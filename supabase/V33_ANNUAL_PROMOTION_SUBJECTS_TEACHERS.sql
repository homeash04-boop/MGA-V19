-- =========================================================
-- MGA School Portal V33
-- Annual promotion + Subjects/classes/teachers relation fix
-- Safe to run multiple times.
-- =========================================================

create extension if not exists "pgcrypto";

-- 1) Annual promotion tables
-- Creates class_progressions if your old database still does not have it.
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
      title text not null default 'الترحيل السنوي',
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

create index if not exists idx_class_progressions_from_class_id on public.class_progressions(from_class_id);
create index if not exists idx_class_progressions_to_class_id on public.class_progressions(to_class_id);

-- 2) Subjects/classes/teachers relations
-- Remove duplicate class_subjects rows first so unique upsert works.
delete from public.class_subjects a
using public.class_subjects b
where a.ctid < b.ctid
  and a.class_id = b.class_id
  and a.subject_id = b.subject_id
  and coalesce(a.academic_term_id, -1) = coalesce(b.academic_term_id, -1);

-- For current UI: one subject can be linked once to each class.
-- If you need different term-specific links later, this can be changed.
create unique index if not exists uq_class_subjects_class_subject
on public.class_subjects(class_id, subject_id);

create index if not exists idx_class_subjects_class_id on public.class_subjects(class_id);
create index if not exists idx_class_subjects_subject_id on public.class_subjects(subject_id);
create index if not exists idx_teacher_subjects_teacher_id on public.teacher_subjects(teacher_id);
create index if not exists idx_teacher_subjects_class_subject on public.teacher_subjects(class_id, subject_id);

-- 3) RLS policies needed by the web app
alter table public.subjects enable row level security;
alter table public.classes enable row level security;
alter table public.class_subjects enable row level security;
alter table public.teacher_subjects enable row level security;
alter table public.class_progressions enable row level security;
alter table public.annual_promotion_runs enable row level security;
alter table public.annual_promotion_students enable row level security;
alter table public.student_movements enable row level security;
alter table public.student_enrollment_periods enable row level security;

drop policy if exists "authenticated_all_subjects" on public.subjects;
create policy "authenticated_all_subjects"
on public.subjects for all to authenticated
using (true) with check (true);

drop policy if exists "authenticated_all_classes" on public.classes;
create policy "authenticated_all_classes"
on public.classes for all to authenticated
using (true) with check (true);

drop policy if exists "authenticated_all_class_subjects" on public.class_subjects;
create policy "authenticated_all_class_subjects"
on public.class_subjects for all to authenticated
using (true) with check (true);

drop policy if exists "authenticated_all_teacher_subjects" on public.teacher_subjects;
create policy "authenticated_all_teacher_subjects"
on public.teacher_subjects for all to authenticated
using (true) with check (true);

drop policy if exists "authenticated_all_class_progressions" on public.class_progressions;
create policy "authenticated_all_class_progressions"
on public.class_progressions for all to authenticated
using (true) with check (true);

drop policy if exists "authenticated_all_annual_promotion_runs" on public.annual_promotion_runs;
create policy "authenticated_all_annual_promotion_runs"
on public.annual_promotion_runs for all to authenticated
using (true) with check (true);

drop policy if exists "authenticated_all_annual_promotion_students" on public.annual_promotion_students;
create policy "authenticated_all_annual_promotion_students"
on public.annual_promotion_students for all to authenticated
using (true) with check (true);

drop policy if exists "authenticated_all_student_movements" on public.student_movements;
create policy "authenticated_all_student_movements"
on public.student_movements for all to authenticated
using (true) with check (true);

drop policy if exists "authenticated_all_student_enrollment_periods" on public.student_enrollment_periods;
create policy "authenticated_all_student_enrollment_periods"
on public.student_enrollment_periods for all to authenticated
using (true) with check (true);

notify pgrst, 'reload schema';
