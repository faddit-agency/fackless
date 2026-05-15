"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessagesSquare, Download, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
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
];

export function MobileBottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/login") || pathname.startsWith("/onboarding")) {
    return null;
  }
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 md:hidden border-t bg-background/95 backdrop-blur"
      aria-label="모바일 메인 네비게이션"
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px]",
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
