import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "관리자 대시보드" };

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: userCount },
    { count: postCount },
    { count: commentCount },
    { count: downloadCount },
    { count: applicationCount },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .neq("status", "deleted"),
    supabase.from("resource_downloads").select("id", { count: "exact", head: true }),
    supabase
      .from("bootcamp_applications")
      .select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "가입자", value: userCount ?? 0 },
    { label: "게시글", value: postCount ?? 0 },
    { label: "댓글", value: commentCount ?? 0 },
    { label: "자료 다운로드", value: downloadCount ?? 0 },
    { label: "부트캠프 신청", value: applicationCount ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold">대시보드</h1>
        <p className="text-sm text-muted-foreground">
          서비스 핵심 지표를 한눈에 확인하세요.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">
              {formatNumber(stat.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
