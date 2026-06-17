import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-shell";
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

export default function NewsPage() {
  return (
    <>
      <WarmNewsCacheTrigger />
      <PageHero
        eyebrow="FASHION NEWS"
        title={"K패션·리테일·패션테크\n업계 소식"}
        description="브랜드, 생산, 유통, 스타트업 뉴스를 큐레이션해 전해드립니다."
      />
      <section className="section-surface-soft">
        <div className="container py-10 md:py-14 pb-16 md:pb-20">
          <Suspense fallback={<NewsPageSkeleton />}>
            <NewsPageContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}
