export function HomeFeedsSkeleton() {
  return (
    <div className="space-y-16 animate-pulse">
      {Array.from({ length: 4 }).map((_, section) => (
        <section key={section} className="space-y-4">
          <div className="h-7 w-48 rounded bg-muted" />
          <div className="h-4 w-72 max-w-full rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl border bg-muted/60" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
