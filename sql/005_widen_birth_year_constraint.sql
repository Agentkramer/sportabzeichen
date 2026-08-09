-- Fix: DB-Constraint "participants_birth_year_check" war noch auf die
-- ursprüngliche 10-17-Jahre-Logik hartcodiert (currentYear-18 bis
-- currentYear-10) und unabhängig vom App-Code (kein Teil der bisherigen
-- sql/*.sql-Migrationen - vermutlich beim ursprünglichen Tabellen-Setup
-- in Phase 1 manuell im Table Editor angelegt). Das blockierte den Import
-- von Teilnehmer*innen außerhalb 10-17 komplett lautlos auf DB-Ebene,
-- obwohl die App selbst (nach Ergänzung der Altersbänder 8-9/18-19)
-- 8-19 Jahre erlaubt.
--
-- Im Supabase Dashboard unter "SQL Editor" ausführen.

alter table public.participants drop constraint participants_birth_year_check;

alter table public.participants add constraint participants_birth_year_check
  check (
    birth_year >= extract(year from current_date) - 19
    and birth_year <= extract(year from current_date) - 8
  );
