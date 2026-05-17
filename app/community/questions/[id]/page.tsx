import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Eye, MessageCircle, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { MarkdownContent } from "@/components/markdown-content";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { CommentForm } from "./comment-form";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  toMetaDescription,
} from "@/lib/seo";

export const revalidate = 60;

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, content, type")
    .eq("id", params.id)
    .eq("type", "question")
    .maybeSingle();
  if (!post) return {};
  return createPageMetadata({
    title: post.title,
    description: toMetaDescription(post.excerpt ?? post.content),
    path: `/community/questions/${params.id}`,
    ogType: "article",
  });
}

export default async function QuestionDetailPage({ params }: Props) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select(
      "*, category:categories(name, slug), author:profiles!posts_author_id_fkey(user_id, nickname, avatar_url, role_type, is_verified_expert)",
    )
    .eq("id", params.id)
    .eq("type", "question")
    .maybeSingle();

  if (!post) notFound();

  const { data: tagRows } = await supabase
    .from("post_tags")
    .select("tag")
    .eq("post_id", params.id);

  const { data: comments } = await supabase
    .from("comments")
    .select(
      "id, content, created_at, is_accepted, like_count, author:profiles!comments_author_id_fkey(user_id, nickname, avatar_url, role_type, is_verified_expert)",
    )
    .eq("post_id", params.id)
    .neq("status", "deleted")
    .order("is_accepted", { ascending: false })
    .order("created_at", { ascending: true });

  void supabase
    .from("posts")
    .update({ view_count: (post.view_count ?? 0) + 1 })
    .eq("id", params.id);

  const me = await getCurrentProfile();

  const author = post.author as unknown as
    | {
        user_id: string;
        nickname: string;
        avatar_url: string | null;
        role_type: string;
        is_verified_expert: boolean;
      }
    | null;

  const path = `/community/questions/${params.id}`;

  return (
    <article className="container max-w-3xl py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "질문 게시판", path: "/community/questions" },
          { name: post.title, path },
        ])}
      />
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link href="/community/questions">
          <ArrowLeft className="h-4 w-4" /> 질문 목록
        </Link>
      </Button>

      <header className="space-y-4 border-b pb-6 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {post.category && "name" in post.category ? (
            <Badge variant="soft">{(post.category as { name: string }).name}</Badge>
          ) : null}
          <Badge variant="outline">질문</Badge>
          {tagRows?.map((t) => (
            <Badge key={t.tag} variant="outline" className="text-[10px]">
              #{t.tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold leading-snug">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserAvatar
              nickname={author?.nickname}
              avatarUrl={author?.avatar_url}
              className="h-7 w-7"
              fallbackClassName="text-[10px]"
            />
            <Link
              href={`/profile/${author?.user_id ?? ""}`}
              className="font-medium text-foreground/80 hover:underline"
            >
              {author?.nickname ?? "익명"}
            </Link>
            {author?.is_verified_expert ? (
              <Badge variant="accent" className="text-[10px]">
                전문가
              </Badge>
            ) : null}
          </div>
          <span>·</span>
          <span>{formatRelativeTime(post.created_at)}</span>
          <span className="ml-auto inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {formatNumber(post.view_count)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />{" "}
              {formatNumber(post.comment_count)}
            </span>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" /> {formatNumber(post.like_count)}
            </span>
          </span>
        </div>
      </header>

      <MarkdownContent content={post.content} />

      <section className="mt-10 space-y-4">
        <h2 className="text-lg font-bold">
          답변 {formatNumber(comments?.length ?? 0)}
        </h2>
        <ul className="space-y-3">
          {(comments ?? []).map((comment) => {
            const cAuthor = comment.author as unknown as
              | {
                  user_id: string;
                  nickname: string;
                  avatar_url: string | null;
                  is_verified_expert: boolean;
                }
              | null;
            return (
              <li
                key={comment.id}
                className="rounded-xl border p-4 bg-card"
                data-accepted={comment.is_accepted ? "true" : undefined}
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UserAvatar
                    nickname={cAuthor?.nickname}
                    avatarUrl={cAuthor?.avatar_url}
                    className="h-6 w-6"
                    fallbackClassName="text-[9px]"
                  />
                  <span className="font-medium text-foreground/80">
                    {cAuthor?.nickname ?? "익명"}
                  </span>
                  {cAuthor?.is_verified_expert ? (
                    <Badge variant="accent" className="text-[10px]">
                      전문가
                    </Badge>
                  ) : null}
                  {comment.is_accepted ? (
                    <Badge variant="default" className="text-[10px]">
                      채택됨
                    </Badge>
                  ) : null}
                  <span className="ml-auto">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </li>
            );
          })}
          {(comments?.length ?? 0) === 0 ? (
            <li className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground text-center">
              아직 답변이 없어요. 첫 번째 답변을 남겨주세요.
            </li>
          ) : null}
        </ul>

        {me ? (
          <CommentForm postId={post.id} />
        ) : (
          <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground flex items-center justify-between">
            로그인 후 답변할 수 있어요.
            <Button asChild size="sm" variant="accent">
              <Link href={`/login?redirectTo=/community/questions/${post.id}`}>
                로그인
              </Link>
            </Button>
          </div>
        )}
      </section>
    </article>
  );
}
