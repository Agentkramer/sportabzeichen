-- ============================================================
-- Keep-Alive, Neufassung: robuster + ohne offene Schreibrechte
-- ============================================================
--
-- Ersetzt die bisherige Lösung (Tabelle `keep_alive` mit
-- "Allow anon inserts", siehe 004). Zwei Ziele:
--
--   1. Der Ping soll von Supabase zuverlässig als Datenbankaktivität
--      gewertet werden.
--   2. `anon` soll nicht mehr direkt in eine Tabelle schreiben dürfen.
--
-- ------------------------------------------------------------
-- WAS WIR WISSEN UND WAS NICHT
-- ------------------------------------------------------------
-- Supabase dokumentiert nur vage: "a few user requests to the database
-- each day over the previous week" verhindere die Pausierung. Was genau
-- gezählt wird, ist nicht öffentlich.
--
-- Der Projektverlauf ist aber eindeutig genug:
--   - Solange der GitHub-Workflow eine Zeile SCHRIEB, pausierte nichts.
--   - Als danach nur noch ein LESE-Ping auf participants lief (der wegen
--     RLS als anon ein leeres Ergebnis lieferte), pausierte das Projekt
--     trotz zuverlässig laufendem Cronjob.
--
-- Deshalb: wieder ein echter Schreibvorgang, zusätzlich ein echter
-- Lesezugriff auf die Haupttabelle. Mehr "Aktivität" als das geht ohne
-- Unsinn in den Nutzdaten nicht.
--
-- Im Supabase Dashboard unter "SQL Editor" ausführen.
-- ============================================================


-- ============================================================
-- SCHRITT 1: Statustabelle mit genau EINER Zeile
-- ============================================================
-- Die Prüfbedingung erzwingt, dass es nie mehr als eine Zeile gibt.
-- Damit kann die Tabelle nicht wachsen, egal wie oft gepingt wird.

create table if not exists public.keep_alive_status (
  id                 int primary key default 1,
  last_ping          timestamptz not null default now(),
  ping_count         bigint not null default 0,
  participants_count bigint,
  constraint keep_alive_status_single_row check (id = 1)
);

insert into public.keep_alive_status (id)
values (1)
on conflict (id) do nothing;

-- RLS an, aber bewusst OHNE Policies: niemand kommt über die API direkt
-- an diese Tabelle heran – weder lesend noch schreibend.
alter table public.keep_alive_status enable row level security;


-- ============================================================
-- SCHRITT 2: Ping-Funktion
-- ============================================================
-- security definer, damit sie trotz der gesperrten Tabelle schreiben
-- und participants lesen darf.
--
-- Gibt bewusst nur 'ok' zurück und NICHT die Teilnehmerzahl – sonst
-- könnte jeder mit dem (öffentlichen) publishable Key auslesen, wie
-- viele Schüler*innen erfasst sind. Die Zahl wird nur in der Tabelle
-- abgelegt, wo sie ausschließlich über den SQL Editor sichtbar ist.

create or replace function public.keep_alive_ping()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_teilnehmer bigint;
begin
  -- echter Lesezugriff auf die Haupttabelle
  select count(*) into v_teilnehmer from public.participants;

  -- echter Schreibvorgang
  update public.keep_alive_status
     set last_ping          = now(),
         ping_count         = ping_count + 1,
         participants_count = v_teilnehmer
   where id = 1;

  return 'ok';
end;
$$;

-- Rechte eng fassen: nur der Cronjob (anon) darf die Funktion aufrufen.
revoke all on function public.keep_alive_ping() from public;
grant execute on function public.keep_alive_ping() to anon;


-- ============================================================
-- SCHRITT 3: Testen
-- ============================================================
-- Direkt hier:
--   select public.keep_alive_ping();
--   select * from public.keep_alive_status;
--
-- Danach den Cronjob umstellen (siehe unten) und erneut prüfen, ob
-- last_ping sich bewegt und ping_count hochzählt.


-- ============================================================
-- SCHRITT 4: Cronjob bei cron-job.org anpassen
-- ============================================================
-- URL:      https://<projekt>.supabase.co/rest/v1/rpc/keep_alive_ping
-- Methode:  POST
-- Header:   apikey: <publishable key>
--           Content-Type: application/json
-- Body:     {}
-- Zeitplan: TÄGLICH, nicht nur an zwei Wochentagen.
--           Empfehlung: 0 6,18 * * *   (zweimal täglich, mit Reserve)
--
-- WICHTIG: In cron-job.org die Benachrichtigung bei Fehlern aktivieren
-- ("Notifications" -> bei Fehlschlag benachrichtigen). Beide bisherigen
-- Pausierungen sind aufgetreten, ohne dass es jemandem aufgefallen ist.
-- Ein stiller Ausfall ist hier das eigentliche Risiko, nicht die
-- Technik des Pings.


-- ============================================================
-- SCHRITT 5: Erst wenn der neue Ping nachweislich läuft – aufräumen
-- ============================================================
-- Alte Lösung entfernen (schließt die offene anon-Schreibberechtigung):
--
--   drop policy if exists "Allow anon inserts" on public.keep_alive;
--   drop table if exists public.keep_alive;
--
-- Vorher sicherstellen, dass keep_alive_status.ping_count seit der
-- Umstellung gestiegen ist – sonst steht ihr ohne Keep-Alive da.


-- ============================================================
-- Kontrolle (jederzeit)
-- ============================================================
-- select last_ping,
--        now() - last_ping as her,
--        ping_count,
--        participants_count
-- from public.keep_alive_status;
--
-- "her" sollte deutlich unter 24 Stunden liegen.
