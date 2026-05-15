import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ROLE_TYPE_LABEL } from "@/lib/constants";
import type { BootcampApplication } from "@/lib/database.types";

export const dynamic = "force-dynamic";

function escapeCsv(value: unknown): string {
  if (value == null) return "";
  const str = String(value).replace(/"/g, '""');
  return /[",\n]/.test(str) ? `"${str}"` : str;
}

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!me?.is_admin) return new NextResponse("Forbidden", { status: 403 });

  const { data } = await supabase
    .from("bootcamp_applications")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data as BootcampApplication[]) ?? [];

  const headers = [
    "신청일",
    "이름",
    "연락처",
    "이메일",
    "직군",
    "브랜드 단계",
    "현재 어려움",
    "상태",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.created_at,
        row.name,
        row.phone,
        row.email,
        ROLE_TYPE_LABEL[row.role_type],
        row.brand_stage ?? "",
        row.pain_point ?? "",
        row.status,
      ]
        .map(escapeCsv)
        .join(","),
    );
  }

  return new NextResponse(`\uFEFF${lines.join("\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="bootcamp-applications.csv"',
    },
  });
}
