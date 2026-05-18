"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Home,
  Menu,
  MessagesSquare,
  Download,
  GraduationCap,
  User,
  Newspaper,
  FileText,
  Users,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import type { HeaderProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { ROLE_TYPE_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { HeaderNavItem } from "@/components/layout/header-nav";

const QUICK_LINKS = [
  { href: "/", label: "홈", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/community",
    label: "커뮤니티",
    icon: MessagesSquare,
    match: (p: string) => p.startsWith("/community"),
  },
  {
    href: "/resources",
    label: "자료",
    icon: Download,
    match: (p: string) => p.startsWith("/resources"),
  },
  {
    href: "/bootcamp",
    label: "부트캠프",
    icon: GraduationCap,
    match: (p: string) => p.startsWith("/bootcamp"),
  },
  {
    href: "/me",
    label: "내 정보",
    icon: User,
    match: (p: string) => p.startsWith("/me") || p.startsWith("/profile"),
  },
] as const;

const QUICK_HREFS = new Set<string>(QUICK_LINKS.map((item) => item.href));

const NAV_ICONS: Record<string, typeof Home> = {
  "/news": Newspaper,
  "/articles": FileText,
  "/community": Users,
  "/resources": Download,
  "/bootcamp": GraduationCap,
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface MobileNavMenuProps {
  navItems: HeaderNavItem[];
  profile: HeaderProfile | null;
}

export function MobileNavMenu({ navItems, profile }: MobileNavMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const exploreItems = navItems.filter((item) => !QUICK_HREFS.has(item.href));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    window.location.href = "/";
  };

  const panel =
    open && mounted ? (
      <div
        className="fixed inset-0 z-50 md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
      >
        <button
          type="button"
          aria-label="메뉴 닫기"
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
        />
        <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-background shadow-xl">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <p className="text-sm font-semibold">메뉴</p>
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {profile ? (
              <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
                <UserAvatar
                  nickname={profile.nickname}
                  avatarUrl={profile.avatar_url}
                  className="h-10 w-10"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {profile.nickname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ROLE_TYPE_LABEL[profile.role_type]}
                    {profile.is_verified_expert ? " · 전문가" : ""}
                  </p>
                </div>
              </div>
            ) : null}

            <section className="space-y-1">
              <p className="px-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                바로가기
              </p>
              {QUICK_LINKS.map((item) => {
                const Icon = item.icon;
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </section>

            {exploreItems.length > 0 ? (
              <section className="space-y-1">
                <p className="px-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  탐색
                </p>
                {exploreItems.map((item) => {
                  const Icon = NAV_ICONS[item.href] ?? FileText;
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                        active
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </section>
            ) : null}

            {profile ? (
              <section className="space-y-1 border-t pt-4">
                <Link
                  href={`/profile/${profile.user_id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                >
                  내 프로필
                </Link>
                <Link
                  href="/community/questions/new"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                >
                  질문 작성
                </Link>
                {profile.is_admin ? (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                  >
                    관리자
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  로그아웃
                </button>
              </section>
            ) : null}
          </div>

          {!profile ? (
            <div className="border-t p-4 space-y-2">
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/login" onClick={() => setOpen(false)}>
                  로그인
                </Link>
              </Button>
              <Button asChild variant="accent" className="w-full" size="lg">
                <Link href="/signup" onClick={() => setOpen(false)}>
                  회원가입
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
      >
        <Menu className="h-5 w-5" />
      </button>
      {mounted && panel ? createPortal(panel, document.body) : null}
    </>
  );
}
