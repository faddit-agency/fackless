import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/category-tabs";
import { PageBody, PageHero } from "@/components/layout/page-shell";
import { PostSearchList } from "@/components/lists/post-search-list";
import { getCategories, getPosts } from "@/lib/queries";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = createPageMetadata({
  title: "질문 게시판",
  description:
    "원단, 공장, 작업지시서, 원가, 브랜딩 등 패션 브랜드 실무 질문에 답을 받아보세요.",
  path: "/community/questions",
});

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: { category?: string };
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

  return (
    <>
      <PageHero
        eyebrow="Q&A"
        title={"생산·원가·브랜딩,\n무엇이든 물어보세요"}
        description="원단, 공장, 작업지시서, 원가, 브랜딩 — 패션 브랜드 실무자들이 함께 답합니다."
        align="left"
        action={
          <Button asChild variant="accent" className="hidden sm:inline-flex">
            <Link href="/community/questions/new">
              <Plus className="h-4 w-4" /> 질문 작성
            </Link>
          </Button>
        }
      />
      <section className="section-surface-soft">
        <PageBody>
          <CategoryTabs
          basePath="/community/questions"
          categories={categories}
          activeSlug={searchParams.category}
        />
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            아직 등록된 질문이 없어요.{" "}
            <Link
              href="/community/questions/new"
              className="font-semibold text-foreground underline underline-offset-2 hover:text-accent"
            >
              첫 질문 작성하기
            </Link>
          </p>
        ) : (
          <PostSearchList
            posts={posts}
            variant="question"
            placeholder="질문 게시판 검색"
            emptyMessage="검색 결과가 없습니다."
            className="mb-2"
            listClassName="grid gap-3"
          />
        )}
        <div className="sm:hidden">
          <Button asChild className="w-full" variant="accent">
            <Link href="/community/questions/new">
              <Plus className="h-4 w-4" /> 질문 작성
            </Link>
          </Button>
        </div>
        </PageBody>
      </section>
    </>
  );
}
