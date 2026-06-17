import Link from "next/link";
import { Eye, MessageCircle, ThumbsUp, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PastelChip } from "@/components/ui/pastel-chip";
import { CONTENT_CARD_CLASS } from "@/lib/chip-colors";
import { getPostHref } from "@/lib/post-links";
import { formatNumber, formatRelativeTime, truncate } from "@/lib/utils";
import type { PostListItem } from "@/lib/queries";
import { POST_TYPE_LABEL } from "@/lib/constants";

interface Props {
  post: PostListItem;
  hrefBuilder?: (post: PostListItem) => string;
}

export function PostCard({ post, hrefBuilder }: Props) {
  const href = hrefBuilder?.(post) ?? getPostHref(post);

  return (
    <Link href={href} className={CONTENT_CARD_CLASS}>
      <div className="flex items-center gap-2 mb-2">
        {post.is_pinned ? (
          <Badge variant="accent" className="gap-1">
            <Pin className="h-3 w-3" /> 고정
          </Badge>
        ) : null}
        {post.category?.name ? (
          <PastelChip label={post.category.name} />
        ) : (
          <PastelChip label={POST_TYPE_LABEL[post.type]} />
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {formatRelativeTime(post.created_at)}
        </span>
      </div>
      <h3 className="font-semibold text-[15px] md:text-base leading-[1.3]">
        {post.title}
      </h3>
      {post.excerpt ? (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {truncate(post.excerpt, 130)}
        </p>
      ) : null}
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        {post.author?.nickname ? (
          <span className="font-medium text-foreground/80">
            {post.author.nickname}
          </span>
        ) : (
          <span>FACKLESS</span>
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
