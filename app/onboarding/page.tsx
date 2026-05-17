import { redirect } from "next/navigation";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";
import { OnboardingForm } from "./onboarding-form";

export const metadata = { title: "프로필 설정" };

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/onboarding");
  const profile = await getCurrentProfile();
  if (profile?.is_onboarded) redirect("/");

  return (
    <div className="container max-w-2xl py-10 md:py-16">
      <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <BrandLogo className="h-[1.575rem]" />
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase md:text-right">
          온보딩
        </p>
      </div>
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          몇 가지만 알려주시면, 더 맞는 콘텐츠를 보여드릴게요.
        </h1>
        <p className="text-sm text-muted-foreground">
          직군과 관심 분야는 언제든 프로필에서 수정할 수 있어요.
        </p>
      </div>
      <OnboardingForm
        userId={user.id}
        initial={{
          nickname: profile?.nickname ?? "",
          avatar_url: profile?.avatar_url ?? "",
          bio: profile?.bio ?? "",
          region: profile?.region ?? "",
          website_url: profile?.website_url ?? "",
          interests: profile?.interests ?? [],
          role_type: profile?.role_type ?? "general",
        }}
      />
    </div>
  );
}
