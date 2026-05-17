-- 0006: 뉴스 페이지 광고 슬롯 관리 + 광고 이미지 Storage 버킷
-- 실행 위치: Supabase SQL Editor

create table if not exists public.news_ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  link_url text not null,
  image_url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_ads_active_sort_idx
  on public.news_ads(is_active, sort_order, created_at desc);

drop trigger if exists news_ads_set_updated_at on public.news_ads;
create trigger news_ads_set_updated_at
  before update on public.news_ads
  for each row execute function public.set_updated_at();

alter table public.news_ads enable row level security;

drop policy if exists "News ads are publicly readable" on public.news_ads;
create policy "News ads are publicly readable"
  on public.news_ads
  for select
  using (is_active = true or auth.uid() is not null);

drop policy if exists "Admins can insert news ads" on public.news_ads;
create policy "Admins can insert news ads"
  on public.news_ads
  for insert
  with check (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );

drop policy if exists "Admins can update news ads" on public.news_ads;
create policy "Admins can update news ads"
  on public.news_ads
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );

drop policy if exists "Admins can delete news ads" on public.news_ads;
create policy "Admins can delete news ads"
  on public.news_ads
  for delete
  using (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-ads',
  'news-ads',
  true,
  5242880,
  array['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "News ad images are publicly readable" on storage.objects;
create policy "News ad images are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'news-ads');

drop policy if exists "Admins can upload news ad images" on storage.objects;
create policy "Admins can upload news ad images"
  on storage.objects
  for insert
  with check (
    bucket_id = 'news-ads'
    and auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );

drop policy if exists "Admins can update news ad images" on storage.objects;
create policy "Admins can update news ad images"
  on storage.objects
  for update
  using (
    bucket_id = 'news-ads'
    and auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  )
  with check (
    bucket_id = 'news-ads'
    and auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );

drop policy if exists "Admins can delete news ad images" on storage.objects;
create policy "Admins can delete news ad images"
  on storage.objects
  for delete
  using (
    bucket_id = 'news-ads'
    and auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );
