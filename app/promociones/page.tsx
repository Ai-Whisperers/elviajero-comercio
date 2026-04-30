import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/content/es.json"
import Link from "next/link"

const c = content as any
const promos = c.promociones?.promotions || []

export default function Promociones() {
  return (<><Header />
    <section className="bg-accent py-12 text-center text-accent-foreground"><h1 className="text-4xl font-bold">{c.promociones?.hero?.headline}</h1><p className="mt-2 text-accent-foreground/80">{c.promociones?.hero?.subheadline}</p></section>

    <section className="bg-background py-16"><div className="mx-auto max-w-7xl px-4">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {promos.map((p:any,i:number)=>(
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            {p.image && <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden"><img src={p.image} alt={p.title} className="h-full w-full object-cover" /></div>}
            <div className="p-6">
              {p.badge && <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">{p.badge}</span>}
              <h3 className="mb-2 text-xl font-bold text-foreground">{p.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{p.description}</p>
              <a href={p.ctaHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">{p.ctaText}</a>
            </div>
          </div>
        ))}
      </div>
      {promos.length === 0 && <div className="py-20 text-center text-muted-foreground">No hay promociones activas en este momento.</div>}
    </div></section>

    <Footer />
  </>)
}
