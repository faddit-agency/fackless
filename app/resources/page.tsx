import { CategoryTabs } from "@/components/category-tabs";
import { ResourceCard } from "@/components/cards/resource-card";
import { Input } from "@/components/ui/input";
import { getCategories, getResources } from "@/lib/queries";

export const revalidate = 60;

export const metadata = {
  title: "무료 자료실",
  description:
    "작업지시서, 원가계산, 생산 체크리스트, 원단 용어집 등 무료 템플릿.",
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const [categories, resources] = await Promise.all([
    getCategories("resource"),
    getResources({ categorySlug: searchParams.category, limit: 40 }),
  ]);
  const query = (searchParams.q ?? "").trim().toLowerCase();
  const filteredResources = query
    ? resources.filter((resource) => {
        const haystack =
          `${resource.title} ${resource.description ?? ""} ${resource.resource_type}`.toLowerCase();
        return haystack.includes(query);
      })
    : resources;

  return (
    <div className="container py-10">
      <header className="mb-6 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          FREE RESOURCES
        </p>
        <h1 className="text-2xl md:text-3xl font-bold">무료 자료실</h1>
        <p className="text-sm text-muted-foreground">
          현장에서 그대로 쓸 수 있는 실무 템플릿을 무료로 받아보세요. 로그인 후
          다운로드 가능합니다.
        </p>
      </header>
      <div className="mb-6">
        <CategoryTabs
          basePath="/resources"
          categories={categories}
          activeSlug={searchParams.category}
        />
      </div>
      <form action="/resources" className="mb-6 flex gap-2">
        {searchParams.category ? (
          <input type="hidden" name="category" value={searchParams.category} />
        ) : null}
        <Input
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder="자료실 검색"
          className="max-w-md"
        />
      </form>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredResources.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground py-10 text-center">
            아직 등록된 자료가 없어요.
          </p>
        ) : (
          filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        )}
      </div>
    </div>
  );
}
