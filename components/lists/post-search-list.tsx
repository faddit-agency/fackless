"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/cards/post-card";
import { LiveSearchInput } from "@/components/live-search-input";
import type { PostListItem } from "@/lib/queries";

type PostSearchVariant = "article" | "question";

interface PostSearchListProps {
  posts: PostListItem[];
  variant: PostSearchVariant;
  placeholder: string;
  emptyMessage: string;
  className?: string;
  listClassName?: string;
}

function postHaystack(post: PostListItem) {
  return `${post.title} ${post.excerpt ?? ""} ${post.category?.name ?? ""}`;
}

export function PostSearchList({
  posts,
  variant,
  placeholder,
  emptyMessage,
  className,
  listClassName = "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
}: PostSearchListProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts;
    return posts.filter((post) =>
      postHaystack(post).toLowerCase().includes(normalizedQuery),
    );
  }, [posts, normalizedQuery]);

  return (
    <>
      <LiveSearchInput
        mode="local"
        onQueryChange={setQuery}
        placeholder={placeholder}
        className={className}
      />
      <div className={listClassName}>
        {filteredPosts.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground py-10 text-center">
            {normalizedQuery ? "검색 결과가 없습니다." : emptyMessage}
          </p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              hrefBuilder={
                variant === "question"
                  ? (p) => `/community/questions/${p.id}`
                  : undefined
              }
            />
          ))
        )}
      </div>
    </>
  );
}
