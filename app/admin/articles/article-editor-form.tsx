"use client";

import { Loader2, Save } from "lucide-react";
import { useFormStatus } from "react-dom";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/lib/database.types";
import { createArticle, updateArticle } from "./actions";

interface ArticleEditorFormProps {
  categories: Category[];
  mode: "create" | "edit";
  post?: {
    id: string;
    title: string;
    excerpt: string | null;
    content: string;
    category_id: string | null;
    status: string;
  };
}

export function ArticleEditorForm({ categories, mode, post }: ArticleEditorFormProps) {
  const action = mode === "create" ? createArticle : updateArticle;

  return (
    <form action={action} className="space-y-5">
      {mode === "edit" && post ? (
        <input type="hidden" name="post_id" value={post.id} />
      ) : null}

      <Field label="제목" required>
        <Input
          name="title"
          required
          maxLength={120}
          defaultValue={post?.title ?? ""}
          placeholder="실무 콘텐츠 제목"
        />
      </Field>

      <Field label="요약" hint="목록에 표시됩니다. 비워두면 본문에서 자동 생성됩니다.">
        <Textarea
          name="excerpt"
          rows={2}
          maxLength={300}
          defaultValue={post?.excerpt ?? ""}
          placeholder="한 줄 요약"
        />
      </Field>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="카테고리">
          <select
            name="category_id"
            defaultValue={post?.category_id ?? ""}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">선택 안 함</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="상태" required>
          <select
            name="status"
            defaultValue={post?.status ?? "published"}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="published">공개</option>
            <option value="draft">초안</option>
          </select>
        </Field>
      </div>

      <Field label="본문" required>
        <RichTextEditor
          name="content"
          defaultValue={post?.content ?? ""}
          placeholder="실무 가이드 본문을 작성하세요. 굵게, 목록, 링크 등을 사용할 수 있습니다."
        />
      </Field>

      <SubmitButton label={mode === "create" ? "콘텐츠 등록" : "변경사항 저장"} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex justify-end">
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            저장 중...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            {label}
          </>
        )}
      </Button>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required ? <span className="text-destructive ml-1">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
