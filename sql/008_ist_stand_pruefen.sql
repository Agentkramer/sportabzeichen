-- ============================================================
-- IST-Stand der Datenbank auslesen (reine Leseabfragen)
-- ============================================================
--
-- Zweck: Die Dateien in sql/ werden von Hand ausgeführt und beschreiben
-- deshalb nur den SOLL-Stand. Was tatsächlich in der Datenbank steht,
-- kann davon abweichen – etwa wenn etwas direkt im Table Editor
-- angelegt wurde.
--
-- Genau das ist schon passiert: Das Constraint
-- `participants_birth_year_check` (10–17 Jahre) stammte aus Phase 1,
-- stand in keiner Datei, und hat später den Import von Teilnehmer*innen
-- außerhalb dieser Altersspanne lautlos blockiert.
--
-- Dieses Skript ändert nichts. Es zeigt nur an, was da ist.
-- Empfehlung: nach jeder Schema-Änderung einmal laufen lassen und mit
-- den Dateien in sql/ abgleichen.
--
-- Im Supabase Dashboard unter "SQL Editor" ausführen.
-- ============================================================


-- ============================================================
-- ABFRAGE 1: Vollständige Inventur (alles in einem Ergebnis)
-- ============================================================
select 'Tabelle' as kategorie,
       table_name as objekt,
       '' as details
from information_schema.tables
where table_schema = 'public' and table_type = 'BASE TABLE'

union all

select 'Spalte',
       table_name || '.' || column_name,
       data_type
         || case when is_nullable = 'NO' then ' NOT NULL' else '' end
         || coalesce(' DEFAULT ' || column_default, '')
from information_schema.columns
where table_schema = 'public'

union all

select 'Constraint',
       conrelid::regclass::text || ' → ' || conname,
       pg_get_constraintdef(oid)
from pg_constraint
where connamespace = 'public'::regnamespace
  and conrelid <> 0

union all

select 'RLS',
       relname,
       case when relrowsecurity then 'aktiviert' else '⚠️ NICHT AKTIVIERT' end
from pg_class
where relnamespace = 'public'::regnamespace and relkind = 'r'

union all

select 'Policy',
       tablename || ' → ' || policyname,
       cmd || ' für ' || array_to_string(roles, ', ')
from pg_policies
where schemaname = 'public'

union all

select 'Trigger',
       c.relname || ' → ' || t.tgname,
       p.proname || '()'
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_proc p on p.oid = t.tgfoid
where not t.tgisinternal
  and c.relnamespace = 'public'::regnamespace

union all

select 'Funktion',
       p.proname,
       '(' || pg_get_function_identity_arguments(p.oid) || ')'
         || case when p.prosecdef then '  [SECURITY DEFINER]' else '' end
from pg_proc p
where p.pronamespace = 'public'::regnamespace

order by 1, 2;


-- ============================================================
-- ABFRAGE 2: Auffälligkeiten (das Kurzprotokoll)
-- ============================================================
-- Diese Abfrage separat ausführen. Idealerweise kommt hier nichts
-- oder nur Bekanntes zurück.

-- select 'Tabelle ohne RLS' as befund,
--        relname as objekt,
--        'Über den publishable Key frei zugänglich!' as hinweis
-- from pg_class
-- where relnamespace = 'public'::regnamespace
--   and relkind = 'r'
--   and not relrowsecurity
--
-- union all
--
-- select 'Tabelle mit RLS, aber ohne Policies',
--        c.relname,
--        'Niemand kommt an die Daten (außer über den SQL Editor).'
-- from pg_class c
-- where c.relnamespace = 'public'::regnamespace
--   and c.relkind = 'r'
--   and c.relrowsecurity
--   and not exists (
--     select 1 from pg_policies pol
--     where pol.schemaname = 'public' and pol.tablename = c.relname
--   )
--
-- union all
--
-- select 'SECURITY DEFINER Funktion',
--        p.proname,
--        'Läuft mit erhöhten Rechten – prüfen, ob sie noch gebraucht wird '
--        || 'und ob anon/authenticated sie aufrufen dürfen.'
-- from pg_proc p
-- where p.pronamespace = 'public'::regnamespace
--   and p.prosecdef;


-- ============================================================
-- Erwarteter Stand (Abgleich für Abfrage 2)
-- ============================================================
-- Tabellen ohne RLS:              keine
-- Tabellen mit RLS ohne Policies: keepalive (Absicht – der Zugriff läuft
--                                 ausschließlich über bump_keepalive())
-- SECURITY DEFINER Funktionen:    is_admin, my_classes, handle_new_user,
--                                 bump_keepalive, set_updated_by
--                                 -> tmp_create_account darf NICHT
--                                    auftauchen (sonst Schritt 5 aus
--                                    006 nachholen)
