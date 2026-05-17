-- 0005: 자료 파일/썸네일 업로드용 Storage 버킷 + RLS
-- 실행 위치: Supabase SQL Editor

insert into storage.buckets (id, name, public, file_size_limit)
values ('resource-files', 'resource-files', true, 26214400)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit;

drop policy if exists "Resource files are publicly readable" on storage.objects;
create policy "Resource files are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'resource-files');

drop policy if exists "Admins can upload resource files" on storage.objects;
create policy "Admins can upload resource files"
  on storage.objects
  for insert
  with check (
    bucket_id = 'resource-files'
    and auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );

drop policy if exists "Admins can update resource files" on storage.objects;
create policy "Admins can update resource files"
  on storage.objects
  for update
  using (
    bucket_id = 'resource-files'
    and auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  )
  with check (
    bucket_id = 'resource-files'
    and auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );

drop policy if exists "Admins can delete resource files" on storage.objects;
create policy "Admins can delete resource files"
  on storage.objects
  for delete
  using (
    bucket_id = 'resource-files'
    and auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );
