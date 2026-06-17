"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ensureAdmin } from "@/lib/admin-auth";

const schema = z
  .object({
    title: z.string().min(2).max(140),
    description: z.string().max(2000).optional().or(z.literal("")),
    category_id: z.string().uuid().optional().or(z.literal("")),
    resource_type: z.enum([
      "pdf",
      "excel",
      "notion",
      "figma",
      "link",
      "faddit_template",
    ]),
    file_url: z.string().url().optional().or(z.literal("")),
    external_url: z.string().url().optional().or(z.literal("")),
    thumbnail_url: z.string().url().optional().or(z.literal("")),
    target_roles: z.array(z.string()).default([]),
    is_published: z.boolean().default(true),
  })
  .refine(
    (data) => {
      const linkOnly =
        data.resource_type === "link" || data.resource_type === "faddit_template";
      if (linkOnly) return Boolean(data.external_url || data.file_url);
      return Boolean(data.file_url || data.external_url);
    },
    { message: "파일 또는 외부 링크 중 하나는 필요합니다.", path: ["file_url"] },
  );

export async function createResource(formData: FormData) {
  const { supabase } = await ensureAdmin();

  const parsed = schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    category_id: formData.get("category_id") ?? "",
    resource_type: formData.get("resource_type"),
    file_url: formData.get("file_url") ?? "",
    external_url: formData.get("external_url") ?? "",
    thumbnail_url: formData.get("thumbnail_url") ?? "",
    target_roles: formData.getAll("target_roles").map((v) => String(v)),
    is_published: formData.get("is_published") === "true",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
  }

  const data = parsed.data;

  const { error } = await supabase.from("resources").insert({
    title: data.title,
    description: data.description || null,
    category_id: data.category_id || null,
    resource_type: data.resource_type,
    file_url: data.file_url || null,
    external_url: data.external_url || null,
    thumbnail_url: data.thumbnail_url || null,
    target_roles: data.target_roles.length ? data.target_roles : null,
    is_published: data.is_published,
  });
  if (error) {
    console.error("[createResource]", error);
    throw new Error("자료 등록에 실패했습니다.");
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  redirect("/admin/resources");
}
