import "server-only";
import { unstable_cache } from "next/cache";

export interface ExternalFashionNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  originalUrl: string;
  publishedAt: string;
  thumbnailUrl: string;
}

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
    name: "Fibre2Fashion Apparel",
    url: "https://feeds.feedburner.com/fibre2fashion/apparelnews",
  },
];

const FASHION_KEYWORDS = [
  "패션",
  "의류",
  "브랜드",
  "디자이너",
  "섬유",
  "K패션",
  "패션업계",
  "스타일",
  "럭셔리",
  "패션테크",
  "패딧",
  "faddit",
  "작업지시서",
  "봉제",
  "생산",
  "리테일",
  "md",
  "동대문",
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
];

const FEED_POOL_SIZE = 72;

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

/** 네트워크 요청 없이 시드 기반 placeholder (picsum CDN) */
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
    const summary = stripTags(extractTag(block, "description"));
    const publishedAt = extractTag(block, "pubDate");
    const itemSource = stripTags(extractTag(block, "source")) || sourceName;
    const mediaImage =
      block.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
    const imageInDescription =
      block.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
    return {
      title,
      originalUrl,
      summary,
      publishedAt,
      source: itemSource,
      mediaImage,
      imageInDescription,
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
  const allItems = [...CURATED_ARTICLES, ...fetchedItems];

  const filtered = allItems
    .filter((item) => {
      if (!item.title || !item.originalUrl) return false;
      const text = `${item.title} ${item.summary}`.toLowerCase();
      return FASHION_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()));
    })
    .filter(
      (item, index, arr) =>
        arr.findIndex((x) => x.originalUrl === item.originalUrl) === index,
    )
    .sort((a, b) => {
      const aIsCurated = CURATED_ARTICLES.some(
        (curated) => curated.originalUrl === a.originalUrl,
      );
      const bIsCurated = CURATED_ARTICLES.some(
        (curated) => curated.originalUrl === b.originalUrl,
      );
      if (aIsCurated && !bIsCurated) return -1;
      if (!aIsCurated && bIsCurated) return 1;
      const aTime = new Date(a.publishedAt).getTime() || 0;
      const bTime = new Date(b.publishedAt).getTime() || 0;
      return bTime - aTime;
    })
    .slice(0, FEED_POOL_SIZE);

  return filtered.map((item) => {
    const thumbnailUrl =
      item.mediaImage ??
      item.imageInDescription ??
      makeThumbnailFallback(
        `${item.title}::${item.publishedAt}`,
        item.title,
        item.summary,
      );
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
  ["external-fashion-news-pool"],
  { revalidate: 1800, tags: ["fashion-news"] },
);

export async function getExternalFashionNews(
  limit = 24,
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
