"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface HeaderNavItem {
  href: string;
  label: string;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav({ items }: { items: HeaderNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center justify-center gap-0.5 text-[15px]">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "px-4 py-2 font-bold text-foreground"
                : "px-4 py-2 font-medium text-muted-foreground hover:text-foreground transition"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
