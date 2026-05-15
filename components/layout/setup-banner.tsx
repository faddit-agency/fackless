import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { hasSupabaseEnv } from "@/lib/supabase/server";

const IS_VERCEL = !!process.env.VERCEL;

export function SetupBanner() {
  if (hasSupabaseEnv()) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="container py-2.5 flex items-start gap-3 text-xs md:text-sm">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <p className="flex-1">
          <strong className="font-semibold">
            Supabase가 아직 연결되지 않았습니다.
          </strong>{" "}
          {IS_VERCEL ? (
            <span className="text-amber-800/90">
              Vercel{" "}
              <strong>Settings → Environment Variables</strong> 에서{" "}
              <code className="px-1 py-0.5 bg-amber-100 rounded">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              과{" "}
              <code className="px-1 py-0.5 bg-amber-100 rounded">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              를 등록한 뒤 <strong>Redeploy</strong> 하세요.
            </span>
          ) : (
            <span className="text-amber-800/90">
              <code className="px-1 py-0.5 bg-amber-100 rounded">.env.local</code>
              에{" "}
              <code className="px-1 py-0.5 bg-amber-100 rounded">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              과{" "}
              <code className="px-1 py-0.5 bg-amber-100 rounded">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              를 입력한 뒤 서버를 재시작해주세요. 설정 후{" "}
              <code className="px-1 py-0.5 bg-amber-100 rounded">
                supabase/migrations/0001_init.sql
              </code>
              과{" "}
              <code className="px-1 py-0.5 bg-amber-100 rounded">
                0002_seed.sql
              </code>{" "}
              을 Supabase SQL Editor에서 실행하세요.
            </span>
          )}{" "}
          <Link
            href={
              IS_VERCEL
                ? "https://vercel.com/dashboard"
                : "https://supabase.com/dashboard"
            }
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline whitespace-nowrap"
          >
            {IS_VERCEL ? "Vercel 대시보드 열기 →" : "Supabase 대시보드 열기 →"}
          </Link>
        </p>
      </div>
    </div>
  );
}
