import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDeleteForm } from "@/components/admin/admin-delete-form";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import type { Resource } from "@/lib/database.types";
import { deleteResource } from "../../actions";
import { ResourceForm } from "../../resource-form";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditResourcePage({ params }: Props) {
  const supabase = createClient();
  const [{ data }, categories] = await Promise.all([
    supabase.from("resources").select("*").eq("id", params.id).maybeSingle(),
    getCategories("resource"),
  ]);

  if (!data) notFound();
  const resource = data as Resource;

  return (
    <div className="space-y-6 max-w-2xl">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">자료 수정</h1>
          <p className="text-sm text-muted-foreground">{resource.title}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/resources/${resource.id}`} target="_blank">
            미리보기
          </Link>
        </Button>
      </header>
      <ResourceForm categories={categories} mode="edit" resource={resource} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AdminDeleteForm
          action={deleteResource}
          id={resource.id}
          idFieldName="resource_id"
          confirmMessage={`"${resource.title}" 자료를 삭제할까요?`}
        />
        <Button asChild variant="outline">
          <Link href="/admin/resources">목록으로</Link>
        </Button>
      </div>
    </div>
  );
}
