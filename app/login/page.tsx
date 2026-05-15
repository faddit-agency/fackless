import Link from "next/link";
import { redirect } from "next/navigation";
import { KakaoLoginButton } from "./kakao-login-button";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "로그인",
};

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
    <div className="container max-w-md py-16 md:py-24">
      <div className="rounded-2xl border bg-card p-8 md:p-10 shadow-sm space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            PACKLESS
          </p>
          <h1 className="text-2xl font-bold">실무 커뮤니티에 합류하기</h1>
          <p className="text-sm text-muted-foreground">
            카카오로 3초 만에 가입하고 무료 자료를 받아보세요.
          </p>
        </div>
        <KakaoLoginButton redirectTo={searchParams.redirectTo} />
        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
          가입 시 패클스의{" "}
          <Link href="/policy/terms" className="underline">
            이용약관
          </Link>{" "}
          및{" "}
          <Link href="/policy/privacy" className="underline">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
