# PACKLESS / 패클스

패션 브랜드 실무 커뮤니티 플랫폼입니다. 원단·공장·작업지시서·원가·브랜딩까지
브랜드 운영자가 실제로 필요한 정보·자료·사람을 모으는 것을 목표로 합니다.

## 기술 스택

- **Next.js 14 App Router** + TypeScript
- **Tailwind CSS** + shadcn/ui 스타일 컴포넌트
- **Supabase** (Auth · PostgreSQL · Storage · RLS)
- **Kakao OAuth** (Supabase Auth Provider)
- **React Hook Form + Zod** (폼·서버 액션 검증)
- 배포: Vercel

## 디렉터리 구조

```
app/                       # Next.js App Router 페이지
  page.tsx                 # 홈
  news/                    # 뉴스 목록 + 상세
  articles/                # 실무 콘텐츠 목록 + 상세
  community/               # 커뮤니티 메인 / 질문 / 피드백 / 네트워킹
  resources/               # 무료 자료실
  bootcamp/                # 부트캠프 랜딩 + 신청 폼
  onboarding/              # 직군 선택 + 추가 정보 입력
  login/                   # 카카오 로그인
  auth/callback/           # OAuth 콜백
  profile/[id]/            # 사용자 프로필
  me/                      # 내 프로필 리다이렉트
  admin/                   # 관리자 페이지 (대시보드, 회원, 게시글, 자료, 신청)
components/
  layout/                  # 헤더, 푸터, 모바일 하단 네비
  ui/                      # shadcn/ui 컴포넌트
  cards/                   # 게시글/자료 카드
  brand-logo.tsx           # 공통 로고 이미지
public/
  logo-packless.png        # 헤더·이메일(사이트 URL)에서 참조하는 워드마크
lib/
  supabase/                # 클라이언트, 서버, 미들웨어 클라이언트
  auth.ts                  # 현재 사용자/프로필 헬퍼
  queries.ts               # 서버 쿼리 헬퍼
  constants.ts             # 직군/카테고리 등 상수
  database.types.ts        # DB 타입
supabase/migrations/       # DB 스키마 + 시드 SQL
supabase/email-templates/  # 브랜드 이메일 템플릿 (Auth용 HTML)
middleware.ts              # 인증·온보딩·관리자 라우트 가드
```

## 사전 준비

### 1. Supabase 프로젝트 생성

1. https://supabase.com 에서 프로젝트 생성
2. SQL Editor에서 다음을 순서대로 실행:
   - `supabase/migrations/0001_init.sql` (스키마/RLS)
   - `supabase/migrations/0002_seed.sql` (카테고리·샘플 콘텐츠, 선택)
   - `supabase/migrations/0003_email_signup.sql` (이메일 회원가입용 컬럼·트리거)
   - `supabase/migrations/0004_avatars_storage.sql` (프로필 이미지 Storage 버킷·정책)
3. **Storage**에서 `post-attachments`, `resource-files` 버킷 생성 (선택)
   - `avatars` 버킷은 `0004_avatars_storage.sql` 실행 시 자동 생성됨
4. **Authentication → Email** Provider 가 활성화돼 있는지 확인 (기본 ON)
   - 개발 중에는 **Authentication → Providers → Email → Confirm email** 옵션을
     꺼두면 가입 직후 바로 로그인 상태가 됩니다.
5. **Authentication → Email Templates** 에서 `supabase/email-templates/` 에 있는
   PACKLESS 브랜드 HTML을 복사해 붙여넣어 주세요.
   적용 방법은 `supabase/email-templates/README.md` 참고.

### 2. Kakao 로그인 설정

1. https://developers.kakao.com 에서 앱 생성
2. "카카오 로그인 → 활성화 설정"에서 활성화
3. Redirect URI 에 다음을 등록:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Supabase Dashboard → Authentication → Providers → **Kakao** 활성화
   - Kakao REST API Key, Client Secret 입력
   - Additional Scopes (선택): `profile_nickname`, `profile_image`, `account_email`
5. Supabase Auth → URL Configuration에서 Site URL/Redirect URLs를 등록
   - `http://localhost:3000/auth/callback`
   - 운영 도메인의 `/auth/callback`

### 3. 관리자 권한 부여

가입한 사용자를 관리자로 만들고 싶다면 Supabase SQL Editor에서 실행:

```sql
update public.profiles set is_admin = true where user_id = '<auth.users.id>';
```

## 로컬 실행

```bash
cp .env.example .env.local
# .env.local 에 Supabase URL/Anon Key 입력
npm install
npm run dev
```

`http://localhost:3000` 접속.

## 환경 변수

| 키 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | (선택) 관리자 작업·시드용 |
| `NEXT_PUBLIC_SITE_URL` | 배포 URL (예: https://packless.app) |
| `NEXT_PUBLIC_FADDIT_URL` | 패딧 외부 링크 |

## 데이터베이스 개요

`supabase/migrations/0001_init.sql` 참고. 핵심 테이블:

- `profiles` · 공통 사용자 프로필 (역할/온보딩/관리자 플래그)
- `designer_profiles` / `pattern_maker_profiles` / `factory_profiles` /
  `brand_profiles` / `general_profiles` · 직군별 추가 정보
- `categories` · 뉴스/아티클/질문/피드백/네트워킹/자료의 카테고리
- `posts` · 모든 게시글 (뉴스·아티클·질문·피드백·네트워킹 통합)
- `post_tags`, `post_attachments`, `comments`
- `resources`, `resource_downloads`
- `bookmarks`, `likes`, `reports`
- `bootcamp_applications`

`auth.users` 가 생성될 때 트리거 `handle_new_user` 가 자동으로 `profiles` 행을
만들고 `is_onboarded = false` 상태로 시작합니다.

## 권한·라우트 정책

`middleware.ts` 에서 처리:

- `/admin/*` → 로그인 + 관리자만
- `/onboarding` → 로그인 필수
- `/community/.../new` → 로그인 + 온보딩 필수
- 로그인 사용자가 온보딩 미완료 상태에서 글 작성/관리자 페이지 진입 시
  `/onboarding`으로 리다이렉트

RLS 는 `supabase/migrations/0001_init.sql` 의 정책 섹션에서 정의:

- 게시글은 published + 가시성 규칙(public/members_only)에 따라 노출
- 댓글/좋아요/북마크는 본인만 수정/삭제
- 관리자 권한은 `profiles.is_admin = true` 체크

## 개발 우선순위

1차 MVP (현재 구현):

- 카카오 로그인 / 온보딩 / 프로필
- 홈 / 뉴스 / 실무 콘텐츠 / 자료실 / 커뮤니티(질문) / 부트캠프
- 자료 다운로드 로그
- 관리자 기본 (대시보드, 회원, 게시글, 자료, 부트캠프 신청, 신고)

2차 개발 (확장 포인트):

- 피드백/네트워킹 게시판 본격 오픈
- 북마크/좋아요/채택 UI
- 전문가 인증 워크플로
- 신고 처리 워크플로

3차 개발:

- DM, 패딧 SSO 연동, 결제, 알림

## 패딧 연동 준비

- `user_id` 는 `auth.users.id` 를 그대로 사용 → 추후 패딧과 동일 IDP(SSO) 적용 시
  매핑 불필요
- `lib/constants.ts` 의 `FADDIT_URL` 로 외부 링크 일괄 관리
- 자료 유형에 `faddit_template` 포함 → 패딧 템플릿을 자료실에서 바로 노출 가능

## 스크립트

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run start        # 빌드 결과 실행
npm run lint         # ESLint
npm run typecheck    # TypeScript 검사
```
