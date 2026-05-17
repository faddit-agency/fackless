import Link from "next/link";
import { Button } from "@/components/ui/button";

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "네트워킹 게시판",
  description:
    "디자이너, 패턴사, 공장, 브랜드 운영자를 연결하는 패션 네트워킹 게시판.",
  path: "/community/networking",
});

export default function NetworkingComingSoon() {
  return (
    <div className="container max-w-2xl py-20 text-center space-y-4">
      <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
        NETWORKING
      </p>
      <h1 className="text-2xl md:text-3xl font-bold">네트워킹 게시판은 곧 오픈됩니다.</h1>
      <p className="text-sm text-muted-foreground">
        브랜드 운영자, 디자이너, 패턴사, 공장이 협업 파트너를 찾을 수 있는
        공간을 준비 중이에요. 미리 직군 프로필을 채워두면 가장 먼저 매칭됩니다.
      </p>
      <div className="flex justify-center gap-2 pt-2">
        <Button asChild>
          <Link href="/onboarding">프로필 설정</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/community">커뮤니티 메인</Link>
        </Button>
      </div>
    </div>
  );
}
