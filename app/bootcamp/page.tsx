import Link from "next/link";
import {
  ArrowRight,
  Check,
  Factory,
  FileText,
  GraduationCap,
  Lightbulb,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BootcampApplyForm } from "./apply-form";
import { createPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "패클스 부트캠프",
  description:
    "내 브랜드를 실제 생산 가능한 상태까지 만드는 6주 실전 과정. 작업지시서·원가·샘플 제작·공장 연결까지.",
  path: "/bootcamp",
});

const PROBLEMS = [
  "브랜드는 시작했지만, 생산 단계에서 막힌다",
  "원단·공장·MOQ·작업지시서·원가가 너무 어렵다",
  "샘플은 만들었는데 시장에 내보낼 자신이 없다",
  "혼자 결정하기엔 검증해줄 사람이 없다",
];

const HERO_PILLARS = [
  {
    icon: Factory,
    title: "실제 제작 연결",
    desc: "졸업 후 바로 제작 가능한 공장·패턴사 연결",
  },
  {
    icon: Users,
    title: "현직자 피드백",
    desc: "디자이너·MD·생산 PM의 매주 1:1 피드백",
  },
  {
    icon: Rocket,
    title: "패딧 무료 체험",
    desc: "작업지시서 SaaS 패딧 부트캠프 기간 무료",
  },
];

const PROGRAM_STATS = [
  { label: "기간", value: "6", unit: "주" },
  { label: "방식", value: "하이브리드", unit: "온·오프라인" },
  { label: "피드백", value: "1:1", unit: "매주" },
  { label: "제작 연결", value: "100", unit: "% 포함" },
];

const CURRICULUM = [
  {
    week: 1,
    title: "브랜드 구조 설계",
    detail:
      "타깃, 컨셉, 가격대, 시장 포지셔닝까지 — 브랜드의 뼈대를 함께 설계합니다.",
  },
  {
    week: 2,
    title: "생산 구조 이해",
    detail:
      "원단·부자재·봉제 공장의 생산 흐름과 협업 구조를 실제 사례로 익힙니다.",
  },
  {
    week: 3,
    title: "작업지시서 실습",
    detail:
      "패딧 템플릿을 활용해 봉제 공장이 좋아하는 작업지시서를 직접 만들어봅니다.",
  },
  {
    week: 4,
    title: "원가 계산과 샘플 제작",
    detail:
      "원단·부자재·공임·로스율·물류까지 반영한 진짜 원가를 계산합니다.",
  },
  {
    week: 5,
    title: "브랜딩 / 상세페이지 / SNS",
    detail:
      "제품이 만들어진 뒤 시장에 닿게 하는 콘텐츠 구조를 설계합니다.",
  },
  {
    week: 6,
    title: "최종 발표 및 제작 연결",
    detail:
      "확정된 라인업을 실제 공장과 매칭하고 후속 일정을 함께 계획합니다.",
  },
];

const BENEFITS = [
  "패클스 표준 작업지시서 템플릿",
  "원가계산 시트 (Excel)",
  "샘플 제작 체크리스트",
  "패딧 무료 체험",
  "검증된 공장/패턴사 추천",
  "패클스 커뮤니티 영구 참여",
];

const PROCESS = [
  { step: "01", label: "브랜드 설계" },
  { step: "02", label: "생산 이해" },
  { step: "03", label: "작업지시서" },
  { step: "04", label: "원가·샘플" },
  { step: "05", label: "브랜딩" },
  { step: "06", label: "제작 연결" },
];

