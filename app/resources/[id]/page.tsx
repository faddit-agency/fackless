import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getResourceById } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { FADDIT_URL, ROLE_TYPE_LABEL } from "@/lib/constants";
import { DownloadButton } from "./download-button";

export const revalidate = 0;

interface Props {
  params: { id: string };
}

const TYPE_LABEL: Record<string, string> = {
  pdf: "PDF",
  excel: "Excel",
  notion: "Notion",
  figma: "Figma",
  link: "외부 링크",
  faddit_template: "패딧 템플릿",
};

export default async function ResourceDetailPage({ params }: Props) {
  const resource = await getResourceById(params.id);
  if (!resource) notFound();
  const profile = await getCurrentProfile();
  const canDownload = !!profile && profile.is_onboarded;

  return (
    <div className="container max-w-3xl py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link href="/resources">
          <ArrowLeft className="h-4 w-4" /> 자료실
        </Link>
      </Button>

      <div className="rounded-2xl border bg-card p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="soft">{TYPE_LABEL[resource.resource_type]}</Badge>
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Download className="h-3 w-3" />
            {formatNumber(resource.download_count)}회 다운로드
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {formatRelativeTime(resource.created_at)}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold leading-snug">
          {resource.title}
        </h1>
        {resource.description ? (
          <p className="text-sm md:text-base text-muted-foreground whitespace-pre-wrap">
            {resource.description}
          </p>
        ) : null}

        {resource.target_roles && resource.target_roles.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground">
              추천 대상
            </p>
            <div className="flex flex-wrap gap-1.5">
              {resource.target_roles.map((role) => (
                <Badge key={role} variant="outline">
                  {ROLE_TYPE_LABEL[role]}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        {canDownload ? (
          <DownloadButton resourceId={resource.id} />
        ) : (
          <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground flex items-center justify-between gap-2 flex-wrap">
            {profile
              ? "온보딩 완료 후 다운로드할 수 있어요."
              : "로그인 후 무료로 다운로드할 수 있어요."}
            <Button
              asChild
              size="sm"
              variant="accent"
            >
              <Link
                href={
                  profile
                    ? "/onboarding"
                    : `/login?redirectTo=/resources/${resource.id}`
                }
              >
                {profile ? "온보딩 완료하기" : "로그인하기"}
              </Link>
            </Button>
          </div>
        )}
      </div>

      <FadditCta />
      <BootcampCta />
    </div>
  );
}

function FadditCta() {
  return (
    <aside className="mt-8 rounded-2xl border bg-primary text-primary-foreground p-6 md:p-8 space-y-3">
      <p className="text-xs font-semibold tracking-wider uppercase">
        패딧에서 바로 사용
      </p>
      <h2 className="text-lg md:text-xl font-bold">
        다운받은 템플릿을 패딧에서 편집하고 공장에 바로 보내세요.
      </h2>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="accent">
          <Link href={FADDIT_URL} target="_blank" rel="noreferrer">
            패딧에서 열기
          </Link>
        </Button>
      </div>
    </aside>
  );
}

function BootcampCta() {
  return (
    <aside className="mt-6 rounded-2xl border bg-brand-soft p-6 md:p-8 space-y-3">
      <p className="text-xs font-semibold text-primary tracking-wider uppercase">
        패클스 부트캠프
      </p>
      <h2 className="text-lg md:text-xl font-bold">
        자료를 어떻게 써야 하는지부터 알고 싶다면?
      </h2>
      <Button asChild>
        <Link href="/bootcamp">부트캠프 자세히 보기</Link>
      </Button>
    </aside>
  );
}
