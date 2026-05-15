import { CategoryTabs } from "@/components/category-tabs";
import { PostCard } from "@/components/cards/post-card";
import { getCategories, getPosts } from "@/lib/queries";

export const revalidate = 60;

export const metadata = {
  title: "패션 업계 뉴스",
  description:
    "디자인 업계, 원단, 생산 시장, 브랜드 트렌드, AI/패션테크 뉴스를 한 곳에서.",
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [categories, posts] = await Promise.all([
    getCategories("news"),
    getPosts({
      type: "news",
      categorySlug: searchParams.category,
      limit: 30,
    }),
  ]);

  return (
    <div className="container py-10">
      <header className="mb-6 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          NEWS
        </p>
        <h1 className="text-2xl md:text-3xl font-bold">패션 업계 뉴스</h1>
        <p className="text-sm text-muted-foreground">
          브랜드 운영자에게 꼭 필요한 업계 뉴스만 큐레이션합니다.
        </p>
      </header>
      <div className="mb-6">
        <CategoryTabs
          basePath="/news"
          categories={categories}
          activeSlug={searchParams.category}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground py-10 text-center">
            아직 등록된 뉴스가 없어요.
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
