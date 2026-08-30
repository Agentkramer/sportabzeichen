-- ===========================================================================
-- 011  Schreibfunktion für die Sammelerfassung
-- ===========================================================================
-- Im Supabase SQL-Editor ausführen. Danach einmal sql/008_ist_stand_pruefen.sql
-- laufen lassen und abgleichen.
--
-- Warum überhaupt eine Funktion? Die App schrieb bisher beim Speichern die
-- komplette Teilnehmerzeile. Genau daraus entstanden zwei stille Datenverluste
-- (Klassenzuordnung und external_id). set_result ändert ausschließlich EINE
-- Disziplingruppe innerhalb von results – alles andere kann die
-- Sammelerfassung damit gar nicht anfassen.
--
-- Drei Eigenschaften sind nicht verhandelbar:
--   1. security invoker  – die RLS-Regeln des angemeldeten Nutzers gelten
--      weiter. Ein Examiner kann also auch über diesen Weg nur seine eigenen
--      Klassen bearbeiten. SECURITY DEFINER wäre hier ein Loch.
--   2. die Prüfung des Gruppennamens – sonst ließen sich beliebige Schlüssel
--      in das JSONB schreiben.
--   3. if not found – ein von RLS blockiertes UPDATE trifft null Zeilen und
--      sähe in der App sonst wie Erfolg aus. Genau diese Sorte stiller
--      Fehlschlag hat uns die Klassenzuordnungen gekostet.
-- ===========================================================================

create or replace function public.set_result(
  p_participant uuid,
  p_gruppe      text,
  p_exercise    text,
  p_value       text
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_gruppe not in ('ausdauer','kraft','schnelligkeit','koordination') then
    raise exception 'Unbekannte Disziplingruppe: %', p_gruppe;
  end if;

  if p_value is null or btrim(p_value) = '' then
    -- Leerer Wert löscht die Gruppe. Fehlende Disziplinen sind undefined,
    -- nicht 0 – das wertet die Punktelogik so aus.
    update public.participants
       set results = coalesce(results, '{}'::jsonb) - p_gruppe
     where id = p_participant;
  else
    update public.participants
       set results = coalesce(results, '{}'::jsonb)
                     || jsonb_build_object(
                          p_gruppe,
                          jsonb_build_object('exercise', p_exercise, 'value', p_value)
                        )
     where id = p_participant;
  end if;

  if not found then
    raise exception 'Kein Schreibrecht für diesen Teilnehmer (oder nicht gefunden)';
  end if;
end;
$$;

-- Funktionen sind in Postgres standardmäßig für PUBLIC ausführbar – das wird
-- hier zurückgenommen. Ohne Anmeldung (Rolle anon) gibt es kein Schreiben.
revoke all on function public.set_result(uuid,text,text,text) from public, anon;
grant execute on function public.set_result(uuid,text,text,text) to authenticated;

-- Kontrolle:
--   select proname, prosecdef from pg_proc where proname = 'set_result';
--   -> prosecdef muss false sein (= security invoker)
