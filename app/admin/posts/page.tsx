import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { POST_TYPE_LABEL, POST_TYPES } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "게시글 관리" };

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: { type?: string; status?: string };
}) {
  const supabase = createClient();
  let query = supabase
    .from("posts")
    .select(
      "id, type, title, status, created_at, view_count, comment_count, author:profiles!posts_author_id_fkey(nickname)",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (searchParams.type) query = query.eq("type", searchParams.type);
  if (searchParams.status) query = query.eq("status", searchParams.status);

  const { data: posts } = await query;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">게시글 관리</h1>
        <p className="text-sm text-muted-foreground">
          모든 게시글의 상태와 노출 여부를 관리합니다.
        </p>
      </header>
      <form className="flex flex-wrap gap-2 text-sm" method="get">
        <select
          name="type"
          defaultValue={searchParams.type ?? ""}
          className="h-10 rounded-md border border-input bg-background px-3"
        >
          <option value="">모든 타입</option>
          {POST_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={searchParams.status ?? ""}
          className="h-10 rounded-md border border-input bg-background px-3"
        >
          <option value="">모든 상태</option>
          <option value="published">노출</option>
          <option value="draft">초안</option>
          <option value="hidden">숨김</option>
          <option value="deleted">삭제</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-md border bg-primary px-4 text-primary-foreground"
        >
          필터
        </button>
      </form>
      <div className="rounded-xl border overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs">
            <tr>
              <th className="px-4 py-3">제목</th>
              <th className="px-4 py-3">타입</th>
              <th className="px-4 py-3">작성자</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">조회/댓글</th>
              <th className="px-4 py-3">작성일</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3 font-medium max-w-md truncate">
                  <Link href={`/admin/posts/${p.id}`} className="hover:underline">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="soft">
                    {POST_TYPE_LABEL[p.type as keyof typeof POST_TYPE_LABEL]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {(p.author as { nickname?: string } | null)?.nickname ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{p.status}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.view_count} / {p.comment_count}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {formatRelativeTime(p.created_at)}
                </td>
              </tr>
            ))}
            {(posts?.length ?? 0) === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  조건에 맞는 게시글이 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
