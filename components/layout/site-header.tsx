import Link from "next/link";
import { Menu } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { BrandLogoLink } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { HeaderNav } from "@/components/layout/header-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

const NAV = [
  { href: "/news", label: "뉴스" },
  { href: "/articles", label: "실무 콘텐츠" },
  { href: "/community", label: "커뮤니티" },
  { href: "/resources", label: "무료 자료실" },
  { href: "/bootcamp", label: "부트캠프" },
];

export async function SiteHeader() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container grid h-16 grid-cols-[auto,1fr,auto] items-center gap-4">
        <BrandLogoLink priority />

        <HeaderNav items={NAV} />

        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />
          {profile ? (
            <UserMenu profile={profile} />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild size="sm" variant="accent">
                <Link href="/signup">회원가입</Link>
              </Button>
            </>
          )}
          <Link
            href="/menu"
            aria-label="메뉴"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
