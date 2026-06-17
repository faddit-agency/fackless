import {
  getExternalFashionNews,
  FASHION_NEWS_TOTAL_COUNT,
} from "@/lib/external-fashion-news";
import { NEWS_CATEGORY_OPTIONS } from "@/lib/news-classify";
import { NewsFeed } from "@/components/news/news-feed";

export async function NewsPageContent() {
  const articles = await getExternalFashionNews(FASHION_NEWS_TOTAL_COUNT);

  return (
    <NewsFeed
      articles={articles}
      categoryOptions={NEWS_CATEGORY_OPTIONS.map((o) => ({
        slug: o.slug,
        label: o.label,
      }))}
    />
  );
}
