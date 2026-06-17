import { CategoryTabs } from "@/components/category-tabs";
import { PageBody, PageHero } from "@/components/layout/page-shell";
import { PostSearchList } from "@/components/lists/post-search-list";
import { getCategories, getPosts } from "@/lib/queries";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = createPageMetadata({
  title: "실무 콘텐츠",
  description:
    "브랜드 운영, 생산 실무, 원단·봉제, 작업지시서, 원가 계산, 정부지원사업까지. 패션 브랜드 현장에서 바로 쓰는 가이드.",
  path: "/articles",
});

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [categories, posts] = await Promise.all([
    getCategories("article"),
    getPosts({
      type: "article",
      categorySlug: searchParams.category,
      limit: 30,
    }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="ARTICLES"
        title={"현장에서 바로 쓰는\n패션 브랜드 실무 가이드"}
        description="브랜드 운영, 생산, 원단·봉제, 작업지시서, 원가 계산까지 — 실무자가 직접 정리한 콘텐츠입니다."
      />
      <PageBody>
        <CategoryTabs
          basePath="/articles"
          categories={categories}
          activeSlug={searchParams.category}
        />
        <PostSearchList
          posts={posts}
          variant="article"
          placeholder="실무 콘텐츠 검색"
          emptyMessage="아직 등록된 실무 콘텐츠가 없어요."
          className="mb-2"
        />
      </PageBody>
    </>
  );
}
