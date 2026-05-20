import "server-only";
import { unstable_cache } from "next/cache";
import { FASHION_NEWS_TOTAL_COUNT } from "@/lib/constants";
import { enrichItemsWithOgImages } from "@/lib/news-og-image";
import { normalizeNewsImageUrl } from "@/lib/news-image";

export { FASHION_NEWS_TOTAL_COUNT };

export interface ExternalFashionNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  originalUrl: string;
  publishedAt: string;
  thumbnailUrl: string;
}

/** 한국어 패션·의류 뉴스 RSS (영문/해외 피드 제외) */
const RSS_FEEDS = [
  {
    name: "한국면세뉴스 패션",
    url: "https://www.kdfnews.com/rss/S2N5.xml",
  },
  {
    name: "연합뉴스 경제",
    url: "https://www.yna.co.kr/rss/economy.xml",
  },
  {
    name: "연합뉴스 문화",
    url: "https://www.yna.co.kr/rss/culture.xml",
  },
  {
    name: "연합뉴스 산업",
    url: "https://www.yna.co.kr/rss/industry.xml",
  },
  {
    name: "매일경제 경제",
    url: "https://www.mk.co.kr/rss/30100041/",
  },
  {
    name: "무신사 뉴스",
    url: "https://fashioncord.github.io/musinsa/news.xml",
  },
];

/** 패션·의류 도메인 키워드 (일반 경제·브랜드 뉴스 제외) */
const FASHION_KEYWORDS = [
  "패션",
  "의류",
  "K패션",
  "패션업계",
  "패션테크",
  "패션브랜드",
  "패션산업",
  "패션위크",
  "패딧",
  "faddit",
  "의상",
  "봉제",
  "원단",
  "섬유",
  "런웨이",
  "작업지시서",
  "의류제조",
  "패션스타트업",
  "룩북",
  "스타일링",
  "무신사",
  "동대문",
  "봉제공장",
  "의류브랜드",
];

const KOREAN_MEDIA_HOSTS = [
  "yna.co.kr",
  "mk.co.kr",
  "kdfnews.com",
  "mt.co.kr",
  "besuccess.com",
  "venturesquare.net",
  "munhwa.com",
  "hankyung.com",
  "sedaily.com",
  "fashionbiz.co.kr",
  "platum.io",
  "newspatch.co.kr",
  "fashioncord.github.io",
  "musinsa.com",
];

const CURATED_ARTICLES = [
  {
    title: "패딧, 엑셀·종이 문서 벗고 패션 제조 공정 디지털 전환",
    originalUrl: "https://www.mt.co.kr/future/2026/02/13/2026021308381359032",
    summary:
      "패션 제조 현장의 작업지시서/패턴 프로세스를 디지털로 전환하는 패딧의 서비스 소개 기사.",
    publishedAt: "Sun, 17 May 2026 13:38:13 +0900",
    source: "머니투데이",
    mediaImage: null as string | null,
    imageInDescription: null as string | null,
  },
  {
    title:
      "패션테크 스타트업 패딧, 의류 제작 디지털 표준 언어 서비스 정식 출시",
    originalUrl: "https://besuccess.com/?p=178478",
    summary:
      "패딧의 작업지시서·패턴 기반 디지털 협업 구조를 소개한 스타트업 미디어 기사.",
    publishedAt: "Sun, 17 May 2026 13:30:00 +0900",
    source: "beSUCCESS",
    mediaImage: null as string | null,
    imageInDescription: null as string | null,
  },
  {
    title: "패딧, 중기부 팁스 선정",
    originalUrl: "https://www.venturesquare.net/1029992/",
    summary:
      "패션 제조 데이터 표준화 솔루션을 운영하는 패딧의 팁스 선정 소식을 다룬 기사.",
    publishedAt: "Sun, 17 May 2026 13:20:00 +0900",
    source: "벤처스퀘어",
    mediaImage: null as string | null,
    imageInDescription: null as string | null,
  },
  {
    title:
      "패션 테크 패딧, 패션 제조 공정 DX 솔루션 출시…글로벌 바이어·공장 협업 겨냥",
    originalUrl: "https://besuccess.com/?p=180072",
    summary:
      "작업지시서·패턴 통합 DX 솔루션을 공식 출시하고 글로벌 생산 협업을 목표로 한다는 패딧 소식.",
    publishedAt: "Sun, 17 May 2026 13:15:00 +0900",
    source: "beSUCCESS",
    mediaImage: null as string | null,
    imageInDescription: null as string | null,
  },
];

const CURATED_URLS = new Set(CURATED_ARTICLES.map((item) => item.originalUrl));

const FEED_POOL_SIZE = FASHION_NEWS_TOTAL_COUNT;

type RawNewsItem = {
  title: string;
  originalUrl: string;
  summary: string;
  publishedAt: string;
  source: string;
  mediaImage: string | null;
  imageInDescription: string | null;
};

function decodeHtml(input: string) {
  return input
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(input: string) {
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeHtml(match[1].trim()) : "";
}

function extractFirstImageUrl(block: string): string | null {
  const candidates = [
    block.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*>/i)?.[1],
    block.match(/<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*>/i)?.[1],
    block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i)?.[1],
    block.match(/<enclosure[^>]+type=["']image[^"']*["'][^>]+url=["']([^"']+)["']/i)?.[1],
    block.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)?.[1],
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    const url = raw.trim().replace(/&amp;/g, "&");
    if (/^https?:\/\//i.test(url) && !/favicon|pixel|1x1/i.test(url)) {
      return normalizeNewsImageUrl(url);
    }
  }
  return null;
}

function hasHangul(text: string) {
  return /[\uAC00-\uD7A3]/.test(text);
}

