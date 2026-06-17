"use server";

import { revalidatePath } from "next/cache";
import { ensureAdmin } from "@/lib/admin-auth";

export async function updatePostStatus(formData: FormData) {
  const { supabase } = await ensureAdmin();
  const postId = formData.get("post_id") as string;
  const status = formData.get("status") as string;
  if (!postId || !status) return;
  await supabase
    .from("posts")
    .update({ status: status as "published" | "hidden" | "deleted" | "draft" })
    .eq("id", postId);
  revalidatePath(`/admin/posts/${postId}`);
  revalidatePath("/admin/posts");
}

export async function togglePin(formData: FormData) {
  const { supabase } = await ensureAdmin();
  const postId = formData.get("post_id") as string;
  const pinned = (formData.get("pinned") as string) === "true";
  await supabase.from("posts").update({ is_pinned: pinned }).eq("id", postId);
  revalidatePath(`/admin/posts/${postId}`);
  revalidatePath("/admin/posts");
}
