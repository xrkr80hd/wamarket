-- Production schema snapshot. Browser roles cannot read these tables directly.
create table if not exists public.wamarket_records(id text primary key,data jsonb not null,version integer not null default 1,updated_at timestamptz not null default now());
create table if not exists public.wamarket_dashboards(user_id uuid primary key references auth.users(id) on delete cascade,data jsonb not null default '{}'::jsonb,updated_at timestamptz not null default now());
create table if not exists public.wamarket_presence(user_id uuid primary key references auth.users(id) on delete cascade,last_seen timestamptz not null default now(),online boolean not null default true);
create table if not exists public.wamarket_integrations(provider text primary key,data jsonb not null,updated_at timestamptz not null default now());
alter table public.wamarket_records enable row level security;
alter table public.wamarket_dashboards enable row level security;
alter table public.wamarket_presence enable row level security;
alter table public.wamarket_integrations enable row level security;
revoke all on public.wamarket_records,public.wamarket_dashboards,public.wamarket_presence,public.wamarket_integrations from anon,authenticated;
grant all on public.wamarket_records,public.wamarket_dashboards,public.wamarket_presence,public.wamarket_integrations to service_role;
insert into storage.buckets(id,name,public,allowed_mime_types) values ('wamarket-videos','wamarket-videos',false,array['video/*']),('wamarket-images','wamarket-images',false,array['image/*']),('wamarket-audio','wamarket-audio',false,array['audio/*']) on conflict(id) do nothing;
