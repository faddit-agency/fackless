import Link from "next/link";
import { getHeaderProfile } from "@/lib/auth";
import { BrandLogoLink } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { HeaderNav } from "@/components/layout/header-nav";
import { MobileNavMenu } from "@/components/layout/mobile-nav-menu";
import { UserMenu } from "@/components/layout/user-menu";

const NAV = [
  { href: "/news", label: "뉴스" },
  { href: "/articles", label: "실무 콘텐츠" },
  { href: "/community", label: "커뮤니티" },
  { href: "/resources", label: "무료 자료실" },
  { href: "/bootcamp", label: "부트캠프" },
];

export async function SiteHeader() {
  const profile = await getHeaderProfile();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container grid h-16 grid-cols-[auto,1fr,auto] items-center gap-4">
        <BrandLogoLink priority />

        <HeaderNav items={NAV} />

        <div className="flex items-center justify-end gap-2">
          {profile ? (
            <div className="hidden md:block">
              <UserMenu profile={profile} />
            </div>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                <Link href="/login">로그인</Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="accent"
                className="hidden md:inline-flex"
              >
                <Link href="/signup">회원가입</Link>
              </Button>
            </>
          )}
          <MobileNavMenu navItems={NAV} profile={profile} />
        </div>
      </div>
    </header>
  );
}
