import { Suspense } from "react";
import { NewsPageContent } from "@/components/news/news-page-content";
import { NewsPageSkeleton } from "@/components/news/news-page-skeleton";
import { WarmNewsCacheTrigger } from "@/components/news/warm-news-cache";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 1800;

export const metadata = createPageMetadata({
  title: "패션 업계 뉴스",
  description:
    "디자인 업계, 원단, 생산 시장, 브랜드 트렌드, AI·패션테크 뉴스를 한곳에서. K패션·리테일·스타트업 소식을 큐레이션합니다.",
  path: "/news",
});

export default function NewsPage({
  searchParams,
}: {
  searchParams?: { category?: string; page?: string };
}) {
  return (
    <div className="container py-8 space-y-5">
      <WarmNewsCacheTrigger />
      <Suspense
        key={`${searchParams?.category ?? "all"}-${searchParams?.page ?? "1"}`}
        fallback={<NewsPageSkeleton />}
      >
        <NewsPageContent
          category={searchParams?.category}
          page={searchParams?.page}
        />
      </Suspense>
    </div>
  );
}
