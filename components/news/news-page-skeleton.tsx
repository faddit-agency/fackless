export function NewsPageSkeleton() {
  return (
    <div className="grid gap-8 xl:grid-cols-[240px,minmax(0,1fr)] animate-pulse">
      <aside className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-36 rounded-full bg-muted" />
        ))}
      </aside>
      <section className="space-y-4">
        <div className="h-10 max-w-md rounded-md bg-muted" />
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[16/10] rounded-xl bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-5 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
