import "server-only";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export interface NewsAdItem {
  id: string;
  title: string;
  subtitle: string | null;
  link_url: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export async function getActiveNewsAds(limit = 5): Promise<NewsAdItem[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("news_ads")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("[getActiveNewsAds]", error);
      return [];
    }
    return (data as NewsAdItem[]) ?? [];
  } catch (error) {
    console.warn("[getActiveNewsAds]", error);
    return [];
  }
}
