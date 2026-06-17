import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageBody, PageHero } from "@/components/layout/page-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "네트워킹 게시판",
  description: "패션 브랜드 실무자·디자이너·공장 네트워킹 게시판.",
  path: "/community/networking",
});

export default function NetworkingComingSoon() {
  return (
    <>
      <PageHero
        eyebrow="NETWORKING"
        title={"디자이너·패턴사·공장,\n함께 일할 사람 찾기"}
        description="브랜드를 함께 만들 동료, 협업 파트너, 공장·패턴사를 찾는 네트워킹 공간을 준비하고 있어요."
      />
      <PageBody className="text-center space-y-5">
        <p className="text-sm text-muted-foreground leading-[1.3]">
          곧 오픈 예정입니다. 커뮤니티 질문 게시판에서 먼저 연결해 보세요.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button asChild variant="accent">
            <Link href="/community/questions">질문 게시판</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/community">커뮤니티 홈</Link>
          </Button>
        </div>
      </PageBody>
    </>
  );
}
