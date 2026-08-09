-- Fix für Keep-Alive-Ping: participants liefert für "anon" (ungeloggter
-- Cronjob-Request) seit der RLS-Einführung (Schritt 3) ein leeres
-- Ergebnis - das zählt bei Supabase offenbar nicht zuverlässig als
-- Aktivität, obwohl der Request technisch mit 200 OK durchläuft.
--
-- Lösung: eine eigene, winzige Tabelle nur für den Ping-Zweck, plus eine
-- eng gefasste Funktion, die einen echten Schreibvorgang auslöst.
-- "anon" bekommt KEIN direktes Schreibrecht auf die Tabelle (keine RLS-
-- Policy dafür), sondern darf nur genau diese eine Funktion aufrufen -
-- participants/profiles bleiben komplett unberührt.
--
-- Im Supabase Dashboard unter "SQL Editor" ausführen.

create table if not exists public.keepalive (
  id int primary key default 1,
  last_ping timestamptz not null default now(),
  ping_count int not null default 0,
  constraint keepalive_singleton check (id = 1)
);

insert into public.keepalive (id) values (1) on conflict (id) do nothing;

-- RLS aktiv, aber bewusst OHNE Policies für anon/authenticated ->
-- direkter Tabellenzugriff von außen ist komplett gesperrt.
alter table public.keepalive enable row level security;

create function public.bump_keepalive()
returns void
language sql
security definer
set search_path = public
as $$
  update public.keepalive
  set last_ping = now(), ping_count = ping_count + 1
  where id = 1;
$$;

-- Nur diese eine Funktion darf von "anon" (also vom Cronjob ohne Login)
-- aufgerufen werden - die Funktion selbst läuft mit erhöhten Rechten
-- (security definer) und umgeht dabei die RLS-Sperre von oben.
grant execute on function public.bump_keepalive() to anon;
