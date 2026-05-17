import Link from "next/link";
import {
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BootcampApplyForm } from "./apply-form";

export const metadata = {
  title: "패클스 부트캠프",
  description:
    "내 브랜드를 실제 생산 가능한 상태까지 만드는 6주 실전 과정.",
};

const PROBLEMS = [
  "브랜드는 시작했지만, 생산 단계에서 막힌다",
  "원단·공장·MOQ·작업지시서·원가가 너무 어렵다",
  "샘플은 만들었는데 시장에 내보낼 자신이 없다",
  "혼자 결정하기엔 검증해줄 사람이 없다",
];

const CURRICULUM = [
  {
    week: "Week 1",
    title: "브랜드 구조 설계",
    detail:
      "타깃, 컨셉, 가격대, 시장 포지셔닝까지 — 브랜드의 뼈대를 함께 설계합니다.",
  },
  {
    week: "Week 2",
    title: "생산 구조 이해",
    detail:
      "원단·부자재·봉제 공장의 생산 흐름과 협업 구조를 실제 사례로 익힙니다.",
  },
  {
    week: "Week 3",
    title: "작업지시서 실습",
    detail:
      "패딧 템플릿을 활용해 봉제 공장이 좋아하는 작업지시서를 직접 만들어봅니다.",
  },
  {
    week: "Week 4",
    title: "원가 계산과 샘플 제작",
    detail:
      "원단·부자재·공임·로스율·물류까지 반영한 진짜 원가를 계산합니다.",
  },
  {
    week: "Week 5",
    title: "브랜딩 / 상세페이지 / SNS",
    detail:
      "제품이 만들어진 뒤 시장에 닿게 하는 콘텐츠 구조를 설계합니다.",
  },
  {
    week: "Week 6",
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

export default function BootcampPage() {
  return (
    <div>
      <HeroSection />
      <div className="container space-y-20 mt-16">
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
    <section className="border-b bg-gradient-to-br from-primary via-primary to-brand-deep text-primary-foreground">
      <div className="container py-16 md:py-28 grid gap-8 md:grid-cols-[1.4fr,1fr] items-end">
        <div className="space-y-6">
          <Badge
            variant="accent"
            className="rounded-full px-3 py-1 bg-accent text-accent-foreground"
          >
            패클스 부트캠프 · 6주 실전 과정
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.5]">
            내 브랜드를 실제 생산 가능한 <br className="hidden md:block" />
            상태까지 만드는 6주 실전 과정.
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/80 max-w-xl leading-[1.5]">
            강의 + 실습 + 피드백 + 제작 연결까지, 브랜드를 진짜 시장에 내보낼
            준비를 함께 합니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="xl" variant="accent">
              <Link href="#apply">신청하기</Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="bg-transparent border-white/40 text-white hover:bg-white/10"
            >
              <Link href="#curriculum">커리큘럼 보기</Link>
            </Button>
          </div>
        </div>
        <ul className="space-y-3 rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-6">
          <li className="flex gap-3 items-start">
            <Sparkles className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-semibold">실제 제작 연결</p>
              <p className="text-sm text-primary-foreground/75">
                실제 공장·패턴사와 연결되어 졸업 후 바로 제작 가능
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <Lightbulb className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-semibold">현직자 피드백</p>
              <p className="text-sm text-primary-foreground/75">
                10년차 디자이너·MD·생산 PM이 매주 1:1로 피드백
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <Rocket className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-semibold">패딧 무료 체험</p>
              <p className="text-sm text-primary-foreground/75">
                작업지시서 SaaS 패딧을 부트캠프 기간 무료 이용
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section>
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          이런 분들을 위해
        </p>
        <h2 className="text-2xl md:text-3xl font-bold">
          브랜드는 시작했지만, 진짜 어려운 건 그 다음이에요.
        </h2>
      </div>
      <ul className="mt-8 grid gap-3 md:grid-cols-2">
        {PROBLEMS.map((p) => (
          <li
            key={p}
            className="rounded-xl border bg-card p-4 flex items-start gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-sm md:text-base">{p}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProgramSection() {
  return (
    <section className="rounded-2xl border bg-card p-8 md:p-12 grid gap-8 md:grid-cols-2 items-center">
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          PROGRAM
        </p>
        <h2 className="text-2xl md:text-3xl font-bold">
          4~6주, 실제 제작까지 연결되는 실전 과정
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          이론 강의에서 끝나지 않아요. 직접 작업지시서를 만들고, 원가를
          계산하고, 샘플을 의뢰하는 모든 과정을 함께 진행합니다.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="기간" value="6주" />
        <Stat label="방식" value="온라인 + 오프라인" />
        <Stat label="피드백" value="매주 1:1" />
        <Stat label="제작 연결" value="포함" />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
}

function CurriculumSection() {
  return (
    <section id="curriculum">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          CURRICULUM
        </p>
        <h2 className="text-2xl md:text-3xl font-bold">6주 커리큘럼</h2>
      </div>
      <ol className="mt-8 grid gap-3 md:grid-cols-2">
        {CURRICULUM.map((week) => (
          <li
            key={week.week}
            className="rounded-xl border bg-card p-5 space-y-2"
          >
            <p className="text-xs font-semibold text-primary">{week.week}</p>
            <h3 className="text-lg font-bold">{week.title}</h3>
            <p className="text-sm text-muted-foreground">{week.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section>
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          BENEFIT
        </p>
        <h2 className="text-2xl md:text-3xl font-bold">제공 혜택</h2>
      </div>
      <ul className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <li
            key={b}
            className="rounded-xl border bg-card p-4 flex items-center gap-3"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-primary">
              <GraduationCap className="h-5 w-5" />
            </span>
            <p className="text-sm md:text-base font-medium">{b}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ApplySection() {
  return (
    <section id="apply" className="rounded-2xl border bg-card p-6 md:p-10">
      <div className="space-y-2 mb-6">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          APPLY
        </p>
        <h2 className="text-2xl md:text-3xl font-bold">신청하기</h2>
        <p className="text-sm text-muted-foreground">
          신청서를 검토 후 별도로 연락드립니다. (24~48시간 이내)
        </p>
      </div>
      <BootcampApplyForm />
    </section>
  );
}
