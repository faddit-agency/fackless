import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { MarkdownContent } from "@/components/markdown-content";
import { updatePostStatus, togglePin } from "../actions";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function AdminPostDetail({ params }: Props) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select(
      "*, author:profiles!posts_author_id_fkey(nickname), category:categories(name)",
    )
    .eq("id", params.id)
    .maybeSingle();
  if (!post) notFound();

  return (
    <article className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/admin/posts">← 게시글 목록</Link>
      </Button>
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{post.status}</Badge>
          {post.is_pinned ? <Badge variant="accent">고정</Badge> : null}
          {"name" in (post.category ?? {}) ? (
            <Badge variant="soft">
              {(post.category as { name?: string }).name}
            </Badge>
          ) : null}
        </div>
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-xs text-muted-foreground">
          작성자{" "}
          {(post.author as { nickname?: string } | null)?.nickname ?? "—"}
        </p>
      </header>

      <div className="rounded-xl border bg-card p-5">
        <MarkdownContent content={post.content} />
      </div>

      <section className="rounded-xl border bg-card p-5 space-y-3">
        <p className="text-sm font-semibold">관리 액션</p>
        <div className="flex flex-wrap gap-2">
          <form action={updatePostStatus}>
            <input type="hidden" name="post_id" value={post.id} />
            <input type="hidden" name="status" value="published" />
            <Button type="submit" variant="outline">
              노출
            </Button>
          </form>
          <form action={updatePostStatus}>
            <input type="hidden" name="post_id" value={post.id} />
            <input type="hidden" name="status" value="hidden" />
            <Button type="submit" variant="outline">
              숨김
            </Button>
          </form>
          <form action={updatePostStatus}>
            <input type="hidden" name="post_id" value={post.id} />
            <input type="hidden" name="status" value="deleted" />
            <Button type="submit" variant="destructive">
              삭제 (soft)
            </Button>
          </form>
          <form action={togglePin}>
            <input type="hidden" name="post_id" value={post.id} />
            <input
              type="hidden"
              name="pinned"
              value={post.is_pinned ? "false" : "true"}
            />
            <Button type="submit" variant="accent">
              {post.is_pinned ? "고정 해제" : "상단 고정"}
            </Button>
          </form>
        </div>
      </section>
    </article>
  );
}
