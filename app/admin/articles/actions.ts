"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ensureAdmin } from "@/lib/admin-auth";
import { createArticleSlug } from "@/lib/slugify";

const createSchema = z.object({
  title: z.string().min(2, "제목을 입력해주세요").max(120),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  content: z.string().min(8, "본문을 입력해주세요"),
  category_id: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["published", "draft"]),
});

const updateSchema = createSchema.extend({
  post_id: z.string().uuid(),
});

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function createArticle(formData: FormData) {
  const { supabase, user } = await ensureAdmin();

  const parsed = createSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") ?? "",
    content: formData.get("content"),
    category_id: formData.get("category_id") ?? "",
    status: formData.get("status") ?? "published",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
  }

  const data = parsed.data;
  const slug = createArticleSlug(data.title);
  const excerpt =
    data.excerpt?.trim() ||
    stripHtml(data.content).slice(0, 160) ||
    null;

  const { data: inserted, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      type: "article",
      title: data.title,
      slug,
      excerpt,
      content: data.content,
      category_id: data.category_id || null,
      status: data.status,
      metadata: { content_format: "html" },
    })
    .select("id")
    .single();

  if (error) {
    console.error("[createArticle]", error);
    throw new Error("콘텐츠 등록에 실패했습니다.");
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin/posts");
  revalidatePath("/articles");
  redirect(`/admin/articles/${inserted.id}/edit`);
}

export async function updateArticle(formData: FormData) {
  const { supabase } = await ensureAdmin();

  const parsed = updateSchema.safeParse({
    post_id: formData.get("post_id"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt") ?? "",
    content: formData.get("content"),
    category_id: formData.get("category_id") ?? "",
    status: formData.get("status") ?? "published",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
  }

  const data = parsed.data;
  const excerpt =
    data.excerpt?.trim() ||
    stripHtml(data.content).slice(0, 160) ||
    null;

  const { error } = await supabase
    .from("posts")
    .update({
      title: data.title,
      excerpt,
      content: data.content,
      category_id: data.category_id || null,
      status: data.status,
      metadata: { content_format: "html" },
    })
    .eq("id", data.post_id)
    .eq("type", "article");

  if (error) {
    console.error("[updateArticle]", error);
    throw new Error("콘텐츠 수정에 실패했습니다.");
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin/posts");
  revalidatePath("/articles");
  revalidatePath(`/admin/articles/${data.post_id}/edit`);
}

export async function deleteArticle(formData: FormData) {
  const { supabase } = await ensureAdmin();
  const postId = String(formData.get("post_id") ?? "");
  if (!postId) return;

  const { error } = await supabase
    .from("posts")
    .update({ status: "deleted" })
    .eq("id", postId)
    .eq("type", "article");

  if (error) {
    console.error("[deleteArticle]", error);
    throw new Error("콘텐츠 삭제에 실패했습니다.");
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin/posts");
  revalidatePath("/articles");
  redirect("/admin/articles");
}
