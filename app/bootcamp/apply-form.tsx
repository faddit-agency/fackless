"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ROLE_TYPES, BRAND_STAGES } from "@/lib/constants";
import { applyBootcamp } from "./actions";

export function BootcampApplyForm() {
  const [pending, startTransition] = useTransition();
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<
    { kind: "success" } | { kind: "error"; message: string } | null
  >(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreed) {
      setStatus({ kind: "error", message: "개인정보 수집 동의가 필요합니다." });
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("privacy_agreed", "true");
    setStatus(null);
    startTransition(async () => {
      const result = await applyBootcamp(formData);
      if (result.ok) {
        setStatus({ kind: "success" });
        form.reset();
        setAgreed(false);
      } else {
        setStatus({ kind: "error", message: result.error });
      }
    });
  };

  if (status?.kind === "success") {
    return (
      <div className="rounded-xl border bg-brand-soft p-6 text-sm space-y-2">
        <p className="font-semibold text-primary">신청이 접수되었습니다.</p>
        <p className="text-muted-foreground">
          24~48시간 이내로 안내 연락을 드릴게요. 그 사이 무료 자료실도
          둘러보세요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="이름" required>
          <Input name="name" required maxLength={40} />
        </Field>
        <Field label="연락처" required>
          <Input
            name="phone"
            required
            placeholder="010-0000-0000"
            inputMode="tel"
            maxLength={20}
          />
        </Field>
      </div>
      <Field label="이메일" required>
        <Input type="email" name="email" required maxLength={120} />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="직군" required>
          <select
            name="role_type"
            required
            defaultValue=""
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="" disabled>
              직군을 선택해주세요
            </option>
            {ROLE_TYPES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="브랜드 단계">
          <select
            name="brand_stage"
            defaultValue=""
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">선택해주세요</option>
            {BRAND_STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="현재 가장 어려운 점">
        <Textarea
          name="pain_point"
          placeholder="원단/공장/작업지시서/원가/브랜딩 등 가장 막혀있는 부분을 적어주세요."
          className="min-h-[140px]"
          maxLength={2000}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <Checkbox
          checked={agreed}
          onCheckedChange={(v) => setAgreed(v === true)}
        />
        <span>
          상담을 위한 개인정보 수집·이용에 동의합니다. (필수)
        </span>
      </label>
      {status?.kind === "error" ? (
        <p className="text-sm text-destructive">{status.message}</p>
      ) : null}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          variant="accent"
          disabled={pending}
          className="min-w-[160px]"
        >
          {pending ? "신청 중..." : "신청하기"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required ? <span className="text-destructive ml-1">*</span> : null}
      </Label>
      {children}
    </div>
  );
}
