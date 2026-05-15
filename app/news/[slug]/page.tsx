import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/markdown-content";
import { getPostBySlugOrId } from "@/lib/queries";
import { formatRelativeTime } from "@/lib/utils";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlugOrId(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? post.content.slice(0, 140),
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.content.slice(0, 140),
      type: "article",
      publishedTime: post.created_at,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const post = await getPostBySlugOrId(params.slug);
  if (!post || post.type !== "news") notFound();

  return (
    <article className="container max-w-3xl py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/news">
          <ArrowLeft className="h-4 w-4" /> 뉴스 목록
        </Link>
      </Button>
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          {post.category?.name ? (
            <Badge variant="soft">{post.category.name}</Badge>
          ) : null}
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(post.created_at)}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold leading-snug">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="text-base text-muted-foreground">{post.excerpt}</p>
        ) : null}
      </div>
      <MarkdownContent content={post.content} />
      <RelatedCta />
    </article>
  );
}

function RelatedCta() {
  return (
    <aside className="mt-12 rounded-2xl border bg-brand-soft p-6 md:p-8 space-y-3">
      <p className="text-xs font-semibold text-primary tracking-wider uppercase">
        다음 단계
      </p>
      <h2 className="text-lg md:text-xl font-bold">
        뉴스를 봤다면, 실무에 바로 써먹어보세요.
      </h2>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/resources">무료 자료 다운로드</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/bootcamp">부트캠프 보기</Link>
        </Button>
      </div>
    </aside>
  );
}
