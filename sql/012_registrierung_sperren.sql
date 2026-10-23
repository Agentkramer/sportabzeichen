-- ============================================================
-- Registrierung sperren: zweites Schloss hinter dem Dashboard-Schalter
-- ============================================================
--
-- NICHT AUSGEFUEHRT - und zwar bewusst. Am 23.10.2026 nach dem Lesen
-- dieser Datei dagegen entschieden: Der Preis (Konten anlegen in zwei
-- Schritten, siehe unten) rechtfertigt den Gewinn nicht, solange der
-- Dashboard-Schalter sicher aus ist. Die Abschnitte A bis C sind damit
-- ein BESCHRIEBENER VORSCHLAG, kein Bestand - wer sie spaeter doch
-- ausfuehrt, muss die drei Stellen in der README, in der CLAUDE.md und
-- an handleLogin() in app.js mitziehen, die heute sagen, dass es diese
-- Sperre nicht gibt.
--
-- WAS DAFUER GILT: Abschnitt D. Ohne das zweite Schloss haengt alles an
-- einem einzigen Schalter in einer Weboberflaeche, und wenn der umfaellt,
-- faellt er lautlos um. Das ist in diesem Projekt schon zweimal
-- passiert (Keep-Alive, siehe 009). Die Leseabfragen in D finden ein
-- unerwartetes Konto - gelegentlich laufen lassen, sie aendern nichts.
--
-- Stand geprueft am 23.10.2026: POST /auth/v1/signup antwortet
-- 422 signup_disabled. Der Schalter ist also aus.
--
-- ------------------------------------------------------------
--
-- Im Supabase-Dashboard ist unter Authentication der Schalter
-- "Allow new users to sign up" AUS. Das ist die eigentliche Sperre.
-- Diese Datei beschreibt ein zweites Schloss dahinter.
--
-- ------------------------------------------------------------
-- WARUM UEBERHAUPT EIN ZWEITES
-- ------------------------------------------------------------
-- Der anon-Key steht im Quelltext der App - so ist er gedacht, er ist
-- oeffentlich. Damit kann jeder, der die Seite aufruft, auch direkt
--
--   POST https://<projekt>.supabase.co/auth/v1/signup
--
-- aufrufen. Dass die App keine Registrierungsmaske hat und app.js kein
-- signUp() enthaelt, aendert daran nichts: Fehlende Oberflaeche ist
-- keine Sperre.
--
-- Was ein so angelegtes Konto koennte: Durch den Trigger aus 002
-- bekaeme es ein profiles-Zeile mit Rolle 'examiner' und LEERER
-- Klassenliste. Die RLS aus 003 gibt ihm damit keine einzige Zeile aus
-- participants heraus, und profiles darf es nur fuer sich selbst lesen.
-- Es koennte also nichts sehen. Aber es waere da, es wuerde eine
-- E-Mail-Adresse speichern, und in der Datenschutzerklaerung steht
-- (Abschnitt 3.4), dass eine Selbstregistrierung nicht moeglich ist.
-- Diese Zusicherung soll nicht an einem einzigen Schalter in einer
-- Weboberflaeche haengen, den ein Update oder ein Fehlklick umlegt.
--
-- ------------------------------------------------------------
-- WAS DAS FUER DEINEN ABLAUF BEDEUTET - BITTE LESEN
-- ------------------------------------------------------------
-- Nach diesem Skript schlaegt das Anlegen eines Kontos im Dashboard
-- fehl, solange die Adresse nicht vorher freigeschaltet ist. Das
-- Anlegen hat also ZWEI Schritte:
--
--   1. Adresse hier freischalten (SQL Editor, siehe Abschnitt B)
--   2. Konto wie gewohnt anlegen: Authentication -> Users -> Add user
--      (oder Invite)
--
-- Vergisst man Schritt 1, zeigt das Dashboard eine Fehlermeldung mit
-- dem Text "Registrierung nicht freigeschaltet". Das ist dann kein
-- Defekt, sondern genau diese Sperre.
--
-- Genau dieser zweite Schritt war der Grund, es nicht zu tun (siehe
-- oben). Der Dashboard-Schalter bleibt damit die einzige Sperre.
--
-- Abschnitt D (Kontrolle) laeuft ohne dieses Skript und ist jetzt der
-- Ersatz dafuer. Nur Abschnitt A bis C waeren im SQL Editor
-- auszufuehren - und sind es nicht.
-- ============================================================


