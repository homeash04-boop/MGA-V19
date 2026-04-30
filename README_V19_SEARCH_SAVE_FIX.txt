School Portal V19 - Searchable Dropdowns + Save Fix

هذه النسخة تحل:
1) مشكلة عدم حفظ الطالب.
2) مشكلة:
   Could not embed because more than one relationship was found for 'students' and 'profiles'
3) تحويل اختيار الطالب والصف إلى حقل بحث تكتب فيه ويبحث مباشرة.
4) إصلاح صفحة سجل حركة الطلاب بدون علاقات Supabase embedded.
5) إصلاح صفحة أرشيف الطلاب ومعلومات الطلاب لتعمل بدون خطأ relationships.

مهم:
شغّل SQL:
supabase/V19_SAVE_AND_RELATION_FIX.sql

ثم:
npm.cmd install
npm.cmd run dev

للرفع:
git add .
git commit -m "V19 searchable dropdowns save fix"
git push
