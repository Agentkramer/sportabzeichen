-- ============================================================
-- VORLAGE: Accounts per SQL anlegen (Auswerter / Lehrkräfte)
-- ============================================================
--
-- ACHTUNG – diese Datei enthält bewusst KEINE echten Passwörter.
-- Sie dokumentiert nur das Verfahren und wird ins (öffentliche) Repo
-- eingecheckt. Die ausgefüllte Fassung mit echten Zugangsdaten gehört
-- NIEMALS ins Repo, sondern in einen Ordner außerhalb davon.
--
-- ------------------------------------------------------------
-- WARUM DAS HIER MIT VORSICHT ZU GENIESSEN IST
-- ------------------------------------------------------------
-- Supabase legt Auth-Nutzer in den internen Tabellen `auth.users` und
-- `auth.identities` ab. Diese Struktur ist nicht offiziell dokumentiert
-- und hat sich zwischen Supabase-Versionen bereits geändert. Das
-- Verfahren funktioniert in der Praxis, ist aber nicht supportet.
--
-- => Deshalb IMMER zuerst EINEN Testaccount anlegen, Login in der App
--    prüfen, und erst dann den Rest erzeugen.
-- => Der offiziell sichere Weg bleibt: Dashboard → Authentication →
--    Users → "Add user" (mit "Auto Confirm User").
--
-- ------------------------------------------------------------
-- SICHERHEITSHINWEIS ZUR HILFSFUNKTION
-- ------------------------------------------------------------
-- Funktionen im Schema `public` sind bei Supabase automatisch über die
-- REST-API erreichbar (`POST /rest/v1/rpc/<name>`) und haben per
-- Postgres-Default EXECUTE für alle. Eine Funktion, die Auth-Nutzer
-- anlegen kann, wäre damit für jeden mit dem publishable Key aufrufbar!
--
-- Deshalb: direkt nach dem CREATE die Rechte entziehen (Schritt 1b) und
-- die Funktion nach getaner Arbeit wieder löschen (Schritt 5).
-- ============================================================


-- ============================================================
-- SCHRITT 1a: Hilfsfunktion anlegen
-- ============================================================
create or replace function public.tmp_create_account(p_email text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions, auth
as $$
declare
  v_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated',
    lower(p_email), crypt(p_password, gen_salt('bf')),
    now(), now(), now(),                        -- email_confirmed_at = sofort bestätigt
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    '', '', '', ''
  );

  -- Ohne passende identities-Zeile schlägt der Login fehl
  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), v_id,
    jsonb_build_object('sub', v_id::text, 'email', lower(p_email)),
    'email', v_id::text,
    now(), now(), now()
  );

  return v_id;
end;
$$;

-- ============================================================
-- SCHRITT 1b: Funktion sofort von der öffentlichen API abschotten
-- (siehe Sicherheitshinweis oben – nicht überspringen!)
-- ============================================================
revoke all on function public.tmp_create_account(text, text) from public;
revoke all on function public.tmp_create_account(text, text) from anon;
revoke all on function public.tmp_create_account(text, text) from authenticated;


-- ============================================================
-- SCHRITT 2: ERST EINEN Testaccount anlegen und Login prüfen!
-- ============================================================
select public.tmp_create_account('test-sql@dsa-intern.local', 'PASSWORT-HIER-EINSETZEN');

-- Jetzt in der App einloggen. Erst wenn das klappt, weitermachen.
-- Falls der Login fehlschlägt: Account wieder löschen (Schritt 6) und
-- stattdessen den Dashboard-Weg nutzen.


-- ============================================================
-- SCHRITT 3: Restliche Accounts anlegen
-- ============================================================
-- Der DB-Trigger `on_auth_user_created` (siehe 002_roles.sql) legt
-- automatisch die passende Zeile in `public.profiles` an,
-- Standardrolle 'examiner', noch ohne Klassen.

-- Auswerter (ein Account pro Jahrgang):
-- select public.tmp_create_account('auswertung-jg5@dsa-intern.local',  'PASSWORT');
-- select public.tmp_create_account('auswertung-jg6@dsa-intern.local',  'PASSWORT');
-- ... usw.

-- Lehrkräfte (echte Schul-Mailadressen eintragen):
-- select public.tmp_create_account('vorname.nachname@schule.de', 'PASSWORT');


-- ============================================================
-- SCHRITT 4: Klassen zuweisen
-- ============================================================
-- Geht auch bequem im Admin-Panel der App (👥-Button). Per SQL:

-- update public.profiles set classes = array['5a','5b','5c']
--   where email = 'auswertung-jg5@dsa-intern.local';

-- Lehrkräfte bleiben zunächst ohne Klassen:
--   ACHTUNG: Ein Examiner ohne Klassen sieht durch RLS GAR KEINE
--   Teilnehmer – der Account funktioniert, die Liste bleibt aber leer,
--   bis im Admin-Panel Klassen zugewiesen werden. Das ist erwartet.


-- ============================================================
-- SCHRITT 5: Hilfsfunktion wieder löschen (WICHTIG)
-- ============================================================
drop function if exists public.tmp_create_account(text, text);


-- ============================================================
-- SCHRITT 6: Kontrolle / Aufräumen
-- ============================================================
-- Übersicht aller Accounts:
-- select email, role, classes, created_at from public.profiles order by email;

-- Einzelnen Account wieder löschen (löscht per Cascade auch das Profil,
-- die Teilnehmerdaten bleiben unberührt – `participants` hat keinerlei
-- Verweis auf den anlegenden Nutzer):
-- delete from auth.users where email = 'auswertung-jg5@dsa-intern.local';

-- Alle Auswerter-Accounts nach dem Aktionstag entfernen:
-- delete from auth.users where email like 'auswertung-jg%@dsa-intern.local';
