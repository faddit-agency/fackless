"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { createNewsAd } from "./actions";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function NewsAdCreateForm() {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form action={createNewsAd} className="space-y-4 rounded-xl border bg-card p-4">
      <input type="hidden" name="image_url" value={imageUrl} />
      <input type="hidden" name="is_active" value="true" />

      <Field label="광고 제목" required>
        <Input name="title" required maxLength={80} />
      </Field>

      <Field label="부제목">
        <Textarea name="subtitle" rows={2} maxLength={200} />
      </Field>

      <Field label="링크 URL" required>
        <Input name="link_url" type="url" required placeholder="https://..." />
      </Field>

      <Field label="정렬 순서 (작을수록 상단)">
        <Input name="sort_order" type="number" min={0} defaultValue={0} />
      </Field>

      <Field label="광고 이미지 업로드" required hint="JPG/PNG/WEBP/GIF, 최대 5MB">
        <Input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.currentTarget.value = "";
            if (!file) return;

            setError(null);
            if (!file.type.startsWith("image/")) {
              setError("이미지 파일만 업로드할 수 있습니다.");
              return;
            }
            if (file.size > MAX_IMAGE_SIZE) {
              setError("최대 5MB 이미지까지 업로드할 수 있습니다.");
              return;
            }

            try {
              setUploading(true);
              const supabase = createClient();
              const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
              const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
              const filePath = `ads/${fileName}`;
              const { error: uploadError } = await supabase.storage
                .from("news-ads")
                .upload(filePath, file, { contentType: file.type, upsert: false });
              if (uploadError) throw uploadError;
              const { data } = supabase.storage.from("news-ads").getPublicUrl(filePath);
              setImageUrl(data.publicUrl);
            } catch (uploadError) {
              console.error("[news ad upload]", uploadError);
              setError("이미지 업로드에 실패했습니다.");
            } finally {
              setUploading(false);
            }
          }}
        />
        <p className="text-xs text-muted-foreground">
          {imageUrl ? "이미지 업로드 완료" : "아직 업로드된 이미지가 없습니다."}
        </p>
      </Field>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <SubmitButton disabled={uploading || !imageUrl} />
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="accent" disabled={disabled || pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          저장 중...
        </>
      ) : (
        <>
          <Upload className="h-4 w-4" />
          광고 등록
        </>
      )}
    </Button>
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
