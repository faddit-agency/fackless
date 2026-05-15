"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[app/error]", error);
    }
  }, [error]);

  return (
    <div className="container max-w-xl py-20">
      <div className="rounded-2xl border bg-card p-8 md:p-10 text-center space-y-5">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-bold">
            페이지를 불러오지 못했어요.
          </h1>
          <p className="text-sm text-muted-foreground">
            일시적인 문제일 수 있어요. 잠시 후 다시 시도해주세요. 문제가 계속되면{" "}
            <a
              href="mailto:hello@packless.app"
              className="underline font-medium text-foreground/80"
            >
              hello@packless.app
            </a>{" "}
            으로 알려주세요.
          </p>
        </div>
        {error.digest ? (
          <p className="text-[11px] text-muted-foreground/80 font-mono">
            오류 코드 · {error.digest}
          </p>
        ) : null}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button onClick={() => reset()} size="sm" variant="accent">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            다시 시도
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
