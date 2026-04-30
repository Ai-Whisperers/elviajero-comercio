import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface ServiceItem {
  name: string; description?: string; priceUSD?: string; pricePYG?: string
  delivery?: string; includes?: string[]; category?: string
}

export function ServicesSection({ data }: { data: { title?: string; subtitle?: string; items?: ServiceItem[] } }) {
  if (!data?.items?.length) return null
  const grouped: Record<string, ServiceItem[]> = {}
  for (const item of data.items) {
    const cat = item.category || "Otros"
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(item)
  }

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">{data.title}</h2>
          {data.subtitle && <p className="text-muted-foreground">{data.subtitle}</p>}
        </div>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-12 last:mb-0">
            <h3 className="mb-6 text-xl font-semibold text-primary">{cat}</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((svc, i) => (
                <div key={i} className="flex flex-col rounded-xl border border-border bg-background p-6">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h4 className="text-lg font-semibold text-foreground">{svc.name}</h4>
                    {(svc.priceUSD || svc.pricePYG) && (
                      <Badge variant="outline" className="shrink-0">{svc.priceUSD}{svc.priceUSD && svc.pricePYG ? ' / ' : ''}{svc.pricePYG}</Badge>
                    )}
                  </div>
                  {svc.description && <p className="mb-3 text-sm text-muted-foreground">{svc.description}</p>}
                  {svc.delivery && (
                    <p className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} /> Entrega: {svc.delivery}
                    </p>
                  )}
                  {(svc.includes?.length ?? 0) > 0 && (
                    <div className="mt-auto">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">INCLUYE</p>
                      <ul className="space-y-1">
                        {(svc.includes ?? []).map((inc, j) => (
                          <li key={j} className="flex gap-2 text-sm text-foreground"><span className="text-primary">•</span><span>{inc}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
