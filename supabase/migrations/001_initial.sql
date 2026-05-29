-- Links: affiliate redirect entries
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  destination_url text not null,
  og_title text not null,
  og_description text not null default 'Facebook.com',
  image_url text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists links_slug_idx on public.links (slug) where deleted_at is null;

-- Click analytics
create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links (id) on delete cascade,
  user_agent text,
  referrer text,
  is_crawler boolean not null default false,
  is_fb_in_app boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists clicks_link_id_idx on public.clicks (link_id);
create index if not exists clicks_created_at_idx on public.clicks (created_at desc);

alter table public.links enable row level security;
alter table public.clicks enable row level security;

-- Public read active links (for /r/[slug] redirect)
create policy "Public read active links"
  on public.links for select
  using (deleted_at is null);

-- Admin CRUD links
create policy "Authenticated insert links"
  on public.links for insert
  to authenticated
  with check (true);

create policy "Authenticated update links"
  on public.links for update
  to authenticated
  using (true);

-- Anyone can log clicks (redirect is public)
create policy "Public insert clicks"
  on public.clicks for insert
  with check (true);

-- Admin read clicks
create policy "Authenticated read clicks"
  on public.clicks for select
  to authenticated
  using (true);

-- Storage bucket: create "og-images" as public in Supabase Dashboard
-- Policies (run in SQL editor after bucket exists):
-- insert: authenticated only
-- select: public
