"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LiveSearchInput } from "@/components/live-search-input";
import { NewsThumbnail } from "@/components/news/news-thumbnail";
import type { ExternalFashionNewsItem } from "@/lib/external-fashion-news";

const PAGE_ROWS = 5;
const PAGE_COLUMNS = 4;
const PAGE_SIZE = PAGE_ROWS * PAGE_COLUMNS;

export type NewsArticleMeta = ExternalFashionNewsItem & {
  category: string;
  tags: string[];
};

interface NewsFeedProps {
  articles: NewsArticleMeta[];
  categoryOptions: { slug: string; label: string }[];
  initialCategory: string;
  initialPage: number;
}

export function NewsFeed({
  articles,
  categoryOptions,
  initialCategory,
  initialPage,
}: NewsFeedProps) {
  const [query, setQuery] = useState("");
  const selectedCategory = initialCategory;
  const page = initialPage;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredArticles = useMemo(() => {
    const byCategory =
      selectedCategory === "all"
        ? articles
        : articles.filter((article) => article.category === selectedCategory);
    if (!normalizedQuery) return byCategory;
    return byCategory.filter((article) => {
      const haystack =
        `${article.title} ${article.summary} ${article.source} ${article.tags.join(" ")}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [articles, selectedCategory, normalizedQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedArticles = filteredArticles.slice(startIndex, startIndex + PAGE_SIZE);

  const categoryCounts = useMemo(() => {
    return categoryOptions.reduce<Record<string, number>>((acc, option) => {
      acc[option.slug] =
        option.slug === "all"
          ? articles.length
          : articles.filter((article) => article.category === option.slug).length;
      return acc;
    }, {});
  }, [articles, categoryOptions]);

  return (
    <div className="grid gap-8 xl:grid-cols-[240px,minmax(0,1fr)]">
      <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <section className="p-1">
          <ul className="space-y-3 text-[15px] text-foreground/90">
            {categoryOptions.map((option) => {
              const active = selectedCategory === option.slug;
              return (
                <li key={option.slug}>
                  <Link
                    href={buildCategoryHref(option.slug)}
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
        <LiveSearchInput
          mode="local"
          onQueryChange={setQuery}
          placeholder="뉴스 제목/요약/출처 검색"
        />
        {pagedArticles.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center border rounded-xl">
            {normalizedQuery
              ? "검색 결과가 없습니다."
              : "지금은 불러온 뉴스가 없습니다. 잠시 후 다시 시도해주세요."}
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pagedArticles.map((article, index) => (
              <article key={article.id} className="space-y-3">
                <Link
                  href={article.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-xl overflow-hidden bg-card hover:shadow-sm transition"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <NewsThumbnail
                      src={article.thumbnailUrl}
                      alt={article.title}
                      priority={currentPage === 1 && index < 4}
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
                    <h2 className="line-clamp-2 text-[16px] md:text-[17px] font-bold tracking-tight leading-[1.3]">
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
                href={buildPageHref(selectedCategory, currentPage - 1)}
                className="rounded-md border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                이전
              </Link>
            ) : null}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={buildPageHref(selectedCategory, pageNum)}
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
                href={buildPageHref(selectedCategory, currentPage + 1)}
                className="rounded-md border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                다음
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </div>
  );
}

function buildCategoryHref(category: string) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  const search = params.toString();
  return search ? `/news?${search}` : "/news";
}

function buildPageHref(category: string, page: number) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/news?${search}` : "/news";
}