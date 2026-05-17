export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // next build 단계에서는 RSS 워밍 생략 (Vercel 빌드 타임아웃 방지)
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { warmFashionNewsCache } = await import("@/lib/external-fashion-news");
  void warmFashionNewsCache();
}
