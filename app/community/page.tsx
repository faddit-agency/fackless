import Link from "next/link";
import {
  ArrowRight,
  HelpCircle,
  Layers,
  Users as UsersIcon,
} from "lucide-react";
import { PostCard } from "@/components/cards/post-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPosts } from "@/lib/queries";

export const revalidate = 60;

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "커뮤니티",
  description:
    "패션 브랜드를 만드는 디자이너·패턴사·공장·브랜드 운영자의 질문, 피드백, 네트워킹 게시판.",
  path: "/community",
});

const BOARDS = [
  {
    href: "/community/questions",
    icon: HelpCircle,
    label: "질문 게시판",
    description: "생산·원단·공장·브랜딩 무엇이든 물어보세요.",
  },
  {
    href: "/community/feedback",
    icon: Layers,
    label: "피드백 게시판",
    description: "작업지시서·디자인·샘플에 실무자 피드백을 받아보세요.",
    soon: true,
  },
  {
    href: "/community/networking",
    icon: UsersIcon,
    label: "네트워킹 게시판",
    description: "함께할 디자이너·패턴사·공장·파트너를 찾아보세요.",
    soon: true,
  },
];

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

      <section className="grid gap-3 md:grid-cols-3">
        {BOARDS.map((board) => (
          <Link
            key={board.href}
            href={board.href}
            className="group rounded-2xl border bg-card p-5 hover:border-foreground/30 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-primary">
                <board.icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold">{board.label}</p>
                <p className="text-xs text-muted-foreground">
                  {board.description}
                </p>
              </div>
              {board.soon ? (
                <Badge variant="outline" className="text-[10px]">
                  곧 오픈
                </Badge>
              ) : (
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition" />
              )}
            </div>
          </Link>
        ))}
      </section>

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
