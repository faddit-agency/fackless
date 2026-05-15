"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { recordResourceDownload } from "../actions";

export function DownloadButton({ resourceId }: { resourceId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handle = () => {
    setError(null);
    startTransition(async () => {
      const result = await recordResourceDownload(resourceId);
      if (!result.success) {
        setError(result.error ?? "다운로드에 실패했습니다.");
        return;
      }
      if (result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
      }
    });
  };

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        variant="accent"
        onClick={handle}
        disabled={pending}
        className="w-full md:w-auto"
      >
        <Download className="h-4 w-4" />
        {pending ? "처리 중..." : "무료 다운로드"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
