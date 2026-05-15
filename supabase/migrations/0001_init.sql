-- PACKLESS / 패클스 초기 스키마
-- 실행 위치: Supabase SQL Editor 또는 supabase CLI

-- 1. Extensions ---------------------------------------------------------
create extension if not exists "pgcrypto";

-- 2. Enums --------------------------------------------------------------
do $$ begin
  create type role_type as enum ('designer','pattern_maker','factory','brand','general');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_type as enum ('question','feedback','networking','article','news');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_status as enum ('draft','published','hidden','deleted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_visibility as enum ('public','members_only','private');
exception when duplicate_object then null; end $$;

do $$ begin
  create type resource_file_type as enum ('pdf','excel','notion','figma','link','faddit_template');
exception when duplicate_object then null; end $$;

do $$ begin
  create type category_type as enum ('news','article','question','feedback','networking','resource');
exception when duplicate_object then null; end $$;

do $$ begin
  create type bookmark_target as enum ('post','resource');
exception when duplicate_object then null; end $$;

do $$ begin
  create type like_target as enum ('post','comment');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_target as enum ('post','comment','user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type bootcamp_application_status as enum ('pending','contacted','accepted','rejected');
exception when duplicate_object then null; end $$;

-- 3. Helper trigger -----------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- 4. Profiles & role-specific profiles ---------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  role_type role_type not null default 'general',
  bio text,
  interests text[] default '{}',
  region text,
  website_url text,
  is_onboarded boolean not null default false,
  is_verified_expert boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_role_type_idx on public.profiles(role_type);
create index if not exists profiles_is_onboarded_idx on public.profiles(is_onboarded);
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create table if not exists public.designer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  specialty text[] default '{}',
  portfolio_url text,
  collaboration_available boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists designer_profiles_set_updated_at on public.designer_profiles;
create trigger designer_profiles_set_updated_at before update on public.designer_profiles
  for each row execute function public.set_updated_at();

create table if not exists public.pattern_maker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  specialty_items text[] default '{}',
  experience_years int default 0,
  sample_available boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists pattern_maker_profiles_set_updated_at on public.pattern_maker_profiles;
create trigger pattern_maker_profiles_set_updated_at before update on public.pattern_maker_profiles
  for each row execute function public.set_updated_at();

create table if not exists public.factory_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  location text,
  available_items text[] default '{}',
  moq int,
  equipment text,
  sample_available boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists factory_profiles_set_updated_at on public.factory_profiles;
create trigger factory_profiles_set_updated_at before update on public.factory_profiles
  for each row execute function public.set_updated_at();

create table if not exists public.brand_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  brand_stage text,
  interests text[] default '{}',
  planned_items text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists brand_profiles_set_updated_at on public.brand_profiles;
create trigger brand_profiles_set_updated_at before update on public.brand_profiles
  for each row execute function public.set_updated_at();

create table if not exists public.general_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  interests text[] default '{}',
  startup_planning boolean not null default false,
  newsletter_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists general_profiles_set_updated_at on public.general_profiles;
create trigger general_profiles_set_updated_at before update on public.general_profiles
  for each row execute function public.set_updated_at();

-- 5. Categories ---------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  type category_type not null,
  name text not null,
  slug text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(type, slug)
);
create index if not exists categories_type_idx on public.categories(type);

-- 6. Posts --------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  type post_type not null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  content text not null default '',
  excerpt text,
  cover_image_url text,
  status post_status not null default 'published',
  visibility post_visibility not null default 'public',
  view_count int not null default 0,
  like_count int not null default 0,
  comment_count int not null default 0,
  is_pinned boolean not null default false,
  slug text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_type_idx on public.posts(type);
create index if not exists posts_category_idx on public.posts(category_id);
create index if not exists posts_status_idx on public.posts(status);
create index if not exists posts_created_idx on public.posts(created_at desc);
create unique index if not exists posts_slug_unique on public.posts(slug) where slug is not null;
drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

create table if not exists public.post_tags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  unique(post_id, tag)
);
create index if not exists post_tags_tag_idx on public.post_tags(tag);

