"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailLogin } from "./actions";

export function EmailLoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    if (redirectTo) formData.set("redirectTo", redirectTo);
    startTransition(async () => {
      const result = await emailLogin(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace(result.redirectTo);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-sm">이메일</Label>
        <Input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="hello@packless.app"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm">비밀번호</Label>
        <Input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="비밀번호"
        />
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <Button
        type="submit"
        disabled={pending}
        size="lg"
        className="w-full"
      >
        {pending ? "로그인 중..." : "이메일로 로그인"}
      </Button>
    </form>
  );
}
