import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleEditorForm } from "../article-editor-form";
import { getCategories } from "@/lib/queries";

export const metadata = { title: "실무 콘텐츠 작성" };

export default async function NewArticlePage() {
  const categories = await getCategories("article");

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">새 실무 콘텐츠</h1>
        <p className="text-sm text-muted-foreground">
          위즈윅 에디터로 본문을 작성하고 바로 공개할 수 있습니다.
        </p>
      </header>
      <ArticleEditorForm categories={categories} mode="create" />
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/admin/articles">목록으로</Link>
        </Button>
      </div>
    </div>
  );
}
