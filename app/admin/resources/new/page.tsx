import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getCategories } from "@/lib/queries";
import { RESOURCE_TYPES, ROLE_TYPES } from "@/lib/constants";
import { createResource } from "./actions";

export const metadata = { title: "자료 등록" };

export default async function NewResourcePage() {
  const categories = await getCategories("resource");
  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">새 자료 등록</h1>
        <p className="text-sm text-muted-foreground">
          무료 자료 정보를 입력하세요. 파일은 Supabase Storage 또는 외부 링크를
          사용할 수 있습니다.
        </p>
      </header>
      <form action={createResource} className="space-y-5">
        <Field label="제목" required>
          <Input name="title" required maxLength={120} />
        </Field>
        <Field label="설명">
          <Textarea name="description" rows={4} />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="카테고리">
            <select
              name="category_id"
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
          <Field label="자료 유형" required>
            <select
              name="resource_type"
              required
              defaultValue=""
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="" disabled>
                선택해주세요
              </option>
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field
          label="파일 URL"
          hint="Supabase Storage 또는 외부 다운로드 링크"
        >
          <Input name="file_url" placeholder="https://..." />
        </Field>
        <Field label="외부 링크 (선택)">
          <Input name="external_url" placeholder="https://..." />
        </Field>
        <Field label="썸네일 URL">
          <Input name="thumbnail_url" placeholder="https://..." />
        </Field>
        <div className="space-y-1.5">
          <Label className="text-sm">추천 대상</Label>
          <div className="flex flex-wrap gap-2">
            {ROLE_TYPES.map((r) => (
              <label key={r.value} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="target_roles"
                  value={r.value}
                  className="h-4 w-4"
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked
            value="true"
            className="h-4 w-4"
          />
          바로 공개
        </label>
        <div className="flex justify-end gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/resources">취소</Link>
          </Button>
          <Button type="submit" variant="accent">
            등록
          </Button>
        </div>
      </form>
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
