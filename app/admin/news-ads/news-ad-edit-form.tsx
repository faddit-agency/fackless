"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { updateNewsAd } from "./actions";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

type NewsAdItem = {
  id: string;
  title: string;
  subtitle: string | null;
  link_url: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
};

export function NewsAdEditForm({ ad }: { ad: NewsAdItem }) {
  const [imageUrl, setImageUrl] = useState(ad.image_url);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form action={updateNewsAd} className="space-y-3">
      <input type="hidden" name="id" value={ad.id} />
      <input type="hidden" name="image_url" value={imageUrl} />
      <input type="hidden" name="is_active" value={ad.is_active ? "true" : "false"} />

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="제목" required>
          <Input name="title" defaultValue={ad.title} required />
        </Field>
        <Field label="정렬 순서">
          <Input
            name="sort_order"
            type="number"
            min={0}
            defaultValue={ad.sort_order}
          />
        </Field>
      </div>

      <Field label="부제목">
        <Textarea name="subtitle" rows={2} defaultValue={ad.subtitle ?? ""} />
      </Field>

      <Field label="링크 URL" required>
        <Input name="link_url" defaultValue={ad.link_url} required />
      </Field>

      <Field label="광고 이미지" hint="새 이미지를 올리지 않으면 기존 이미지가 유지됩니다.">
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
          {uploading
            ? "이미지 업로드 중..."
            : imageUrl !== ad.image_url
              ? "새 이미지가 적용됩니다."
              : "현재 이미지 유지"}
        </p>
      </Field>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <SubmitButton disabled={uploading} />
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" disabled={disabled || pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          저장 중...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          수정 저장
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
