'use client'
export function StatsCounter({ items }: { items: Array<{ value: string; label: string }> }) {
  if (!items?.length) return null
  return (
    <section className="bg-surface py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className={`grid gap-6 sm:gap-8 ${items.length === 3 ? 'grid-cols-3' : items.length === 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-primary sm:text-4xl">{item.value}</div>
              <div className="mt-1 text-xs font-medium text-white/90 sm:text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
