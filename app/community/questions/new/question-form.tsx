"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Category } from "@/lib/database.types";
import { createQuestion } from "../actions";

export function QuestionForm({ categories }: { categories: Category[] }) {
  return (
    <form action={createQuestion} className="space-y-5">
      <Field label="카테고리">
        <select
          name="category_id"
          defaultValue=""
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">선택해주세요</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="제목" required>
        <Input
          name="title"
          required
          maxLength={120}
          placeholder="질문 제목을 입력해주세요"
        />
      </Field>
      <Field label="내용" required>
        <Textarea
          name="content"
          required
          rows={12}
          placeholder="상황과 시도해본 점을 함께 적어주시면 더 좋은 답변을 받을 수 있어요."
          className="min-h-[260px]"
        />
      </Field>
      <Field label="태그 (쉼표로 구분)">
        <Input name="tags" placeholder="예: 봉제, 동대문, MOQ" maxLength={200} />
      </Field>
      <Field label="공개 범위">
        <select
          name="visibility"
          defaultValue="public"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="public">전체 공개</option>
          <option value="members_only">회원 공개</option>
          <option value="private">비공개 (본인만)</option>
        </select>
      </Field>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button type="submit" disabled={pending} variant="accent" size="lg">
        {pending ? "등록 중..." : "질문 등록"}
      </Button>
    </div>
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
