import Link from "next/link";
import { ArrowRight, Sparkles, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/cards/post-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { SectionHeading } from "@/components/section-heading";
import { getPosts, getResources } from "@/lib/queries";
import { FADDIT_URL, ROLE_TYPES } from "@/lib/constants";

export const revalidate = 60;

export default async function HomePage() {
  const [articles, questions, resources] = await Promise.all([
    getPosts({ type: "article", limit: 4 }),
    getPosts({ type: "question", limit: 5 }),
    getResources({ limit: 4 }),
  ]);

  return (
    <div>
      <HeroSection />
      <div className="container space-y-16 mt-16">
        <RoleEntry />

        <section>
          <SectionHeading
            title="오늘의 실무 콘텐츠"
            description="브랜드 운영부터 생산 실무까지, 현장에서 바로 쓰는 인사이트"
            moreHref="/articles"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {articles.length === 0 ? (
              <EmptyHint message="첫 번째 실무 콘텐츠를 곧 만나보실 수 있어요." />
            ) : (
              articles.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </section>

        <section>
          <SectionHeading
            title="지금 많이 묻는 질문"
            description="브랜드 운영자들이 가장 많이 묻고 있는 실무 질문"
            moreHref="/community/questions"
          />
          <div className="grid gap-3 lg:grid-cols-2">
            {questions.length === 0 ? (
              <EmptyHint message="질문을 등록해 패클스 첫 게시글의 주인공이 되어보세요." />
            ) : (
              questions.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </section>

        <section>
          <SectionHeading
            title="무료 자료실"
            description="작업지시서·원가계산·체크리스트 등 실무 템플릿 무료 다운로드"
            moreHref="/resources"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {resources.length === 0 ? (
              <EmptyHint message="곧 무료 자료가 업로드됩니다." />
            ) : (
              resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            )}
          </div>
        </section>

        <BootcampCTA />
        <FadditCTA />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="border-b bg-gradient-to-b from-brand-soft to-background">
      <div className="container py-14 md:py-24 grid gap-10 md:grid-cols-2 items-end">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.2] md:!leading-[1.2]">
            브랜드는 시작했지만,
            <br />
            생산에서 막히는 사람들을 위한
            <br />
            패션 브랜드 실무 커뮤니티
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-[1.5]">
            원단·공장·작업지시서·원가·브랜딩까지, 실무자에게 실제로 도움이 되는
            정보와 사람을 모았습니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="xl" variant="accent">
              <Link href="/signup">무료로 가입하기</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/resources">무료 자료실 둘러보기</Link>
            </Button>
          </div>
          <ul className="grid grid-cols-3 gap-4 pt-6">
            <Stat label="실무 콘텐츠" value="50+" />
            <Stat label="질문/답변" value="실시간" />
            <Stat label="템플릿" value="무료" />
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted-foreground">
            패클스에서 할 수 있는 일
          </p>
          <div className="mt-3 grid gap-3">
            <HeroItem
              icon={Wrench}
              title="작업지시서·원가 템플릿 다운로드"
              desc="공장과 협업할 때 바로 쓰는 실무 자료"
            />
            <HeroItem
              icon={Users}
              title="디자이너·패턴사·공장 네트워킹"
              desc="브랜드를 함께 만들 동료를 찾아보세요"
            />
            <HeroItem
              icon={Sparkles}
              title="6주 부트캠프로 실제 생산까지"
              desc="브랜드를 진짜 시장에 내보내는 실전 과정"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="rounded-xl border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </li>
  );
}

function HeroItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-semibold leading-[1.5]">{title}</p>
        <p className="text-xs text-muted-foreground leading-[1.5]">{desc}</p>
      </div>
    </div>
  );
}

function RoleEntry() {
  return (
    <section className="rounded-2xl border bg-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            나에게 맞는 커뮤니티
          </p>
          <h2 className="text-xl md:text-2xl font-bold mt-1">
            직군별 진입으로 빠르게 시작하세요
          </h2>
        </div>
        <Link
          href="/community"
          className="text-sm font-medium inline-flex items-center gap-1 hover:underline"
        >
          커뮤니티 메인 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        {ROLE_TYPES.map((role) => (
          <Link
            key={role.value}
            href={`/community?role=${role.value}`}
            className="rounded-xl border p-4 text-center transition hover:border-foreground/30 hover:bg-muted/40"
          >
            <p className="text-base font-semibold">{role.label}</p>
            <p className="text-xs text-muted-foreground mt-1">진입하기</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BootcampCTA() {
  return (
    <section className="overflow-hidden rounded-2xl border bg-primary text-primary-foreground">
      <div className="grid gap-6 p-8 md:p-12 md:grid-cols-[1.4fr,1fr] items-center">
        <div className="space-y-4">
          <Badge
            variant="accent"
            className="bg-accent/90 text-accent-foreground"
          >
            패클스 부트캠프
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold leading-snug">
            내 브랜드를 실제 생산 가능한 상태까지 만드는 6주 실전 과정
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 max-w-xl">
            강의 + 실습 + 피드백 + 제작 연결까지, 브랜드를 진짜 시장에 내보낼
            준비를 함께 합니다.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="accent" size="lg">
              <Link href="/bootcamp">자세히 보기</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/bootcamp#apply">신청하기</Link>
            </Button>
          </div>
        </div>
        <ul className="grid gap-2 text-sm text-primary-foreground/85">
          <li>· 작업지시서·원가계산 템플릿 제공</li>
          <li>· 샘플 제작 체크리스트 + 공장 연결</li>
          <li>· 최종 발표 및 제작 연결</li>
          <li>· 패딧 무료 체험 + 커뮤니티 영구 참여</li>
        </ul>
      </div>
    </section>
  );
}

function FadditCTA() {
  return (
    <section className="rounded-2xl border bg-brand-soft p-8 md:p-10 flex flex-col md:flex-row gap-6 md:items-center">
      <div className="flex-1 space-y-2">
        <p className="text-xs font-semibold text-primary/80 tracking-wider uppercase">
          FADDIT × PACKLESS
        </p>
        <h2 className="text-xl md:text-2xl font-bold">
          작업지시서, 직접 만들어볼 시간이에요.
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl">
          패클스 자료실에서 받은 템플릿을 패딧에서 바로 편집하고, 그대로 공장에
          전송할 수 있어요.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild size="lg" variant="default">
          <Link href={FADDIT_URL} target="_blank" rel="noreferrer">
            패딧에서 템플릿 열기
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/resources">자료실 보기</Link>
        </Button>
      </div>
    </section>
  );
}

function EmptyHint({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground text-center md:col-span-2 xl:col-span-4 lg:col-span-2">
      {message}
    </div>
  );
}
