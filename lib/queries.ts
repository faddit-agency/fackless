import "server-only";
import { unstable_cache } from "next/cache";
import {
  createClient,
  createPublicClient,
  hasSupabaseEnv,
} from "@/lib/supabase/server";
import type {
  Category,
  CategoryType,
  Post,
  PostType,
  Resource,
} from "@/lib/database.types";

const POST_LIST_COLUMNS =
  "id, slug, title, excerpt, type, status, created_at, view_count, comment_count, like_count, is_pinned, category_id, author_id";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasSupabaseEnv()) return fallback;
  try {
    return await fn();
  } catch (error) {
    console.warn("[supabase query]", error);
    return fallback;
  }
}

async function fetchCategories(type?: CategoryType): Promise<Category[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("categories")
    .select("id, name, slug, type, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (type) query = query.eq("type", type);
  const { data, error } = await query;
  if (error) {
    console.error("[getCategories]", error);
    return [];
  }
  return (data as Category[]) ?? [];
}

export async function getCategories(type?: CategoryType): Promise<Category[]> {
  return safe(
    () =>
      unstable_cache(
        () => fetchCategories(type),
        ["categories", type ?? "all"],
        { revalidate: 300, tags: ["categories"] },
      )(),
    [],
  );
}

export interface PostListItem extends Post {
  category?: Pick<Category, "id" | "name" | "slug"> | null;
  author?: { user_id: string; nickname: string; avatar_url: string | null } | null;
}

async function fetchPosts(options: {
  type?: PostType;
  categorySlug?: string;
  limit?: number;
  pinnedFirst?: boolean;
}): Promise<PostListItem[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("posts")
    .select(
      `${POST_LIST_COLUMNS}, category:categories(id, name, slug), author:profiles!posts_author_id_fkey(user_id, nickname, avatar_url)`,
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
}

export async function getPosts(options: {
  type?: PostType;
  categorySlug?: string;
  limit?: number;
  pinnedFirst?: boolean;
}): Promise<PostListItem[]> {
  const cacheKey = JSON.stringify(options);
  return safe(
    () =>
      unstable_cache(
        () => fetchPosts(options),
        ["posts", cacheKey],
        { revalidate: 60, tags: ["posts"] },
      )(),
    [],
  );
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

const RESOURCE_LIST_COLUMNS =
  "id, title, description, category_id, resource_type, file_url, external_url, thumbnail_url, target_roles, is_published, download_count, created_at";

async function fetchResources(options: {
  categorySlug?: string;
  limit?: number;
}): Promise<Resource[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("resources")
    .select(RESOURCE_LIST_COLUMNS)
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
}

export async function getResources(options: {
  categorySlug?: string;
  limit?: number;
}): Promise<Resource[]> {
  const cacheKey = JSON.stringify(options);
  return safe(
    () =>
      unstable_cache(
        () => fetchResources(options),
        ["resources", cacheKey],
        { revalidate: 60, tags: ["resources"] },
      )(),
    [],
  );
}

export interface SitemapPostEntry {
  id: string;
  slug: string | null;
  type: PostType;
  updated_at: string;
}

export interface SitemapResourceEntry {
  id: string;
  updated_at: string;
}

export async function getSitemapPosts(): Promise<SitemapPostEntry[]> {
  return safe(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("id, slug, type, updated_at")
      .eq("status", "published")
      .in("type", ["article", "question"]);
    if (error) {
      console.error("[getSitemapPosts]", error);
      return [];
    }
    return (data as SitemapPostEntry[]) ?? [];
  }, []);
}

export async function getSitemapResources(): Promise<SitemapResourceEntry[]> {
  return safe(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("resources")
      .select("id, updated_at")
      .eq("is_published", true);
    if (error) {
      console.error("[getSitemapResources]", error);
      return [];
    }
    return (data as SitemapResourceEntry[]) ?? [];
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
