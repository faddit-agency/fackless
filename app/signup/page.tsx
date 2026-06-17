import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { AuthCardShell } from "@/components/layout/page-shell";
import { SignupForm } from "./signup-form";
import { getCurrentUser } from "@/lib/auth";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "회원가입",
  description: "FACKLESS 패클스 무료 회원가입",
  path: "/signup",
  noIndex: true,
});

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <AuthCardShell>
      <div className="flex flex-col items-center gap-3 text-center">
        <BrandLogo className="h-[1.575rem]" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">패클스에 가입하기</h1>
          <p className="text-sm text-muted-foreground">
            이메일을 아이디로 사용해 가입합니다.
          </p>
        </div>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있나요?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground underline underline-offset-2 hover:text-accent"
        >
          로그인
        </Link>
      </p>
    </AuthCardShell>
  );
}
