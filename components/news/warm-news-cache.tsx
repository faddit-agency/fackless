import { warmFashionNewsCache } from "@/lib/external-fashion-news";

/** 백그라운드 RSS 캐시 워밍 — 렌더를 막지 않음 */
export function WarmNewsCacheTrigger() {
  void warmFashionNewsCache();
  return null;
}
