"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

interface AdminDeleteFormProps {
  action: (formData: FormData) => Promise<void>;
  id: string;
  idFieldName?: string;
  label?: string;
  confirmMessage?: string;
  variant?: "destructive" | "outline";
  size?: "default" | "sm";
}

export function AdminDeleteForm({
  action,
  id,
  idFieldName = "id",
  label = "삭제",
  confirmMessage = "정말 삭제하시겠습니까?",
  variant = "destructive",
  size = "sm",
}: AdminDeleteFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name={idFieldName} value={id} />
      <DeleteSubmitButton label={label} variant={variant} size={size} />
    </form>
  );
}

function DeleteSubmitButton({
  label,
  variant,
  size,
}: {
  label: string;
  variant: "destructive" | "outline";
  size: "default" | "sm";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} size={size} disabled={pending}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          {label ? <span>{label}</span> : null}
        </>
      )}
    </Button>
  );
}
