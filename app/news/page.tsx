import Link from "next/link";
import { getExternalFashionNews } from "@/lib/external-fashion-news";
import { Input } from "@/components/ui/input";

export const revalidate = 60;

export const metadata = {
  title: "패션 업계 뉴스",
  description:
    "디자인 업계, 원단, 생산 시장, 브랜드 트렌드, AI/패션테크 뉴스를 한 곳에서.",
};

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
const PAGE_ROWS = 5;
const PAGE_COLUMNS = 4;
const PAGE_SIZE = PAGE_ROWS * PAGE_COLUMNS;

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

export default async function NewsPage({
  searchParams,
}: {
  searchParams?: { category?: string; page?: string; q?: string };
}) {
  const articles = await getExternalFashionNews(120);

  const selectedCategory = (searchParams?.category ?? "all") as CategorySlug;
  const query = (searchParams?.q ?? "").trim();
  const normalizedQuery = query.toLowerCase();
  const page = Math.max(1, Number(searchParams?.page ?? "1") || 1);
  const articlesWithMeta = articles.map((article) => ({
    ...article,
    ...classifyArticle(article.title, article.summary),
  }));
  const filteredArticles =
    selectedCategory === "all"
      ? articlesWithMeta
      : articlesWithMeta.filter((article) => article.category === selectedCategory);
  const searchedArticles = normalizedQuery
    ? filteredArticles.filter((article) => {
        const haystack = `${article.title} ${article.summary} ${article.source} ${article.tags.join(" ")}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : filteredArticles;
  const totalPages = Math.max(1, Math.ceil(searchedArticles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedArticles = searchedArticles.slice(startIndex, startIndex + PAGE_SIZE);

  const categoryCounts = CATEGORY_OPTIONS.reduce<Record<string, number>>((acc, option) => {
    acc[option.slug] =
      option.slug === "all"
        ? articlesWithMeta.length
        : articlesWithMeta.filter((article) => article.category === option.slug).length;
    return acc;
  }, {});

  return (
    <div className="container py-8 space-y-5">
      <div className="grid gap-8 xl:grid-cols-[240px,minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <section className="p-1">
            <ul className="space-y-3 text-[15px] text-foreground/90">
              {CATEGORY_OPTIONS.map((option) => {
                const active = selectedCategory === option.slug;
                return (
                  <li key={option.slug}>
                    <Link
                      href={buildCategoryHref(option.slug, query)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
                        active
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      {option.label}
                      <span className="text-xs text-muted-foreground">
                        {categoryCounts[option.slug]}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>

        <section className="space-y-4">
          <form action="/news" className="flex gap-2">
            {selectedCategory !== "all" ? (
              <input type="hidden" name="category" value={selectedCategory} />
            ) : null}
            <Input
              name="q"
              defaultValue={query}
              placeholder="뉴스 제목/요약/출처 검색"
              className="max-w-md"
            />
          </form>
          {pagedArticles.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center border rounded-xl">
              지금은 불러온 뉴스가 없습니다. 잠시 후 다시 시도해주세요.
            </p>
          ) : (
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pagedArticles.map((article) => (
                <article key={article.id} className="space-y-3">
                  <Link
                    href={article.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl overflow-hidden bg-card hover:shadow-sm transition"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.thumbnailUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                  <div className="space-y-1.5 px-0.5">
                    <p className="text-[11px] text-muted-foreground">
                      {article.source} · {article.publishedAt}
                    </p>
                    <Link
                      href={article.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block hover:underline"
                    >
                      <h2 className="line-clamp-2 text-[18px] md:text-[19px] font-black tracking-tight leading-[1.3]">
                        {article.title}
                      </h2>
                    </Link>
                    <p className="line-clamp-1 text-[13px] text-muted-foreground leading-[1.4]">
                      {article.summary}
                    </p>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 pt-0.5">
                      {article.tags.map((tag) => (
                        <Link
                          key={`${article.id}-${tag}`}
                          href={`/news?category=${article.category}`}
                          className="text-xs font-medium text-[#277CFA] hover:underline"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <nav className="flex items-center justify-center gap-1.5 pt-2">
              {currentPage > 1 ? (
                <Link
                  href={buildPageHref(selectedCategory, currentPage - 1, query)}
                  className="rounded-md border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  이전
                </Link>
              ) : null}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={buildPageHref(selectedCategory, pageNum, query)}
                  className={
                    pageNum === currentPage
                      ? "rounded-md bg-primary/10 px-2.5 py-1.5 text-sm font-semibold text-primary"
                      : "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                  }
                >
                  {pageNum}
                </Link>
              ))}

              {currentPage < totalPages ? (
                <Link
                  href={buildPageHref(selectedCategory, currentPage + 1, query)}
                  className="rounded-md border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  다음
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function buildCategoryHref(category: CategorySlug, query: string) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (query) params.set("q", query);
  const search = params.toString();
  return search ? `/news?${search}` : "/news";
}

function buildPageHref(category: CategorySlug, page: number, query: string) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/news?${search}` : "/news";
}
