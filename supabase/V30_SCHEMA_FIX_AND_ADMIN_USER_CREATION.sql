-- V30 Schema Fix + Admin-only user profiles
-- شغّل هذا الملف في Supabase SQL Editor مرة واحدة بعد رفع النسخة الجديدة.
-- يحل أخطاء: table not found / schema cache، ويجعل إضافة صلاحيات المستخدمين من الإدارة فقط.

-- 1) Helpers
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role::text = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- 2) Ensure core accounting/financial tables exist
create table if not exists public.accounting_fiscal_years (
  id bigserial primary key,
  name text not null unique,
  starts_on date,
  ends_on date,
  is_active boolean default false,
  is_closed boolean default false,
  close_mode text default 'open',
  closed_at timestamptz,
  closed_by uuid references public.profiles(id) on delete set null,
  close_note text,
  receivables_carried_over boolean default false,
  carried_over_to_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.accounting_fiscal_years add column if not exists starts_on date;
alter table public.accounting_fiscal_years add column if not exists ends_on date;
alter table public.accounting_fiscal_years add column if not exists is_active boolean default false;
alter table public.accounting_fiscal_years add column if not exists is_closed boolean default false;
alter table public.accounting_fiscal_years add column if not exists close_mode text default 'open';
alter table public.accounting_fiscal_years add column if not exists close_note text;
alter table public.accounting_fiscal_years add column if not exists receivables_carried_over boolean default false;
alter table public.accounting_fiscal_years add column if not exists carried_over_to_year_id bigint references public.accounting_fiscal_years(id) on delete set null;

create table if not exists public.accounting_categories (
  id bigserial primary key,
  name text not null unique,
  type text not null default 'fee',
  created_at timestamptz default now()
);

create table if not exists public.accounting_payment_methods (
  id bigserial primary key,
  name text not null unique,
  is_active boolean default true
);

create table if not exists public.accounting_accounts (
  id bigserial primary key,
  code text not null unique,
  name text not null,
  account_type text not null default 'asset',
  parent_id bigint references public.accounting_accounts(id) on delete set null,
  is_active boolean default true,
  created_at timestamptz default now()
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

-- 3) Pricing/contracts/installments/scholarships/documents
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
  updated_at timestamptz default now()
);

alter table public.class_pricing add column if not exists academic_term_id bigint references public.academic_terms(id) on delete set null;
alter table public.class_pricing add column if not exists registration_fee numeric(12,2) not null default 0;
alter table public.class_pricing add column if not exists tuition_fee numeric(12,2) not null default 0;
alter table public.class_pricing add column if not exists bus_fee numeric(12,2) not null default 0;
alter table public.class_pricing add column if not exists books_fee numeric(12,2) not null default 0;
alter table public.class_pricing add column if not exists uniform_fee numeric(12,2) not null default 0;
alter table public.class_pricing add column if not exists activities_fee numeric(12,2) not null default 0;
alter table public.class_pricing add column if not exists default_discount_amount numeric(12,2) not null default 0;
alter table public.class_pricing add column if not exists default_discount_percent numeric(6,2) not null default 0;
alter table public.class_pricing add column if not exists currency text not null default 'JOD';
alter table public.class_pricing add column if not exists is_active boolean default true;
alter table public.class_pricing add column if not exists notes text;

