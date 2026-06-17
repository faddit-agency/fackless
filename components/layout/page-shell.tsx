import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  action?: React.ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  align = "center",
  action,
  className,
}: PageHeroProps) {
  const centered = align === "center";

  return (
    <section className={cn("page-hero", className)}>
      <div
        className={cn(
          "page-hero-inner",
          centered ? "text-center" : "text-left",
        )}
      >
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="page-hero-title whitespace-pre-line">{title}</h1>
        {description ? (
          <p className="page-hero-desc">{description}</p>
        ) : null}
        {action ? (
          <div className={cn("pt-2", centered && "flex justify-center")}>
            {action}
          </div>
        ) : null}
      </div>
    </section>
  );
}

interface PageBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function PageBody({ children, className }: PageBodyProps) {
  return (
    <div className={cn("container py-10 md:py-12 space-y-8", className)}>
      {children}
    </div>
  );
}

interface AuthCardShellProps {
  children: React.ReactNode;
}

export function AuthCardShell({ children }: AuthCardShellProps) {
  return (
    <div className="page-hero min-h-[calc(100vh-4.25rem)] flex items-center">
      <div className="container py-12 md:py-16 w-full max-w-md mx-auto">
        <div className="rounded-2xl border bg-card p-7 md:p-9 shadow-sm space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
