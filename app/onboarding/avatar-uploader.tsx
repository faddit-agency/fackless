"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface Props {
  userId: string;
  initialUrl: string;
  nickname: string;
}

export function AvatarUploader({ userId, initialUrl, nickname }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>(initialUrl);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("JPG, PNG, WEBP 형식만 업로드할 수 있어요.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("5MB 이하의 이미지만 업로드할 수 있어요.");
      return;
    }

    setPending(true);
    try {
      const preview = URL.createObjectURL(file);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = preview;
      setUrl(preview);

      const supabase = createClient();
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const path = `${userId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = `${data.publicUrl}?v=${Date.now()}`;

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setUrl(publicUrl);
    } catch (err) {
      console.error("[avatar upload]", err);
      setError(
        "이미지 업로드에 실패했어요. Supabase Storage 'avatars' 버킷이 생성되어 있는지 확인해주세요.",
      );
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setUrl(initialUrl);
    } finally {
      setPending(false);
    }
  };

  const handleRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setUrl("");
    setError(null);
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name="avatar_url" value={url} />
      <div className="flex items-center gap-5">
        <label
          htmlFor={inputId}
          className={cn(
            "group relative inline-flex cursor-pointer",
            pending && "pointer-events-none opacity-70",
          )}
          aria-label="프로필 이미지 선택"
        >
          <UserAvatar
            nickname={nickname || "P"}
            avatarUrl={url || null}
            className="h-20 w-20 ring-1 ring-border"
            fallbackClassName="text-2xl"
          />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#181818]/45 text-white opacity-0 transition group-hover:opacity-100">
            {pending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
          </span>
        </label>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  업로드 중…
                </>
              ) : url ? (
                "이미지 변경"
              ) : (
                "이미지 업로드"
              )}
            </Button>
            {url ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={pending}
                className="text-muted-foreground"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> 기본 이미지
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            JPG·PNG·WEBP · 최대 5MB. 업로드하지 않으면 닉네임 앞글자가 들어간
            기본 이미지가 사용돼요.
          </p>
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
      </div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="sr-only"
      />
    </div>
  );
}
