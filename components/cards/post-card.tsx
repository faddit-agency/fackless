import Link from "next/link";
import { Eye, MessageCircle, ThumbsUp, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatRelativeTime, truncate } from "@/lib/utils";
import type { PostListItem } from "@/lib/queries";
import { POST_TYPE_LABEL } from "@/lib/constants";

interface Props {
  post: PostListItem;
  hrefBuilder?: (post: PostListItem) => string;
}

export function PostCard({ post, hrefBuilder }: Props) {
  const href =
    hrefBuilder?.(post) ??
    (post.type === "article" || post.type === "news"
      ? `/${post.type === "article" ? "articles" : "news"}/${post.slug ?? post.id}`
      : `/community/${post.type}s/${post.id}`);

  return (
    <Link
      href={href}
      className="block rounded-xl border bg-card p-5 hover:border-foreground/20 hover:shadow-sm transition"
    >
      <div className="flex items-center gap-2 mb-2">
        {post.is_pinned ? (
          <Badge variant="accent" className="gap-1">
            <Pin className="h-3 w-3" /> 고정
          </Badge>
        ) : null}
        {post.category?.name ? (
          <Badge variant="soft">{post.category.name}</Badge>
        ) : (
          <Badge variant="outline">{POST_TYPE_LABEL[post.type]}</Badge>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {formatRelativeTime(post.created_at)}
        </span>
      </div>
      <h3 className="font-semibold text-[15px] md:text-base leading-snug">
        {post.title}
      </h3>
      {post.excerpt || post.content ? (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {truncate(post.excerpt ?? post.content.replace(/[#*`>]/g, ""), 130)}
        </p>
      ) : null}
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        {post.author?.nickname ? (
          <span className="font-medium text-foreground/80">
            {post.author.nickname}
          </span>
        ) : (
          <span>PACKLESS</span>
        )}
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" /> {formatNumber(post.view_count)}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" />{" "}
          {formatNumber(post.comment_count)}
        </span>
        <span className="inline-flex items-center gap-1">
          <ThumbsUp className="h-3.5 w-3.5" /> {formatNumber(post.like_count)}
        </span>
      </div>
    </Link>
  );
}
