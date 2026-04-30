-- School Portal V16 Complete Schema
-- شغّل هذا الملف مرة واحدة في Supabase SQL Editor

do $$
begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace where t.typname='user_role' and n.nspname='public') then
    create type public.user_role as enum ('admin','accountant','teacher','student','parent');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace where t.typname='attendance_status' and n.nspname='public') then
    create type public.attendance_status as enum ('present','absent','late','excused');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'student',
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.classes (
  id bigserial primary key,
  name text not null,
  section text,
  created_at timestamptz default now()
);

create table if not exists public.subjects (
  id bigserial primary key,
  name text not null,
  code text,
  created_at timestamptz default now()
);

create table if not exists public.academic_terms (
  id bigserial primary key,
  name text not null,
  year_label text not null,
  starts_on date,
  ends_on date,
  is_active boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.students (
  id bigserial primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  class_id bigint references public.classes(id) on delete set null,
  student_number text,
  date_of_birth date,
  address text,
  status text not null default 'active' check (status in ('active','suspended','left','withdrawn','returned','transferred','graduated','archived')),
  archived_at timestamptz,
  archived_by uuid references public.profiles(id) on delete set null,
  archive_reason text,
  left_at date,
  returned_at date,
  previous_student_number text,
  last_movement_note text,
  student_full_name_cache text,
  normalized_name text,
  national_id text,
  gender text check (gender in ('male','female') or gender is null),
  health_notes text,
  emergency_contact_name text,
  emergency_contact_phone text,
  extra_notes text,
  bus_number text,
  bus_round text,
  pickup_point text,
  dropoff_point text,
  transport_notes text,
  created_at timestamptz default now()
);

create unique index if not exists uq_students_student_number_not_null
on public.students(student_number)
where student_number is not null and student_number <> '';

create unique index if not exists uq_students_name_dob_not_archived
on public.students(normalized_name, date_of_birth)
where normalized_name is not null and normalized_name <> '' and date_of_birth is not null and status <> 'archived';

create table if not exists public.parent_students (
  id bigserial primary key,
  parent_id uuid references public.profiles(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  relation text default 'parent',
  unique(parent_id, student_id)
);

create table if not exists public.teacher_subjects (
  id bigserial primary key,
  teacher_id uuid references public.profiles(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  class_id bigint references public.classes(id) on delete cascade,
  unique(teacher_id, subject_id, class_id)
);

create table if not exists public.class_subjects (
  id bigserial primary key,
  class_id bigint references public.classes(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.grades (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  title text not null,
  score numeric(7,2) not null,
  max_score numeric(7,2) not null default 100,
  created_at timestamptz default now()
);

create table if not exists public.attendance (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  class_id bigint references public.classes(id) on delete cascade,
  date date not null default current_date,
  status public.attendance_status not null,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  unique(student_id, date)
);

create table if not exists public.assignments (
  id bigserial primary key,
  class_id bigint references public.classes(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  is_online boolean default true,
  max_score numeric(7,2) default 100,
  created_at timestamptz default now()
);

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

create table if not exists public.timetable (
  id bigserial primary key,
  class_id bigint references public.classes(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  day_of_week int not null check (day_of_week between 1 and 7),
  start_time time not null,
  end_time time not null,
  room text
);

create table if not exists public.announcements (
  id bigserial primary key,
  title text not null,
  body text not null,
  target_role public.user_role,
  class_id bigint references public.classes(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id bigserial primary key,
  sender_id uuid references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  body text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

create table if not exists public.grade_visibility_rules (
  id bigserial primary key,
  title text not null,
  is_visible boolean not null default true,
  class_id bigint references public.classes(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.accounting_fiscal_years (
  id bigserial primary key,
  name text not null unique,
  starts_on date not null,
  ends_on date not null,
  is_active boolean default false,
  is_closed boolean default false,
  close_mode text default 'open' check (close_mode in ('open','soft_closed','hard_closed')),
  closed_at timestamptz,
  closed_by uuid references public.profiles(id) on delete set null,
  close_note text,
  receivables_carried_over boolean default false,
  carried_over_to_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.accounting_accounts (
  id bigserial primary key,
  code text not null unique,
  name text not null,
  account_type text not null check (account_type in ('asset','liability','equity','income','expense')),
  parent_id bigint references public.accounting_accounts(id) on delete set null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.accounting_payment_methods (
  id bigserial primary key,
  name text not null unique,
  is_active boolean default true
);

create table if not exists public.accounting_journal_entries (
  id bigserial primary key,
  entry_no text unique,
  entry_date date not null default current_date,
  description text,
  source_type text,
  source_id text,
  fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.accounting_journal_lines (
  id bigserial primary key,
  journal_entry_id bigint references public.accounting_journal_entries(id) on delete cascade,
  account_id bigint references public.accounting_accounts(id) on delete restrict,
  debit numeric(12,2) not null default 0,
  credit numeric(12,2) not null default 0,
  note text
);

create table if not exists public.accounting_categories (
  id bigserial primary key,
  name text not null unique,
  type text not null default 'fee' check (type in ('fee','discount','expense')),
  created_at timestamptz default now()
);

create table if not exists public.class_pricing (
  id bigserial primary key,
  class_id bigint references public.classes(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  registration_fee numeric(12,2) not null default 0,
  tuition_fee numeric(12,2) not null default 0,
  bus_fee numeric(12,2) not null default 0,
  books_fee numeric(12,2) not null default 0,
  uniform_fee numeric(12,2) not null default 0,
  activities_fee numeric(12,2) not null default 0,
  default_discount_amount numeric(12,2) not null default 0,
  default_discount_percent numeric(6,2) not null default 0,
  currency text not null default 'JOD',
  is_active boolean default true,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(class_id, academic_term_id)
);

create table if not exists public.student_contracts (
  id bigserial primary key,
  contract_no text not null unique,
  student_id bigint references public.students(id) on delete cascade,
  guardian_id uuid references public.profiles(id) on delete set null,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  class_pricing_id bigint references public.class_pricing(id) on delete set null,
  total_amount numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  net_amount numeric(12,2) generated always as (total_amount - discount_amount) stored,
  registration_fee_snapshot numeric(12,2) not null default 0,
  tuition_fee_snapshot numeric(12,2) not null default 0,
  bus_fee_snapshot numeric(12,2) not null default 0,
  books_fee_snapshot numeric(12,2) not null default 0,
  uniform_fee_snapshot numeric(12,2) not null default 0,
  activities_fee_snapshot numeric(12,2) not null default 0,
  discount_percent_snapshot numeric(6,2) not null default 0,
  pricing_snapshot jsonb,
  start_date date,
  end_date date,
  status text default 'active' check (status in ('draft','active','cancelled','completed')),
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.student_fees (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  category_id bigint references public.accounting_categories(id) on delete set null,
  fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  title text not null,
  amount numeric(10,2) not null check (amount >= 0),
  due_date date,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.student_payments (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  amount numeric(10,2) not null check (amount > 0),
  payment_date date not null default current_date,
  method text default 'cash',
  payment_method_id bigint references public.accounting_payment_methods(id) on delete set null,
  receipt_no text unique,
  reference_no text,
  note text,
  contract_id bigint references public.student_contracts(id) on delete set null,
  journal_entry_id bigint references public.accounting_journal_entries(id) on delete set null,
  status text not null default 'posted' check (status in ('posted','cancelled','reversed')),
  cancelled_at timestamptz,
  cancelled_by uuid references public.profiles(id) on delete set null,
  cancel_reason text,
  reversal_journal_entry_id bigint references public.accounting_journal_entries(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.student_discounts (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  title text not null,
  amount numeric(10,2) not null check (amount >= 0),
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.student_installment_plans (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  contract_id bigint references public.student_contracts(id) on delete set null,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  title text not null,
  total_amount numeric(12,2) not null default 0,
  installments_count int not null default 1,
  start_date date not null default current_date,
  status text not null default 'active' check (status in ('draft','active','completed','cancelled')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.student_installments (
  id bigserial primary key,
  plan_id bigint references public.student_installment_plans(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  due_date date not null,
  amount numeric(12,2) not null default 0,
  paid_amount numeric(12,2) not null default 0,
  payment_id bigint references public.student_payments(id) on delete set null,
  original_fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  paid_fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','paid','partial','overdue','cancelled')),
  note text,
  created_at timestamptz default now()
);

create table if not exists public.student_scholarships (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  scholarship_type text not null check (scholarship_type in ('fixed','percent','full','partial')),
  title text not null,
  amount numeric(12,2) not null default 0,
  percent numeric(6,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
  requested_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.student_documents (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  document_type text not null,
  title text not null,
  file_url text,
  issue_date date,
  expiry_date date,
  note text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

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
  status text not null default 'draft' check (status in ('draft','previewed','executed','cancelled')),
  executed_at timestamptz,
  executed_by uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.annual_promotion_students (
  id bigserial primary key,
  run_id bigint references public.annual_promotion_runs(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  from_class_id bigint references public.classes(id) on delete set null,
  to_class_id bigint references public.classes(id) on delete set null,
  action text not null default 'promote' check (action in ('promote','hold','graduate','skip')),
  is_exception boolean default false,
  exception_reason text,
  exception_by uuid references public.profiles(id) on delete set null,
  executed boolean default false,
  unique(run_id, student_id)
);

create table if not exists public.audit_logs (
  id bigserial primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_table text,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.fiscal_carryover_runs (
  id bigserial primary key,
  from_fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  to_fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  run_no text unique,
  status text not null default 'draft' check (status in ('draft','executed','cancelled')),
  total_students int default 0,
  total_balance numeric(12,2) default 0,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  executed_by uuid references public.profiles(id) on delete set null,
  executed_at timestamptz
);

create table if not exists public.fiscal_carryover_items (
  id bigserial primary key,
  run_id bigint references public.fiscal_carryover_runs(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  old_balance numeric(12,2) not null default 0,
  carried_amount numeric(12,2) not null default 0,
  fee_id bigint references public.student_fees(id) on delete set null,
  note text,
  created_at timestamptz default now()
);

-- Functions
create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.write_audit_log(p_action text, p_entity_table text default null, p_entity_id text default null, p_old_data jsonb default null, p_new_data jsonb default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_logs(actor_id, action, entity_table, entity_id, old_data, new_data)
  values (auth.uid(), p_action, p_entity_table, p_entity_id, p_old_data, p_new_data);
end;
$$;

create or replace function public.sync_student_name_cache()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_name text;
begin
  select full_name into v_name from public.profiles where id = new.profile_id;
  new.student_full_name_cache := coalesce(v_name, new.student_full_name_cache, '');
  new.normalized_name := lower(regexp_replace(trim(coalesce(v_name, '')), '\\s+', ' ', 'g'));
  return new;
end;
$$;

drop trigger if exists trg_sync_student_name_cache on public.students;
create trigger trg_sync_student_name_cache before insert or update of profile_id on public.students for each row execute function public.sync_student_name_cache();

create or replace function public.get_fiscal_year_for_date(p_date date default current_date)
returns bigint language sql security definer set search_path = public as $$
  select id from public.accounting_fiscal_years where p_date between starts_on and ends_on order by is_active desc, starts_on desc limit 1
$$;

create or replace function public.get_current_fiscal_year()
returns bigint language sql security definer set search_path = public as $$
  select id from public.accounting_fiscal_years where is_active = true order by starts_on desc limit 1
$$;

create or replace function public.next_receipt_no()
returns text language plpgsql security definer as $$
declare v_no text;
begin
  select 'RC-' || to_char(now(), 'YYYYMMDD') || '-' || lpad((coalesce(max(id),0)+1)::text, 5, '0') into v_no from public.student_payments;
  return v_no;
end;
$$;

create or replace function public.create_student_receipt(p_student_id bigint, p_amount numeric, p_payment_method_id bigint default null, p_reference_no text default null, p_note text default null, p_contract_id bigint default null)
returns bigint language plpgsql security definer set search_path = public as $$
declare v_payment_id bigint; v_entry_id bigint; v_receipt_no text; v_fiscal_year_id bigint;
begin
  v_fiscal_year_id := public.get_fiscal_year_for_date(current_date);
  if v_fiscal_year_id is null then v_fiscal_year_id := public.get_current_fiscal_year(); end if;
  v_receipt_no := public.next_receipt_no();

  insert into public.accounting_journal_entries(entry_no, entry_date, description, source_type, source_id, fiscal_year_id, created_by)
  values ('JE-' || to_char(now(), 'YYYYMMDDHH24MISSMS'), current_date, 'سند قبض طالب رقم ' || p_student_id, 'student_payment', p_student_id::text, v_fiscal_year_id, auth.uid())
  returning id into v_entry_id;

  insert into public.student_payments(student_id, amount, payment_date, payment_method_id, receipt_no, reference_no, note, contract_id, journal_entry_id, fiscal_year_id, created_by, status)
  values (p_student_id, p_amount, current_date, p_payment_method_id, v_receipt_no, p_reference_no, p_note, p_contract_id, v_entry_id, v_fiscal_year_id, auth.uid(), 'posted')
  returning id into v_payment_id;

  perform public.write_audit_log('create_receipt','student_payments',v_payment_id::text,null,jsonb_build_object('student_id',p_student_id,'amount',p_amount));
  return v_payment_id;
end;
$$;

create or replace function public.cancel_student_receipt(p_payment_id bigint, p_reason text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.student_payments
  set status='cancelled', cancelled_at=now(), cancelled_by=auth.uid(), cancel_reason=p_reason
  where id=p_payment_id and status='posted';
  perform public.write_audit_log('cancel_receipt','student_payments',p_payment_id::text,null,jsonb_build_object('reason',p_reason));
end;
$$;

create or replace function public.get_class_pricing_snapshot(p_class_id bigint, p_academic_term_id bigint default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_row public.class_pricing%rowtype;
begin
  select * into v_row from public.class_pricing
  where class_id=p_class_id and (academic_term_id=p_academic_term_id or p_academic_term_id is null) and is_active=true
  order by academic_term_id nulls last, updated_at desc limit 1;

  if not found then
    return jsonb_build_object('class_pricing_id',null,'registration_fee',0,'tuition_fee',0,'bus_fee',0,'books_fee',0,'uniform_fee',0,'activities_fee',0,'default_discount_amount',0,'default_discount_percent',0);
  end if;

  return jsonb_build_object('class_pricing_id',v_row.id,'registration_fee',v_row.registration_fee,'tuition_fee',v_row.tuition_fee,'bus_fee',v_row.bus_fee,'books_fee',v_row.books_fee,'uniform_fee',v_row.uniform_fee,'activities_fee',v_row.activities_fee,'default_discount_amount',v_row.default_discount_amount,'default_discount_percent',v_row.default_discount_percent);
end;
$$;

create or replace function public.archive_student(p_student_id bigint, p_reason text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.students set status='archived', archived_at=now(), archived_by=auth.uid(), archive_reason=p_reason where id=p_student_id;
  insert into public.student_movements(student_id,movement_type,movement_date,old_status,new_status,reason,created_by)
  values (p_student_id,'archived',current_date,'active','archived',p_reason,auth.uid());
end;
$$;

create or replace function public.restore_student(p_student_id bigint)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.students set status='active', archived_at=null, archived_by=null, archive_reason=null where id=p_student_id;
  insert into public.student_movements(student_id,movement_type,movement_date,old_status,new_status,created_by)
  values (p_student_id,'restored',current_date,'archived','active',auth.uid());
end;
$$;

create or replace function public.student_leave_school(p_student_id bigint, p_movement_type text default 'left_school', p_date date default current_date, p_reason text default null, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
declare v_new_status text; v_old_status text; v_class bigint;
begin
  select status,class_id into v_old_status,v_class from public.students where id=p_student_id;
  v_new_status := case when p_movement_type='withdrawn' then 'withdrawn' when p_movement_type='transferred_out' then 'transferred' when p_movement_type='graduated' then 'graduated' when p_movement_type='suspended' then 'suspended' else 'left' end;
  update public.students set status=v_new_status, left_at=p_date, last_movement_note=coalesce(p_reason,p_note) where id=p_student_id;
  update public.student_enrollment_periods set ended_on=p_date, end_reason=coalesce(p_reason,p_note,v_new_status), is_current=false where student_id=p_student_id and is_current=true;
  insert into public.student_movements(student_id,movement_type,movement_date,from_class_id,old_status,new_status,reason,note,created_by) values (p_student_id,p_movement_type,p_date,v_class,v_old_status,v_new_status,p_reason,p_note,auth.uid());
end;
$$;

create or replace function public.student_return_to_school(p_student_id bigint, p_to_class_id bigint, p_date date default current_date, p_new_student_number text default null, p_reason text default null, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
declare v_old_status text; v_old_class bigint;
begin
  select status,class_id into v_old_status,v_old_class from public.students where id=p_student_id;
  update public.students set status='active', class_id=p_to_class_id, returned_at=p_date, previous_student_number=case when p_new_student_number is not null and p_new_student_number<>student_number then student_number else previous_student_number end, student_number=coalesce(nullif(p_new_student_number,''),student_number), archived_at=null, archive_reason=null, last_movement_note=coalesce(p_reason,p_note) where id=p_student_id;
  insert into public.student_enrollment_periods(student_id,class_id,started_on,is_current,created_by) values (p_student_id,p_to_class_id,p_date,true,auth.uid());
  insert into public.student_movements(student_id,movement_type,movement_date,from_class_id,to_class_id,old_status,new_status,reason,note,created_by) values (p_student_id,'returned',p_date,v_old_class,p_to_class_id,v_old_status,'active',p_reason,p_note,auth.uid());
end;
$$;

create or replace function public.create_installment_plan(p_student_id bigint, p_contract_id bigint, p_title text, p_total_amount numeric, p_installments_count int, p_start_date date)
returns bigint language plpgsql security definer set search_path = public as $$
declare v_plan_id bigint; v_each numeric(12,2); i int;
begin
  v_each := round(p_total_amount / p_installments_count,2);
  insert into public.student_installment_plans(student_id,contract_id,title,total_amount,installments_count,start_date,status,fiscal_year_id,created_by)
  values (p_student_id,p_contract_id,p_title,p_total_amount,p_installments_count,p_start_date,'active',public.get_fiscal_year_for_date(p_start_date),auth.uid()) returning id into v_plan_id;
  for i in 1..p_installments_count loop
    insert into public.student_installments(plan_id,student_id,due_date,amount,status,original_fiscal_year_id)
    values (v_plan_id,p_student_id,(p_start_date + ((i-1) || ' month')::interval)::date,case when i=p_installments_count then p_total_amount-(v_each*(p_installments_count-1)) else v_each end,'pending',public.get_fiscal_year_for_date((p_start_date + ((i-1) || ' month')::interval)::date));
  end loop;
  return v_plan_id;
end;
$$;

create or replace function public.pay_student_installment(p_installment_id bigint, p_payment_method_id bigint default null, p_reference_no text default null, p_note text default null)
returns bigint language plpgsql security definer set search_path = public as $$
declare v_inst public.student_installments%rowtype; v_payment_id bigint; v_paid_year bigint;
begin
  select * into v_inst from public.student_installments where id=p_installment_id;
  if v_inst.status='paid' then raise exception 'Installment already paid'; end if;
  v_payment_id := public.create_student_receipt(v_inst.student_id, v_inst.amount-v_inst.paid_amount, p_payment_method_id, p_reference_no, coalesce(p_note,'دفع قسط'), null);
  v_paid_year := public.get_fiscal_year_for_date(current_date);
  update public.student_installments set paid_amount=amount, payment_id=v_payment_id, paid_fiscal_year_id=v_paid_year, status='paid' where id=p_installment_id;
  return v_payment_id;
end;
$$;

create or replace function public.soft_close_fiscal_year(p_fiscal_year_id bigint, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.accounting_fiscal_years set is_closed=true, close_mode='soft_closed', closed_at=now(), closed_by=auth.uid(), close_note=p_note where id=p_fiscal_year_id;
end;
$$;

create or replace function public.reopen_fiscal_year(p_fiscal_year_id bigint, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.accounting_fiscal_years set is_closed=false, close_mode='open', closed_at=null, closed_by=null, close_note=p_note where id=p_fiscal_year_id;
end;
$$;

create or replace function public.approve_scholarship(p_scholarship_id bigint)
returns void language plpgsql security definer set search_path = public as $$
declare v public.student_scholarships%rowtype;
begin
  select * into v from public.student_scholarships where id=p_scholarship_id;
  update public.student_scholarships set status='approved', approved_by=auth.uid(), approved_at=now() where id=p_scholarship_id;
  insert into public.student_discounts(student_id,academic_term_id,title,amount,note,created_by) values (v.student_id,v.academic_term_id,v.title,v.amount,v.note,auth.uid());
end;
$$;

-- Views
create or replace view public.student_account_summary as
select
  s.id as student_id,
  s.student_number,
  s.status,
  p.full_name as student_name,
  c.id as class_id,
  c.name as class_name,
  c.section as class_section,
  coalesce(f.total_fees,0)::numeric(10,2) as total_fees,
  coalesce(d.total_discounts,0)::numeric(10,2) as total_discounts,
  coalesce(pay.total_payments,0)::numeric(10,2) as total_payments,
  (coalesce(f.total_fees,0)-coalesce(d.total_discounts,0)-coalesce(pay.total_payments,0))::numeric(10,2) as balance
from public.students s
left join public.profiles p on p.id=s.profile_id
left join public.classes c on c.id=s.class_id
left join (select student_id,sum(amount) total_fees from public.student_fees group by student_id) f on f.student_id=s.id
left join (select student_id,sum(amount) total_discounts from public.student_discounts group by student_id) d on d.student_id=s.id
left join (select student_id,sum(amount) total_payments from public.student_payments where status='posted' group by student_id) pay on pay.student_id=s.id;

create or replace view public.installments_with_fiscal_years as
select i.*, p.full_name student_name, s.student_number, ofy.name original_fiscal_year_name, pfy.name paid_fiscal_year_name, pl.title plan_title
from public.student_installments i
left join public.students s on s.id=i.student_id
left join public.profiles p on p.id=s.profile_id
left join public.accounting_fiscal_years ofy on ofy.id=i.original_fiscal_year_id
left join public.accounting_fiscal_years pfy on pfy.id=i.paid_fiscal_year_id
left join public.student_installment_plans pl on pl.id=i.plan_id;

create or replace view public.global_search_view as
select 'student'::text entity_type, s.id::text entity_id, coalesce(p.full_name,'') title, concat_ws(' - ',s.student_number,c.name,c.section,p.phone,s.bus_number,s.bus_round) subtitle, '/admin/student-profile/'||s.id::text link
from public.students s left join public.profiles p on p.id=s.profile_id left join public.classes c on c.id=s.class_id
union all
select 'receipt', sp.id::text, coalesce(sp.receipt_no,'سند قبض'), concat_ws(' - ',p.full_name,sp.amount::text,sp.status), '/admin/accounting/receipts'
from public.student_payments sp left join public.students s on s.id=sp.student_id left join public.profiles p on p.id=s.profile_id
union all
select 'contract', sc.id::text, sc.contract_no, concat_ws(' - ',p.full_name,sc.net_amount::text,sc.status), '/admin/contracts'
from public.student_contracts sc left join public.students s on s.id=sc.student_id left join public.profiles p on p.id=s.profile_id;

-- RLS: pragmatic for MVP/prototype
do $$
declare r record;
begin
  for r in select schemaname, tablename from pg_tables where schemaname='public' loop
    execute format('alter table %I.%I enable row level security', r.schemaname, r.tablename);
  end loop;
end $$;

do $$
declare r record;
begin
  for r in select schemaname, tablename, policyname from pg_policies where schemaname='public' loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

do $$
declare r record;
begin
  for r in select tablename from pg_tables where schemaname='public' loop
    execute format('create policy "auth read %I" on public.%I for select to authenticated using (true)', r.tablename, r.tablename);
    execute format('create policy "auth write %I" on public.%I for all to authenticated using (true) with check (true)', r.tablename, r.tablename);
  end loop;
end $$;

-- Defaults
insert into public.classes(name,section) values ('الصف الأول','أ'),('الصف الثاني','أ'),('الصف الثالث','أ'),('الصف الرابع','أ'),('الصف الخامس','أ'),('الصف السادس','أ'),('الصف السابع','أ'),('الصف الثامن','أ') on conflict do nothing;
insert into public.subjects(name,code) values ('الرياضيات','MATH'),('العلوم','SCI'),('اللغة العربية','AR'),('اللغة الإنجليزية','EN') on conflict do nothing;
insert into public.academic_terms(name,year_label,starts_on,ends_on,is_active) values ('الفصل الأول','2026/2027','2026-09-01','2027-01-15',true),('الفصل الثاني','2026/2027','2027-02-01','2027-06-15',false) on conflict do nothing;
insert into public.accounting_fiscal_years(name,starts_on,ends_on,is_active) values ('2026/2027','2026-09-01','2027-08-31',true) on conflict (name) do nothing;
insert into public.accounting_accounts(code,name,account_type) values ('1000','الصندوق والبنك','asset'),('1100','ذمم الطلاب','asset'),('4000','إيرادات الرسوم','income'),('5000','مصروفات','expense') on conflict (code) do nothing;
insert into public.accounting_payment_methods(name) values ('نقدًا'),('بطاقة'),('تحويل بنكي'),('شيك'),('محفظة إلكترونية') on conflict (name) do nothing;
insert into public.app_settings(key,value) values ('school_name','بوابة الطالب المدرسية'),('school_email_domain','mga-school.com') on conflict (key) do nothing;
