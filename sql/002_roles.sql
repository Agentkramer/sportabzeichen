-- Phase 2, Schritt 2: Rollen (admin / examiner) für Supabase Auth
-- Im Supabase Dashboard unter "SQL Editor" ausführen.
-- Achtung: Dieses Skript enthält noch KEINE Row Level Security (RLS) –
-- das ist bewusst Schritt 3. Bis dahin ist die Tabelle "profiles" genauso
-- offen wie "participants" (lesbar/schreibbar über den publishable Key).

-- 1. Tabelle für Rollen + (später) Klassen-Zuordnung
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'examiner' check (role in ('admin', 'examiner')),
  classes text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 2. Trigger: jeder neue Auth-User bekommt automatisch eine Zeile hier,
--    Standardrolle "examiner", noch ohne Klassen (die weist du später zu).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Backfill: Accounts, die VOR diesem Trigger schon manuell angelegt
--    wurden (Phase 2, Schritt 1), bekommen jetzt nachträglich eine Zeile.
insert into public.profiles (id, email)
select id, email from auth.users
where id not in (select id from public.profiles);

-- 4. Dich selbst zum Admin machen (E-Mail unten anpassen!)
update public.profiles set role = 'admin' where email = 'DEINE-EMAIL-HIER@example.com';
