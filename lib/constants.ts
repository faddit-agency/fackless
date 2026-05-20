/** 수집·노출하는 패션 뉴스 전체 개수 */
export const FASHION_NEWS_TOTAL_COUNT = 30;

export const SITE_NAME = "PACKLESS";
export const SITE_TAGLINE = "패션 브랜드 실무 커뮤니티";
export const SITE_DESCRIPTION =
  "원단·공장·작업지시서·원가·브랜딩까지, 패션 브랜드를 만드는 사람들의 실무 허브.";

export const ROLE_TYPES = [
  { value: "designer", label: "디자이너" },
  { value: "pattern_maker", label: "패턴사" },
  { value: "factory", label: "공장" },
  { value: "brand", label: "브랜드" },
  { value: "general", label: "일반" },
] as const;

export type RoleType = (typeof ROLE_TYPES)[number]["value"];

export const DESIGNER_SPECIALTIES = [
  "여성복",
  "남성복",
  "유니섹스",
  "그래픽",
  "텍스타일",
] as const;

export const PATTERN_ITEMS = [
  "티셔츠",
  "셔츠",
  "팬츠",
  "아우터",
  "니트",
] as const;

export const FACTORY_ITEMS = [
  "우븐",
  "니트",
  "데님",
  "아우터",
  "잡화",
  "액세서리",
] as const;

export const BRAND_STAGES = [
  { value: "preparing", label: "준비 중" },
  { value: "operating", label: "운영 중" },
  { value: "renewing", label: "리뉴얼 중" },
] as const;

export const BRAND_INTERESTS = [
  "생산",
  "원단",
  "브랜딩",
  "마케팅",
  "원가",
] as const;

export const POST_TYPES = [
  { value: "question", label: "질문" },
  { value: "feedback", label: "피드백" },
  { value: "networking", label: "네트워킹" },
  { value: "article", label: "아티클" },
  { value: "news", label: "뉴스" },
] as const;

export type PostType = (typeof POST_TYPES)[number]["value"];

export const POST_TYPE_LABEL: Record<PostType, string> = {
  question: "질문",
  feedback: "피드백",
  networking: "네트워킹",
  article: "아티클",
  news: "뉴스",
};

export const ROLE_TYPE_LABEL: Record<RoleType, string> = {
  designer: "디자이너",
  pattern_maker: "패턴사",
  factory: "공장",
  brand: "브랜드",
  general: "일반",
};

export const RESOURCE_TYPES = [
  { value: "pdf", label: "PDF" },
  { value: "excel", label: "Excel" },
  { value: "notion", label: "Notion 템플릿" },
  { value: "figma", label: "Figma 템플릿" },
  { value: "link", label: "Google Sheet 링크" },
  { value: "faddit_template", label: "패딧 템플릿" },
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number]["value"];

export const FADDIT_URL =
  process.env.NEXT_PUBLIC_FADDIT_URL ?? "https://faddit.app";