create table if not exists public.post_attachments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  file_url text not null,
  file_name text,
  mime_type text,
  size_bytes bigint,
  kind text default 'file',
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- 7. Comments -----------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  is_accepted boolean not null default false,
  like_count int not null default 0,
  status post_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments(post_id);
create index if not exists comments_author_idx on public.comments(author_id);
drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at before update on public.comments
  for each row execute function public.set_updated_at();

-- 8. Resources ----------------------------------------------------------
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  resource_type resource_file_type not null,
  file_url text,
  external_url text,
  thumbnail_url text,
  target_roles role_type[] default '{}',
  download_count int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists resources_category_idx on public.resources(category_id);
drop trigger if exists resources_set_updated_at on public.resources;
create trigger resources_set_updated_at before update on public.resources
  for each row execute function public.set_updated_at();

create table if not exists public.resource_downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  resource_id uuid not null references public.resources(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);
create index if not exists resource_downloads_user_idx on public.resource_downloads(user_id);
create index if not exists resource_downloads_resource_idx on public.resource_downloads(resource_id);

-- 9. Bookmarks / Likes / Reports ---------------------------------------
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type bookmark_target not null,
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, target_type, target_id)
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type like_target not null,
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, target_type, target_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_type report_target not null,
  target_id uuid not null,
  reason text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- 10. Bootcamp ---------------------------------------------------------
create table if not exists public.bootcamp_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  phone text not null,
  email text not null,
  role_type role_type not null,
  brand_stage text,
  pain_point text,
  privacy_agreed boolean not null default false,
  status bootcamp_application_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- 11. Auto profile + counters -----------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_nickname text;
begin
  default_nickname := coalesce(
    new.raw_user_meta_data->>'nickname',
    new.raw_user_meta_data->>'name',
    split_part(coalesce(new.email, ''), '@', 1),
    'packless_' || substr(new.id::text, 1, 6)
  );

  insert into public.profiles (user_id, nickname, avatar_url, is_onboarded)
  values (
    new.id,
    default_nickname,
    new.raw_user_meta_data->>'avatar_url',
    false
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.bump_post_comment_count()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update public.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end;$$;

drop trigger if exists comments_bump_count on public.comments;
create trigger comments_bump_count
  after insert or delete on public.comments
  for each row execute function public.bump_post_comment_count();

-- 12. Row Level Security ----------------------------------------------
alter table public.profiles enable row level security;
alter table public.designer_profiles enable row level security;
alter table public.pattern_maker_profiles enable row level security;
alter table public.factory_profiles enable row level security;
alter table public.brand_profiles enable row level security;
alter table public.general_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.post_attachments enable row level security;
alter table public.comments enable row level security;
alter table public.resources enable row level security;
alter table public.resource_downloads enable row level security;
alter table public.bookmarks enable row level security;
alter table public.likes enable row level security;
alter table public.reports enable row level security;
alter table public.bootcamp_applications enable row level security;

-- profiles
drop policy if exists "profiles select all" on public.profiles;
create policy "profiles select all" on public.profiles for select using (true);
drop policy if exists "profiles upsert self" on public.profiles;
create policy "profiles upsert self" on public.profiles for insert with check (auth.uid() = user_id);
drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- role-specific profiles
do $$
declare t text;
begin
  for t in select unnest(array['designer_profiles','pattern_maker_profiles','factory_profiles','brand_profiles','general_profiles']) loop
    execute format('drop policy if exists "%1$s select" on public.%1$s', t);
    execute format('create policy "%1$s select" on public.%1$s for select using (true)', t);
    execute format('drop policy if exists "%1$s upsert" on public.%1$s', t);
    execute format('create policy "%1$s upsert" on public.%1$s for insert with check (auth.uid() = user_id)', t);
    execute format('drop policy if exists "%1$s update" on public.%1$s', t);
    execute format('create policy "%1$s update" on public.%1$s for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('drop policy if exists "%1$s delete" on public.%1$s', t);
    execute format('create policy "%1$s delete" on public.%1$s for delete using (auth.uid() = user_id)', t);
  end loop;
end$$;

-- categories : public read
drop policy if exists "categories select" on public.categories;
create policy "categories select" on public.categories for select using (true);
drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories
  for all using (
    exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
  ) with check (
    exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
  );

-- posts
drop policy if exists "posts read public" on public.posts;
create policy "posts read public" on public.posts for select using (
  status = 'published' and (
    visibility = 'public'
    or (visibility = 'members_only' and auth.uid() is not null)
    or auth.uid() = author_id
  )
);
drop policy if exists "posts insert by member" on public.posts;
create policy "posts insert by member" on public.posts for insert with check (
  auth.uid() is not null and (
    type in ('question','feedback','networking')
    or exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
  )
);
drop policy if exists "posts update own or admin" on public.posts;
create policy "posts update own or admin" on public.posts for update using (
  auth.uid() = author_id
  or exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
);

-- post_tags
drop policy if exists "post_tags select" on public.post_tags;
create policy "post_tags select" on public.post_tags for select using (true);
drop policy if exists "post_tags insert" on public.post_tags;
create policy "post_tags insert" on public.post_tags for insert with check (
  exists(select 1 from public.posts po where po.id = post_id and (po.author_id = auth.uid()
    or exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)))
);
drop policy if exists "post_tags delete" on public.post_tags;
create policy "post_tags delete" on public.post_tags for delete using (
  exists(select 1 from public.posts po where po.id = post_id and (po.author_id = auth.uid()
    or exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)))
);

