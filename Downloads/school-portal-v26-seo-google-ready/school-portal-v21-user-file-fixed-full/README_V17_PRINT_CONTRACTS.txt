School Portal V17 - Print & Editable Contract Templates

هذه نسخة كاملة مبنية على V16 وتضيف:

1) قوالب طباعة قابلة للتعديل من الأدمن:
- عقد طالب عادي
- عقد طالب منحة
- كشف حساب طالب
- تقرير ذمم

2) طباعة العقود:
- العقد العادي له تصميم مستقل.
- طالب المنحة له عقد مختلف وشروط مختلفة.
- كل عقد يحفظ عدد مرات الطباعة ووقت آخر طباعة.

3) صفحة قوالب الطباعة:
- /admin/print-templates
- الأدمن يستطيع تعديل HTML و CSS للقالب مباشرة.

4) صفحة طباعة العقود:
- /admin/print-contracts
- /accountant/print-contracts

5) صفحة طباعة التقارير:
- /admin/print-reports
- /accountant/print-reports

6) العقود:
- أضيف نوع العقد:
  regular
  scholarship
  transfer
  returning
  custom
- أضيفت حقول المنحة:
  scholarship_title
  scholarship_percent
  scholarship_amount

طريقة التركيب إذا كنت تستخدم النسخة الحالية:
1) انسخ ملفات المشروع فوق مشروعك.
2) شغّل SQL:
   supabase/V17_PRINT_CONTRACT_TEMPLATES.sql
3) أعد تشغيل المشروع:
   npm run dev

طريقة الرفع:
git add .
git commit -m "V17 print contract templates"
git push
