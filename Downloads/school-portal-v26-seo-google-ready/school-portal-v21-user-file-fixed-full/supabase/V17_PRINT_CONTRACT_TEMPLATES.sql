-- School Portal V17 - Printable Reports + Editable Contract Templates
-- شغّل هذا الملف بعد FULL_SUPABASE_SCHEMA_V16.sql

-- نوع العقد: عادي / منحة / نقل / إعادة تسجيل
alter table public.student_contracts add column if not exists contract_type text not null default 'regular'
  check (contract_type in ('regular','scholarship','transfer','returning','custom'));

alter table public.student_contracts add column if not exists scholarship_title text;
alter table public.student_contracts add column if not exists scholarship_percent numeric(6,2) default 0;
alter table public.student_contracts add column if not exists scholarship_amount numeric(12,2) default 0;
alter table public.student_contracts add column if not exists printed_at timestamptz;
alter table public.student_contracts add column if not exists print_count int default 0;

-- قوالب الطباعة القابلة للتعديل
create table if not exists public.document_templates (
  id bigserial primary key,
  template_key text not null unique,
  title text not null,
  document_type text not null check (document_type in ('contract','scholarship_contract','receipt','report','statement','custom')),
  paper_size text not null default 'A4',
  orientation text not null default 'portrait' check (orientation in ('portrait','landscape')),
  header_html text,
  body_html text not null,
  footer_html text,
  css text,
  is_active boolean default true,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.document_print_logs (
  id bigserial primary key,
  template_id bigint references public.document_templates(id) on delete set null,
  document_type text not null,
  entity_table text,
  entity_id text,
  printed_by uuid references public.profiles(id) on delete set null,
  printed_at timestamptz default now(),
  note text
);

alter table public.document_templates enable row level security;
alter table public.document_print_logs enable row level security;

drop policy if exists "document templates read" on public.document_templates;
drop policy if exists "document templates manage" on public.document_templates;
drop policy if exists "print logs read" on public.document_print_logs;
drop policy if exists "print logs manage" on public.document_print_logs;

create policy "document templates read"
on public.document_templates
for select
to authenticated
using (true);

create policy "document templates manage"
on public.document_templates
for all
to authenticated
using (public.current_user_role() in ('admin'::public.user_role))
with check (public.current_user_role() in ('admin'::public.user_role));

create policy "print logs read"
on public.document_print_logs
for select
to authenticated
using (public.current_user_role() in ('admin'::public.user_role, 'accountant'::public.user_role));

create policy "print logs manage"
on public.document_print_logs
for all
to authenticated
using (public.current_user_role() in ('admin'::public.user_role, 'accountant'::public.user_role))
with check (public.current_user_role() in ('admin'::public.user_role, 'accountant'::public.user_role));

create or replace function public.log_document_print(
  p_template_key text,
  p_document_type text,
  p_entity_table text default null,
  p_entity_id text default null,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_template_id bigint;
begin
  select id into v_template_id
  from public.document_templates
  where template_key = p_template_key
  limit 1;

  insert into public.document_print_logs(
    template_id,
    document_type,
    entity_table,
    entity_id,
    printed_by,
    note
  )
  values (
    v_template_id,
    p_document_type,
    p_entity_table,
    p_entity_id,
    auth.uid(),
    p_note
  );

  if p_entity_table = 'student_contracts' and p_entity_id is not null then
    update public.student_contracts
    set printed_at = now(),
        print_count = coalesce(print_count,0) + 1
    where id = p_entity_id::bigint;
  end if;
end;
$$;

-- Default regular student contract template
insert into public.document_templates(template_key, title, document_type, paper_size, orientation, header_html, body_html, footer_html, css)
values (
'student_contract_regular',
'عقد تسجيل طالب - عادي',
'contract',
'A4',
'portrait',
'<div class="doc-header">
  <h1>{{school_name}}</h1>
  <h2>عقد تسجيل طالب</h2>
  <p>رقم العقد: <b>{{contract_no}}</b></p>
</div>',
'<div class="section">
  <h3>أولًا: بيانات الطالب</h3>
  <table>
    <tr><td>اسم الطالب</td><td>{{student_name}}</td></tr>
    <tr><td>رقم الطالب</td><td>{{student_number}}</td></tr>
    <tr><td>الصف</td><td>{{class_name}}</td></tr>
    <tr><td>رقم الباص</td><td>{{bus_number}}</td></tr>
    <tr><td>الجولة</td><td>{{bus_round}}</td></tr>
  </table>
</div>

<div class="section">
  <h3>ثانيًا: الرسوم المالية</h3>
  <table>
    <tr><td>رسوم التسجيل</td><td>{{registration_fee}}</td></tr>
    <tr><td>الرسوم الدراسية</td><td>{{tuition_fee}}</td></tr>
    <tr><td>رسوم الباص</td><td>{{bus_fee}}</td></tr>
    <tr><td>الكتب</td><td>{{books_fee}}</td></tr>
    <tr><td>الزي</td><td>{{uniform_fee}}</td></tr>
    <tr><td>الأنشطة</td><td>{{activities_fee}}</td></tr>
    <tr><td>الخصم</td><td>{{discount_amount}}</td></tr>
    <tr class="total"><td>الصافي المطلوب</td><td>{{net_amount}}</td></tr>
  </table>
</div>

<div class="section">
  <h3>ثالثًا: شروط العقد</h3>
  <ol>
    <li>يلتزم ولي الأمر بسداد الرسوم حسب الخطة المعتمدة من المدرسة.</li>
    <li>لا تعتبر عملية التسجيل مكتملة إلا بعد اعتماد الإدارة للعقد.</li>
    <li>أي خصومات أو تعديلات مالية يجب أن تعتمد من الإدارة.</li>
    <li>يلتزم الطالب وولي الأمر بأنظمة المدرسة وتعليماتها.</li>
  </ol>
</div>

<div class="signatures">
  <div>توقيع ولي الأمر<br><br>________________</div>
  <div>توقيع المحاسب<br><br>________________</div>
  <div>ختم الإدارة<br><br>________________</div>
</div>',
'<div class="doc-footer">تاريخ الطباعة: {{print_date}} - {{school_name}}</div>',
'body{font-family:Arial,Tahoma,sans-serif;direction:rtl;color:#111}.doc-header{text-align:center;border-bottom:2px solid #111;padding-bottom:12px;margin-bottom:18px}.doc-header h1{margin:0;font-size:24px}.doc-header h2{margin:8px 0;font-size:22px}.section{margin:16px 0}.section h3{background:#f1f5f9;padding:10px;border-radius:8px}table{width:100%;border-collapse:collapse;margin-top:8px}td,th{border:1px solid #222;padding:9px}.total td{font-weight:bold;background:#e0f2fe}.signatures{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:45px;text-align:center}.doc-footer{position:fixed;bottom:10mm;left:0;right:0;text-align:center;font-size:12px;color:#555}@page{size:A4;margin:15mm}'
)
on conflict (template_key) do update
set title=excluded.title,
    body_html=excluded.body_html,
    header_html=excluded.header_html,
    footer_html=excluded.footer_html,
    css=excluded.css,
    updated_at=now();

-- Default scholarship contract template
insert into public.document_templates(template_key, title, document_type, paper_size, orientation, header_html, body_html, footer_html, css)
values (
'student_contract_scholarship',
'عقد طالب منحة',
'scholarship_contract',
'A4',
'portrait',
'<div class="doc-header scholarship">
  <h1>{{school_name}}</h1>
  <h2>عقد طالب منحة / خصم</h2>
  <p>رقم العقد: <b>{{contract_no}}</b></p>
</div>',
'<div class="notice">
  هذا العقد خاص بطالب حاصل على منحة أو خصم، وتبقى المنحة سارية حسب قرار الإدارة وضمن شروط المدرسة.
</div>

<div class="section">
  <h3>بيانات الطالب</h3>
  <table>
    <tr><td>اسم الطالب</td><td>{{student_name}}</td></tr>
    <tr><td>رقم الطالب</td><td>{{student_number}}</td></tr>
    <tr><td>الصف</td><td>{{class_name}}</td></tr>
    <tr><td>نوع المنحة</td><td>{{scholarship_title}}</td></tr>
    <tr><td>نسبة المنحة</td><td>{{scholarship_percent}}%</td></tr>
    <tr><td>مبلغ المنحة</td><td>{{scholarship_amount}}</td></tr>
  </table>
</div>

<div class="section">
  <h3>الرسوم بعد المنحة</h3>
  <table>
    <tr><td>إجمالي الرسوم قبل المنحة</td><td>{{total_amount}}</td></tr>
    <tr><td>إجمالي الخصم / المنحة</td><td>{{discount_amount}}</td></tr>
    <tr class="total"><td>الصافي بعد المنحة</td><td>{{net_amount}}</td></tr>
  </table>
</div>

<div class="section">
  <h3>شروط المنحة</h3>
  <ol>
    <li>تمنح هذه المنحة بقرار إداري ولا تعتبر حقًا دائمًا إلا بموافقة المدرسة.</li>
    <li>يحق للإدارة مراجعة المنحة عند انخفاض الالتزام الأكاديمي أو السلوكي أو المالي.</li>
    <li>لا تنتقل المنحة تلقائيًا إلى سنة دراسية جديدة إلا باعتماد جديد.</li>
    <li>يلتزم ولي الأمر بسداد أي مبالغ متبقية حسب كشف الحساب.</li>
  </ol>
</div>

<div class="signatures">
  <div>توقيع ولي الأمر<br><br>________________</div>
  <div>اعتماد الإدارة<br><br>________________</div>
</div>',
'<div class="doc-footer">تاريخ الطباعة: {{print_date}} - عقد منحة</div>',
'body{font-family:Arial,Tahoma,sans-serif;direction:rtl;color:#111}.doc-header{text-align:center;border-bottom:3px solid #b45309;padding-bottom:12px;margin-bottom:18px}.scholarship h2{color:#b45309}.notice{background:#fffbeb;border:1px solid #f59e0b;border-radius:10px;padding:12px;margin:12px 0}.section{margin:16px 0}.section h3{background:#fef3c7;padding:10px;border-radius:8px}table{width:100%;border-collapse:collapse;margin-top:8px}td,th{border:1px solid #222;padding:9px}.total td{font-weight:bold;background:#fde68a}.signatures{display:grid;grid-template-columns:repeat(2,1fr);gap:40px;margin-top:55px;text-align:center}.doc-footer{position:fixed;bottom:10mm;left:0;right:0;text-align:center;font-size:12px;color:#555}@page{size:A4;margin:15mm}'
)
on conflict (template_key) do update
set title=excluded.title,
    body_html=excluded.body_html,
    header_html=excluded.header_html,
    footer_html=excluded.footer_html,
    css=excluded.css,
    updated_at=now();

-- Account statement template
insert into public.document_templates(template_key, title, document_type, paper_size, orientation, header_html, body_html, footer_html, css)
values (
'student_account_statement',
'كشف حساب طالب',
'statement',
'A4',
'portrait',
'<div class="doc-header"><h1>{{school_name}}</h1><h2>كشف حساب طالب</h2></div>',
'<div class="section">
  <table>
    <tr><td>اسم الطالب</td><td>{{student_name}}</td></tr>
    <tr><td>رقم الطالب</td><td>{{student_number}}</td></tr>
    <tr><td>الصف</td><td>{{class_name}}</td></tr>
  </table>
</div>
<div class="summary">
  <div><span>إجمالي الرسوم</span><b>{{total_fees}}</b></div>
  <div><span>المدفوع</span><b>{{total_payments}}</b></div>
  <div><span>الخصومات</span><b>{{total_discounts}}</b></div>
  <div><span>الرصيد</span><b>{{balance}}</b></div>
</div>
<p class="note">هذا الكشف صادر من النظام ويخضع للمراجعة المالية النهائية.</p>',
'<div class="doc-footer">تاريخ الطباعة: {{print_date}}</div>',
'body{font-family:Arial,Tahoma,sans-serif;direction:rtl;color:#111}.doc-header{text-align:center;border-bottom:2px solid #111;margin-bottom:18px}.section{margin:16px 0}table{width:100%;border-collapse:collapse}td{border:1px solid #222;padding:10px}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:25px 0}.summary div{border:1px solid #111;border-radius:10px;padding:15px;text-align:center}.summary span{display:block;color:#555}.summary b{font-size:22px}.note{margin-top:40px}.doc-footer{position:fixed;bottom:10mm;left:0;right:0;text-align:center;font-size:12px}@page{size:A4;margin:15mm}'
)
on conflict (template_key) do update
set title=excluded.title,
    body_html=excluded.body_html,
    header_html=excluded.header_html,
    footer_html=excluded.footer_html,
    css=excluded.css,
    updated_at=now();

notify pgrst, 'reload schema';