-- post_attachments
drop policy if exists "post_attachments select" on public.post_attachments;
create policy "post_attachments select" on public.post_attachments for select using (true);
drop policy if exists "post_attachments insert" on public.post_attachments;
create policy "post_attachments insert" on public.post_attachments for insert with check (
  exists(select 1 from public.posts po where po.id = post_id and (po.author_id = auth.uid()
    or exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)))
);
drop policy if exists "post_attachments delete" on public.post_attachments;
create policy "post_attachments delete" on public.post_attachments for delete using (
  exists(select 1 from public.posts po where po.id = post_id and (po.author_id = auth.uid()
    or exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)))
);

-- comments
drop policy if exists "comments select" on public.comments;
create policy "comments select" on public.comments for select using (status <> 'deleted');
drop policy if exists "comments insert member" on public.comments;
create policy "comments insert member" on public.comments for insert with check (auth.uid() is not null);
drop policy if exists "comments update own" on public.comments;
create policy "comments update own" on public.comments for update using (
  auth.uid() = author_id
  or exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
);

-- resources
drop policy if exists "resources read" on public.resources;
create policy "resources read" on public.resources for select using (is_published or
  exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin));
drop policy if exists "resources admin write" on public.resources;
create policy "resources admin write" on public.resources for all using (
  exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
) with check (
  exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
);

-- resource downloads (insert by self, read by self or admin)
drop policy if exists "resource_downloads insert self" on public.resource_downloads;
create policy "resource_downloads insert self" on public.resource_downloads for insert with check (
  auth.uid() = user_id
);
drop policy if exists "resource_downloads select self" on public.resource_downloads;
create policy "resource_downloads select self" on public.resource_downloads for select using (
  auth.uid() = user_id
  or exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
);

-- bookmarks
drop policy if exists "bookmarks self" on public.bookmarks;
create policy "bookmarks self" on public.bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- likes
drop policy if exists "likes self" on public.likes;
create policy "likes self" on public.likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- reports (insert by member, read by admin)
drop policy if exists "reports insert" on public.reports;
create policy "reports insert" on public.reports for insert with check (auth.uid() is not null);
drop policy if exists "reports admin read" on public.reports;
create policy "reports admin read" on public.reports for select using (
  exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
);
drop policy if exists "reports admin update" on public.reports;
create policy "reports admin update" on public.reports for update using (
  exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
) with check (true);

-- bootcamp_applications (anonymous insert allowed, admin read)
drop policy if exists "bootcamp insert" on public.bootcamp_applications;
create policy "bootcamp insert" on public.bootcamp_applications for insert with check (true);
drop policy if exists "bootcamp admin read" on public.bootcamp_applications;
create policy "bootcamp admin read" on public.bootcamp_applications for select using (
  exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
);
drop policy if exists "bootcamp admin update" on public.bootcamp_applications;
create policy "bootcamp admin update" on public.bootcamp_applications for update using (
  exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
) with check (true);
