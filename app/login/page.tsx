import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { AuthCardShell } from "@/components/layout/page-shell";
import { EmailLoginForm } from "./email-login-form";
import { getCurrentUser } from "@/lib/auth";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "로그인",
  description: "FACKLESS 패클스 회원 로그인",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect(searchParams.redirectTo ?? "/");
  }

  return (
    <AuthCardShell>
      <div className="flex flex-col items-center gap-3 text-center">
        <BrandLogo className="h-[1.575rem]" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">실무 커뮤니티에 합류하기</h1>
          <p className="text-sm text-muted-foreground">
            가입한 이메일(아이디)과 비밀번호로 로그인하세요.
          </p>
        </div>
      </div>
      <EmailLoginForm redirectTo={searchParams.redirectTo} />
      <p className="text-center text-sm text-muted-foreground">
        아직 회원이 아니신가요?{" "}
        <Link
          href="/signup"
          className="font-semibold text-foreground underline underline-offset-2 hover:text-accent"
        >
          이메일로 가입
        </Link>
      </p>
      <p className="text-[11px] text-muted-foreground text-center leading-[1.3]">
        가입 시 패클스의{" "}
        <Link href="/policy/terms" className="underline hover:text-foreground">
          이용약관
        </Link>{" "}
        및{" "}
        <Link href="/policy/privacy" className="underline hover:text-foreground">
          개인정보처리방침
        </Link>
        에 동의하게 됩니다.
      </p>
    </AuthCardShell>
  );
}
