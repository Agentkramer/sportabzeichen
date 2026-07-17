-- Phase 2, Schritt 3: Row Level Security
-- Im Supabase Dashboard unter "SQL Editor" ausführen.
--
-- Ab hier gilt: Zugriff auf participants/profiles nur noch mit gültiger
-- Supabase-Auth-Session (eingeloggter Nutzer). Der publishable Key allein
-- reicht nicht mehr, um Daten zu lesen oder zu schreiben.
--
-- Regeln:
--   - admin: voller Zugriff auf alle Teilnehmer (lesen/anlegen/bearbeiten/löschen)
--   - examiner: sieht/bearbeitet nur Teilnehmer der eigenen zugewiesenen
--     Klassen (profiles.classes), darf NICHT löschen
--   - Teilnehmer ohne Klasse (class_name IS NULL) sind nur für admin sichtbar

-- 1. Hilfsfunktionen (security definer = laufen mit erhöhten Rechten,
--    damit sie beim Lesen von profiles nicht selbst wieder RLS auslösen
--    und dadurch eine Endlosschleife entsteht)
create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create function public.my_classes()
returns text[]
language sql
security definer
set search_path = public
stable
as $$
  select classes from public.profiles where id = auth.uid();
$$;

-- 2. Policies für profiles (RLS ist seit Schritt 2 schon aktiv, aber ohne Policies)
create policy "Nutzer liest eigenes Profil"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Admin liest alle Profile"
on public.profiles for select
to authenticated
using (public.is_admin());

create policy "Admin bearbeitet Profile"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 3. RLS für participants aktivieren + Policies
alter table public.participants enable row level security;

-- Altlast entfernen: aus einer früheren Einstellung existierte hier noch
-- eine permissive "Allow all access"-Policy für die Rolle "public" (= alle,
-- auch ohne Login). Da Postgres mehrere passende Policies per OR verknüpft,
-- hätte diese jede der folgenden, engeren Policies wirkungslos gemacht.
drop policy if exists "Allow all access" on public.participants;

create policy "Admin voller Zugriff auf Teilnehmer"
on public.participants for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Examiner sieht eigene Klassen"
on public.participants for select
to authenticated
using (class_name = any (public.my_classes()));

create policy "Examiner legt Teilnehmer in eigenen Klassen an"
on public.participants for insert
to authenticated
with check (class_name = any (public.my_classes()));

create policy "Examiner bearbeitet eigene Klassen"
on public.participants for update
to authenticated
using (class_name = any (public.my_classes()))
with check (class_name = any (public.my_classes()));

-- Bewusst KEINE Delete-Policy für Examiner -> Löschen bleibt admin-exklusiv
-- (deckt die "for all"-Policy oben für admin bereits ab)

-- ---------------------------------------------------------------------
-- Hilfs-Snippet (nicht Teil der Migration, nur zur Doku):
-- So weist du einem Examiner später Klassen zu, z.B. wenn der
-- Stundenplan feststeht oder über die Test-Zuweisung jetzt:
--
-- update public.profiles
-- set classes = array['5a', '5b']
-- where email = 'lehrkraft@example.com';
-- ---------------------------------------------------------------------
