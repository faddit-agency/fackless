import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { getCategories } from "@/lib/queries";
import { QuestionForm } from "./question-form";

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "질문 작성",
  path: "/community/questions/new",
  noIndex: true,
});

export default async function NewQuestionPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirectTo=/community/questions/new");
  if (!profile.is_onboarded) redirect("/onboarding");

  const categories = await getCategories("question");

  return (
    <div className="container max-w-2xl py-10">
      <header className="mb-6 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          QUESTION
        </p>
        <h1 className="text-2xl md:text-3xl font-bold">질문 작성</h1>
        <p className="text-sm text-muted-foreground">
          구체적으로 질문할수록 좋은 답변을 받을 수 있어요.
        </p>
      </header>
      <QuestionForm categories={categories} />
    </div>
  );
}
