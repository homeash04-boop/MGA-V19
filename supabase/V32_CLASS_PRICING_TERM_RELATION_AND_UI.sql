-- V32: class_pricing <-> academic_terms relation safety + contracts/UI support notes
-- Run this in Supabase SQL Editor after V30 if your old database still misses the FK.

alter table public.class_pricing
  add column if not exists academic_term_id bigint;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'class_pricing_academic_term_id_fkey'
  ) then
    begin
      alter table public.class_pricing
        add constraint class_pricing_academic_term_id_fkey
        foreign key (academic_term_id)
        references public.academic_terms(id)
        on delete set null;
    exception when others then
      raise notice 'Could not create FK automatically: %', sqlerrm;
    end;
  end if;
end $$;

create index if not exists idx_class_pricing_academic_term_id on public.class_pricing(academic_term_id);
create index if not exists idx_student_contracts_student_id on public.student_contracts(student_id);
create index if not exists idx_student_contracts_class_pricing_id on public.student_contracts(class_pricing_id);
create index if not exists idx_student_contracts_academic_term_id on public.student_contracts(academic_term_id);
