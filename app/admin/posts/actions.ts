"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function ensureAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) throw new Error("관리자 권한이 필요합니다.");
  return supabase;
}

export async function updatePostStatus(formData: FormData) {
  const supabase = await ensureAdmin();
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
  const supabase = await ensureAdmin();
  const postId = formData.get("post_id") as string;
  const pinned = (formData.get("pinned") as string) === "true";
  await supabase.from("posts").update({ is_pinned: pinned }).eq("id", postId);
  revalidatePath(`/admin/posts/${postId}`);
  revalidatePath("/admin/posts");
}
