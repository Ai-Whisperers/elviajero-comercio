
"use client"
export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 aspect-[3/2] rounded-lg bg-muted" />
      <div className="h-3 w-2/3 rounded bg-muted mb-2" />
      <div className="h-4 w-1/2 rounded bg-muted mb-2" />
      <div className="h-3 w-1/3 rounded bg-muted" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={"h-3 rounded bg-muted " + (i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  )
}
