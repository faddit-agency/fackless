import Link from "next/link";
import { Button } from "@/components/ui/button";

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "피드백 게시판",
  description: "패션 브랜드 실무자들의 작품·아이디어 피드백 게시판.",
  path: "/community/feedback",
});

export default function FeedbackComingSoon() {
  return (
    <div className="container max-w-2xl py-20 text-center space-y-4">
      <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
        FEEDBACK BOARD
      </p>
      <h1 className="text-2xl md:text-3xl font-bold">피드백 게시판은 곧 오픈됩니다.</h1>
      <p className="text-sm text-muted-foreground">
        작업지시서·디자인·샘플·상세페이지에 대한 실무자 피드백을 받을 수 있는
        공간을 준비하고 있어요. 가장 먼저 알림을 받고 싶다면 자료실 이용 후
        뉴스레터를 신청해주세요.
      </p>
      <div className="flex justify-center gap-2 pt-2">
        <Button asChild>
          <Link href="/resources">자료실 가기</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/community/questions">질문 게시판</Link>
        </Button>
      </div>
    </div>
  );
}
