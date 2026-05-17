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
    <nav className="hidden md:flex items-center justify-center gap-1 text-sm">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "px-3 py-2 rounded-md font-bold text-[#181818] bg-muted/60"
                : "px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