-- ============================================================
-- A. Freigabeliste
-- ============================================================
-- Eine Tabelle, nicht eine Liste im Funktionsrumpf: so laesst sich
-- eine Adresse freischalten, ohne eine Funktion neu zu schreiben.

create table if not exists public.erlaubte_accounts (
  email       text primary key,
  notiz       text,
  angelegt_am timestamptz not null default now()
);

comment on table public.erlaubte_accounts is
  'Adressen, fuer die ein Auth-Konto entstehen darf. Durchgesetzt vom Trigger handle_new_user. Siehe sql/012_registrierung_sperren.sql.';

-- RLS an, aber bewusst OHNE Policies - wie keep_alive_status aus 009:
-- damit kommt ueber die REST-API niemand an diese Tabelle heran, weder
-- lesend noch schreibend. Erreichbar ist sie nur hier im SQL-Editor.
alter table public.erlaubte_accounts enable row level security;

-- Bestand uebernehmen: alle Konten, die es jetzt schon gibt, gelten als
-- freigeschaltet. Sonst liesse sich ein nach dem Aktionstag entferntes
-- Helferkonto spaeter nicht ohne Nachdenken wieder anlegen.
insert into public.erlaubte_accounts (email, notiz)
select lower(email), 'Bestand bei Einfuehrung von 012'
from auth.users
where email is not null
on conflict (email) do nothing;


-- ============================================================
-- B. So schaltest du eine Adresse frei
-- ============================================================
-- Vor dem Anlegen eines Kontos ausfuehren, Adresse anpassen:
--
-- insert into public.erlaubte_accounts (email, notiz)
-- values (lower('lehrkraft@example.com'), 'Kollegin 6b, Schuljahr 26/27')
-- on conflict (email) do nothing;
--
-- Freigabe wieder zuruecknehmen (verhindert nur das NEU-Anlegen,
-- ein bestehendes Konto bleibt bestehen - das loescht 010):
--
-- delete from public.erlaubte_accounts where email = lower('helfer@example.com');


-- ============================================================
-- C. Der Trigger
-- ============================================================
-- Ersetzt handle_new_user() aus 002. Der Trigger selbst
-- (on_auth_user_created) bleibt unveraendert - nur die Funktion, die er
-- aufruft, bekommt vorne eine Pruefung.
--
-- Zwei Punkte, die nicht verhandelbar sind:
--
--   security definer: die Funktion muss auth.users und
--   erlaubte_accounts lesen duerfen, was ein normaler Nutzer nicht
--   darf. Sie nimmt dafuer keine Eingabe vom Client an - der Wert
--   kommt aus NEW, also aus dem Datensatz, den Supabase selbst
--   schreibt.
--
--   raise exception in einem AFTER-INSERT-Trigger rollt die gesamte
--   Transaktion zurueck. Das Konto entsteht also nicht halb: auth.users
--   bleibt unveraendert, und der signup-Aufruf bekommt einen Fehler.
--   Ein blosses "return null" wuerde den Trigger beenden, den User aber
--   anlegen - nur ohne Profil. Das waere schlechter als nichts, weil
--   loadCurrentUserProfile() dann auf 'examiner' zurueckfaellt.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public, auth
as $$
begin
  if not exists (
    select 1 from public.erlaubte_accounts
    where email = lower(new.email)
  ) then
    raise exception
      'Registrierung nicht freigeschaltet fuer %. Adresse zuerst in public.erlaubte_accounts eintragen (siehe sql/012_registrierung_sperren.sql).',
      new.email
      using errcode = 'check_violation';
  end if;

  insert into public.profiles (id, email)
  values (new.id, new.email);

  return new;
