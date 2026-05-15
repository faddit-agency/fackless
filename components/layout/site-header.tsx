import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";
import { SITE_NAME } from "@/lib/constants";

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
      <div className="container flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-black">
            P
          </span>
          <span className="tracking-tight">{SITE_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            aria-label="검색"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Search className="h-4 w-4" />
          </Link>
          {profile ? (
            <UserMenu profile={profile} />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild size="sm" variant="accent">
                <Link href="/login">시작하기</Link>
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
