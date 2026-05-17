import { CategoryTabs } from "@/components/category-tabs";
import { PostCard } from "@/components/cards/post-card";
import { Input } from "@/components/ui/input";
import { getCategories, getPosts } from "@/lib/queries";

export const revalidate = 60;

export const metadata = {
  title: "실무 콘텐츠",
  description:
    "브랜드 운영, 생산 실무, 원단 실무, 작업지시서, 원가 계산, 정부지원사업까지.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const [categories, posts] = await Promise.all([
    getCategories("article"),
    getPosts({
      type: "article",
      categorySlug: searchParams.category,
      limit: 30,
    }),
  ]);
  const query = (searchParams.q ?? "").trim().toLowerCase();
  const filteredPosts = query
    ? posts.filter((post) => {
        const haystack =
          `${post.title} ${post.excerpt ?? ""} ${post.content ?? ""} ${post.category?.name ?? ""}`.toLowerCase();
        return haystack.includes(query);
      })
    : posts;

  return (
    <div className="container py-10">
      <header className="mb-6 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          ARTICLES
        </p>
        <h1 className="text-2xl md:text-3xl font-bold">실무 콘텐츠</h1>
        <p className="text-sm text-muted-foreground">
          현장에서 바로 적용 가능한 패션 브랜드 실무 가이드.
        </p>
      </header>
      <div className="mb-6">
        <CategoryTabs
          basePath="/articles"
          categories={categories}
          activeSlug={searchParams.category}
        />
      </div>
      <form action="/articles" className="mb-6 flex gap-2">
        {searchParams.category ? (
          <input type="hidden" name="category" value={searchParams.category} />
        ) : null}
        <Input
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder="실무 콘텐츠 검색"
          className="max-w-md"
        />
      </form>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground py-10 text-center">
            아직 등록된 실무 콘텐츠가 없어요.
          </p>
        ) : (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
