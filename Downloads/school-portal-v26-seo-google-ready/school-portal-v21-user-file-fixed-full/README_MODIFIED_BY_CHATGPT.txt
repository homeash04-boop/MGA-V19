تم تعديل هذا الملف المرفق نفسه وإصلاح المشاكل التالية:

1) إزالة Duplicate keys من src/main.jsx:
   - parent_id
   - document_type
   - partial

2) إصلاح خطأ:
   onAuthStateChange(...).then is not a function

3) إضافة إعداد Auth مستقر:
   storageKey: mga_school_portal_auth_fixed

4) إضافة:
   public/_redirects
   حتى تعمل روابط Netlify الداخلية مثل /admin و /login.

5) إضافة ملف:
   supabase/FULL_SCHEMA_V23_COMPLETE.sql
   كملف توسعة للميزات المتقدمة إن لم يكن موجوداً.

الأوامر:
npm.cmd install
npm.cmd run build

بعد النشر، نفذ مرة واحدة من Console:
localStorage.clear();
sessionStorage.clear();
location.href = '/login';