V32 changes
==========
1) Fixed Class Pricing page so it no longer relies on PostgREST schema-cache relationship loading between class_pricing and academic_terms.
2) Added safer SQL migration V32_CLASS_PRICING_TERM_RELATION_AND_UI.sql to create/repair the FK if your old database is missing it.
3) Converted contract printing into a direct button inside the Contracts page.
4) Improved Contracts page with searchable student/guardian selectors and better labels.
5) Added smoother UI interactions and simple animation effects.
6) Added missing routes for print templates and print reports.

Recommended order:
- Run V30 if you did not run it yet.
- Run V17 if printing templates are missing.
- Run V32 to repair the class_pricing -> academic_terms FK if needed.
- Deploy the updated frontend.
