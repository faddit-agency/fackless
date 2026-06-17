import Link from "next/link";
import { FileText, PackageOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "관리자 대시보드" };

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: userCount },
    { count: postCount },
    { count: articleCount },
    { count: resourceCount },
    { count: downloadCount },
    { count: applicationCount },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("type", "article")
      .eq("status", "published"),
    supabase
      .from("resources")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("resource_downloads").select("id", { count: "exact", head: true }),
    supabase
      .from("bootcamp_applications")
      .select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "가입자", value: userCount ?? 0 },
    { label: "공개 게시글", value: postCount ?? 0 },
    { label: "실무 콘텐츠", value: articleCount ?? 0 },
    { label: "공개 자료", value: resourceCount ?? 0 },
    { label: "자료 다운로드", value: downloadCount ?? 0 },
    { label: "부트캠프 신청", value: applicationCount ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold">대시보드</h1>
        <p className="text-sm text-muted-foreground">
          콘텐츠·자료실을 등록하고 서비스 지표를 확인하세요.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <QuickAction
          title="실무 콘텐츠 작성"
          description="위즈윅 에디터로 아티클 등록"
          href="/admin/articles/new"
          icon={FileText}
        />
        <QuickAction
          title="무료 자료 등록"
          description="PDF·엑셀·패딧 템플릿 업로드"
          href="/admin/resources/new"
          icon={PackageOpen}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{formatNumber(stat.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickAction({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-accent">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <Button asChild variant="accent" size="sm" className="w-fit">
        <Link href={href}>
          <Plus className="h-4 w-4" /> 새로 만들기
        </Link>
      </Button>
    </div>
  );
}
