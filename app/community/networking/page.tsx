import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/category-tabs";
import { PageBody, PageHero } from "@/components/layout/page-shell";
import { PostSearchList } from "@/components/lists/post-search-list";
import { getCategories, getPosts } from "@/lib/queries";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "네트워킹 게시판",
  description: "패션 브랜드 실무자·디자이너·공장 네트워킹 게시판.",
  path: "/community/networking",
});

export const revalidate = 60;

export default async function NetworkingPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [categories, posts] = await Promise.all([
    getCategories("networking"),
    getPosts({
      type: "networking",
      categorySlug: searchParams.category,
      limit: 40,
      pinnedFirst: true,
    }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="NETWORKING"
        title={"디자이너·패턴사·공장,\n함께 일할 사람 찾기"}
        description="브랜드를 함께 만들 동료, 협업 파트너, 공장·패턴사를 찾는 네트워킹 게시판입니다."
        align="left"
        action={
          <Button asChild variant="accent" className="hidden sm:inline-flex">
            <Link href="/community/networking/new">
              <Plus className="h-4 w-4" /> 글 작성
            </Link>
          </Button>
        }
      />
      <PageBody>
        <CategoryTabs
          basePath="/community/networking"
          categories={categories}
          activeSlug={searchParams.category}
        />
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            아직 등록된 글이 없어요.{" "}
            <Link
              href="/community/networking/new"
              className="font-semibold text-foreground underline underline-offset-2 hover:text-accent"
            >
              첫 글 작성하기
            </Link>
          </p>
        ) : (
          <PostSearchList
            posts={posts}
            variant="article"
            placeholder="네트워킹 게시판 검색"
            emptyMessage="검색 결과가 없습니다."
            className="mb-2"
            listClassName="grid gap-3"
          />
        )}
        <div className="sm:hidden">
          <Button asChild className="w-full" variant="accent">
            <Link href="/community/networking/new">
              <Plus className="h-4 w-4" /> 글 작성
            </Link>
          </Button>
        </div>
      </PageBody>
    </>
  );
}
