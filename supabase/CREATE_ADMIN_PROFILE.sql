-- عدّل الإيميل هنا إلى إيميل المدير الذي أنشأته من Supabase Authentication
insert into public.profiles (id, full_name, role, phone)
select id, 'مدير النظام', 'admin'::public.user_role, '0790000000'
from auth.users
where email = 'admin@mga-school.com'
on conflict (id) do update
set full_name = excluded.full_name,
    role = excluded.role,
    phone = excluded.phone;

select u.email, p.full_name, p.role
from auth.users u
left join public.profiles p on p.id = u.id;
