import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber, formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "자료실 관리" };

export default async function AdminResourcesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const resources = data ?? [];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">자료실 관리</h1>
          <p className="text-sm text-muted-foreground">
            무료 자료 등록 및 다운로드 수를 확인합니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/resources/new">새 자료 등록</Link>
        </Button>
      </header>
      <div className="rounded-xl border overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs">
            <tr>
              <th className="px-4 py-3">제목</th>
              <th className="px-4 py-3">유형</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">다운로드</th>
              <th className="px-4 py-3">등록일</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3 font-medium max-w-md truncate">
                  <Link href={`/resources/${r.id}`} className="hover:underline">
                    {r.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="soft">{r.resource_type}</Badge>
                </td>
                <td className="px-4 py-3">
                  {r.is_published ? (
                    <Badge variant="default">공개</Badge>
                  ) : (
                    <Badge variant="outline">비공개</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatNumber(r.download_count)}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {formatRelativeTime(r.created_at)}
                </td>
              </tr>
            ))}
            {resources.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  등록된 자료가 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
