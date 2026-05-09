"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { PromoCarousel } from "@/components/promo-carousel"
import { HeroCarousel } from "@/components/hero-carousel"
import { CookieConsent } from "@/components/cookie-consent"
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/animations/scroll-reveal"
import { CartToastListener } from "@/components/cart-toast-listener"
import { RecentlyViewed } from "@/components/recently-viewed"
import { ExitIntentPopup } from "@/components/exit-intent"
import { NewsletterForm } from "@/components/newsletter-form"
import { NewsletterSuccess } from "@/components/ui"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

const c = content as any
const h = c.home || {}
const products = h.productCatalog?.products || []
const categories = h.productCatalog?.categories || []
const ICON_MAP: Record<string, string> = {
  camping: "/images/icons/camping.png",
  pesca: "/images/icons/pesca.png",
  playaypesca: "/images/icons/playa-pesca.png",
  accpersonales: "/images/icons/accesorios.png",
  automviles: "/images/icons/autos.png",
  motos: "/images/icons/motos.png",
  campo: "/images/icons/campo.png",
}
function catSlug(cat: string) { return cat.toLowerCase().replace(/[^a-z]/g, "") }
const testimonials = h.testimonials || []
const features = h.features?.items || []
const stats = h.stats?.items || []
const promotions = c.promociones?.promotions || []
const newArrivals = h.newArrivals?.products || []
const featuredProducts = h.featuredProducts?.products || products.slice(0, 6)
const bestSellers = h.bestSellers?.products || products.slice(0, 4)
const storeLocator = c.storeLocator || {}

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
      <CartToastListener />
      <NewsletterSuccess />
      <PromoCarousel />
      <HeroCarousel />

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

      {/* Nuevo en Stock carousel */}
      {newArrivals.length > 0 && (
        <FadeUp>
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">{h.newArrivals?.title || "Nuevo en Stock"}</h2>
                <p className="text-muted-foreground">{h.newArrivals?.subtitle || ""}</p>
              </div>
              <Link href="/tienda" className="text-sm font-semibold text-primary hover:underline">Ver todo</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {newArrivals.slice(0, 8).map((p: any, i: number) => (
                <Link key={i} href="/tienda" className="group text-center">
                  <div className="mb-2 overflow-hidden rounded-xl border border-border bg-surface p-2 transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                    <div className="aspect-square flex items-center justify-center bg-muted rounded-lg">
                      {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={120} height={120} className="h-full w-full object-contain p-2" />}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary">{p.name}</p>
                  <p className="text-xs font-bold text-primary mt-0.5">{p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        </FadeUp>
      )}

      {/* Featured Products with animations */}
      {featuredProducts.length > 0 && (
        <FadeUp>
        <section className="bg-surface-light py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">{h.featuredProducts?.title || "Productos Destacados"}</h2>
              <Link href="/tienda" className="text-sm font-semibold text-primary hover:underline">Ver todos</Link>
            </div>
            <StaggerGrid>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.slice(0, 6).map((p: any, i: number) => (
                <StaggerItem key={i}>
                <Link href="/tienda" className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="aspect-[3/2] bg-muted p-4 flex items-center justify-center">
                    {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={400} height={267} className="h-full w-full object-contain" />}
                  </div>
                  <div className="p-4">
                    {p.brand && <p className="text-xs font-medium text-muted-foreground">{p.brand}</p>}
                    <h3 className="font-semibold text-foreground group-hover:text-primary line-clamp-1">{p.name}</h3>
                    <p className="text-lg font-bold text-primary mt-1">{p.price}</p>
                    {p.priceBefore && <p className="text-xs text-muted-foreground line-through">{p.priceBefore}</p>}
                  </div>
                </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerGrid>
          </div>
        </section>
        </FadeUp>
      )}

      {/* Features */}
      {features.length > 0 && (
        <FadeUp>
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
        </FadeUp>
      )}

      {/* Store Locator */}
      {storeLocator.title && (
        <section className="bg-surface-light py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="mb-4 text-3xl font-bold text-foreground">{storeLocator.title}</h2>
                <p className="mb-6 text-muted-foreground">{storeLocator.description}</p>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-primary text-lg">📍</span>
                    <div><p className="font-semibold text-foreground">Dirección</p><p className="text-muted-foreground">{storeLocator.address}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-primary text-lg">🕐</span>
                    <div><p className="font-semibold text-foreground">Horarios</p><p className="text-muted-foreground">{storeLocator.hours}</p></div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <a href={storeLocator.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
                      Google Maps
                    </a>
                    <a href={`https://wa.me/${storeLocator.whatsappNumber}?text=${encodeURIComponent(storeLocator.whatsappText || "Hola, quiero la dirección")}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-primary px-6 text-sm font-semibold text-primary transition-all hover:bg-primary/5">
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-border shadow-sm">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(storeLocator.address)}&output=embed`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de El Viajero"
                />
              </div>
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
              {categories.map((cat: string, i: number) => {
                const slug = catSlug(cat)
                return (
                <Link key={i} href={"/tienda#" + slug}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                  <Image src={ICON_MAP[slug] || ""} alt={cat} width={64} height={64} className="h-16 w-16" />
                  <div className="text-xs font-semibold text-foreground">{cat}</div>
                </Link>
              )})}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <FadeUp>
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-10 text-center text-3xl font-bold text-foreground">Lo que dicen nuestros clientes</h2>
            <StaggerGrid>
              {testimonials.map((t: any, i: number) => (
                <StaggerItem key={i}>
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    {t.image && <Image src={t.image} alt={t.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />}
                    <div>
                      <p className="font-medium text-foreground">{t.name}</p>
                      <div className="flex gap-1 text-amber-400">{Array.from({ length: t.rating || 5 }).map((_: any, j: number) => <span key={j}>★</span>)}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
        </FadeUp>
      )}

      {/* Payment Icons */}
      <section className="bg-primary/5 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="mb-4 text-sm font-medium text-muted-foreground">Medios de pago</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-white px-4 shadow-sm">
              <svg width="20" height="14" viewBox="0 0 50 30" fill="#1A1F71"><rect width="50" height="30" rx="4" fill="white"/><circle cx="20" cy="15" r="8" fill="#1A1F71"/><circle cx="30" cy="15" r="8" fill="#E60012"/></svg>
              <span className="text-xs font-bold text-foreground hidden sm:inline">Visa</span>
            </div>
            <div className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-white px-4 shadow-sm">
              <svg width="20" height="14" viewBox="0 0 50 30" fill="#EB001B"><rect width="50" height="30" rx="4" fill="white"/><path d="M32 6h-14v18h14V6z" fill="#EB001B"/><path d="M33.5 15c0-3.5-1.4-6.7-3.7-9h5.6c4.3 3.6 7 8.9 7 15s-2.7 11.4-7 15h-5.6c2.3-2.3 3.7-5.5 3.7-9z" fill="#F79E1B"/></svg>
              <span className="text-xs font-bold text-foreground hidden sm:inline">Mastercard</span>
            </div>
            <div className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-white px-4 shadow-sm">
              <svg width="20" height="14" viewBox="0 0 50 30" fill="#00B4E6"><rect width="50" height="30" rx="4" fill="white"/><path d="M25 8c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z" fill="#00B4E6"/><circle cx="25" cy="18" r="6" fill="white"/></svg>
              <span className="text-xs font-bold text-blue-600 hidden sm:inline">Mercado Pago</span>
            </div>
            <div className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-white px-4 shadow-sm">
              <svg width="20" height="14" viewBox="0 0 50 30" fill="#F39200"><rect width="50" height="30" rx="4" fill="white"/><path d="M16 12h18v6H16z" fill="#F39200"/><circle cx="22" cy="18" r="8" fill="#F39200"/><circle cx="28" cy="18" r="8" fill="#E16200"/></svg>
              <span className="text-xs font-bold text-foreground hidden sm:inline">Pagopar</span>
            </div>
            <div className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-white px-4 shadow-sm">
              <svg width="20" height="14" viewBox="0 0 50 30" fill="#E31E24"><rect width="50" height="30" rx="4" fill="white"/><circle cx="25" cy="15" r="9" fill="#E31E24"/><path d="M21 12h8v6H21z" fill="white"/></svg>
              <span className="text-xs font-bold text-foreground hidden sm:inline">Bancard</span>
            </div>
            <div className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-white px-4 shadow-sm">
              <svg width="20" height="14" viewBox="0 0 50 30" fill="#4CAF50"><rect width="50" height="30" rx="4" fill="#4CAF50"/><text x="25" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">$</text></svg>
              <span className="text-xs font-bold text-foreground hidden sm:inline">Efectivo</span>
            </div>
            <div className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-white px-4 shadow-sm">
              <svg width="20" height="14" viewBox="0 0 50 30" fill="#2196F3"><rect width="50" height="30" rx="4" fill="#2196F3"/><text x="25" y="20" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">TRF</text></svg>
              <span className="text-xs font-bold text-foreground hidden sm:inline">Transf.</span>
            </div>
          </div>
          {c.paymentMethods?.installments && (
            <p className="mt-3 text-xs text-muted-foreground">{c.paymentMethods.installments}</p>
          )}
        </div>
      </section>

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
        <FadeUp>
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
        </FadeUp>
      )}

      <Footer />
      <RecentlyViewed />
      <ExitIntentPopup />
      <WhatsAppFloat phone={c.home?.contact?.whatsapp || "595981234567"} message={c.whatsapp?.defaultMessage || "Hola! Quiero informacion"} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <CookieConsent />
    </>
  )
}

export default function Page() {
  return (
    <HomePage />
  )
}
