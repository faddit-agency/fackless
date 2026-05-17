import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/category-tabs";
import { PostCard } from "@/components/cards/post-card";
import { LiveSearchInput } from "@/components/live-search-input";
import { getCategories, getPosts } from "@/lib/queries";

export const revalidate = 60;

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "질문 게시판",
  description:
    "원단, 공장, 작업지시서, 원가, 브랜딩 등 패션 브랜드 실무 질문에 답을 받아보세요.",
  path: "/community/questions",
});

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const [categories, posts] = await Promise.all([
    getCategories("question"),
    getPosts({
      type: "question",
      categorySlug: searchParams.category,
      limit: 40,
      pinnedFirst: true,
    }),
  ]);
  const query = (searchParams.q ?? "").trim().toLowerCase();
  const filteredPosts = query
    ? posts.filter((post) => {
        const haystack =
          `${post.title} ${post.excerpt ?? ""} ${post.category?.name ?? ""}`.toLowerCase();
        return haystack.includes(query);
      })
    : posts;

  return (
    <div className="container py-10">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Q&A
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">질문 게시판</h1>
          <p className="text-sm text-muted-foreground">
            생산, 원단, 공장, 브랜딩, 작업지시서, 원가 — 무엇이든 물어보세요.
          </p>
        </div>
        <Button asChild variant="accent" className="hidden sm:inline-flex">
          <Link href="/community/questions/new">
            <Plus className="h-4 w-4" /> 질문 작성
          </Link>
        </Button>
      </header>
      <div className="mb-6">
        <CategoryTabs
          basePath="/community/questions"
          categories={categories}
          activeSlug={searchParams.category}
        />
      </div>
      <LiveSearchInput
        initialValue={searchParams.q ?? ""}
        placeholder="질문 게시판 검색"
        className="mb-6"
      />
      <div className="grid gap-3">
        {filteredPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            아직 등록된 질문이 없어요.{" "}
            <Link
              href="/community/questions/new"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              첫 질문 작성하기
            </Link>
          </p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              hrefBuilder={(p) => `/community/questions/${p.id}`}
            />
          ))
        )}
      </div>
      <div className="mt-8 sm:hidden">
        <Button asChild className="w-full" variant="accent">
          <Link href="/community/questions/new">
            <Plus className="h-4 w-4" /> 질문 작성
          </Link>
        </Button>
      </div>
    </div>
  );
}
