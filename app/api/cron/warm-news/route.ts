import { NextResponse } from "next/server";
import { warmFashionNewsCache } from "@/lib/external-fashion-news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  await warmFashionNewsCache();
  return NextResponse.json({ ok: true, warmedAt: new Date().toISOString() });
}
