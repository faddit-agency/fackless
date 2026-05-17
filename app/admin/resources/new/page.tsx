import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/queries";
import { ResourceCreateForm } from "./resource-create-form";

export const metadata = { title: "자료 등록" };

export default async function NewResourcePage() {
  const categories = await getCategories("resource");
  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">새 자료 등록</h1>
        <p className="text-sm text-muted-foreground">
          무료 자료 정보를 입력하세요. 파일/썸네일은 업로드 후 자동으로 연결됩니다.
        </p>
      </header>
      <ResourceCreateForm categories={categories} />
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/admin/resources">목록으로</Link>
        </Button>
      </div>
    </div>
  );
}
