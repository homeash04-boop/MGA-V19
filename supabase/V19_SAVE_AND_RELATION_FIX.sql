-- V19 Save + Relationship Ambiguity Fix
-- شغّل هذا الملف في Supabase SQL Editor بعد FULL_SUPABASE_SCHEMA_V16
-- يعالج نقص الأعمدة والجداول الشائعة ويجدد الكاش.

alter table public.students add column if not exists profile_id uuid references public.profiles(id) on delete set null;
alter table public.students add column if not exists class_id bigint references public.classes(id) on delete set null;
alter table public.students add column if not exists student_number text;
alter table public.students add column if not exists date_of_birth date;
alter table public.students add column if not exists address text;
alter table public.students add column if not exists status text default 'active';
alter table public.students add column if not exists archived_at timestamptz;
alter table public.students add column if not exists archived_by uuid references public.profiles(id) on delete set null;
alter table public.students add column if not exists archive_reason text;
alter table public.students add column if not exists left_at date;
alter table public.students add column if not exists returned_at date;
alter table public.students add column if not exists previous_student_number text;
alter table public.students add column if not exists last_movement_note text;
alter table public.students add column if not exists student_full_name_cache text;
alter table public.students add column if not exists normalized_name text;
alter table public.students add column if not exists bus_number text;
alter table public.students add column if not exists bus_round text;
alter table public.students add column if not exists pickup_point text;
alter table public.students add column if not exists dropoff_point text;
alter table public.students add column if not exists transport_notes text;
alter table public.students add column if not exists national_id text;
alter table public.students add column if not exists gender text;
alter table public.students add column if not exists health_notes text;
alter table public.students add column if not exists emergency_contact_name text;
alter table public.students add column if not exists emergency_contact_phone text;
alter table public.students add column if not exists extra_notes text;

create table if not exists public.student_movements (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  movement_type text not null,
  movement_date date not null default current_date,
  from_class_id bigint references public.classes(id) on delete set null,
  to_class_id bigint references public.classes(id) on delete set null,
  old_status text,
  new_status text,
  reason text,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.student_enrollment_periods (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  class_id bigint references public.classes(id) on delete set null,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  started_on date not null default current_date,
  ended_on date,
  end_reason text,
  is_current boolean default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.student_movements enable row level security;
alter table public.student_enrollment_periods enable row level security;

drop policy if exists "auth read student_movements" on public.student_movements;
drop policy if exists "auth write student_movements" on public.student_movements;
drop policy if exists "auth read student_enrollment_periods" on public.student_enrollment_periods;
drop policy if exists "auth write student_enrollment_periods" on public.student_enrollment_periods;

create policy "auth read student_movements"
on public.student_movements
for select to authenticated
using (true);

create policy "auth write student_movements"
on public.student_movements
for all to authenticated
using (true)
with check (true);

create policy "auth read student_enrollment_periods"
on public.student_enrollment_periods
for select to authenticated
using (true);

create policy "auth write student_enrollment_periods"
on public.student_enrollment_periods
for all to authenticated
using (true)
with check (true);

create or replace function public.sync_student_name_cache()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare v_name text;
begin
  select full_name into v_name from public.profiles where id = new.profile_id;
  new.student_full_name_cache := coalesce(v_name, new.student_full_name_cache, '');
  new.normalized_name := lower(regexp_replace(trim(coalesce(v_name, '')), '\s+', ' ', 'g'));
  return new;
end;
$$;

drop trigger if exists trg_sync_student_name_cache on public.students;
create trigger trg_sync_student_name_cache
before insert or update of profile_id
on public.students
for each row
execute function public.sync_student_name_cache();

create or replace function public.archive_student(p_student_id bigint, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.students
  set status='archived',
      archived_at=now(),
      archived_by=auth.uid(),
      archive_reason=p_reason
  where id=p_student_id;

  insert into public.student_movements(student_id,movement_type,movement_date,old_status,new_status,reason,created_by)
  values (p_student_id,'archived',current_date,'active','archived',p_reason,auth.uid());
end;
$$;

create or replace function public.restore_student(p_student_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.students
  set status='active',
      archived_at=null,
      archived_by=null,
      archive_reason=null
  where id=p_student_id;

  insert into public.student_movements(student_id,movement_type,movement_date,old_status,new_status,created_by)
  values (p_student_id,'restored',current_date,'archived','active',auth.uid());
end;
$$;

-- افتح RLS لجداول الطلاب في نسخة الاختبار الحالية
alter table public.students enable row level security;

drop policy if exists "auth read students" on public.students;
drop policy if exists "auth write students" on public.students;

create policy "auth read students"
on public.students
for select to authenticated
using (true);

create policy "auth write students"
on public.students
for all to authenticated
using (true)
with check (true);

-- حركات افتتاحية للطلاب الموجودين
insert into public.student_movements (
  student_id, movement_type, movement_date, to_class_id, new_status, note
)
select
  s.id,
  'new_registration',
  coalesce(s.created_at::date, current_date),
  s.class_id,
  coalesce(s.status, 'active'),
  'حركة افتتاحية تلقائية'
from public.students s
where not exists (
  select 1 from public.student_movements m where m.student_id = s.id
);

insert into public.student_enrollment_periods (
  student_id, class_id, started_on, is_current
)
select
  s.id,
  s.class_id,
  coalesce(s.created_at::date, current_date),
  true
from public.students s
where not exists (
  select 1 from public.student_enrollment_periods ep where ep.student_id = s.id
);

notify pgrst, 'reload schema';
