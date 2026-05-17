import { PostCard } from "@/components/cards/post-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { HomeNews } from "@/components/home/home-news";
import { SectionHeading } from "@/components/section-heading";
import { getPosts, getResources } from "@/lib/queries";

export async function HomeFeeds() {
  const [articles, questions, resources] = await Promise.all([
    getPosts({ type: "article", limit: 4 }),
    getPosts({ type: "question", limit: 5 }),
    getResources({ limit: 4 }),
  ]);

  return (
    <>
      <section>
        <SectionHeading
          title="오늘의 실무 콘텐츠"
          description="브랜드 운영부터 생산 실무까지, 현장에서 바로 쓰는 인사이트"
          moreHref="/articles"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {articles.length === 0 ? (
            <EmptyHint message="첫 번째 실무 콘텐츠를 곧 만나보실 수 있어요." />
          ) : (
            articles.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </section>

      <section>
        <SectionHeading
          title="지금 많이 묻는 질문"
          description="브랜드 운영자들이 가장 많이 묻고 있는 실무 질문"
          moreHref="/community/questions"
        />
        <div className="grid gap-3 lg:grid-cols-2">
          {questions.length === 0 ? (
            <EmptyHint message="질문을 등록해 패클스 첫 게시글의 주인공이 되어보세요." />
          ) : (
            questions.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </section>

      <HomeNews />

      <section>
        <SectionHeading
          title="무료 자료실"
          description="작업지시서·원가계산·체크리스트 등 실무 템플릿 무료 다운로드"
          moreHref="/resources"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {resources.length === 0 ? (
            <EmptyHint message="곧 무료 자료가 업로드됩니다." />
          ) : (
            resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          )}
        </div>
      </section>
    </>
  );
}

function EmptyHint({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground text-center md:col-span-2 xl:col-span-4 lg:col-span-2">
      {message}
    </div>
  );
}
