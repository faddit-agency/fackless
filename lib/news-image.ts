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
  "feedburner.com",
  "fibre2fashion.com",
  "kakaocdn.net",
  "ncloudstorage.com",
  "supabase.co",
];

export function canOptimizeNewsImage(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    return OPTIMIZABLE_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    );
  } catch {
    return false;
  }
}
