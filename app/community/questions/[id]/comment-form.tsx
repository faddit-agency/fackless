"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "../actions";

export function CommentForm({ postId }: { postId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (formData) => {
        await createComment(formData);
        ref.current?.reset();
      }}
      className="space-y-2"
    >
      <input type="hidden" name="post_id" value={postId} />
      <Textarea
        name="content"
        required
        minLength={2}
        maxLength={4000}
        placeholder="답변을 작성해주세요. 구체적인 경험을 공유해 주시면 도움이 됩니다."
        className="min-h-[120px]"
      />
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant="accent">
      {pending ? "등록 중..." : "답변 등록"}
    </Button>
  );
}
