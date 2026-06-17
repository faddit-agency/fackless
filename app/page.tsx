import Link from "next/link";
import {
  BookOpen,
  Download,
  MessageCircleQuestion,
  Newspaper,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { HomeDbFeeds } from "@/components/home/home-db-feeds";
import { HomeFeedsSkeleton } from "@/components/home/home-feeds-skeleton";
import { HomeNews } from "@/components/home/home-news";
import { HomeNewsSkeleton } from "@/components/home/home-news-skeleton";
import {
  FeatureCard,
  MarketingSection,
} from "@/components/marketing/feature-card";
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

const SERVICE_HIGHLIGHTS = [
  {
    icon: Newspaper,
    title: "패션 업계 뉴스",
    description: "K패션·리테일·패션테크 소식을 큐레이션해 전해드립니다.",
    href: "/news",
  },
  {
    icon: BookOpen,
    title: "실무 콘텐츠",
    description: "브랜드 운영·생산·원가 등 현장에서 바로 쓰는 가이드.",
    href: "/articles",
  },
  {
    icon: MessageCircleQuestion,
    title: "커뮤니티 Q&A",
    description: "원단·공장·작업지시서, 실무자에게 직접 질문하세요.",
    href: "/community/questions",
  },
];

const VALUE_PROPS = [
  {
    icon: Wrench,
    title: "실무 A to Z",
    description: "작업지시서·원가 템플릿부터 공장 협업까지 한곳에서.",
  },
  {
    icon: Users,
    title: "현장 네트워킹",
    description: "디자이너·패턴사·공장·브랜드 운영자를 연결합니다.",
  },
  {
    icon: Download,
    title: "무료 자료실",
    description: "체크리스트·엑셀 시트 등 실무 템플릿 무료 다운로드.",
  },
];

export default function HomePage() {
  return (
    <div>
      <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
      <WarmNewsCacheTrigger />
      <HeroSection />
      <ServiceHighlightSection />
      <ValuePropSection />
      <div className="container space-y-20 md:space-y-24 py-16 md:py-20">
        <Suspense fallback={<HomeFeedsSkeleton />}>
          <HomeDbFeeds />
        </Suspense>
        <Suspense fallback={<HomeNewsSkeleton />}>
          <HomeNews />
        </Suspense>
        <BootcampCTA />
        <FadditCTA />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="border-b bg-gradient-to-b from-brand-soft via-background to-background">
      <div className="container py-16 md:py-24 text-center space-y-8 max-w-4xl mx-auto">
        <p className="text-xs md:text-sm font-semibold tracking-[0.14em] uppercase text-muted-foreground">
          FACKLESS · {SITE_TAGLINE}
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.2] whitespace-pre-line">
          {"브랜드는 시작했지만,\n생산에서 막히는 사람들을 위한\n패션 브랜드 실무 커뮤니티"}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          원단·공장·작업지시서·원가·브랜딩까지, 실무자에게 실제로 도움이 되는
          정보와 사람을 모았습니다.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="xl" variant="accent" className="min-w-[160px]">
            <Link href="/signup">무료로 가입하기</Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="min-w-[160px]">
            <Link href="/resources">무료 자료실 둘러보기</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ServiceHighlightSection() {
  return (
    <section className="container py-14 md:py-16">
      <div className="grid gap-4 md:grid-cols-3">
        {SERVICE_HIGHLIGHTS.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

function ValuePropSection() {
  return (
    <section className="border-y bg-muted/20">
      <div className="container py-16 md:py-20 space-y-12">
        <MarketingSection
          title={"브랜드 실무,\n어디서부터 시작해야 할까요?"}
          description="패클스가 생산·원가·네트워킹까지 실무 여정을 쉽게 만들어 드립니다."
        />
        <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
          {VALUE_PROPS.map((item) => (
            <FeatureCard key={item.title} {...item} className="text-center items-center" />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          디자이너 · 패턴사 · 공장 · 브랜드 운영자 · 패션 창업 준비생을 위한 실무
          허브
        </p>
      </div>
    </section>
  );
}

function BootcampCTA() {
  return (
    <section className="overflow-hidden rounded-2xl border bg-primary text-primary-foreground">
      <div className="grid gap-6 p-8 md:p-12 md:grid-cols-[1.4fr,1fr] items-center">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-primary-foreground/70">
            <Sparkles className="h-3.5 w-3.5" />
            패클스 부트캠프
          </p>
          <h2 className="text-2xl md:text-3xl font-bold leading-snug">
            내 브랜드를 실제 생산 가능한 상태까지 만드는 6주 실전 과정
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 max-w-xl leading-relaxed">
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
        <ul className="grid gap-2.5 text-sm text-primary-foreground/85">
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
          FADDIT × FACKLESS
        </p>
        <h2 className="text-xl md:text-2xl font-bold">
          작업지시서, 직접 만들어볼 시간이에요.
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
          패클스 자료실에서 받은 템플릿을 패딧에서 바로 편집하고, 그대로 공장에
          전송할 수 있어요.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
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
