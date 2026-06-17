import Link from "next/link";
import type { Category } from "@/lib/database.types";
import { getPastelChipStyle } from "@/lib/chip-colors";
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
  const chip = getPastelChipStyle(label);

  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-2 text-sm whitespace-nowrap transition font-medium",
        active
          ? "bg-foreground text-background"
          : cn(chip.bg, chip.text, "hover:opacity-90"),
      )}
    >
      {label}
    </Link>
  );
}
