-- School Portal Advanced Extension
-- شغّله بعد ملف قاعدة البيانات الأساسي الموجود في المشروع.
-- يضيف: سنوات مالية مرنة، ترحيل ذمم، منح، ترحيل سنوي، واجبات، امتحانات، بحث شامل.

alter table public.accounting_fiscal_years add column if not exists receivables_carried_over boolean default false;
alter table public.accounting_fiscal_years add column if not exists carried_over_to_year_id bigint references public.accounting_fiscal_years(id) on delete set null;

create table if not exists public.fiscal_carryover_runs (
  id bigserial primary key,
  from_fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  to_fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  run_no text unique,
  status text not null default 'executed',
  total_students int default 0,
  total_balance numeric(12,2) default 0,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.fiscal_carryover_items (
  id bigserial primary key,
  run_id bigint references public.fiscal_carryover_runs(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  old_balance numeric(12,2) default 0,
  carried_amount numeric(12,2) default 0,
  fee_id bigint references public.student_fees(id) on delete set null,
  created_at timestamptz default now()
);

create or replace function public.soft_close_fiscal_year(p_fiscal_year_id bigint, p_note text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.accounting_fiscal_years
  set is_closed=true,
      close_mode='soft_closed',
      closed_at=now(),
      closed_by=auth.uid(),
      close_note=p_note
  where id=p_fiscal_year_id;
end;
$$;

create or replace function public.reopen_fiscal_year(p_fiscal_year_id bigint, p_note text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.accounting_fiscal_years
  set is_closed=false,
      close_mode='open',
      closed_at=null,
      closed_by=null,
      close_note=p_note
  where id=p_fiscal_year_id;
end;
$$;

create table if not exists public.student_scholarships (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  scholarship_type text not null default 'fixed',
  title text not null,
  amount numeric(12,2) default 0,
  percent numeric(6,2) default 0,
  status text not null default 'pending',
  note text,
  approved_at timestamptz,
  created_at timestamptz default now()
);

create or replace function public.approve_scholarship(p_scholarship_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v public.student_scholarships%rowtype;
begin
  select * into v from public.student_scholarships where id=p_scholarship_id;
  update public.student_scholarships set status='approved', approved_at=now() where id=p_scholarship_id;
  insert into public.student_discounts(student_id,title,amount,note)
  values(v.student_id,v.title,v.amount,v.note);
end;
$$;

create table if not exists public.class_progressions (
  id bigserial primary key,
  from_class_id bigint references public.classes(id) on delete cascade,
  to_class_id bigint references public.classes(id) on delete set null,
  is_graduation boolean default false,
  sort_order int default 0,
  note text,
  unique(from_class_id)
);

create table if not exists public.annual_promotion_runs (
  id bigserial primary key,
  run_no text unique,
  title text not null,
  status text not null default 'draft',
  created_at timestamptz default now(),
  executed_at timestamptz
);

create table if not exists public.annual_promotion_students (
  id bigserial primary key,
  run_id bigint references public.annual_promotion_runs(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  from_class_id bigint references public.classes(id) on delete set null,
  to_class_id bigint references public.classes(id) on delete set null,
  action text not null default 'promote',
  is_exception boolean default false,
  exception_reason text,
  executed boolean default false,
  unique(run_id, student_id)
);

alter table public.assignments add column if not exists is_online boolean default true;
alter table public.assignments add column if not exists max_score numeric(7,2) default 100;

create table if not exists public.assignment_submissions (
  id bigserial primary key,
  assignment_id bigint references public.assignments(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  answer_text text,
  file_url text,
  score numeric(7,2),
  teacher_note text,
  submitted_at timestamptz default now(),
  unique(assignment_id, student_id)
);

create table if not exists public.online_exams (
  id bigserial primary key,
  class_id bigint references public.classes(id) on delete set null,
  subject_id bigint references public.subjects(id) on delete set null,
  title text not null,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  duration_minutes int default 45,
  max_score numeric(7,2) default 100,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.online_exam_questions (
  id bigserial primary key,
  exam_id bigint references public.online_exams(id) on delete cascade,
  question_text text not null,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_option text,
  points numeric(7,2) default 1,
  sort_order int default 0
);

create table if not exists public.online_exam_attempts (
  id bigserial primary key,
  exam_id bigint references public.online_exams(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  answers jsonb,
  score numeric(7,2) default 0,
  submitted_at timestamptz default now(),
  unique(exam_id, student_id)
);

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

insert into public.app_settings(key,value) values
('school_name','روضة ومدرسة العصر الذهبي الحديث'),
('school_domain','mga-school.com'),
('allow_student_grade_view','true')
on conflict (key) do nothing;

create or replace view public.global_search_view as
select
  'student'::text entity_type,
  s.id::text entity_id,
  coalesce(p.full_name,'') title,
  concat_ws(' - ',s.student_number,c.name,c.section,p.phone,s.bus_number,s.bus_round) subtitle,
  '/admin/student-profile/'||s.id::text link
from public.students s
left join public.profiles p on p.id=s.profile_id
left join public.classes c on c.id=s.class_id

union all

select
  'contract',
  sc.id::text,
  sc.contract_no,
  concat_ws(' - ',p.full_name,sc.net_amount::text,sc.contract_type),
  '/admin/contracts'
from public.student_contracts sc
left join public.students s on s.id=sc.student_id
left join public.profiles p on p.id=s.profile_id

union all

select
  'receipt',
  sp.id::text,
  coalesce(sp.receipt_no,'سند قبض'),
  concat_ws(' - ',p.full_name,sp.amount::text,sp.status),
  '/admin/accounting/receipts'
from public.student_payments sp
left join public.students s on s.id=sp.student_id
left join public.profiles p on p.id=s.profile_id;

notify pgrst, 'reload schema';
