import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "실무 콘텐츠 관리" };

export default async function AdminArticlesPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, status, created_at, view_count, category:categories(name)")
    .eq("type", "article")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">실무 콘텐츠</h1>
          <p className="text-sm text-muted-foreground">
            위즈윅 에디터로 아티클을 작성·수정하고 공개합니다.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4" /> 새 콘텐츠 작성
          </Link>
        </Button>
      </header>

      <div className="rounded-xl border overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs">
            <tr>
              <th className="px-4 py-3">제목</th>
              <th className="px-4 py-3">카테고리</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">조회</th>
              <th className="px-4 py-3">작성일</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((post) => (
              <tr key={post.id} className="border-t">
                <td className="px-4 py-3 font-medium max-w-md">
                  <Link
                    href={`/admin/articles/${post.id}/edit`}
                    className="hover:underline line-clamp-1"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {(post.category as { name?: string } | null)?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={post.status === "published" ? "default" : "outline"}>
                    {post.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{post.view_count}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {formatRelativeTime(post.created_at)}
                </td>
              </tr>
            ))}
            {(posts?.length ?? 0) === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  등록된 실무 콘텐츠가 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
