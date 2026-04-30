export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden animate-pulse">
      <div className="aspect-[3/2] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-5 bg-muted rounded w-1/4" />
        <div className="h-9 bg-muted rounded w-full mt-2" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="min-h-[70vh] bg-muted animate-pulse flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-8 bg-muted-foreground/20 rounded w-96 mx-auto" />
        <div className="h-4 bg-muted-foreground/20 rounded w-64 mx-auto" />
        <div className="h-10 bg-muted-foreground/20 rounded w-40 mx-auto" />
      </div>
    </div>
  )
}
