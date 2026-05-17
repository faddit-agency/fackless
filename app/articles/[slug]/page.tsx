import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/markdown-content";
import { JsonLd } from "@/components/seo/json-ld";
import { getPostBySlugOrId } from "@/lib/queries";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  toMetaDescription,
} from "@/lib/seo";
import { formatRelativeTime } from "@/lib/utils";
import { FADDIT_URL } from "@/lib/constants";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlugOrId(params.slug);
  if (!post || post.type !== "article") return {};
  const path = `/articles/${post.slug ?? post.id}`;
  return createPageMetadata({
    title: post.title,
    description: toMetaDescription(post.excerpt ?? post.content),
    path,
    image: post.cover_image_url,
    ogType: "article",
    publishedTime: post.created_at,
    modifiedTime: post.updated_at,
    authors: post.author?.nickname ? [post.author.nickname] : undefined,
  });
}

export default async function ArticleDetailPage({ params }: Props) {
  const post = await getPostBySlugOrId(params.slug);
  if (!post || post.type !== "article") notFound();

  const showFadditCta =
    post.category?.slug === "spec-sheet" || post.title.includes("작업지시서");
  const path = `/articles/${post.slug ?? post.id}`;
  const description = toMetaDescription(post.excerpt ?? post.content);

  return (
    <article className="container max-w-3xl py-10">
      <JsonLd
        data={[
          articleJsonLd({
            title: post.title,
            description,
            path,
            publishedTime: post.created_at,
            modifiedTime: post.updated_at,
            authorName: post.author?.nickname,
            image: post.cover_image_url,
          }),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "실무 콘텐츠", path: "/articles" },
            { name: post.title, path },
          ]),
        ]}
      />
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/articles">
          <ArrowLeft className="h-4 w-4" /> 실무 콘텐츠
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

      {showFadditCta ? (
        <aside className="mt-10 rounded-2xl border bg-primary text-primary-foreground p-6 md:p-8 space-y-3">
          <p className="text-xs font-semibold tracking-wider uppercase">
            패딧에서 바로 만들기
          </p>
          <h2 className="text-lg md:text-xl font-bold">
            이 가이드대로 작업지시서를 직접 만들어보세요.
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="accent">
              <Link href={FADDIT_URL} target="_blank" rel="noreferrer">
                패딧에서 템플릿 열기
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/resources?category=spec-sheet">
                작업지시서 자료 모음
              </Link>
            </Button>
          </div>
        </aside>
      ) : null}

      <aside className="mt-8 rounded-2xl border bg-brand-soft p-6 md:p-8 space-y-3">
        <p className="text-xs font-semibold text-primary tracking-wider uppercase">
          더 깊이 배우고 싶다면
        </p>
        <h2 className="text-lg md:text-xl font-bold">
          부트캠프에서 직접 적용해보세요.
        </h2>
        <Button asChild>
          <Link href="/bootcamp">부트캠프에서 자세히 배우기</Link>
        </Button>
      </aside>
    </article>
  );
}
