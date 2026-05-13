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
import { KitsCarousel } from "@/components/kits-carousel"
import { useContent } from "@/lib/content-provider"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

const ICON_MAP: Record<string, string> = {
  camping: "/images/icons/camping.webp",
  pesca: "/images/icons/pesca.webp",
  playaypesca: "/images/icons/playa-pesca.webp",
  accpersonales: "/images/icons/accesorios.webp",
  automviles: "/images/icons/autos.webp",
  motos: "/images/icons/motos.webp",
  campo: "/images/icons/campo.webp",
}
function catSlug(cat: string) { return cat.toLowerCase().replace(/[^a-z]/g, "") }

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
  const { get } = useContent()
  const h = get("home") || {}
  const products: any[] = h.productCatalog?.products || []
  const categories: any[] = h.productCatalog?.categories || []
  const testimonials: any[] = h.testimonials?.items || []
  const features: any[] = h.features?.items || []
  const stats: any[] = h.stats?.items || []
  const promotions: any[] = get("promociones.promotions") || []
  const newArrivals = products.filter((p: any) => p.isNew)
  const featuredProducts = products.filter((p: any) => p.featured)
  const bestSellers = products.filter((p: any) => p.featured).slice(0, 4)
  const statsTitle = h.stats?.title || ""
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <CartToastListener />
      <NewsletterSuccess />
      <PromoCarousel />
      <HeroCarousel />

      {/* Kits / Promos Carousel */}
      <KitsCarousel items={h.kitsCarousel?.items || []} title={h.kitsCarousel?.title} whatsappPhone={h.productCatalog?.whatsappPhone} />

      {/* Animated Stats */}
      {stats.length > 0 && (
        <section className="bg-surface py-10">
          <div className="mx-auto max-w-7xl px-4">
            {statsTitle && (
              <h2 className="mb-6 text-center text-2xl font-bold text-foreground">{statsTitle}</h2>
            )}
            <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-4">
              {stats.map((s: any, i: number) => (
                <AnimatedStat key={i} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features / Benefits */}
      {features.length > 0 && (
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">{h.features?.title || "¿Por qué El Viajero?"}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f: any, i: number) => (
                <FadeUp key={i} delay={i * 70}>
                  <div className="group h-full rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 12l2 2l5-5M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0z"/>
                      </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-foreground">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Catalog */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          <FadeUp>
            <h2 className="mb-4 text-center text-3xl font-bold text-foreground">Nuestras Categorías</h2>
            <p className="mb-10 text-center text-muted-foreground">Todo lo que necesitás para tu próxima aventura</p>
          </FadeUp>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat: any) => (
                <Link key={cat} href={`/tienda#${catSlug(cat)}`}
                className="group relative flex h-52 items-end overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                {ICON_MAP[catSlug(cat)] && (
                  <Image src={ICON_MAP[catSlug(cat)]} alt="" fill className="object-contain p-6 transition-all duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 25vw" />
                )}
                <div className="relative z-20 p-5">
                  <h3 className="text-lg font-bold text-white drop-shadow-sm">{cat}</h3>
                  <p className="mt-1 text-sm text-white/80">{cat.items || cat.count || ""} productos</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4">
            <FadeUp>
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground">{h.newArrivals?.title || "Novedades"}</h2>
            </FadeUp>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.slice(0, 8).map((p: any) => (
                <Link key={p.id} href={`/producto/${p.slug || p.id}`}
                  className="group rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="relative mb-3 flex h-44 items-center justify-center overflow-hidden rounded-lg bg-surface-light">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.name} fill className="object-contain p-2 transition-all duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
                    ) : (
                      <svg className="h-12 w-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    )}
                    {p.isNew && (
                      <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">Nuevo</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.brand}</p>
                  <p className="mt-2 text-sm font-bold text-primary">
                    {p.price_before && <span className="mr-1 text-xs text-muted-foreground line-through">{p.price_before}</span>}
                    {p.price}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4">
            <FadeUp>
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground">{h.featuredProducts?.title || "Destacados"}</h2>
            </FadeUp>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 8).map((p: any) => (
                <Link key={p.id} href={`/producto/${p.slug || p.id}`}
                  className="group rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="relative mb-3 flex h-44 items-center justify-center overflow-hidden rounded-lg bg-surface-light">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.name} fill className="object-contain p-2 transition-all duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
                    ) : (
                      <svg className="h-12 w-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">{p.name}</h3>
                  <p className="mt-2 text-sm font-bold text-primary">
                    {p.price_before && <span className="mr-1 text-xs text-muted-foreground line-through">{p.price_before}</span>}
                    {p.price}
                  </p>
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
            <FadeUp>
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground">{h.testimonials?.title || "Lo que dicen nuestros clientes"}</h2>
            </FadeUp>
            <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t: any, i: number) => (
                <StaggerItem key={i}>
                  <div className="h-full rounded-xl border border-border bg-white p-6 shadow-sm">
                    <div className="mb-3 flex text-amber-400">
                      {[...Array(t.rating || 5)].map((_, j) => (
                        <svg key={j} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                    <p className="mt-4 text-xs font-semibold text-foreground">— {t.name || "Cliente"}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* Gallery */}
      {h.gallery?.images?.length > 0 && (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4">
            <FadeUp>
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground">{h.gallery?.title || "Galería"}</h2>
            </FadeUp>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {h.gallery.images.slice(0, 8).map((img: string, i: number) => (
                <div key={i} className="relative h-48 overflow-hidden rounded-xl">
                  <Image src={img} alt="" fill className="object-cover transition-all duration-300 hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-primary/90 to-accent/90 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">{h.newsletter?.title || "Mantenete al tanto"}</h2>
          <p className="mt-2 text-white/80">{h.newsletter?.description || "Recibí ofertas y novedades"}</p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {h.finalCta && (
        <section className="relative bg-background py-20">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-4xl font-bold text-foreground">{h.finalCta.title || "¿Listo para tu próxima aventura?"}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{h.finalCta.description}</p>
            <Link href={h.finalCta.buttonHref || "/tienda"}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90">
              {h.finalCta.buttonText || "Ver Productos"}
            </Link>
          </div>
        </section>
      )}

      <RecentlyViewed />
      <Footer />
      <CookieConsent />
      <WhatsAppFloat phone={get("home.contact.whatsapp") || process.env.NEXT_PUBLIC_WHATSAPP || "595981234567"} message={get("whatsapp.defaultMessage") || "Hola! Quiero informacion"} />
      {h.contact?.map && (
        <ExitIntentPopup />
      )}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default function Page() {
  return <HomePage />
}
