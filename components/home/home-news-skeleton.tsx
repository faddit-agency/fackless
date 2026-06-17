export function HomeNewsSkeleton() {
  return (
    <section className="space-y-4 animate-pulse">
      <div className="h-7 w-40 rounded bg-muted" />
      <div className="h-4 w-72 max-w-full rounded bg-muted" />
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[16/10] rounded-xl bg-muted/60" />
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}
