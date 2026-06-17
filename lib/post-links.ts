import type { PostListItem } from "@/lib/queries";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return UUID_RE.test(value);
}

/** 게시글 상세 경로 (slug 우선, 없으면 id) */
export function getPostHref(post: Pick<PostListItem, "id" | "slug" | "type">) {
  if (post.type === "article") {
    return `/articles/${post.slug ?? post.id}`;
  }
  if (post.type === "news") {
    return `/news/${post.slug ?? post.id}`;
  }
  if (post.type === "question") {
    return `/community/questions/${post.id}`;
  }
  if (post.type === "feedback") {
    return `/community/feedback`;
  }
  if (post.type === "networking") {
    return `/community/networking`;
  }
  return `/community/${post.type}s/${post.id}`;
}
