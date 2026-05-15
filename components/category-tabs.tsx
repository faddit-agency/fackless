import Link from "next/link";
import type { Category } from "@/lib/database.types";
import { cn } from "@/lib/utils";

interface Props {
  basePath: string;
  categories: Category[];
  activeSlug?: string;
}

export function CategoryTabs({ basePath, categories, activeSlug }: Props) {
  return (
    <nav
      className="flex flex-wrap items-center gap-1 overflow-x-auto"
      aria-label="카테고리"
    >
      <CategoryLink
        href={basePath}
        label="전체"
        active={!activeSlug}
      />
      {categories.map((cat) => (
        <CategoryLink
          key={cat.id}
          href={`${basePath}?category=${cat.slug}`}
          label={cat.name}
          active={activeSlug === cat.slug}
        />
      ))}
    </nav>
  );
}

function CategoryLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "hover:border-foreground/30 text-muted-foreground",
      )}
    >
      {label}
    </Link>
  );
}
