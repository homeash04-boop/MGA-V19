-- =========================================================
-- MGA School Portal V31
-- Annual Promotion / Class Progressions Schema Fix
-- يشغل بأمان حتى لو كانت الجداول موجودة مسبقًا
-- =========================================================

create extension if not exists "pgcrypto";

do $$
declare
  v_class_id_type text;
  v_student_id_type text;
begin
  select format_type(a.atttypid, a.atttypmod)
  into v_class_id_type
  from pg_attribute a
  join pg_class c on c.oid = a.attrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = 'classes'
    and a.attname = 'id'
    and not a.attisdropped;

  select format_type(a.atttypid, a.atttypmod)
  into v_student_id_type
  from pg_attribute a
  join pg_class c on c.oid = a.attrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = 'students'
    and a.attname = 'id'
    and not a.attisdropped;

  if v_class_id_type is null then
    raise exception 'Cannot find public.classes.id';
  end if;

  if v_student_id_type is null then
    raise exception 'Cannot find public.students.id';
  end if;

  execute format($sql$
    create table if not exists public.class_progressions (
      id bigserial primary key,
      from_class_id %s references public.classes(id) on delete cascade,
      to_class_id %s references public.classes(id) on delete set null,
      is_graduation boolean default false,
      sort_order int default 0,
      note text,
      created_at timestamptz default now(),
      unique(from_class_id)
    );
  $sql$, v_class_id_type, v_class_id_type);

  execute format($sql$
    create table if not exists public.annual_promotion_runs (
      id bigserial primary key,
      run_no text unique,
      title text not null,
      academic_year text,
      status text not null default 'draft',
      executed_at timestamptz,
      executed_by uuid references public.profiles(id) on delete set null,
      created_by uuid references public.profiles(id) on delete set null,
      note text,
      created_at timestamptz default now()
    );
  $sql$);

  execute format($sql$
    create table if not exists public.annual_promotion_students (
      id bigserial primary key,
      run_id bigint references public.annual_promotion_runs(id) on delete cascade,
      student_id %s references public.students(id) on delete cascade,
      from_class_id %s references public.classes(id) on delete set null,
      to_class_id %s references public.classes(id) on delete set null,
      action text not null default 'promote',
      is_exception boolean default false,
      exception_reason text,
      exception_by uuid references public.profiles(id) on delete set null,
      executed boolean default false,
      created_at timestamptz default now(),
      unique(run_id, student_id)
    );
  $sql$, v_student_id_type, v_class_id_type, v_class_id_type);
end $$;

create index if not exists idx_class_progressions_from_class_id
on public.class_progressions(from_class_id);

create index if not exists idx_class_progressions_to_class_id
on public.class_progressions(to_class_id);

create index if not exists idx_annual_promotion_students_run_id
on public.annual_promotion_students(run_id);

create index if not exists idx_annual_promotion_students_student_id
on public.annual_promotion_students(student_id);

alter table public.class_progressions enable row level security;
alter table public.annual_promotion_runs enable row level security;
alter table public.annual_promotion_students enable row level security;

drop policy if exists "authenticated_all_class_progressions" on public.class_progressions;
create policy "authenticated_all_class_progressions"
on public.class_progressions
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated_all_annual_promotion_runs" on public.annual_promotion_runs;
create policy "authenticated_all_annual_promotion_runs"
on public.annual_promotion_runs
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated_all_annual_promotion_students" on public.annual_promotion_students;
create policy "authenticated_all_annual_promotion_students"
on public.annual_promotion_students
for all
to authenticated
using (true)
with check (true);

alter table public.student_movements enable row level security;
alter table public.student_enrollment_periods enable row level security;

drop policy if exists "authenticated_all_student_movements" on public.student_movements;
create policy "authenticated_all_student_movements"
on public.student_movements
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated_all_student_enrollment_periods" on public.student_enrollment_periods;
create policy "authenticated_all_student_enrollment_periods"
on public.student_enrollment_periods
for all
to authenticated
using (true)
with check (true);

notify pgrst, 'reload schema';
