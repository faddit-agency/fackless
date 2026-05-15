-- 일반 회원가입 (이메일/비밀번호) 지원
-- 이미 0001_init.sql 이 실행된 환경에서 추가 실행

-- 1. profiles 테이블에 컬럼 추가 ---------------------------------------
alter table public.profiles
  add column if not exists username text;
alter table public.profiles
  add column if not exists real_name text;

create unique index if not exists profiles_username_unique
  on public.profiles (lower(username))
  where username is not null;

-- 2. 신규 가입자 트리거 업데이트 ---------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_nickname text;
  meta_username text;
  meta_real_name text;
begin
  default_nickname := coalesce(
    new.raw_user_meta_data->>'nickname',
    new.raw_user_meta_data->>'name',
    split_part(coalesce(new.email, ''), '@', 1),
    'packless_' || substr(new.id::text, 1, 6)
  );
  meta_username := nullif(new.raw_user_meta_data->>'username', '');
  meta_real_name := nullif(new.raw_user_meta_data->>'real_name', '');

  insert into public.profiles (
    user_id,
    nickname,
    avatar_url,
    username,
    real_name,
    is_onboarded
  )
  values (
    new.id,
    default_nickname,
    new.raw_user_meta_data->>'avatar_url',
    meta_username,
    meta_real_name,
    false
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;
