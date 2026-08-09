-- ============================================================
-- DOKUMENTATION des Bestands aus Phase 1
-- ============================================================
--
-- NICHT AUSFÜHREN. Diese Datei beschreibt nur, was bereits in der
-- Datenbank existiert – angelegt in Phase 1 direkt im Supabase Table
-- Editor, bevor Schema-Änderungen in sql/ festgehalten wurden.
--
-- Nachträglich rekonstruiert am 2026-08-09 aus der Inventur
-- (siehe sql/008_ist_stand_pruefen.sql). Zweck: Damit im Repo
-- nachvollziehbar ist, worauf der App-Code aufbaut, und damit die
-- Datenbank im Notfall (Projektverlust, Umzug, zweite Schule)
-- vollständig neu aufgebaut werden kann.
-- ============================================================


-- ------------------------------------------------------------
-- Tabelle participants
-- ------------------------------------------------------------
-- create table public.participants (
--   id          uuid primary key default gen_random_uuid(),
--   created_at  timestamptz default now(),
--   updated_at  timestamptz default now(),
--   first_name  text,
--   last_name   text,
--   birth_year  integer not null,
--   class_name  varchar,
--   gender      text not null,
--   external_id text unique,
--   results     jsonb default '{}'::jsonb
--   -- updated_by kam später dazu, siehe 007_updated_by.sql
-- );

-- Wichtig für den CSV-Import: Die UNIQUE-Bedingung auf external_id ist
-- die Grundlage der Dublettenerkennung in importParticipantsToDb().
-- Zeilen OHNE external_id werden deshalb immer neu angelegt – ein
-- zweiter Import derselben Liste erzeugt Duplikate.

-- Erlaubte Geschlechter (Werte müssen zu PERFORMANCE_DATA in app.js passen):
-- alter table public.participants add constraint participants_gender_check
--   check (gender = any (array['weiblich'::text, 'maennlich'::text]));

-- Altersgrenze: ursprünglich 10–17 Jahre. Dieses Constraint hat später
-- den Import von Teilnehmer*innen außerhalb der Spanne lautlos
-- blockiert und wurde in 005 auf 8–19 Jahre erweitert.


-- ------------------------------------------------------------
-- Automatischer Zeitstempel
-- ------------------------------------------------------------
-- create function public.update_updated_at()
-- returns trigger language plpgsql as $$
-- begin
--   new.updated_at := now();
--   return new;
-- end;
-- $$;
--
-- create trigger participants_updated_at
--   before update on public.participants
--   for each row execute function public.update_updated_at();

-- Hinweis: Seit 007 setzt auch set_updated_by() das Feld updated_at.
-- Beide Trigger schreiben denselben Wert (now()), stören sich also
-- nicht. Wer aufräumen will, kann update_updated_at() entfernen –
-- nötig ist es nicht.


-- ------------------------------------------------------------
-- Tabelle keep_alive
-- ------------------------------------------------------------
-- Siehe 004_keepalive.sql – dort ist der tatsächliche Stand beschrieben.