export default function BootcampPage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <ProcessStrip />
      <div className="container space-y-24 md:space-y-32 py-20 md:py-28">
        <ProblemSection />
        <ProgramSection />
        <CurriculumSection />
        <BenefitsSection />
        <ApplySection />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-soft via-background to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-[min(480px,55vw)] w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-64 w-96 translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tl from-brand-soft to-transparent opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bootcamp-grid opacity-[0.25]"
      />

      <div className="container relative py-20 md:py-28 lg:py-32">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            FACKLESS BOOTCAMP
          </div>

          <h1 className="text-[2rem] md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.3] whitespace-pre-line">
            {"내 브랜드를\n실제 생산 가능한 상태까지"}
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-[1.3]">
            강의 + 실습 + 피드백 + 제작 연결. 6주 동안 브랜드를 시장에 내보낼
            준비를 함께합니다.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="xl" variant="accent" className="min-w-[148px]">
              <Link href="#apply">
                신청하기 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="min-w-[148px]">
              <Link href="#curriculum">커리큘럼</Link>
            </Button>
          </div>
        </div>

        <ul className="mt-16 md:mt-20 grid gap-4 md:grid-cols-3">
          {HERO_PILLARS.map((item) => (
            <li
              key={item.title}
              className="group rounded-2xl bg-muted/40 p-6 transition hover:bg-muted/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted/50 transition group-hover:bg-accent/10">
                <item.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
              </span>
              <p className="mt-4 font-semibold tracking-tight">{item.title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-[1.3]">
                {item.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProcessStrip() {
  return (
    <section>
      <div className="container py-8 md:py-10">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 md:gap-x-0 md:justify-between">
          {PROCESS.map((item, index) => (
            <div key={item.step} className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2.5 rounded-full bg-muted/40 px-3 py-2 hover:bg-muted/50 transition">
                <span className="text-xs font-bold tabular-nums text-accent">
                  {item.step}
                </span>
                <span className="text-sm font-medium text-foreground/90">
                  {item.label}
                </span>
              </div>
              {index < PROCESS.length - 1 ? (
                <ArrowRight className="hidden md:block h-3.5 w-3.5 text-muted-foreground/50 mx-2 lg:mx-4" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1fr,1.1fr] lg:gap-16 items-start">
      <div className="space-y-5 lg:sticky lg:top-24">
        <SectionLabel>FOR YOU</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.3]">
          브랜드는 시작했지만,
          <br />
          <span className="text-muted-foreground">진짜 어려운 건 그 다음.</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-[1.3] max-w-md">
          아이디어에서 멈추지 않도록, 생산·원가·샘플까지 실무자와 함께
          밀어붙이는 6주 프로그램입니다.
        </p>
      </div>
      <ul className="space-y-3">
        {PROBLEMS.map((problem, index) => (
          <li
            key={problem}
            className="group flex gap-5 rounded-2xl bg-muted/30 p-5 md:p-6 transition hover:bg-muted/45"
          >
            <span className="shrink-0 text-2xl font-bold tabular-nums text-foreground/10 group-hover:text-accent/40 transition">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-base md:text-lg font-medium leading-[1.3] pt-0.5">
              {problem}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProgramSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bootcamp-grid-light opacity-30"
      />
      <div className="relative grid gap-10 p-8 md:p-12 lg:p-16 lg:grid-cols-[1.1fr,1fr] lg:items-end">
        <div className="space-y-5">
          <SectionLabel className="text-primary-foreground/50">PROGRAM</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.3]">
            이론에서 끝나지 않는
            <br />
            6주 실전 과정
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/75 max-w-lg leading-[1.3]">
            작업지시서 작성, 원가 계산, 샘플 의뢰까지 — 브랜드를 실제 생산
            가능한 상태로 만드는 모든 과정을 함께 진행합니다.
          </p>
          <div className="flex items-center gap-3 pt-2 text-sm text-primary-foreground/70">
            <Lightbulb className="h-4 w-4 shrink-0" />
            <span>매주 1:1 피드백 · 실습 중심 · 졸업 후 제작 연결</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PROGRAM_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <p className="text-[11px] uppercase tracking-wider text-primary-foreground/50">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-primary-foreground/60 mt-0.5">
                {stat.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CurriculumSection() {
  return (
    <section id="curriculum">
      <div className="text-center space-y-4 mb-12 md:mb-16">
        <SectionLabel>CURRICULUM</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          6주, 한 단계씩 쌓아가는 커리큘럼
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Week 1부터 Week 6까지, 생산 가능한 브랜드로 가는 경로를 설계합니다.
        </p>
      </div>

      <ol className="relative">
        <div
          aria-hidden
          className="absolute left-[1.125rem] md:left-6 top-3 bottom-3 w-px bg-border"
        />
        {CURRICULUM.map((item, index) => (
          <li key={item.week} className="relative pl-12 md:pl-16 pb-10 last:pb-0">
            <span
              className={cn(
                "absolute left-0 top-0 flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full border-2 bg-background text-xs md:text-sm font-bold tabular-nums",
                index === CURRICULUM.length - 1
                  ? "border-accent text-accent"
                  : "border-foreground/15 text-foreground",
              )}
            >
              {item.week}
            </span>
            <div className="rounded-2xl bg-background/90 p-5 md:p-6 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground">
                Week {item.week}
              </p>
              <h3 className="mt-1 text-lg md:text-xl font-bold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-[1.3]">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="rounded-3xl bg-brand-soft/50 p-8 md:p-12 lg:p-14">
      <div className="grid gap-10 lg:grid-cols-[1fr,1.2fr] lg:items-start">
        <div className="space-y-4">
          <SectionLabel>BENEFITS</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.3]">
            수료 후에도
            <br />
            계속 쓰는 혜택
          </h2>
          <p className="text-sm text-muted-foreground leading-[1.3] max-w-sm">
            템플릿·체크리스트·네트워크까지, 부트캠프 이후에도 브랜드 운영에
            바로 활용할 수 있습니다.
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-xs font-medium text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            실무 템플릿 · 공장 연결 · 커뮤니티 영구 참여
          </span>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 rounded-xl bg-background/80 border border-transparent p-4 transition hover:border-foreground/10"
            >
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="text-sm md:text-[15px] font-medium leading-[1.3]">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ApplySection() {
  return (
    <section id="apply" className="relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="rounded-3xl bg-background p-6 md:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
        <div className="grid gap-8 lg:grid-cols-[1fr,1.1fr] lg:gap-12">
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <SectionLabel>APPLY</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.3]">
              지금 신청하고
              <br />
              6주 후를 준비하세요
            </h2>
            <p className="text-sm text-muted-foreground leading-[1.3]">
              신청서 검토 후 24~48시간 이내 개별 연락드립니다. 선착순으로
              모집하며, 정원 마감 시 대기자 등록을 안내합니다.
            </p>
            <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 shrink-0 text-accent" />
                패션 브랜드·생산 실무 중심 커리큘럼
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-accent" />
                졸업 후 제작·공장 연결 지원
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-muted/30 p-5 md:p-7">
            <BootcampApplyForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
