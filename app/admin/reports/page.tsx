import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "신고 관리" };

export default async function AdminReportsPage() {
  const supabase = createClient();
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">신고 관리</h1>
        <p className="text-sm text-muted-foreground">
          접수된 신고를 검토하고 처리 상태를 변경할 수 있습니다.
        </p>
      </header>
      <div className="rounded-xl border overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs">
            <tr>
              <th className="px-4 py-3">대상</th>
              <th className="px-4 py-3">사유</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">신고일</th>
            </tr>
          </thead>
          <tbody>
            {(reports ?? []).map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">
                  <Badge variant="soft">{r.target_type}</Badge>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {r.target_id}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-md">{r.reason ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{r.status}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {formatRelativeTime(r.created_at)}
                </td>
              </tr>
            ))}
            {(reports?.length ?? 0) === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  접수된 신고가 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
