import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  moreHref?: string;
  moreLabel?: string;
  className?: string;
}

export function SectionHeading({
  title,
  description,
  moreHref,
  moreLabel = "전체 보기",
  className,
}: Props) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-5", className)}>
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {moreHref ? (
        <Link
          href={moreHref}
          className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 whitespace-nowrap"
        >
          {moreLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
