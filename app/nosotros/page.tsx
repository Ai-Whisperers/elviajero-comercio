"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import content from "@/content/es.json"
const c = content as any
const story = c.about?.story?.paragraphs || []
const vals = c.about?.values || []

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <section className="bg-primary py-12 text-center text-primary-foreground">
        <h1 className="text-4xl font-bold">{c.about?.hero?.headline || "Nosotros"}</h1>
        <p className="mt-2 text-primary-foreground/80">{c.about?.hero?.subheadline}</p>
      </section>

      {/* Owner photo placeholder + story */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex items-center justify-center">
              <div className="flex h-64 w-64 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 shadow-inner">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-primary/40">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <p className="mt-2 text-xs text-muted-foreground">Foto del dueño próximamente</p>
                </div>
              </div>
            </div>
            <div>
              {story.map((p: string, i: number) => (
                <p key={i} className="mb-4 text-muted-foreground leading-relaxed">{p}</p>
              ))}
              <a
                href={`https://wa.me/${c.home?.contact?.whatsapp || "595981234567"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Consultanos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-surface-light py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">Nuestra Historia</h2>
          <div className="relative pl-8 before:absolute before:left-3 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-accent">
            {[
              { year: "2025", title: "Nace El Viajero", desc: "Apertura del local en Mariano Roque Alonso con una visión clara: equipar a los aventureros paraguayos." },
              { year: "2025", title: "Primeros Productos", desc: "Importación de carpas y equipos de camping de alta calidad. Respuesta inmediata de la comunidad outdoor." },
              { year: "2026", title: "Expansión", desc: "Más de 200 productos en stock, 7 categorías, envíos a todo Paraguay. Lanzamiento de la tienda online." },
            ].map((item, i) => (
              <div key={i} className="relative mb-8 last:mb-0">
                <div className="absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-white">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
                  <span className="text-xs font-bold text-primary">{item.year}</span>
                  <h3 className="mt-1 font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      {vals.length > 0 && (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">Nuestros Valores</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {vals.map((v: any, i: number) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <CookieConsent />
    </>
  )
}
