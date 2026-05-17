export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { warmFashionNewsCache } = await import("@/lib/external-fashion-news");
  void warmFashionNewsCache();
}
