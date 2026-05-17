import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { NewsThumbnail } from "@/components/news/news-thumbnail";
import { getExternalFashionNews } from "@/lib/external-fashion-news";

export async function HomeNews() {
  const articles = await getExternalFashionNews(4);

  return (
    <section>
      <SectionHeading
        title="패션 업계 뉴스"
        description="브랜드·생산·패션테크 소식을 큐레이션해 전해드립니다"
        moreHref="/news"
      />
      {articles.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10 border border-dashed rounded-xl">
          지금은 불러온 뉴스가 없습니다.{" "}
          <Link href="/news" className="font-semibold text-primary hover:underline">
            뉴스 페이지에서 확인하기
          </Link>
        </p>
      ) : (
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article, index) => (
            <article key={article.id} className="space-y-3">
              <Link
                href={article.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-xl overflow-hidden bg-card border hover:shadow-sm transition"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <NewsThumbnail
                    src={article.thumbnailUrl}
                    alt={article.title}
                    priority={index < 2}
                  />
                </div>
              </Link>
              <div className="space-y-1 px-0.5">
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {article.source}
                </p>
                <Link
                  href={article.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:underline"
                >
                  <h3 className="line-clamp-2 text-[15px] font-bold tracking-tight leading-snug">
                    {article.title}
                  </h3>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
