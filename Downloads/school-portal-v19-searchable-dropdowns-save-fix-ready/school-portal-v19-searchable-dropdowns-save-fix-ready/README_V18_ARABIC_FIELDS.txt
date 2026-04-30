School Portal V18 - Arabic Fields

هذه النسخة مبنية على V17 وتضيف:
- تحويل أسماء الحقول الظاهرة في الواجهة إلى العربية.
- تعريب الحقول العامة التي كانت تظهر بأسماء قاعدة البيانات مثل:
  student_id, class_id, amount, status, contract_type, bus_number, ...
- تعريب قيم الحالات:
  active, archived, pending, paid, regular, scholarship, ...
- تعريب حقول العقود.
- تعريب حقول الطلاب والمواصلات.
- تعريب حقول الأقساط والسنوات المالية.
- تعريب حقول قوالب الطباعة.

مهم:
- أسماء الأعمدة داخل Supabase بقيت إنجليزية وهذا صحيح تقنيًا.
- التغيير فقط في الواجهة للمستخدم.
- لا تحتاج SQL جديد إلا إذا لم تشغّل SQL V17 سابقًا.
- إذا لم تشغّل V17، شغّل:
  supabase/V17_PRINT_CONTRACT_TEMPLATES.sql

طريقة التشغيل:
npm.cmd install
npm.cmd run dev

طريقة الرفع:
git add .
git commit -m "V18 Arabic field labels"
git push