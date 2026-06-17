"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ensureAdmin } from "@/lib/admin-auth";

const createSchema = z.object({
  title: z.string().min(2).max(80),
  subtitle: z.string().max(200).optional().or(z.literal("")),
  link_url: z.string().url(),
  image_url: z.string().url(),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  is_active: z.boolean().default(true),
});

export async function createNewsAd(formData: FormData) {
  const { supabase } = await ensureAdmin();

  const { count } = await supabase
    .from("news_ads")
    .select("id", { count: "exact", head: true });
  if ((count ?? 0) >= 5) {
    throw new Error("광고는 최대 5개까지 등록할 수 있습니다.");
  }

  const parsed = createSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") ?? "",
    link_url: formData.get("link_url"),
    image_url: formData.get("image_url"),
    sort_order: formData.get("sort_order") ?? 0,
    is_active: formData.get("is_active") === "true",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
  }

  const { error } = await supabase.from("news_ads").insert({
    title: parsed.data.title,
    subtitle: parsed.data.subtitle || null,
    link_url: parsed.data.link_url,
    image_url: parsed.data.image_url,
    sort_order: parsed.data.sort_order,
    is_active: parsed.data.is_active,
  });

  if (error) {
    console.error("[createNewsAd]", error);
    throw new Error("광고 등록에 실패했습니다.");
  }

  revalidatePath("/admin/news-ads");
  revalidatePath("/news");
}

export async function updateNewsAd(formData: FormData) {
  const { supabase } = await ensureAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const parsed = createSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") ?? "",
    link_url: formData.get("link_url"),
    image_url: formData.get("image_url"),
    sort_order: formData.get("sort_order") ?? 0,
    is_active: formData.get("is_active") === "true",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
  }

  const { error } = await supabase
    .from("news_ads")
    .update({
      title: parsed.data.title,
      subtitle: parsed.data.subtitle || null,
      link_url: parsed.data.link_url,
      image_url: parsed.data.image_url,
      sort_order: parsed.data.sort_order,
      is_active: parsed.data.is_active,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateNewsAd]", error);
    throw new Error("광고 수정에 실패했습니다.");
  }

  revalidatePath("/admin/news-ads");
  revalidatePath("/news");
}

export async function deleteNewsAd(formData: FormData) {
  const { supabase } = await ensureAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await supabase.from("news_ads").delete().eq("id", id);
  if (error) {
    console.error("[deleteNewsAd]", error);
    throw new Error("광고 삭제에 실패했습니다.");
  }

  revalidatePath("/admin/news-ads");
  revalidatePath("/news");
}
