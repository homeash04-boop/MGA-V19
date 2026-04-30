V33 changes
===========
1) Annual Promotion page is restored as a real working page.
2) Classes page now includes delete row.
3) Subjects page was rebuilt:
   - Add subject
   - Delete subject
   - Link one subject to multiple classes
   - Assign a teacher to each subject/class relation
   - Delete a subject-class-teacher relation
4) Added SQL file:
   supabase/V33_ANNUAL_PROMOTION_SUBJECTS_TEACHERS.sql

After deploy, run the V33 SQL file in Supabase SQL Editor, then hard refresh the website.
