-- 관리자는 초안·숨김·삭제 포함 모든 게시글 조회 가능
drop policy if exists "posts read admin" on public.posts;
create policy "posts read admin" on public.posts for select using (
  exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin)
);
