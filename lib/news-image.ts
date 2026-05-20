/** RSS·OG 이미지 URL을 next/image에 맞게 정규화 (http → https) */
export function normalizeNewsImageUrl(url: string): string {
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === "http:") {
      parsed.protocol = "https:";
    }
    return parsed.href;
  } catch {
    return url;
  }
}

/** next/image 최적화 가능한 뉴스 썸네일 호스트 */
const OPTIMIZABLE_HOST_SUFFIXES = [
  "picsum.photos",
  "images.unsplash.com",
  "yna.co.kr",
  "mk.co.kr",
  "kdfnews.com",
  "mt.co.kr",
  "besuccess.com",
  "venturesquare.net",
  "munhwa.com",
  "hankyung.com",
  "sedaily.com",
  "platum.io",
  "musinsa.com",
  "kakaocdn.net",
  "daumcdn.net",
  "ncloudstorage.com",
  "supabase.co",
];

export function canOptimizeNewsImage(url: string): boolean {
  try {
    const host = new URL(normalizeNewsImageUrl(url)).hostname
      .replace(/^www\./, "")
      .toLowerCase();
    return OPTIMIZABLE_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    );
  } catch {
    return false;
  }
}