end;
$$;

-- Hinweis auf eine Luecke, die bewusst offen bleibt: Dieser Trigger
-- greift nur beim INSERT. Aendert ein bestehender Nutzer seine
-- E-Mail-Adresse (auth.updateUser), wird nicht geprueft, ob die neue
-- Adresse freigeschaltet ist. Das ist kein Weg zu einem neuen Konto -
-- es bleibt dasselbe Konto mit denselben Rechten - und waere deshalb
-- zusaetzlicher Aufwand ohne Gewinn. Die App bietet diese Funktion
-- ausserdem nicht an.


-- ============================================================
-- D. Kontrolle - DER TEIL, DER HIER TATSAECHLICH GILT
-- ============================================================
-- Diese Abfragen brauchen weder die Tabelle aus A noch den Trigger aus
-- C. Sie sind der Ersatz fuer das nicht ausgefuehrte zweite Schloss:
-- Wenn der Dashboard-Schalter die einzige Sperre ist, muss man wenigstens
-- merken, falls er umfaellt. Reine Leseabfragen, aendern nichts.
--
-- Wann laufen lassen: vor und nach jedem Aktionstag, und immer dann,
-- wenn im Dashboard an den Auth-Einstellungen etwas geaendert wurde.

-- 1. Alle Konten im Ueberblick - stimmt die Liste mit dem Kollegium?
--    Das ist die eigentliche Pruefung: eine Zeile, die dort niemand
--    zuordnen kann, ist ein Fund.
--
-- select u.email, u.created_at, u.last_sign_in_at, p.role, p.classes
-- from auth.users u
-- left join public.profiles p on p.id = u.id
-- order by u.created_at;

-- 2. Konten, die sich nie angemeldet haben, aber angelegt wurden.
--    Ein selbst registriertes Konto sieht meistens so aus: angelegt,
--    Rolle examiner, keine Klassen, nie benutzt.
--
-- select u.email, u.created_at, p.role, p.classes
-- from auth.users u
-- left join public.profiles p on p.id = u.id
-- where u.last_sign_in_at is null
-- order by u.created_at desc;

-- 3. Ist der Schalter noch aus? Das beantwortet keine Abfrage, sondern
--    nur ein Versuch von aussen. Im Terminal, mit dem anon-Key aus
--    app.js - die absichtlich ungueltige Adresse sorgt dafuer, dass
--    dabei auch dann kein Konto entsteht, wenn der Schalter an ist:
--
--    curl -s -X POST \
--      'https://<projekt>.supabase.co/auth/v1/signup' \
--      -H 'apikey: <anon-key>' -H 'Content-Type: application/json' \
--      -d '{"email":"kein-gueltiges-format","password":"x"}'
--
--    Erwartet: {"code":422,"error_code":"signup_disabled",...}
--    Kommt stattdessen eine Meldung ueber die ungueltige Adresse, ist
--    der Schalter AN - dann im Dashboard sofort ausschalten, Abfrage 1
--    pruefen, und erst dann weiterarbeiten.


-- ============================================================
-- E. Rueckbau
-- ============================================================
-- Nur noetig, falls A bis C doch einmal ausgefuehrt wurden und man es
-- wieder loswerden will: die Funktion auf den Stand aus 002
-- zuruecksetzen, dann ist nur noch der Dashboard-Schalter aktiv - also
-- wieder der Zustand, in dem das Projekt heute ist.
--
-- create or replace function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer set search_path = public
-- as $$
-- begin
--   insert into public.profiles (id, email)
--   values (new.id, new.email);
--   return new;
-- end;
-- $$;
--
-- drop table if exists public.erlaubte_accounts;
--
-- Achtung: Wird nur die Tabelle geloescht und die Funktion bleibt, kann
-- KEIN Konto mehr angelegt werden - die Pruefung laeuft dann in einen
-- Fehler ueber eine nicht existierende Tabelle. Immer beide Schritte.
