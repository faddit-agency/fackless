import "server-only";
import { unstable_cache } from "next/cache";
import { normalizeNewsImageUrl } from "@/lib/news-image";

const OG_FETCH_TIMEOUT_MS = 3500;
const OG_HTML_MAX_CHARS = 120_000;

function normalizeImageUrl(raw: string, pageUrl: string): string | null {
  try {
    const trimmed = raw.trim().replace(/&amp;/g, "&");
    if (!trimmed || trimmed.startsWith("data:")) return null;
    const absolute = new URL(trimmed, pageUrl).href;
    if (!/^https?:\/\//i.test(absolute)) return null;
    return absolute;
  } catch {
    return null;
  }
}

function isLikelyIconOrTracker(url: string) {
  return (
    /favicon|pixel|1x1|spacer|blank\.(gif|png)|\.ico(\?|$)/i.test(url) ||
    /logo[^/]*\.(png|svg)(\?|$)/i.test(url)
  );
}

function extractOgImageFromHtml(html: string, pageUrl: string): string | null {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["'][^>]*>/gi,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/gi,
  ];

  for (const pattern of patterns) {
    for (const match of html.slice(0, OG_HTML_MAX_CHARS).matchAll(pattern)) {
      const url = normalizeImageUrl(match[1], pageUrl);
      if (url && !isLikelyIconOrTracker(url)) return normalizeNewsImageUrl(url);
    }
  }
  return null;
}

export async function fetchArticleOgImage(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OG_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 86400 },
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) return null;
    const html = await response.text();
    return extractOgImageFromHtml(html, url);
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

const getCachedArticleOgImage = unstable_cache(
  async (url: string) => fetchArticleOgImage(url),
  ["article-og-image"],
  { revalidate: 86400 },
);

export async function resolveArticleOgImage(url: string): Promise<string | null> {
  return getCachedArticleOgImage(url);
}

const OG_BATCH_SIZE = 6;
const OG_ENRICH_LIMIT = 30;

export async function enrichItemsWithOgImages<
  T extends {
    originalUrl: string;
    mediaImage: string | null;
    imageInDescription: string | null;
  },
>(items: T[]): Promise<Map<string, string>> {
  const needsOg = items
    .filter((item) => !item.mediaImage && !item.imageInDescription)
    .slice(0, OG_ENRICH_LIMIT);

  const resolved = new Map<string, string>();

  for (let i = 0; i < needsOg.length; i += OG_BATCH_SIZE) {
    const batch = needsOg.slice(i, i + OG_BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (item) => {
        const image = await resolveArticleOgImage(item.originalUrl);
        return [item.originalUrl, image] as const;
      }),
    );
    for (const [url, image] of results) {
      if (image) resolved.set(url, image);
    }
  }

  return resolved;
}
