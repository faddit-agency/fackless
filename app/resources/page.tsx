import { CategoryTabs } from "@/components/category-tabs";
import { PageBody, PageHero } from "@/components/layout/page-shell";
import { ResourceSearchList } from "@/components/lists/resource-search-list";
import { getCategories, getResources } from "@/lib/queries";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = createPageMetadata({
  title: "무료 자료실",
  description:
    "작업지시서, 원가계산, 생산 체크리스트, 원단 용어집 등 패션 브랜드 실무 템플릿을 무료로 다운로드하세요.",
  path: "/resources",
});

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [categories, resources] = await Promise.all([
    getCategories("resource"),
    getResources({ categorySlug: searchParams.category, limit: 40 }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="FREE RESOURCES"
        title={"공장에 바로 보낼\n실무 템플릿 모음"}
        description="작업지시서, 원가계산, 생산 체크리스트 등 현장에서 그대로 쓰는 자료를 무료로 받아보세요."
      />
      <PageBody>
          <CategoryTabs
            basePath="/resources"
            categories={categories}
            activeSlug={searchParams.category}
          />
          <ResourceSearchList
            resources={resources}
            placeholder="자료실 검색"
            emptyMessage="아직 등록된 자료가 없어요."
            className="mb-2"
          />
      </PageBody>
    </>
  );
}
