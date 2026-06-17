import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  className,
}: FeatureCardProps) {
  const content = (
    <>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-accent">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div className="space-y-2">
        <h3 className="text-base md:text-lg font-bold tracking-tight leading-snug">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </>
  );

  const cardClass = cn(
    "flex flex-col gap-4 rounded-2xl border bg-card p-6 md:p-7 transition hover:border-foreground/15 hover:shadow-sm",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(cardClass, "group")}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}

interface MarketingSectionProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function MarketingSection({
  eyebrow,
  title,
  description,
  className,
  children,
}: MarketingSectionProps) {
  return (
    <section className={cn("text-center space-y-4", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-[1.25] whitespace-pre-line">
        {title}
      </h2>
      {description ? (
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}