function isKoreanArticle(item: { title: string; originalUrl: string }) {
  if (!hasHangul(item.title)) return false;
  try {
    const host = new URL(item.originalUrl).hostname.toLowerCase().replace(/^www\./, "");
    if (host.endsWith(".kr")) return true;
    return KOREAN_MEDIA_HOSTS.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}

function isFashionArticle(item: { title: string; summary: string; originalUrl: string }) {
  if (CURATED_URLS.has(item.originalUrl)) return true;
  const text = `${item.title} ${item.summary}`.toLowerCase();
  return FASHION_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()));
}

function pickFallbackQuery(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase();
  const matches = (keywords: string[]) => keywords.some((keyword) => text.includes(keyword));

  if (matches(["ai", "인공지능", "생성", "패션테크", "테크", "기술"])) {
    return "ai,fashion,technology";
  }
  if (matches(["브랜드", "디자인", "런웨이", "컬렉션", "트렌드", "패션위크"])) {
    return "fashion,runway,designer";
  }
  if (matches(["투자", "실적", "매출", "시장", "성장", "리테일", "유통"])) {
    return "business,retail,fashion";
  }
  if (matches(["채용", "커리어", "인재", "조직", "팀"])) {
    return "team,office,business";
  }
  if (matches(["공장", "생산", "봉제", "원단", "제조", "섬유"])) {
    return "garment,factory,textile";
  }
  if (matches(["패딧", "faddit", "작업지시서"])) {
    return "fashion,saas,workflow";
  }
  return "korean,fashion,industry";
}

/** RSS·OG 모두 없을 때만 사용하는 placeholder */
function makeThumbnailFallback(seed: string, title: string, summary: string) {
  const sig = Math.abs(
    Array.from(`${seed}::${pickFallbackQuery(title, summary)}`).reduce(
      (acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0,
      7,
    ),
  );
  return `https://picsum.photos/seed/${sig}/640/400`;
}

const FEED_FETCH_TIMEOUT_MS = 4000;

async function fetchFeedItems(url: string, sourceName: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FEED_FETCH_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate: 1800 },
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
  if (!response.ok) return [];
  const xml = await response.text();
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return itemBlocks.map((block) => {
    const title = stripTags(extractTag(block, "title"));
    const originalUrl = extractTag(block, "link");
    const description =
      extractTag(block, "description") || extractTag(block, "content:encoded");
    const summary = stripTags(description);
    const publishedAt = extractTag(block, "pubDate");
    const itemSource = stripTags(extractTag(block, "source")) || sourceName;
    const rssImage = extractFirstImageUrl(block);
    return {
      title,
      originalUrl,
      summary,
      publishedAt,
      source: itemSource,
      mediaImage: rssImage,
      imageInDescription: rssImage,
    };
  });
}

async function buildFashionNewsPool(): Promise<ExternalFashionNewsItem[]> {
  const fetchedItems = (
    await Promise.all(
      RSS_FEEDS.map((feed) =>
        fetchFeedItems(feed.url, feed.name).catch(() => []),
      ),
    )
  ).flat();
  const allItems: RawNewsItem[] = [...CURATED_ARTICLES, ...fetchedItems];

  const dedupeByUrl = <T extends { originalUrl: string }>(items: T[]) =>
    items.filter(
      (item, index, arr) =>
        arr.findIndex((x) => x.originalUrl === item.originalUrl) === index,
    );

  const filtered = dedupeByUrl(
    allItems.filter(
      (item) =>
        item.title &&
        item.originalUrl &&
        isKoreanArticle(item) &&
        isFashionArticle(item),
    ),
  ).sort((a, b) => {
    const aIsCurated = CURATED_URLS.has(a.originalUrl);
    const bIsCurated = CURATED_URLS.has(b.originalUrl);
    if (aIsCurated && !bIsCurated) return -1;
    if (!aIsCurated && bIsCurated) return 1;
    const aTime = new Date(a.publishedAt).getTime() || 0;
    const bTime = new Date(b.publishedAt).getTime() || 0;
    return bTime - aTime;
  });

  const merged = filtered.slice(0, FEED_POOL_SIZE);
  const ogImages = await enrichItemsWithOgImages(merged);

  return merged.map((item) => {
    const rawThumbnail =
      item.mediaImage ??
      item.imageInDescription ??
      ogImages.get(item.originalUrl) ??
      makeThumbnailFallback(
        `${item.title}::${item.publishedAt}`,
        item.title,
        item.summary,
      );
    const thumbnailUrl = normalizeNewsImageUrl(rawThumbnail);
    return {
      id: `${item.originalUrl}::${item.publishedAt}`,
      title: item.title,
      summary: item.summary || "원문에서 전체 내용을 확인하세요.",
      source: item.source,
      originalUrl: item.originalUrl,
      publishedAt: item.publishedAt,
      thumbnailUrl,
    } satisfies ExternalFashionNewsItem;
  });
}

const getCachedFashionNewsPool = unstable_cache(
  buildFashionNewsPool,
  ["external-fashion-news-pool", "v5"],
  { revalidate: 1800, tags: ["fashion-news"] },
);

export async function getExternalFashionNews(
  limit = FASHION_NEWS_TOTAL_COUNT,
): Promise<ExternalFashionNewsItem[]> {
  const pool = await getCachedFashionNewsPool();
  return pool.slice(0, limit);
}

/** RSS 풀을 미리 채워 /news 첫 방문 TTFB를 줄임 */
export async function warmFashionNewsCache(): Promise<void> {
  try {
    await getCachedFashionNewsPool();
  } catch (error) {
    console.warn("[warmFashionNewsCache]", error);
  }
}
