import { BrandLogoLink } from "@/components/brand-logo";
import { HeaderNav } from "@/components/layout/header-nav";

const NAV = [
  { href: "/news", label: "뉴스" },
  { href: "/articles", label: "실무 콘텐츠" },
  { href: "/community", label: "커뮤니티" },
  { href: "/resources", label: "무료 자료실" },
  { href: "/bootcamp", label: "부트캠프" },
];

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container grid h-16 grid-cols-[auto,1fr,auto] items-center gap-4">
        <BrandLogoLink priority />
        <HeaderNav items={NAV} />
        <div className="flex items-center justify-end gap-2">
          <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
          <div className="hidden sm:flex gap-2">
            <div className="h-8 w-14 rounded-md bg-muted animate-pulse" />
            <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
