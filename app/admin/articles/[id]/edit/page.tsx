import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDeleteForm } from "@/components/admin/admin-delete-form";
import { Button } from "@/components/ui/button";
import { ArticleEditorForm } from "../../article-editor-form";
import { deleteArticle } from "../../actions";
import { getCategories } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditArticlePage({ params }: Props) {
  const supabase = createClient();
  const [{ data: post }, categories] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, excerpt, content, category_id, status, slug")
      .eq("id", params.id)
      .eq("type", "article")
      .maybeSingle(),
    getCategories("article"),
  ]);

  if (!post) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">콘텐츠 수정</h1>
          <p className="text-sm text-muted-foreground">{post.title}</p>
        </div>
        {post.slug ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/articles/${post.slug}`} target="_blank">
              미리보기
            </Link>
          </Button>
        ) : null}
      </header>
      <ArticleEditorForm
        categories={categories}
        mode="edit"
        post={post}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AdminDeleteForm
          action={deleteArticle}
          id={post.id}
          idFieldName="post_id"
          confirmMessage="이 콘텐츠를 삭제할까요? 삭제 후에는 공개 목록에서 숨겨집니다."
        />
        <Button asChild variant="outline">
          <Link href="/admin/articles">목록으로</Link>
        </Button>
      </div>
    </div>
  );
}
