import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container max-w-md py-24 text-center space-y-3">
      <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
        404
      </p>
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
      <p className="text-sm text-muted-foreground">
        삭제되었거나, 주소가 변경되었을 수 있습니다.
      </p>
      <div className="flex justify-center gap-2 pt-2">
        <Button asChild>
          <Link href="/">홈으로</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/community">커뮤니티</Link>
        </Button>
      </div>
    </div>
  );
}
