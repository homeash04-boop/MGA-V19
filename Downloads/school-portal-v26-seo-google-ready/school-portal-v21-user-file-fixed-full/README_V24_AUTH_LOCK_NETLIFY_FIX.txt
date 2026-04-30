V24 AUTH LOCK + NETLIFY LOADING FIX
===================================
تم إصلاح مشكلة بقاء الصفحة على "جاري التحميل..." بسبب خطأ Supabase Auth:
AbortError: Lock broken by another request with the 'steal' option.

التعديلات:
1) إضافة safeAuthLock داخل Supabase client لمنع تعارض Web Locks في Chrome/Netlify.
2) تغيير storageKey إلى mga_school_portal_auth_v24_safe لتجاوز الجلسات القديمة المعطوبة.
3) تنظيف مفاتيح الجلسات القديمة v20/v21 ومفاتيح lock/gotrue التالفة تلقائيًا.
4) إصلاح onAuthStateChange لأنه في supabase-js v2 يرجع object وليس Promise.
5) إضافة timeout حتى لا تبقى الشاشة على جاري التحميل للأبد.
6) إزالة Duplicate key warnings من AR_LABELS.

بعد الرفع على Netlify:
- افتح الموقع.
- اعمل تسجيل دخول من جديد لأن مفتاح التخزين تغيّر لتجاوز القفل القديم.
- إذا بقي المتصفح محتفظًا بكاش قديم: Ctrl+F5 أو امسح Site Data للموقع.
