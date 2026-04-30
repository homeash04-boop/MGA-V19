School Portal V20 - Auth Lock Fix

تحل هذه النسخة مشكلة بقاء الموقع على "جاري التحميل" بسبب:
@supabase/gotrue-js Lock was not released
AbortError: Lock broken by another request with the 'steal' option

التعديلات:
- تغيير storageKey لجلسة Supabase إلى mga_school_portal_auth_v20
- معالجة AbortError حتى لا يعلق التطبيق
- تنظيف الجلسة القديمة تلقائيًا عند حدوث Lock
- إضافة زر تنظيف الجلسة إذا حدث خطأ تحميل
- إضافة public/_redirects لمشكلة مسارات Netlify

بعد الرفع:
1) افتح الموقع.
2) إذا بقي عالقًا، افتح DevTools > Application > Storage > Clear site data.
3) أو نفّذ في Console:
localStorage.clear(); sessionStorage.clear(); location.href='/login'

الأوامر:
npm.cmd install
npm.cmd run build
git add .
git commit -m "V20 auth lock fix"
git push