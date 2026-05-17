import Link from "next/link";
import { Sparkles, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { HomeFeeds } from "@/components/home/home-feeds";
import { HomeFeedsSkeleton } from "@/components/home/home-feeds-skeleton";
import { WarmNewsCacheTrigger } from "@/components/news/warm-news-cache";
import { JsonLd } from "@/components/seo/json-ld";
import { FADDIT_URL, SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/constants";
import {
  createPageMetadata,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";

export const revalidate = 60;

export const metadata = createPageMetadata({
  title: `패션 브랜드 실무 커뮤니티 · ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  return (
    <div>
      <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
      <WarmNewsCacheTrigger />
      <HeroSection />
      <div className="container space-y-16 mt-16">
        <Suspense fallback={<HomeFeedsSkeleton />}>
          <HomeFeeds />
        </Suspense>
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

