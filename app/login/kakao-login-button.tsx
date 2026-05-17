"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function KakaoLoginButton({ redirectTo }: { redirectTo?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL;
    const callback = new URL("/auth/callback", origin ?? "http://localhost:3000");
    if (redirectTo) callback.searchParams.set("redirectTo", redirectTo);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: callback.toString(),
        queryParams: {
          prompt: "login",
        },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="w-full h-12 rounded-md text-base font-semibold bg-[#FEE500] text-[#181818] hover:bg-[#FEE500]/90 shadow-none"
      >
        <svg
          aria-hidden
          viewBox="0 0 18 18"
          className="h-4 w-4"
          fill="currentColor"
        >
          <path d="M9 1.5C4.58 1.5 1 4.27 1 7.69c0 2.18 1.5 4.09 3.74 5.18l-.7 2.55c-.06.22.17.4.36.27l3.05-2.02c.51.07 1.03.11 1.55.11 4.42 0 8-2.77 8-6.19S13.42 1.5 9 1.5z" />
        </svg>
        {loading ? "이동 중..." : "카카오로 시작하기"}
      </Button>
      {error ? (
        <p className="text-xs text-destructive text-center">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground text-center">
          최초 로그인 시 직군 선택 화면으로 이동합니다.
        </p>
      )}
    </div>
  );
}
