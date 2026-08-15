-- ============================================================
-- Accounts nach der Veranstaltung entfernen (Auswerter / Helfer)
-- ============================================================
--
-- Gegenstück zu 006_accounts_anlegen_vorlage.sql: Die Zugänge, die nur für
-- den Aktionstag bzw. das Sportfest gebraucht wurden, werden danach wieder
-- gelöscht. Weniger offene Zugänge zu Schülerdaten ist die sichere Variante.
--
-- ------------------------------------------------------------
-- WAS DABEI VERSCHWINDET UND WAS BLEIBT
-- ------------------------------------------------------------
-- BLEIBT:  Alle Teilnehmer und Leistungen in `participants`. Die Tabelle hat
--          keinerlei Verweis auf den bearbeitenden Nutzer.
-- BLEIBT:  `participants.updated_by` – die E-Mail steht dort als reiner TEXT,
--          bewusst nicht als Fremdschlüssel (siehe 007_updated_by.sql). Genau
--          deshalb überlebt die Angabe das Löschen des Accounts.
-- WEG:     Die Zeile in `public.profiles` (Rolle + Klassenzuordnung). Sie
--          hängt per `on delete cascade` an `auth.users` (002_roles.sql) und
--          räumt sich selbst auf – gewollt, sonst blieben verwaiste
--          Rollenzuweisungen zurück.
-- WEG:     Sessions, Identities und Refresh-Tokens des Accounts (Cascade
--          innerhalb des auth-Schemas). Offene Logins auf Tablets fliegen
--          damit beim nächsten Token-Refresh raus.
--
-- ------------------------------------------------------------
-- ZWEI EINSCHRÄNKUNGEN, DIE NICHTS MIT DEM LÖSCHEN ZU TUN HABEN
-- ------------------------------------------------------------
-- 1. `updated_by` ist nicht lückenlos. Die Spalte kam erst mit 007 dazu; die
--    damals vorhandenen Zeilen blieben NULL, bis sie das nächste Mal
--    gespeichert wurden. Wo nie wieder gespeichert wurde, steht bis heute
--    nichts drin.
-- 2. Jedes Speichern überschreibt `updated_by` mit dem gerade speichernden
--    Nutzer. Wer nach dem Aktionstag Fehleingaben korrigiert hat, steht dort
--    jetzt anstelle des ursprünglichen Auswerters.
--    => Deshalb Schritt 1: vorher sichern.
--
-- Der offiziell supportete Weg ist Dashboard → Authentication → Users →
-- Account → "Delete user". Bei einer Handvoll Accounts ist das der bequemere
-- und schwerer falsch zu bedienende Weg; dieses Skript ist die dokumentierte
-- Variante für den Fall, dass es viele auf einmal sind.
--
-- Im Supabase Dashboard unter "SQL Editor" ausführen.
-- ============================================================


-- ============================================================
-- SCHRITT 1: Bearbeiter-Spur sichern (VOR dem Löschen)
-- ============================================================
-- Nicht weil das Löschen sie zerstören würde – sondern weil sie durch jede
-- spätere Korrektur überschrieben wird und dies ein guter Anlass ist,
-- den Stand einmal festzuhalten. Ergebnis exportieren (Download als CSV im
-- SQL Editor) und zu den Backups legen.

select updated_by,
       count(*)            as datensaetze,
       min(updated_at)     as erste_bearbeitung,
       max(updated_at)     as letzte_bearbeitung
from public.participants
group by updated_by
order by datensaetze desc;

-- Vollständige Zuordnung Datensatz -> Bearbeiter:
-- select external_id, last_name, first_name, class_name, updated_by, updated_at
-- from public.participants
-- order by updated_by, last_name;


-- ============================================================
-- SCHRITT 2: Anzeigen, was gelöscht werden soll
-- ============================================================
-- IMMER zuerst ansehen, welche Accounts das Muster trifft. Ein zu weit
-- gefasstes LIKE würde sonst auch den eigenen Admin-Zugang erwischen.

select p.email,
       p.role,
       p.classes,
       p.created_at,
       (select count(*) from public.participants t where t.updated_by = p.email)
         as bearbeitete_datensaetze
from public.profiles p
where p.email like 'auswertung-jg%@dsa-intern.local'   -- Muster anpassen!
order by p.email;

-- Sicherheitsnetz: Admins dürfen hier nicht auftauchen.
-- select email, role from public.profiles where role = 'admin';


-- ============================================================
-- SCHRITT 3: Löschen
-- ============================================================
-- Erst ausführen, wenn Schritt 2 GENAU die gewünschten Accounts gezeigt hat.
-- Das `and role <> 'admin'` ist doppelt gemoppelt und bleibt trotzdem stehen:
-- ein Tippfehler im Muster soll nicht den eigenen Zugang kosten.

-- delete from auth.users
-- where id in (
--   select id from public.profiles
--   where email like 'auswertung-jg%@dsa-intern.local'   -- dasselbe Muster wie oben
--     and role <> 'admin'
-- );

-- Einzelner Account:
-- delete from auth.users where email = 'auswertung-jg5@dsa-intern.local';


-- ============================================================
-- SCHRITT 4: Kontrolle nach dem Löschen
-- ============================================================
-- a) Accounts weg?
select email, role, classes from public.profiles order by email;

-- b) Keine verwaisten Profile (sollte 0 Zeilen liefern – der Cascade räumt
--    normalerweise selbst auf, aber prüfen kostet nichts):
select p.email
from public.profiles p
left join auth.users u on u.id = p.id
where u.id is null;

-- c) Teilnehmerdaten unverändert und Bearbeiter-Spur noch da?
--    Die Zahlen müssen zu Schritt 1 passen.
select count(*) as teilnehmer_gesamt,
       count(updated_by) as mit_bearbeiter_vermerk,
       count(distinct updated_by) as verschiedene_bearbeiter
from public.participants;
