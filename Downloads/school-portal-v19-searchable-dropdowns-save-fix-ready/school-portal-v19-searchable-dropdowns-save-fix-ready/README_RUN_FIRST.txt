School Portal V16 Complete Build Ready

طريقة التشغيل المحلي:
1) فك الضغط.
2) انسخ .env.example وسمّه .env
3) ضع:
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
4) افتح Supabase SQL Editor وشغّل:
   supabase/FULL_SUPABASE_SCHEMA_V16.sql
5) أنشئ مستخدم أدمن من Supabase Authentication.
6) شغّل:
   supabase/CREATE_ADMIN_PROFILE.sql
   وعدّل الإيميل داخله حسب حساب الأدمن.
7) شغّل RUN_LOCAL.bat

طريقة النشر:
1) ارفع المشروع على GitHub.
2) اربطه مع Vercel أو Netlify.
3) أضف Environment Variables:
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
4) Build command:
   npm run build
5) Output directory:
   dist

ملاحظات:
- هذه نسخة كاملة للبناء وليست Patch.
- تحتوي على كل المسارات الأساسية التي طلبتها حتى V16.
- Supabase Edge Functions غير مطلوبة في هذه النسخة لإنشاء المستخدمين؛ يتم تسجيل الحسابات من Supabase Auth أو من شاشة التسجيل إذا فعلتها لاحقاً.
- يمكن جعل إنشاء المستخدمين من داخل النظام بإضافة Edge Function لاحقاً.
