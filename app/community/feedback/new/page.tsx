import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { getCategories } from "@/lib/queries";
import { createPageMetadata } from "@/lib/seo";
import { FeedbackForm } from "./feedback-form";

export const metadata = createPageMetadata({
  title: "피드백 글 작성",
  path: "/community/feedback/new",
  noIndex: true,
});

export default async function NewFeedbackPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirectTo=/community/feedback/new");
  if (!profile.is_onboarded) redirect("/onboarding");

  const categories = await getCategories("feedback");

  return (
    <div className="container py-10">
      <header className="mb-6 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          FEEDBACK
        </p>
        <h1 className="text-2xl md:text-3xl font-bold">피드백 글 작성</h1>
        <p className="text-sm text-muted-foreground">
          작업지시서·디자인·샘플 등 피드백 받고 싶은 내용을 올려주세요.
        </p>
      </header>
      <FeedbackForm categories={categories} />
    </div>
  );
}

