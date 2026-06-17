"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  title: z.string().min(5, "제목은 최소 5자 이상").max(120),
  content: z.string().min(10, "내용은 최소 10자 이상").max(20000),
  category_id: z.string().uuid().optional().or(z.literal("")),
  tags: z.string().max(200).optional().or(z.literal("")),
  visibility: z.enum(["public", "members_only", "private"]).default("public"),
});

export async function createFeedback(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = schema.parse({
    title: formData.get("title"),
    content: formData.get("content"),
    category_id: formData.get("category_id") ?? "",
    tags: formData.get("tags") ?? "",
    visibility: (formData.get("visibility") as string) || "public",
  });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_onboarded")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile?.is_onboarded) redirect("/onboarding");

  const { data: inserted, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      type: "feedback",
      title: parsed.title,
      content: parsed.content,
      excerpt: parsed.content.slice(0, 160),
      category_id: parsed.category_id || null,
      visibility: parsed.visibility,
      status: "published",
    })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("[createFeedback]", error);
    throw new Error("게시글 작성 중 오류가 발생했습니다.");
  }

  if (parsed.tags) {
    const tags = parsed.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10);
    if (tags.length > 0) {
      await supabase
        .from("post_tags")
        .insert(tags.map((tag) => ({ post_id: inserted.id, tag })));
    }
  }

  revalidatePath("/community/feedback");
  revalidatePath("/community");
  redirect(`/community/feedback/${inserted.id}`);
}

