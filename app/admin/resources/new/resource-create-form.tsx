"use client";

import { useMemo, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RESOURCE_TYPES, ROLE_TYPES } from "@/lib/constants";
import type { Category } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { createResource } from "./actions";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function ResourceCreateForm({ categories }: { categories: Category[] }) {
  const [fileUrl, setFileUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isUploading = uploadingFile || uploadingThumb;
  const uploadStateText = useMemo(() => {
    if (uploadingFile && uploadingThumb) return "파일/썸네일 업로드 중...";
    if (uploadingFile) return "파일 업로드 중...";
    if (uploadingThumb) return "썸네일 업로드 중...";
    return "";
  }, [uploadingFile, uploadingThumb]);

  const uploadToStorage = async (file: File, folder: "files" | "thumbnails") => {
    const supabase = createClient();
    const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("resource-files")
      .upload(filePath, file, {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("resource-files").getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <form action={createResource} className="space-y-5">
      <input type="hidden" name="file_url" value={fileUrl} />
      <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />

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

      <Field label="자료 파일 업로드" required hint="PDF/엑셀/ZIP 등 최대 25MB">
        <Input
          type="file"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.currentTarget.value = "";
            if (!file) return;

            setUploadError(null);
            if (file.size > MAX_FILE_SIZE) {
              setUploadError("자료 파일은 최대 25MB까지 업로드할 수 있어요.");
              return;
            }

            try {
              setUploadingFile(true);
              const publicUrl = await uploadToStorage(file, "files");
              setFileUrl(publicUrl);
            } catch (error) {
              console.error("[resource file upload]", error);
              setUploadError(
                "파일 업로드에 실패했어요. Storage에 resource-files 버킷이 있는지 확인해주세요.",
              );
            } finally {
              setUploadingFile(false);
            }
          }}
        />
        <p className="text-xs text-muted-foreground">
          {fileUrl ? "업로드 완료됨" : "아직 파일이 업로드되지 않았습니다."}
        </p>
      </Field>

      <Field label="썸네일 이미지 업로드" hint="JPG/PNG/WEBP/GIF 최대 5MB">
        <Input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.currentTarget.value = "";
            if (!file) return;

            setUploadError(null);
            if (!file.type.startsWith("image/")) {
              setUploadError("썸네일은 이미지 파일만 업로드할 수 있어요.");
              return;
            }
            if (file.size > MAX_IMAGE_SIZE) {
              setUploadError("썸네일은 최대 5MB까지 업로드할 수 있어요.");
              return;
            }

            try {
              setUploadingThumb(true);
              const publicUrl = await uploadToStorage(file, "thumbnails");
              setThumbnailUrl(publicUrl);
            } catch (error) {
              console.error("[resource thumbnail upload]", error);
              setUploadError("썸네일 업로드에 실패했어요.");
            } finally {
              setUploadingThumb(false);
            }
          }}
        />
        <p className="text-xs text-muted-foreground">
          {thumbnailUrl ? "썸네일 업로드 완료됨" : "썸네일은 선택 사항입니다."}
        </p>
      </Field>

      <Field label="외부 링크 (선택)" hint="링크형 자료일 때만 입력하세요.">
        <Input name="external_url" placeholder="https://..." />
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

      {uploadError ? (
        <p className="text-sm text-destructive">{uploadError}</p>
      ) : null}
      {isUploading ? (
        <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {uploadStateText}
        </p>
      ) : null}

      <SubmitButton disabled={isUploading || !fileUrl} />
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex justify-end gap-2">
      <Button type="submit" variant="accent" disabled={disabled || pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            등록 중...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            등록
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
