-- ============================================================
-- Nachvollziehbarkeit: wer hat einen Datensatz zuletzt geändert?
-- ============================================================
--
-- Hintergrund: `participants` speicherte bisher nicht, wer einen Wert
-- eingetragen hat. Da am Aktionstag Schüler*innen die handschriftlichen
-- Listen übertragen, soll ein Zahlendreher später zurückverfolgbar sein.
--
-- Warum Text und kein Fremdschlüssel auf auth.users:
--   - `on delete cascade` würde beim Löschen eines Helferaccounts dessen
--     komplette Eintragungen mitlöschen -> auf keinen Fall.
--   - `on delete set null` würde die Spur genau dann leeren, wenn die
--     Accounts nach dem Aktionstag entfernt werden.
--   - Die E-Mail als Text überlebt das Löschen und ist direkt lesbar.
--
-- Im Supabase Dashboard unter "SQL Editor" ausführen.
-- ============================================================

-- 1. Spalte anlegen (bestehende 434 Zeilen bleiben zunächst NULL,
--    sie füllt sich, sobald ein Datensatz das nächste Mal gespeichert wird)
alter table public.participants
  add column if not exists updated_by text;

comment on column public.participants.updated_by is
  'E-Mail des zuletzt speichernden Nutzers. Bewusst Text statt FK, damit die Angabe das Löschen des Accounts überlebt.';

-- 2. Trigger-Funktion: setzt Bearbeiter und Zeitstempel automatisch.
--    security definer ist nötig, weil normale Nutzer auth.users nicht lesen dürfen.
--    Der Wert kommt aus dem Token (auth.uid()), nicht vom Client – er lässt
--    sich also nicht fälschen, auch wenn jemand die App umgeht.
create or replace function public.set_updated_by()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  new.updated_at := now();
  new.updated_by := (select email from auth.users where id = auth.uid());
  return new;
end;
$$;

-- Hinweis: Funktionen mit Rückgabetyp `trigger` sind über die REST-API
-- nicht aufrufbar – hier besteht also nicht das Problem wie bei der
-- Hilfsfunktion aus 006 (die deshalb abgeschottet und gelöscht wird).

-- 3. Trigger setzen
drop trigger if exists participants_set_updated_by on public.participants;

create trigger participants_set_updated_by
  before insert or update on public.participants
  for each row execute function public.set_updated_by();


-- ============================================================
-- Kontrolle
-- ============================================================
-- Nach dem nächsten Speichern in der App sollte hier die eigene
-- E-Mail auftauchen:
--
-- select first_name, last_name, class_name, updated_by, updated_at
-- from public.participants
-- where updated_by is not null
-- order by updated_at desc
-- limit 20;

-- Auffällige Einträge eines bestimmten Auswerters durchsehen:
--
-- select first_name, last_name, class_name, results, updated_at
-- from public.participants
-- where updated_by = 'auswertung-jg5@dsa-intern.local'
-- order by class_name, last_name;


-- ============================================================
-- Wieder entfernen (falls es sich nicht bewährt)
-- ============================================================
-- drop trigger if exists participants_set_updated_by on public.participants;
-- drop function if exists public.set_updated_by();
-- alter table public.participants drop column if exists updated_by;

-- Achtung: Wird nur das Modul in der App entfernt, aber der Trigger
-- bleibt, schreibt die Datenbank weiter mit – das ist unschädlich.
