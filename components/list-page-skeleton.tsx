export function ListPageSkeleton() {
  return (
    <div className="container py-10 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-8 w-56 rounded bg-muted" />
        <div className="h-4 w-80 max-w-full rounded bg-muted" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-20 rounded-full bg-muted" />
        ))}
      </div>
      <div className="h-10 max-w-md rounded-md bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 rounded-xl border bg-muted/50" />
        ))}
      </div>
    </div>
  );
}
