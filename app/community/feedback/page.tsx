import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/category-tabs";
import { PageBody, PageHero } from "@/components/layout/page-shell";
import { PostSearchList } from "@/components/lists/post-search-list";
import { getCategories, getPosts } from "@/lib/queries";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "피드백 게시판",
  description: "패션 브랜드 실무자들의 작품·아이디어 피드백 게시판.",
  path: "/community/feedback",
});

export const revalidate = 60;

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [categories, posts] = await Promise.all([
    getCategories("feedback"),
    getPosts({
      type: "feedback",
      categorySlug: searchParams.category,
      limit: 40,
      pinnedFirst: true,
    }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="FEEDBACK BOARD"
        title={"작업지시서·디자인·샘플,\n피드백 받아보세요"}
        description="작업지시서·디자인·샘플·상세페이지에 대한 실무자 피드백을 받을 수 있는 게시판입니다."
        align="left"
        action={
          <Button asChild variant="accent" className="hidden sm:inline-flex">
            <Link href="/community/feedback/new">
              <Plus className="h-4 w-4" /> 글 작성
            </Link>
          </Button>
        }
      />
      <PageBody>
        <CategoryTabs
          basePath="/community/feedback"
          categories={categories}
          activeSlug={searchParams.category}
        />
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            아직 등록된 글이 없어요.{" "}
            <Link
              href="/community/feedback/new"
              className="font-semibold text-foreground underline underline-offset-2 hover:text-accent"
            >
              첫 글 작성하기
            </Link>
          </p>
        ) : (
          <PostSearchList
            posts={posts}
            variant="article"
            placeholder="피드백 게시판 검색"
            emptyMessage="검색 결과가 없습니다."
            className="mb-2"
            listClassName="grid gap-3"
          />
        )}
        <div className="sm:hidden">
          <Button asChild className="w-full" variant="accent">
            <Link href="/community/feedback/new">
              <Plus className="h-4 w-4" /> 글 작성
            </Link>
          </Button>
        </div>
      </PageBody>
    </>
  );
}
