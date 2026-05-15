"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
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
});

export async function createResource(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!me?.is_admin) throw new Error("관리자 권한 필요");

  const parsed = schema.parse({
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

  const { error } = await supabase.from("resources").insert({
    title: parsed.title,
    description: parsed.description || null,
    category_id: parsed.category_id || null,
    resource_type: parsed.resource_type,
    file_url: parsed.file_url || null,
    external_url: parsed.external_url || null,
    thumbnail_url: parsed.thumbnail_url || null,
    target_roles: parsed.target_roles.length ? parsed.target_roles : null,
    is_published: parsed.is_published,
  });
  if (error) {
    console.error("[createResource]", error);
    throw new Error("자료 등록에 실패했습니다.");
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  redirect("/admin/resources");
}
