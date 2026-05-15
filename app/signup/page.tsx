import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "./signup-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "회원가입" };

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <div className="container max-w-md py-12 md:py-16">
      <div className="rounded-2xl border bg-card p-7 md:p-9 shadow-sm space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            PACKLESS
          </p>
          <h1 className="text-2xl font-bold">패클스에 가입하기</h1>
          <p className="text-sm text-muted-foreground">
            패션 브랜드 실무자들이 모인 커뮤니티에 합류하세요.
          </p>
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
