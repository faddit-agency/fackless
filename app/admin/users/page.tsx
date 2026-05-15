import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { ROLE_TYPE_LABEL } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";
import type { Profile } from "@/lib/database.types";

export const dynamic = "force-dynamic";
export const metadata = { title: "회원 관리" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { role?: string; q?: string };
}) {
  const supabase = createClient();
  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (searchParams.role) query = query.eq("role_type", searchParams.role);
  if (searchParams.q)
    query = query.ilike("nickname", `%${searchParams.q}%`);

  const { data } = await query;
  const users = (data as Profile[]) ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">회원 관리</h1>
        <p className="text-sm text-muted-foreground">
          전체 가입자와 직군, 전문가 인증 여부를 관리합니다.
        </p>
      </header>
      <form className="flex flex-wrap gap-2 text-sm" action="" method="get">
        <input
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder="닉네임 검색"
          className="h-10 rounded-md border border-input bg-background px-3"
        />
        <select
          name="role"
          defaultValue={searchParams.role ?? ""}
          className="h-10 rounded-md border border-input bg-background px-3"
        >
          <option value="">모든 직군</option>
          {Object.entries(ROLE_TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
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
              <th className="px-4 py-3">닉네임</th>
              <th className="px-4 py-3">직군</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">지역</th>
              <th className="px-4 py-3">가입일</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">
                  <Link
                    href={`/profile/${u.user_id}`}
                    className="font-medium hover:underline"
                  >
                    {u.nickname}
                  </Link>
                </td>
                <td className="px-4 py-3">{ROLE_TYPE_LABEL[u.role_type]}</td>
                <td className="px-4 py-3 space-x-1">
                  {u.is_onboarded ? (
                    <Badge variant="soft">온보딩 완료</Badge>
                  ) : (
                    <Badge variant="outline">온보딩 미완료</Badge>
                  )}
                  {u.is_verified_expert ? (
                    <Badge variant="accent">전문가</Badge>
                  ) : null}
                  {u.is_admin ? <Badge>관리자</Badge> : null}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {u.region ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {formatRelativeTime(u.created_at)}
                </td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  조건에 맞는 회원이 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
