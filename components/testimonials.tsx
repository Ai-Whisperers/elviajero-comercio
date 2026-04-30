export interface Testimonial {
  quote: string; author?: string; role?: string; rating?: number
}

export function TestimonialsGrid({ title, subtitle, items }: {
  title: string; subtitle?: string; items: Testimonial[]
}) {
  if (!items?.length) return null
  const cols = items.length >= 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'

  return (
    <section className="bg-surface-light py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`grid gap-6 ${cols}`}>
          {items.map((t, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 sm:p-10">
              {t.rating && <div className="mb-3 flex gap-1">{Array.from({length:5}).map((_,j) => (
                <span key={j} className={j < t.rating! ? 'text-secondary' : 'text-muted'}>★</span>
              ))}</div>}
              <blockquote className="mb-4 text-base leading-relaxed text-foreground sm:text-lg">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="border-t border-border pt-3">
                <p className="font-medium text-foreground">{t.author}</p>
                {t.role && <p className="text-sm text-muted-foreground">{t.role}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
