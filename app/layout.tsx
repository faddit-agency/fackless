import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { HeaderSkeleton } from "@/components/layout/header-skeleton";
import { SiteFooter } from "@/components/layout/site-footer";
import { SetupBanner } from "@/components/layout/setup-banner";
import { rootMetadata } from "@/lib/seo";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#277CFA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background flex flex-col">
        <SetupBanner />
        <Suspense fallback={<HeaderSkeleton />}>
          <SiteHeader />
        </Suspense>
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
