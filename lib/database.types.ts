export type RoleType =
  | "designer"
  | "pattern_maker"
  | "factory"
  | "brand"
  | "general";

export type PostType =
  | "question"
  | "feedback"
  | "networking"
  | "article"
  | "news";

export type PostStatus = "draft" | "published" | "hidden" | "deleted";
export type PostVisibility = "public" | "members_only" | "private";

export type ResourceFileType =
  | "pdf"
  | "excel"
  | "notion"
  | "figma"
  | "link"
  | "faddit_template";

export type CategoryType =
  | "news"
  | "article"
  | "question"
  | "feedback"
  | "networking"
  | "resource";

export type BookmarkTarget = "post" | "resource";
export type LikeTarget = "post" | "comment";
export type ReportTarget = "post" | "comment" | "user";

export interface Profile {
  id: string;
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  role_type: RoleType;
  bio: string | null;
  interests: string[] | null;
  region: string | null;
  website_url: string | null;
  is_onboarded: boolean;
  is_verified_expert: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  type: CategoryType;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

export interface Post {
  id: string;
  author_id: string | null;
  type: PostType;
  category_id: string | null;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  status: PostStatus;
  visibility: PostVisibility;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  slug: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  resource_type: ResourceFileType;
  file_url: string | null;
  external_url: string | null;
  thumbnail_url: string | null;
  target_roles: RoleType[] | null;
  download_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BootcampApplication {
  id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string;
  role_type: RoleType;
  brand_stage: string | null;
  pain_point: string | null;
  privacy_agreed: boolean;
  status: "pending" | "contacted" | "accepted" | "rejected";
  created_at: string;
}
