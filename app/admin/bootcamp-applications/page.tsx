import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLE_TYPE_LABEL } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";
import type { BootcampApplication } from "@/lib/database.types";
import { updateApplicationStatus } from "./actions";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "부트캠프 신청 관리" };

const STATUS_LABEL: Record<BootcampApplication["status"], string> = {
  pending: "대기",
  contacted: "연락 완료",
  accepted: "수강 확정",
  rejected: "거절",
};

export default async function AdminBootcampPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("bootcamp_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const apps = (data as BootcampApplication[]) ?? [];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">부트캠프 신청 관리</h1>
          <p className="text-sm text-muted-foreground">
            총 {apps.length}건의 신청이 있습니다.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/bootcamp-applications/export.csv">CSV 다운로드</Link>
        </Button>
      </header>

      <div className="rounded-xl border overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs">
            <tr>
              <th className="px-4 py-3">이름</th>
              <th className="px-4 py-3">연락처</th>
              <th className="px-4 py-3">이메일</th>
              <th className="px-4 py-3">직군</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">신청일</th>
              <th className="px-4 py-3">액션</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id} className="border-t align-top">
                <td className="px-4 py-3 font-medium">{app.name}</td>
                <td className="px-4 py-3">{app.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{app.email}</td>
                <td className="px-4 py-3">{ROLE_TYPE_LABEL[app.role_type]}</td>
                <td className="px-4 py-3">
                  <Badge variant="soft">{STATUS_LABEL[app.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {formatRelativeTime(app.created_at)}
                </td>
                <td className="px-4 py-3">
                  <form
                    action={updateApplicationStatus}
                    className="flex gap-1 flex-wrap"
                  >
                    <input type="hidden" name="application_id" value={app.id} />
                    {(
                      [
                        "pending",
                        "contacted",
                        "accepted",
                        "rejected",
                      ] as const
                    ).map((status) => (
                      <button
                        key={status}
                        type="submit"
                        name="status"
                        value={status}
                        className="text-[10px] px-2 py-1 rounded border hover:bg-muted"
                        disabled={app.status === status}
                      >
                        {STATUS_LABEL[status]}
                      </button>
                    ))}
                  </form>
                </td>
              </tr>
            ))}
            {apps.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  아직 신청자가 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
