V25 Fix:
- Fixed Supabase PostgREST ambiguity: "Could not embed because more than one relationship was found for students and profiles" by using the explicit students_profile_id_fkey relation where needed.
- Rebuilt Student Movements page query to avoid ambiguous nested profiles embed.
- Added delete-row button to Student Movements page with confirmation.
