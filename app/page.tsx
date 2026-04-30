import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"

const h = (content as any).home || {}
const footer = (content as any).footer || {}
const hero = h.hero || {}
const stats = h.stats?.items || []
const features = h.features || {}
const testimonials = h.testimonials || []
const gallery = h.gallery?.items || []
const newsletter = h.newsletter || {}
const cta = (content as any).home?.finalCta || {}
const promos = (content as any).promociones?.promotions || []
const whatsappData = (content as any).whatsapp || {}
const phone = whatsappData.phone || "595981234567"

export default function Home() {
  const bgStyle = hero.image
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${hero.image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundColor: "var(--color-primary)" }

  return (
    <>
      <Header />

      {/* Promo Banner */}
      {promos.length > 0 && (
        <div className="bg-accent py-2 text-center text-sm font-medium text-accent-foreground">
          {promos[0]?.title} — {promos[0]?.description}
        </div>
      )}

      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden" style={bgStyle}>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-md sm:p-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {hero.headline || "Tu Aventura Empieza Acá"}
            </h1>
            {hero.subheadline && (
              <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">{hero.subheadline}</p>
            )}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="/tienda" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90">
                {hero.ctaPrimaryText || "Ver Catálogo"}
              </a>
              {hero.ctaSecondaryText && (
                <a href={hero.ctaSecondaryHref || `https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-md border-2 border-white px-8 text-sm font-semibold text-white transition-all hover:bg-white/20">
                  {hero.ctaSecondaryText}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="bg-surface py-10">
          <div className="mx-auto max-w-7xl px-4">
            <div className={`grid gap-6 sm:gap-8 ${stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
              {stats.map((s: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-primary sm:text-4xl">{s.value}</div>
                  <div className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {features.items?.length > 0 && (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4">
            {features.title && <h2 className="mb-10 text-center text-3xl font-bold text-foreground">{features.title}</h2>}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {features.items.map((f: any, i: number) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-surface-light py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-10 text-center text-3xl font-bold text-foreground">Lo que dicen nuestros clientes</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {testimonials.map((t: any, i: number) => (
                <div key={i} className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <div className="mb-2 flex gap-1 text-accent">
                    {[1,2,3,4,5].map((s) => <span key={s}>★</span>)}
                  </div>
                  <p className="mb-3 text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                  <p className="font-medium text-foreground">{t.name || t.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      {newsletter.title && (
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground">{newsletter.title}</h2>
            {newsletter.subtitle && <p className="mb-8 text-lg text-primary-foreground/80">{newsletter.subtitle}</p>}
            <div className="mx-auto flex max-w-md gap-3">
              <input type="email" placeholder={newsletter.placeholder || "tu@email.com"}
                className="flex-1 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white" />
              <button className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90">
                {newsletter.ctaText || "Suscribirse"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      {cta.title && (
        <section className="relative overflow-hidden py-16" style={{ background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)" }}>
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">{cta.title}</h2>
            {cta.subtitle && <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">{cta.subtitle}</p>}
            {cta.buttonText && (
              <a href={cta.buttonHref || `https://wa.me/${phone}`} className="inline-block rounded-lg bg-white px-8 py-4 font-semibold text-accent transition-all hover:scale-105">
                {cta.buttonText}
              </a>
            )}
          </div>
        </section>
      )}

      <Footer businessName="El Viajero" email={footer.email} whatsapp={phone} instagram={footer.instagram} facebook={footer.facebook} />
      <WhatsAppFloat phone={phone} message="Hola! Quiero info sobre productos" />
    </>
  )
}
