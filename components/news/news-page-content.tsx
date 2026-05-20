import {
  getExternalFashionNews,
  FASHION_NEWS_TOTAL_COUNT,
} from "@/lib/external-fashion-news";
import { NewsFeed } from "@/components/news/news-feed";

const CATEGORY_OPTIONS = [
  { slug: "all", label: "전체" },
  { slug: "trend", label: "트렌드/브랜드" },
  { slug: "business", label: "비즈니스/리테일" },
  { slug: "ai", label: "패션테크/AI" },
  { slug: "career", label: "채용/커리어" },
  { slug: "startup", label: "스타트업/투자" },
] as const;

const TAG_RULES = [
  { keyword: "ai", category: "ai", tag: "AI" },
  { keyword: "모델", category: "ai", tag: "패션테크" },
  { keyword: "테크", category: "ai", tag: "패션테크" },
  { keyword: "인공지능", category: "ai", tag: "AI" },
  { keyword: "생성", category: "ai", tag: "AI" },
  { keyword: "스타트업", category: "startup", tag: "스타트업" },
  { keyword: "투자", category: "startup", tag: "투자" },
  { keyword: "런칭", category: "startup", tag: "프로덕트 소식" },
  { keyword: "실적", category: "business", tag: "비즈니스 인사이트" },
  { keyword: "유통", category: "business", tag: "리테일" },
  { keyword: "매출", category: "business", tag: "비즈니스 인사이트" },
  { keyword: "채용", category: "career", tag: "기업가 정신" },
  { keyword: "커리어", category: "career", tag: "커리어" },
  { keyword: "브랜드", category: "trend", tag: "브랜드 인사이트" },
  { keyword: "디자인", category: "trend", tag: "디자인" },
  { keyword: "개발", category: "ai", tag: "기술" },
  { keyword: "패션", category: "trend", tag: "패션" },
] as const;

type CategorySlug = (typeof CATEGORY_OPTIONS)[number]["slug"];

function classifyArticle(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase();
  const matches = TAG_RULES.filter((rule) => text.includes(rule.keyword));
  const category = (matches[0]?.category ?? "business") as CategorySlug;
  const tags = Array.from(new Set(matches.map((match) => match.tag))).slice(0, 3);
  if (tags.length === 0) {
    tags.push("비즈니스 인사이트");
  }
  return { category, tags };
}

interface NewsPageContentProps {
  category?: string;
  page?: string;
}

export async function NewsPageContent({
  category,
  page: pageParam,
}: NewsPageContentProps) {
  const articles = await getExternalFashionNews(FASHION_NEWS_TOTAL_COUNT);
  const selectedCategory = (category ?? "all") as CategorySlug;
  const page = Math.max(1, Number(pageParam ?? "1") || 1);

  const articlesWithMeta = articles.map((article) => ({
    ...article,
    ...classifyArticle(article.title, article.summary),
  }));

  return (
    <NewsFeed
      articles={articlesWithMeta}
      categoryOptions={CATEGORY_OPTIONS.map((o) => ({
        slug: o.slug,
        label: o.label,
      }))}
      initialCategory={selectedCategory}
      initialPage={page}
    />
  );
}
