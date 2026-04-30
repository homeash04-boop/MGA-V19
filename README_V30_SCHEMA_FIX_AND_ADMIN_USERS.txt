V30 - Schema Fix + Admin User Creation

1) ارفع المشروع على GitHub/Netlify.
2) افتح Supabase > SQL Editor.
3) شغّل الملف:
   supabase/V30_SCHEMA_FIX_AND_ADMIN_USER_CREATION.sql
4) انتظر 10 ثواني ثم افتح الموقع Ctrl+F5.

الإصلاحات:
- إنشاء الجداول الناقصة التي سببت أخطاء schema cache مثل:
  class_pricing, student_contracts, student_installments,
  student_scholarships, student_documents, accounting_fiscal_years.
- إعادة إنشاء view: student_account_summary.
- إضافة log_document_print كدالة آمنة للطباعة.
- إضافة المستخدمين أصبحت من صفحة المستخدمين في الإدارة بالبريد وكلمة المرور والدور.
- جدول profiles أصبح لا يقبل إضافة/تعديل/حذف إلا من مستخدم admin.

ملاحظة:
إذا كان تأكيد البريد في Supabase مفعّلًا، سيحتاج المستخدم الجديد إلى تأكيد البريد قبل الدخول.
يمكن إيقافه من Authentication > Providers > Email > Confirm email = Off أثناء التجربة.
