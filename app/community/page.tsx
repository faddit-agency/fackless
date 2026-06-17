import Link from "next/link";
import {
  MessageCircleQuestion,
  MessagesSquare,
  Users,
} from "lucide-react";
import { PostCard } from "@/components/cards/post-card";
import { FeatureCard } from "@/components/marketing/feature-card";
import { PageBody, PageHero } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/queries";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = createPageMetadata({
  title: "커뮤니티",
  description:
    "패션 브랜드를 만드는 디자이너·패턴사·공장·브랜드 운영자의 질문, 피드백, 네트워킹 게시판.",
  path: "/community",
});

const BOARDS = [
  {
    icon: MessageCircleQuestion,
    title: "질문 게시판",
    description: "원단·공장·원가·브랜딩, 실무 질문에 답을 받아보세요.",
    href: "/community/questions",
  },
  {
    icon: MessagesSquare,
    title: "피드백 게시판",
    description: "작업지시서·디자인·샘플에 대한 실무자 피드백.",
    href: "/community/feedback",
  },
  {
    icon: Users,
    title: "네트워킹 게시판",
    description: "디자이너·패턴사·공장·브랜드 운영자를 연결합니다.",
    href: "/community/networking",
  },
];

export default async function CommunityPage() {
  const [questions, feedback, networking] = await Promise.all([
    getPosts({ type: "question", limit: 6 }),
    getPosts({ type: "feedback", limit: 3 }),
    getPosts({ type: "networking", limit: 3 }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="COMMUNITY"
        title={"브랜드 실무,\n함께 묻고 답하는 공간"}
        description="디자이너·패턴사·공장·브랜드 운영자가 모여 실무 정보를 나누는 패클스 커뮤니티입니다."
      />
      <section className="section-surface-soft">
        <PageBody className="space-y-14">
        <div className="grid gap-4 md:grid-cols-3">
          {BOARDS.map((board) => (
            <FeatureCard key={board.title} {...board} />
          ))}
        </div>

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
              questions.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  hrefBuilder={(p) => `/community/questions/${p.id}`}
                />
              ))
            )}
          </div>
          <div className="mt-5">
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
        </PageBody>
      </section>
    </>
  );
}

function EmptyHint({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl bg-muted/40 p-8 text-sm text-muted-foreground text-center md:col-span-2">
      {message ?? "첫 번째 게시글의 주인공이 되어보세요."}
    </div>
  );
}
