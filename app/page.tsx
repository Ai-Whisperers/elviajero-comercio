"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { PromoCarousel } from "@/components/promo-carousel"
import { CookieConsent } from "@/components/cookie-consent"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { CartProvider } from "@/lib/cart-context"
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

const c = content as any
const h = c.home || {}
const products = h.productCatalog?.products || []
const categories = h.productCatalog?.categories || []
const testimonials = h.testimonials || []
const features = h.features?.items || []
const stats = h.stats?.items || []
const promotions = c.promociones?.promotions || []
const featuredProducts = h.featuredProducts?.products || products.slice(0, 6)
const bestSellers = h.bestSellers?.products || products.slice(0, 4)

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState("0")
  const ref = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true)
          const target = parseInt(value.replace(/[^\d]/g, ""), 10) || 0
          if (target === 0) { setDisplay(value); return }
          let current = 0
          const step = Math.ceil(target / 30)
          const interval = setInterval(() => {
            current += step
            if (current >= target) { clearInterval(interval); setDisplay(value) }
            else setDisplay(current.toString())
          }, 40)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, animated])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold text-primary sm:text-4xl transition-all duration-500">{display}</div>
      <div className="mt-1 text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  )
}

function HomePage() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <PromoCarousel />

      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden" style={{ backgroundImage: "url(/images/hero-bg.svg)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-md sm:p-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">{h.hero?.headline}</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">{h.hero?.subheadline}</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href={h.hero?.ctaPrimaryHref || "/tienda"} className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-10 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-white/90 hover:scale-105">{h.hero?.ctaPrimaryText}</Link>
              <a href={h.hero?.ctaSecondaryHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-white px-10 text-sm font-semibold text-white transition-all hover:bg-white/20 hover:scale-105">{h.hero?.ctaSecondaryText}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      {stats.length > 0 && (
        <section className="bg-surface py-10">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-4">
              {stats.map((s: any, i: number) => (
                <AnimatedStat key={i} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-2 text-center text-3xl font-bold text-foreground">{h.featuredProducts?.title || "Productos Destacados"}</h2>
            <p className="mb-10 text-center text-muted-foreground">{h.featuredProducts?.subtitle || ""}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.slice(0, 6).map((p: any, i: number) => (
                <Link key={i} href="/tienda" className="group overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="aspect-[3/2] bg-muted p-4 flex items-center justify-center">
                    {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={400} height={267} className="h-full w-full object-contain" />}
                  </div>
                  <div className="p-4">
                    {p.brand && <p className="text-xs font-medium text-muted-foreground">{p.brand}</p>}
                    <h3 className="font-semibold text-foreground group-hover:text-primary">{p.name}</h3>
                    <p className="text-lg font-bold text-primary mt-1">{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/tienda" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">Ver todos los productos</Link>
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="bg-surface-light py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">{h.bestSellers?.title || "Los Más Vendidos"}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellers.slice(0, 4).map((p: any, i: number) => (
                <Link key={i} href="/tienda" className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={64} height={64} className="h-full w-full object-contain p-1" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</p>
                    <p className="text-sm font-bold text-primary">{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-10 text-center text-3xl font-bold text-foreground">{h.features?.title}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f: any, i: number) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                    {f.icon === "shield" && "🛡"}
                    {f.icon === "message-circle" && "💬"}
                    {f.icon === "phone" && "📞"}
                    {f.icon === "truck" && "🚚"}
                    {f.icon === "wallet" && "💳"}
                    {(!f.icon || f.icon === "package") && "📦"}
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seasonal Offers */}
      {promotions.length > 0 && (
        <section className="bg-surface-light py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">Ofertas de Temporada</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promotions.map((p: any, i: number) => (
                <div key={i} className="group relative overflow-hidden rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="aspect-video bg-muted">
                    {p.image && <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    {p.badge && <span className="mb-1 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">{p.badge}</span>}
                    <h3 className="text-lg font-bold text-white">{p.title}</h3>
                    <p className="text-sm text-white/80">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Grid */}
      {categories.length > 0 && (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-6 text-center text-3xl font-bold text-foreground">{h.productCatalog?.title}</h2>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-7">
              {categories.map((cat: string, i: number) => (
                <Link key={i} href={"/tienda#" + cat.toLowerCase().replace(/[^a-z]/g, "")}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl">{cat[0]}</div>
                  <div className="text-xs font-semibold text-foreground">{cat}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-10 text-center text-3xl font-bold text-foreground">Lo que dicen nuestros clientes</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {testimonials.map((t: any, i: number) => (
                <div key={i} className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <div className="mb-2 flex gap-1 text-amber-400">{Array.from({ length: t.rating || 5 }).map((_: any, j: number) => <span key={j}>★</span>)}</div>
                  <p className="mb-3 text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                  <p className="font-medium text-foreground">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">{h.newsletter?.title || "Recibí Novedades"}</h2>
          <p className="mb-6 text-primary-foreground/80">{h.newsletter?.description}</p>
          <form action="/api/subscribe" method="POST" className="mx-auto flex max-w-md gap-3">
            <input name="email" type="email" placeholder={h.newsletter?.placeholder || "tu@email.com"} className="flex-1 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white" required />
            <button type="submit" className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90">{h.newsletter?.buttonText || "Suscribirse"}</button>
          </form>
        </div>
      </section>

      {/* Final CTA */}
      {h.finalCta && (
        <section className="relative overflow-hidden py-16" style={{ background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)" }}>
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">{h.finalCta.title}</h2>
            <p className="mb-6 text-white/80">{h.finalCta.description}</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href={h.finalCta.buttonLink} className="inline-block rounded-lg bg-white px-8 py-4 font-semibold text-accent transition-all hover:scale-105">{h.finalCta.buttonText}</a>
              {h.finalCta.secondaryText && <Link href={h.finalCta.secondaryLink || "/tienda"} className="inline-block rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white/20">{h.finalCta.secondaryText}</Link>}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppFloat phone={c.home?.contact?.whatsapp || "595981234567"} message={c.whatsapp?.defaultMessage || "Hola! Quiero informacion"} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <CookieConsent />
    </>
  )
}

export default function Page() {
  return (
    <CartProvider>
      <HomePage />
    </CartProvider>
  )
}
