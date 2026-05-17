import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { HeaderSkeleton } from "@/components/layout/header-skeleton";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SetupBanner } from "@/components/layout/setup-banner";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SetupBanner />
          <Suspense fallback={<HeaderSkeleton />}>
            <SiteHeader />
          </Suspense>
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <SiteFooter />
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
