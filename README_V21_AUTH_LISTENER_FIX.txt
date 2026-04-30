School Portal V21 - Auth Listener Fix

هذه النسخة تصحح خطأ:
Uncaught TypeError: F.auth.onAuthStateChange(...).then is not a function

السبب:
Supabase auth.onAuthStateChange في النسخة الحالية يرجع Subscription مباشرة وليس Promise.

الأوامر:
npm.cmd install
npm.cmd run build
git add .
git commit -m "V21 auth listener fix"
git push --force

بعد النشر:
افتح Console ونظف الجلسة مرة واحدة:
localStorage.clear(); sessionStorage.clear(); location.href='/login';