import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/constants";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://packless.app"
).replace(/\/$/, "");

export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image";
export const BRAND_LOGO_PATH = "/logo-packless.png";

export const SEO_KEYWORDS = [
  "패션 브랜드",
  "패션 스타트업",
  "의류 생산",
  "작업지시서",
  "원단",
  "봉제 공장",
  "K패션",
  "패션테크",
  "브랜드 운영",
  "원가 계산",
  "패션 커뮤니티",
  "PACKLESS",
  "패클스",
];

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function toMetaDescription(text: string, max = 160): string {
  const plain = text
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*`_>\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max - 1).trim()}…`;
}

export function createPageMetadata(options: {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}): Metadata {
  const description = options.description ?? SITE_DESCRIPTION;
  const canonical = options.path ? absoluteUrl(options.path) : SITE_URL;
  const ogImage = options.image
    ? absoluteUrl(options.image)
    : absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const fullTitle =
    options.title.includes(SITE_NAME) || options.title.includes("패클스")
      ? options.title
      : `${options.title} | ${SITE_NAME}`;

  return {
    title: options.title,
    description,
    keywords: SEO_KEYWORDS,
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: options.ogType ?? "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
      ...(options.publishedTime
        ? { publishedTime: options.publishedTime }
        : {}),
      ...(options.modifiedTime ? { modifiedTime: options.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    ...(options.authors?.length
      ? { authors: options.authors.map((name) => ({ name })) }
      : {}),
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, telephone: false },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} · ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  ...(process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
    ? {
        other: {
          "naver-site-verification":
            process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION,
        },
      }
    : {}),
};

export const noIndexMetadata: Metadata = {
  robots: { index: false, follow: false },
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "패클스",
    url: SITE_URL,
    logo: absoluteUrl(BRAND_LOGO_PATH),
    description: SITE_DESCRIPTION,
    email: "hello@packless.app",
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "패클스",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko-KR",
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function articleJsonLd(options: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName?: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    url: absoluteUrl(options.path),
    datePublished: options.publishedTime,
    dateModified: options.modifiedTime ?? options.publishedTime,
    inLanguage: "ko-KR",
    author: {
      "@type": "Person",
      name: options.authorName ?? SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(BRAND_LOGO_PATH),
      },
    },
    ...(options.image
      ? { image: [absoluteUrl(options.image)] }
      : { image: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)] }),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
