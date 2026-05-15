import "server-only";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import type {
  Category,
  CategoryType,
  Post,
  PostType,
  Resource,
} from "@/lib/database.types";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasSupabaseEnv()) return fallback;
  try {
    return await fn();
  } catch (error) {
    console.warn("[supabase query]", error);
    return fallback;
  }
}

export async function getCategories(type?: CategoryType): Promise<Category[]> {
  return safe(async () => {
    const supabase = createClient();
    let query = supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (type) query = query.eq("type", type);
    const { data, error } = await query;
    if (error) {
      console.error("[getCategories]", error);
      return [];
    }
    return (data as Category[]) ?? [];
  }, []);
}

export interface PostListItem extends Post {
  category?: Pick<Category, "id" | "name" | "slug"> | null;
  author?: { user_id: string; nickname: string; avatar_url: string | null } | null;
}

export async function getPosts(options: {
  type?: PostType;
  categorySlug?: string;
  limit?: number;
  pinnedFirst?: boolean;
}): Promise<PostListItem[]> {
  return safe(async () => {
    const supabase = createClient();
    let query = supabase
      .from("posts")
      .select(
        "*, category:categories(id, name, slug), author:profiles!posts_author_id_fkey(user_id, nickname, avatar_url)",
      )
      .eq("status", "published");
    if (options.type) query = query.eq("type", options.type);
    if (options.categorySlug) {
      const { data: cats } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", options.categorySlug)
        .maybeSingle();
      if (cats?.id) query = query.eq("category_id", cats.id);
    }
    if (options.pinnedFirst) {
      query = query.order("is_pinned", { ascending: false });
    }
    query = query
      .order("created_at", { ascending: false })
      .limit(options.limit ?? 20);
    const { data, error } = await query;
    if (error) {
      console.error("[getPosts]", error);
      return [];
    }
    return (data as unknown as PostListItem[]) ?? [];
  }, []);
}

export async function getPostBySlugOrId(
  identifier: string,
): Promise<PostListItem | null> {
  return safe(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, category:categories(id, name, slug), author:profiles!posts_author_id_fkey(user_id, nickname, avatar_url, role_type, is_verified_expert)",
      )
      .or(`slug.eq.${identifier},id.eq.${identifier}`)
      .eq("status", "published")
      .maybeSingle();
    if (error) {
      console.error("[getPostBySlugOrId]", error);
      return null;
    }
    return (data as unknown as PostListItem) ?? null;
  }, null);
}

export async function getResources(options: {
  categorySlug?: string;
  limit?: number;
}): Promise<Resource[]> {
  return safe(async () => {
    const supabase = createClient();
    let query = supabase
      .from("resources")
      .select("*")
      .eq("is_published", true);
    if (options.categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", options.categorySlug)
        .maybeSingle();
      if (cat?.id) query = query.eq("category_id", cat.id);
    }
    query = query
      .order("created_at", { ascending: false })
      .limit(options.limit ?? 20);
    const { data, error } = await query;
    if (error) {
      console.error("[getResources]", error);
      return [];
    }
    return (data as Resource[]) ?? [];
  }, []);
}

export async function getResourceById(id: string): Promise<Resource | null> {
  return safe(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();
    if (error) {
      console.error("[getResourceById]", error);
      return null;
    }
    return (data as Resource) ?? null;
  }, null);
}
