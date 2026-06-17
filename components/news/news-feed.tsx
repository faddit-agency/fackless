"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LiveSearchInput } from "@/components/live-search-input";
import { NewsThumbnail } from "@/components/news/news-thumbnail";
import type { ExternalFashionNewsItem } from "@/lib/external-fashion-news";

/** 4열 그리드 기준: 20개 = 5행 × 4열 */
const PAGE_SIZE = 20;

interface NewsFeedProps {
  articles: ExternalFashionNewsItem[];
  categoryOptions: { slug: string; label: string }[];
}

export function NewsFeed({ articles, categoryOptions }: NewsFeedProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get("category") ?? "all",
  );
  const [page, setPage] = useState(() =>
    Math.max(1, Number(searchParams.get("page") ?? "1") || 1),
  );

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") ?? "all");
    setPage(Math.max(1, Number(searchParams.get("page") ?? "1") || 1));
  }, [searchParams]);

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

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    syncUrl(category, 1);
  };

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    syncUrl(selectedCategory, nextPage);
  };

  return (
    <div className="grid gap-10 lg:gap-14 xl:grid-cols-[260px,minmax(0,1fr)] xl:gap-16">
      <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <section className="py-1 pr-2">
          <ul className="space-y-2 text-[15px] text-foreground/90">
            {categoryOptions.map((option) => {
              const active = selectedCategory === option.slug;
              return (
                <li key={option.slug}>
                  <button
                    type="button"
                    onClick={() => selectCategory(option.slug)}
                    className={`inline-flex w-full items-center justify-between gap-3 rounded-full px-4 py-2.5 transition ${
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {option.label}
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {categoryCounts[option.slug]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </aside>

      <section className="space-y-8 min-w-0">
        <LiveSearchInput
          mode="local"
          onQueryChange={setQuery}
          placeholder="뉴스 제목/요약/출처 검색"
          className="max-w-lg"
        />
        {pagedArticles.length === 0 ? (
          <p className="text-sm text-muted-foreground py-16 text-center border rounded-2xl">
            {normalizedQuery
              ? "검색 결과가 없습니다."
              : "지금은 불러온 뉴스가 없습니다. 잠시 후 다시 시도해주세요."}
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pagedArticles.map((article, index) => (
              <article key={article.id} className="space-y-4">
                <Link
                  href={article.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-2xl overflow-hidden bg-card border border-transparent hover:border-foreground/10 hover:shadow-sm transition"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <NewsThumbnail
                      src={article.thumbnailUrl}
                      alt={article.title}
                      priority={currentPage === 1 && index < 4}
                    />
                  </div>
                </Link>
                <div className="space-y-2.5 px-1">
                  <p className="text-[11px] text-muted-foreground tracking-wide">
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
                  <p className="line-clamp-2 text-[13px] text-muted-foreground leading-[1.3]">
                    {article.summary}
                  </p>
                  <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 pt-1">
                    {article.tags.map((tag) => (
                      <button
                        key={`${article.id}-${tag}`}
                        type="button"
                        onClick={() => selectCategory(article.category)}
                        className="text-xs font-medium text-[#277CFA] hover:underline"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="flex items-center justify-center gap-2 pt-10">
            {currentPage > 1 ? (
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                className="rounded-md border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                이전
              </button>
            ) : null}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => goToPage(pageNum)}
                className={
                  pageNum === currentPage
                    ? "rounded-md bg-primary/10 px-2.5 py-1.5 text-sm font-semibold text-primary"
                    : "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                }
              >
                {pageNum}
              </button>
            ))}

            {currentPage < totalPages ? (
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                className="rounded-md border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                다음
              </button>
            ) : null}
          </nav>
        ) : null}
      </section>
    </div>
  );
}

function syncUrl(category: string, page: number) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  const nextUrl = search ? `/news?${search}` : "/news";
  window.history.replaceState(null, "", nextUrl);
}
