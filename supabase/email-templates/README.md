# PACKLESS 이메일 템플릿

Supabase Auth에서 발송하는 인증 이메일을 PACKLESS 브랜드에 맞게 디자인한 HTML 템플릿입니다.

## 디자인 시스템

| 요소 | 값 |
| --- | --- |
| 배경 | `#F4F6FA` (Soft Gray) |
| 카드 배경 | `#FFFFFF` |
| 메인 텍스트 | `#181818` |
| 보조 텍스트 | `#475467` |
| 약한 텍스트 | `#98A1B0` |
| 버튼 배경 | `#277CFA` (브랜드 블루) |
| 버튼 텍스트 | `#FFFFFF` |

헤더 로고는 `{{ .SiteURL }}/logo-packless.png` 를 사용합니다. 사이트 루트(`public/logo-packless.png`)에 동일 파일이 배포되어 있어야 메일 클라이언트에서 이미지가 보입니다.
| 테두리 | `#E4E7EE` |
| 카드 radius | `16px`, 버튼 radius `10px` |

폰트 패밀리: `Pretendard` → `Apple SD Gothic Neo` → `Noto Sans KR` → system fallback

## 템플릿 목록

| 파일 | Supabase 항목 | 용도 |
| --- | --- | --- |
| `confirm-signup.html` | **Confirm signup** | 이메일/비밀번호 회원가입 시 인증 메일 |
| `magic-link.html` | **Magic Link** | 비밀번호 없이 로그인할 때 |
| `reset-password.html` | **Reset Password** | 비밀번호 재설정 요청 시 |
| `change-email.html` | **Change Email Address** | 계정 이메일 변경 확인 |
| `invite.html` | **Invite user** | 관리자가 초대장을 보낼 때 |

## 적용 방법

1. Supabase Dashboard 접속 → 해당 프로젝트 선택
2. 좌측 메뉴 **Authentication** → **Email Templates** 클릭
3. 각 항목(`Confirm signup`, `Magic Link`, `Reset Password`, `Change Email Address`, `Invite user`)을 차례로 선택
4. 우측 에디터에서 **Source** 탭(`< >` 아이콘)으로 전환
5. 기존 HTML을 모두 지우고, 이 폴더의 해당 `.html` 파일 내용을 복사해서 붙여넣기
6. **Subject heading**(메일 제목)도 함께 아래 표대로 수정한 뒤 **Save changes** 클릭

### 권장 제목(Subject)

| 항목 | 제목 |
| --- | --- |
| Confirm signup | `[패클스] 이메일 인증을 완료해주세요` |
| Magic Link | `[패클스] 로그인 링크를 보내드려요` |
| Reset Password | `[패클스] 비밀번호 재설정 안내` |
| Change Email Address | `[패클스] 이메일 변경 확인이 필요해요` |
| Invite user | `[패클스] 커뮤니티 초대장이 도착했어요` |

## 템플릿 변수

각 템플릿에서 사용되는 Supabase 변수:

- `{{ .ConfirmationURL }}` — 인증·재설정·로그인 URL
- `{{ .Email }}` — 사용자 이메일
- `{{ .NewEmail }}` — (이메일 변경 시) 새 이메일
- `{{ .Token }}` — 6자리 OTP (사용하지 않음)
- `{{ .SiteURL }}` — `NEXT_PUBLIC_SITE_URL`

## 발신자 설정

Dashboard → **Authentication** → **Email Templates** 상단 또는
**Authentication** → **Settings** → **SMTP Settings** 에서:

- **Sender name**: `PACKLESS`
- **Sender email**: `noreply@packless.app` (커스텀 SMTP 설정 시)
- 기본 Supabase SMTP는 `noreply@mail.app.supabase.io` 로 발송되며, 발신자명은 변경할 수 있습니다.

운영 단계에서는 [Resend](https://resend.com), [Postmark](https://postmarkapp.com), [SendGrid](https://sendgrid.com) 등을 커스텀 SMTP로 연결해
도메인 인증(SPF/DKIM)을 마치면 `hello@packless.app` 같은 자체 도메인 발신이 가능합니다.

## 미리보기

테스트하려면:
- Supabase Dashboard의 템플릿 에디터 우측에 **Preview** 버튼이 있습니다.
- 또는 실제로 `/signup` 에서 가입 시도를 하면 진짜 메일을 받아볼 수 있어요.
