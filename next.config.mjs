/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "kr.object.ncloudstorage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "yna.co.kr" },
      { protocol: "https", hostname: "*.yna.co.kr" },
      { protocol: "https", hostname: "mk.co.kr" },
      { protocol: "https", hostname: "*.mk.co.kr" },
      { protocol: "https", hostname: "kdfnews.com" },
      { protocol: "https", hostname: "*.kdfnews.com" },
      { protocol: "https", hostname: "mt.co.kr" },
      { protocol: "https", hostname: "*.mt.co.kr" },
      { protocol: "https", hostname: "besuccess.com" },
      { protocol: "https", hostname: "*.besuccess.com" },
      { protocol: "https", hostname: "venturesquare.net" },
      { protocol: "https", hostname: "*.venturesquare.net" },
      { protocol: "https", hostname: "munhwa.com" },
      { protocol: "https", hostname: "*.munhwa.com" },
      { protocol: "https", hostname: "musinsa.com" },
      { protocol: "https", hostname: "*.musinsa.com" },
      { protocol: "https", hostname: "kakaocdn.net" },
      { protocol: "https", hostname: "*.kakaocdn.net" },
      { protocol: "https", hostname: "daumcdn.net" },
      { protocol: "https", hostname: "*.daumcdn.net" },
      { protocol: "https", hostname: "hankyung.com" },
      { protocol: "https", hostname: "*.hankyung.com" },
      { protocol: "https", hostname: "platum.io" },
      { protocol: "https", hostname: "*.platum.io" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
