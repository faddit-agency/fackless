"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { emailSignup } from "./actions";

export function SignupForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<
    | { kind: "error"; message: string }
    | { kind: "success"; needsEmailConfirm: boolean }
    | null
  >(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    if (!agreed) {
      setStatus({ kind: "error", message: "약관에 동의해주세요." });
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("terms_agreed", "true");
    startTransition(async () => {
      const result = await emailSignup(formData);
      if (!result.ok) {
        setStatus({ kind: "error", message: result.error });
        return;
      }
      if (result.needsEmailConfirm) {
        setStatus({ kind: "success", needsEmailConfirm: true });
        form.reset();
        setAgreed(false);
      } else {
        router.replace("/onboarding");
        router.refresh();
      }
    });
  };

  if (status?.kind === "success" && status.needsEmailConfirm) {
    return (
      <div className="rounded-xl border bg-brand-soft p-5 text-sm space-y-2">
        <p className="font-semibold text-primary">이메일 인증을 보냈어요.</p>
        <p className="text-muted-foreground">
          입력하신 이메일로 발송된 링크를 눌러 가입을 완료해주세요. 인증 후
          자동으로 온보딩 페이지로 이동합니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="아이디" required>
        <Input
          name="username"
          required
          minLength={4}
          maxLength={15}
          placeholder="4~15자 영문/숫자/_"
          autoComplete="username"
        />
      </Field>
      <Field label="비밀번호" required>
        <Input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="최소 6자 (알파벳·숫자 필수)"
          autoComplete="new-password"
        />
      </Field>
      <Field label="비밀번호 확인" required>
        <Input
          name="password_confirm"
          type="password"
          required
          minLength={6}
          placeholder="비밀번호를 다시 입력해주세요"
          autoComplete="new-password"
        />
      </Field>
      <Field label="이메일" required>
        <Input
          name="email"
          type="email"
          required
          placeholder="hello@packless.app"
          autoComplete="email"
        />
      </Field>
      <Field label="실명" required>
        <Input
          name="real_name"
          required
          minLength={2}
          maxLength={40}
          placeholder="홍길동"
          autoComplete="name"
        />
      </Field>
      <Field label="닉네임" required hint="알파벳, 한글, 숫자 20자 이내">
        <Input
          name="nickname"
          required
          minLength={2}
          maxLength={20}
          placeholder="커뮤니티에서 사용할 닉네임"
        />
      </Field>
      <label className="flex items-start gap-2 text-sm cursor-pointer pt-1">
        <Checkbox
          checked={agreed}
          onCheckedChange={(value) => setAgreed(value === true)}
        />
        <span className="text-muted-foreground leading-relaxed">
          이용약관 및 개인정보처리방침에 동의합니다. (필수)
        </span>
      </label>
      {status?.kind === "error" ? (
        <p className="text-sm text-destructive">{status.message}</p>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        size="lg"
        variant="accent"
        className="w-full"
      >
        {pending ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required ? <span className="text-destructive ml-1">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
