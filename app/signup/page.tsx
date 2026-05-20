import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { SignupForm } from "./signup-form";
import { getCurrentUser } from "@/lib/auth";

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "회원가입",
  description: "PACKLESS 패클스 무료 회원가입",
  path: "/signup",
  noIndex: true,
});

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <div className="container max-w-md py-12 md:py-16">
      <div className="rounded-2xl border bg-card p-7 md:p-9 shadow-sm space-y-6">
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
            className="font-semibold text-foreground hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
