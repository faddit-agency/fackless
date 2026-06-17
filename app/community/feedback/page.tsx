import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageBody, PageHero } from "@/components/layout/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "피드백 게시판",
  description: "패션 브랜드 실무자들의 작품·아이디어 피드백 게시판.",
  path: "/community/feedback",
});

export default function FeedbackComingSoon() {
  return (
    <>
      <PageHero
        eyebrow="FEEDBACK BOARD"
        title={"작업지시서·디자인·샘플,\n피드백 받을 공간"}
        description="작업지시서·디자인·샘플·상세페이지에 대한 실무자 피드백을 받을 수 있는 공간을 준비하고 있어요."
      />
      <PageBody className="text-center space-y-5">
        <p className="text-sm text-muted-foreground leading-[1.3]">
          곧 오픈 예정입니다. 그 전까지는 질문 게시판에서 실무 고민을 나눠보세요.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button asChild variant="accent">
            <Link href="/community/questions">질문 게시판</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/resources">자료실 보기</Link>
          </Button>
        </div>
      </PageBody>
    </>
  );
}
