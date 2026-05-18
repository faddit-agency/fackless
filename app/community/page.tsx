import Link from "next/link";
import { PostCard } from "@/components/cards/post-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/queries";

export const revalidate = 60;

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "커뮤니티",
  description:
    "패션 브랜드를 만드는 디자이너·패턴사·공장·브랜드 운영자의 질문, 피드백, 네트워킹 게시판.",
  path: "/community",
});

export default async function CommunityPage() {
  const [questions, feedback, networking] = await Promise.all([
    getPosts({ type: "question", limit: 6 }),
    getPosts({ type: "feedback", limit: 3 }),
    getPosts({ type: "networking", limit: 3 }),
  ]);

  return (
    <div className="container py-10 space-y-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          COMMUNITY
        </p>
        <h1 className="text-2xl md:text-3xl font-bold">패클스 커뮤니티</h1>
        <p className="text-sm text-muted-foreground">
          실무자와 브랜드 운영자들이 모여 묻고 답하는 공간이에요.
        </p>
      </header>

      <section>
        <SectionHeading
          title="질문 게시판"
          description="브랜드 운영자들이 가장 많이 묻는 실무 질문"
          moreHref="/community/questions"
        />
        <div className="grid gap-3 md:grid-cols-2">
          {questions.length === 0 ? (
            <EmptyHint />
          ) : (
            questions.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
        <div className="mt-4">
          <Button asChild variant="accent">
            <Link href="/community/questions/new">질문 작성하기</Link>
          </Button>
        </div>
      </section>

      <section>
        <SectionHeading title="피드백 게시판" moreHref="/community/feedback" />
        <div className="grid gap-3 md:grid-cols-2">
          {feedback.length === 0 ? (
            <EmptyHint message="피드백 게시판은 곧 오픈됩니다." />
          ) : (
            feedback.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </section>

      <section>
        <SectionHeading title="네트워킹 게시판" moreHref="/community/networking" />
        <div className="grid gap-3 md:grid-cols-2">
          {networking.length === 0 ? (
            <EmptyHint message="네트워킹 게시판은 곧 오픈됩니다." />
          ) : (
            networking.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyHint({ message }: { message?: string }) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground text-center md:col-span-2">
      {message ?? "첫 번째 게시글의 주인공이 되어보세요."}
    </div>
  );
}
