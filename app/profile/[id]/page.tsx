import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/cards/post-card";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { ROLE_TYPE_LABEL } from "@/lib/constants";
import type { Profile } from "@/lib/database.types";
import type { PostListItem } from "@/lib/queries";
import { formatRelativeTime } from "@/lib/utils";

export const revalidate = 0;

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("user_id", params.id)
    .maybeSingle();
  return { title: data?.nickname ? `${data.nickname} 님의 프로필` : "프로필" };
}

export default async function ProfilePage({ params }: Props) {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", params.id)
    .maybeSingle();
  if (!profile) notFound();

  const typedProfile = profile as Profile;
  const me = await getCurrentProfile();
  const isMe = me?.user_id === typedProfile.user_id;

  const [{ data: posts }, role] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "*, category:categories(id, name, slug), author:profiles!posts_author_id_fkey(user_id, nickname, avatar_url)",
      )
      .eq("author_id", typedProfile.user_id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(20),
    fetchRoleSpecific(typedProfile),
  ]);

  return (
    <div className="container max-w-3xl py-10">
      <section className="rounded-2xl border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-6">
        <Avatar className="h-20 w-20">
          {typedProfile.avatar_url ? (
            <AvatarImage
              src={typedProfile.avatar_url}
              alt={typedProfile.nickname}
            />
          ) : null}
          <AvatarFallback className="text-2xl">
            {typedProfile.nickname.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{typedProfile.nickname}</h1>
            <Badge variant="soft">
              {ROLE_TYPE_LABEL[typedProfile.role_type]}
            </Badge>
            {typedProfile.is_verified_expert ? (
              <Badge variant="accent">전문가</Badge>
            ) : null}
            {typedProfile.is_admin ? (
              <Badge variant="default">관리자</Badge>
            ) : null}
          </div>
          {typedProfile.bio ? (
            <p className="text-sm whitespace-pre-wrap">{typedProfile.bio}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              아직 소개가 없어요.
            </p>
          )}
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {typedProfile.region ? <li>지역 · {typedProfile.region}</li> : null}
            {typedProfile.website_url ? (
              <li>
                <Link
                  className="hover:underline"
                  href={typedProfile.website_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {typedProfile.website_url}
                </Link>
              </li>
            ) : null}
            <li>가입 · {formatRelativeTime(typedProfile.created_at)}</li>
          </ul>
          {typedProfile.interests && typedProfile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {typedProfile.interests.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}
          {role ? <RoleDetails details={role} /> : null}
          {isMe ? (
            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/onboarding">프로필 수정</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold mb-4">최근 게시글</h2>
        <div className="grid gap-3">
          {(posts ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground border border-dashed rounded-xl p-8 text-center">
              아직 작성한 게시글이 없어요.
            </p>
          ) : (
            (posts as unknown as PostListItem[]).map((p) => (
              <PostCard key={p.id} post={p} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

async function fetchRoleSpecific(profile: Profile) {
  const supabase = createClient();
  const map: Record<Profile["role_type"], string | null> = {
    designer: "designer_profiles",
    pattern_maker: "pattern_maker_profiles",
    factory: "factory_profiles",
    brand: "brand_profiles",
    general: null,
  };
  const table = map[profile.role_type];
  if (!table) return null;
  const { data } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", profile.user_id)
    .maybeSingle();
  return data ?? null;
}

function RoleDetails({ details }: { details: Record<string, unknown> }) {
  const entries = Object.entries(details).filter(
    ([key, value]) =>
      ![
        "id",
        "user_id",
        "created_at",
        "updated_at",
      ].includes(key) &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0),
  );
  if (entries.length === 0) return null;
  return (
    <ul className="text-xs text-muted-foreground space-y-1 pt-1">
      {entries.map(([key, value]) => (
        <li key={key}>
          <span className="font-semibold text-foreground/80">{labelFor(key)}</span>{" "}
          · {formatValue(value)}
        </li>
      ))}
    </ul>
  );
}

function labelFor(key: string): string {
  return (
    {
      specialty: "전문 분야",
      specialty_items: "전문 품목",
      portfolio_url: "포트폴리오",
      collaboration_available: "협업 가능",
      experience_years: "경력",
      sample_available: "샘플 가능",
      location: "위치",
      available_items: "가능 품목",
      moq: "MOQ",
      equipment: "보유 설비",
      brand_stage: "브랜드 단계",
      interests: "관심 분야",
      planned_items: "예정 품목",
    }[key] ?? key
  );
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "예" : "아니오";
  return String(value);
}