create table if not exists public.student_contracts (
  id bigserial primary key,
  contract_no text unique,
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
  status text default 'active',
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.student_contracts add column if not exists guardian_id uuid references public.profiles(id) on delete set null;
alter table public.student_contracts add column if not exists academic_term_id bigint references public.academic_terms(id) on delete set null;
alter table public.student_contracts add column if not exists class_pricing_id bigint references public.class_pricing(id) on delete set null;
alter table public.student_contracts add column if not exists total_amount numeric(12,2) not null default 0;
alter table public.student_contracts add column if not exists discount_amount numeric(12,2) not null default 0;
alter table public.student_contracts add column if not exists start_date date;
alter table public.student_contracts add column if not exists end_date date;
alter table public.student_contracts add column if not exists status text default 'active';
alter table public.student_contracts add column if not exists notes text;

create table if not exists public.student_fees (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  category_id bigint references public.accounting_categories(id) on delete set null,
  fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  title text not null default 'رسوم',
  amount numeric(12,2) not null default 0,
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
  amount numeric(12,2) not null default 0,
  payment_date date not null default current_date,
  method text default 'cash',
  payment_method_id bigint references public.accounting_payment_methods(id) on delete set null,
  receipt_no text unique,
  reference_no text,
  note text,
  contract_id bigint references public.student_contracts(id) on delete set null,
  journal_entry_id bigint references public.accounting_journal_entries(id) on delete set null,
  status text not null default 'posted',
  cancelled_at timestamptz,
  cancelled_by uuid references public.profiles(id) on delete set null,
  cancel_reason text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.student_discounts (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  title text not null default 'خصم',
  amount numeric(12,2) not null default 0,
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
  title text not null default 'خطة أقساط',
  total_amount numeric(12,2) not null default 0,
  installments_count int not null default 1,
  start_date date default current_date,
  status text not null default 'active',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.student_installments (
  id bigserial primary key,
  plan_id bigint references public.student_installment_plans(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  due_date date,
  amount numeric(12,2) not null default 0,
  paid_amount numeric(12,2) not null default 0,
  payment_id bigint references public.student_payments(id) on delete set null,
  original_fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  paid_fiscal_year_id bigint references public.accounting_fiscal_years(id) on delete set null,
  status text not null default 'pending',
  note text,
  created_at timestamptz default now()
);

create table if not exists public.student_scholarships (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  scholarship_type text not null default 'fixed',
  title text not null default 'خصم / منحة',
  amount numeric(12,2) not null default 0,
  percent numeric(6,2) not null default 0,
  status text not null default 'pending',
  requested_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.student_documents (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  document_type text,
  title text,
  file_url text,
  issue_date date,
  expiry_date date,
  note text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 4) Useful views/functions used by dashboard/printing
create or replace view public.student_account_summary as
select
  s.id as student_id,
  s.student_number,
  s.status,
  p.full_name as student_name,
  c.id as class_id,
  c.name as class_name,
  c.section as class_section,
  coalesce(f.total_fees,0)::numeric(12,2) as total_fees,
  coalesce(d.total_discounts,0)::numeric(12,2) as total_discounts,
  coalesce(pay.total_payments,0)::numeric(12,2) as total_payments,
  (coalesce(f.total_fees,0)-coalesce(d.total_discounts,0)-coalesce(pay.total_payments,0))::numeric(12,2) as balance
from public.students s
left join public.profiles p on p.id=s.profile_id
left join public.classes c on c.id=s.class_id
left join (select student_id,sum(amount) total_fees from public.student_fees group by student_id) f on f.student_id=s.id
left join (select student_id,sum(amount) total_discounts from public.student_discounts group by student_id) d on d.student_id=s.id
left join (select student_id,sum(amount) total_payments from public.student_payments where status='posted' group by student_id) pay on pay.student_id=s.id;

create or replace function public.log_document_print(
  p_template_key text default null,
  p_document_type text default null,
  p_entity_table text default null,
  p_entity_id text default null,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Safe no-op fallback. Keeps the app from crashing if print logs table is not installed yet.
  return;
end;
$$;

grant select on public.student_account_summary to authenticated;
grant execute on function public.log_document_print(text,text,text,text,text) to authenticated;

-- 5) Defaults
insert into public.accounting_fiscal_years(name,starts_on,ends_on,is_active)
values ('2026/2027','2026-09-01','2027-08-31',true)
on conflict (name) do nothing;

insert into public.accounting_categories(name,type) values
('رسوم تسجيل','fee'),('رسوم دراسية','fee'),('رسوم باص','fee'),('خصم','discount')
on conflict (name) do nothing;

insert into public.accounting_payment_methods(name) values
('نقدًا'),('بطاقة'),('تحويل بنكي'),('شيك'),('محفظة إلكترونية')
on conflict (name) do nothing;

insert into public.accounting_accounts(code,name,account_type) values
('1000','الصندوق والبنك','asset'),('1100','ذمم الطلاب','asset'),('4000','إيرادات الرسوم','income'),('5000','مصروفات','expense')
on conflict (code) do nothing;

-- 6) RLS / permissions
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_authenticated" on public.profiles;
drop policy if exists "profiles_insert_admin_only" on public.profiles;
drop policy if exists "profiles_update_admin_only" on public.profiles;
drop policy if exists "profiles_delete_admin_only" on public.profiles;
drop policy if exists "auth read profiles" on public.profiles;
drop policy if exists "auth write profiles" on public.profiles;

create policy "profiles_select_authenticated" on public.profiles
for select to authenticated using (true);

create policy "profiles_insert_admin_only" on public.profiles
for insert to authenticated with check (public.is_admin());

create policy "profiles_update_admin_only" on public.profiles
for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "profiles_delete_admin_only" on public.profiles
for delete to authenticated using (public.is_admin());

-- Allow authenticated users to use school tables in the MVP.
do $$
declare r record;
begin
  for r in
    select unnest(array[
      'accounting_fiscal_years','accounting_categories','accounting_payment_methods','accounting_accounts',
      'accounting_journal_entries','accounting_journal_lines','class_pricing','student_contracts',
      'student_fees','student_payments','student_discounts','student_installment_plans','student_installments',
      'student_scholarships','student_documents'
    ]) as tablename
  loop
    execute format('alter table public.%I enable row level security', r.tablename);
    execute format('drop policy if exists %I on public.%I', 'authenticated_select_'||r.tablename, r.tablename);
    execute format('drop policy if exists %I on public.%I', 'authenticated_write_'||r.tablename, r.tablename);
    execute format('create policy %I on public.%I for select to authenticated using (true)', 'authenticated_select_'||r.tablename, r.tablename);
    execute format('create policy %I on public.%I for all to authenticated using (true) with check (true)', 'authenticated_write_'||r.tablename, r.tablename);
  end loop;
end $$;

-- Make PostgREST reload schema cache immediately.
notify pgrst, 'reload schema';
