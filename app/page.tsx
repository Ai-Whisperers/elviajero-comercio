"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
import { ProductCard } from "@/components/product-card"

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  camping: "/images/categories/camping.webp",
  pesca: "/images/categories/pesca.webp",
  accesoriospersonales: "/images/categories/accesorios.webp",
  electronica: "/images/categories/electronica.webp",
  accesoriosparavehculos: "/images/categories/vehiculos.webp",
}

function catSlug(cat: string) {
  return cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "")
}

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

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")
}

function HomePage() {
  const { get } = useContent()
  const h = get("home") || {}
  const categories: any[] = h.productCatalog?.categories || []
  const blogSection = get("tienda.blog") || {}
  const posts: any[] = blogSection?.index?.posts || []
  const features: any[] = h.features?.items || []
  const stats: any[] = h.stats?.items || []
  const statsTitle = h.stats?.title || ""
  const [cartOpen, setCartOpen] = useState(false)
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/home").then(r => r.json()).then(json => {
      setDbProducts(json.products || [])
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  const newArrivals = dbProducts.filter((p: any) => p.is_new)
  const featuredProducts = dbProducts.filter((p: any) => p.featured)
  const bestSellers = [...dbProducts].sort((a: any, b: any) => (b.stock || 0) - (a.stock || 0)).slice(0, 8)

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
                        <path d="M9 12l2 2l5-5M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0z" />
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

      {/* Product Categories */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          <FadeUp>
            <h2 className="mb-4 text-center text-3xl font-bold text-foreground">Nuestras Categorías</h2>
            <p className="mb-10 text-center text-muted-foreground">Todo lo que necesitás para tu próxima aventura</p>
          </FadeUp>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat: any) => (
              <Link key={cat} href={`/tienda#${catSlug(cat)}`}
                className="group relative flex h-52 items-end overflow-hidden rounded-2xl bg-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                {/* Category images: check content overrides first, then fall back to hardcoded map */}
                {(() => {
                  const imgKey = catSlug(cat)
                  const catImages = get("home.categoryImages") || {}
                  const imgUrl = catImages[imgKey] || CATEGORY_IMAGE_MAP[imgKey]
                  return imgUrl ? (
                    <Image src={imgUrl} alt={cat} fill className="object-cover transition-all duration-500 group-hover:scale-105 brightness-90 group-hover:brightness-100" sizes="(max-width: 768px) 100vw, 25vw" />
                  ) : null
                })()}
                <div className="relative z-20 p-5">
                  <h3 className="text-lg font-bold text-white drop-shadow-sm">{cat}</h3>
                  <p className="mt-1 text-sm text-white/80">Ver productos →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Más Vendidos */}
      {loaded && bestSellers.length > 0 && (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <FadeUp>
                <h2 className="text-3xl font-bold text-foreground">Más Vendidos</h2>
              </FadeUp>
              <Link href="/tienda" className="text-sm font-semibold text-primary hover:underline">Ver todos</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellers.slice(0, 8).map((p: any) => (
                <ProductCard key={p.id} product={{ id: p.id, slug: p.slug, name: p.name, price: p.price, priceBefore: p.price_before, imageUrl: p.image_url, category: p.category, stock: p.stock, specs: p.specs }} onClick={() => {}} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nuevo en Stock */}
      {loaded && newArrivals.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <FadeUp>
                <h2 className="text-3xl font-bold text-foreground">{h.newArrivals?.title || "Nuevo en Stock"}</h2>
              </FadeUp>
              <Link href="/tienda" className="text-sm font-semibold text-primary hover:underline">Ver todos</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.slice(0, 8).map((p: any) => (
                <ProductCard key={p.id} product={{ id: p.id, slug: p.slug, name: p.name, price: p.price, priceBefore: p.price_before, imageUrl: p.image_url, category: p.category, stock: p.stock, specs: p.specs }} onClick={() => {}} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Destacados */}
      {loaded && featuredProducts.length > 0 && (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <FadeUp>
                <h2 className="text-3xl font-bold text-foreground">{h.featuredProducts?.title || "Destacados"}</h2>
              </FadeUp>
              <Link href="/tienda" className="text-sm font-semibold text-primary hover:underline">Ver todos</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 8).map((p: any) => (
                <ProductCard key={p.id} product={{ id: p.id, slug: p.slug, name: p.name, price: p.price, priceBefore: p.price_before, imageUrl: p.image_url, category: p.category, stock: p.stock, specs: p.specs }} onClick={() => {}} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog / Guías */}
      {posts.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4">
            <FadeUp>
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground">{get("blog.title") || "Blog y Guías"}</h2>
            </FadeUp>
            <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {posts.slice(0, 4).map((post: any, i: number) => (
                <StaggerItem key={i}>
                  <Link href={`/blog/${post.slug}`}
                    className="group block overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {post.image ? (
                        <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg className="h-10 w-10 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">{post.category}</span>
                        <span className="text-muted-foreground">{post.date}</span>
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <p className="mt-2 text-xs font-medium text-primary group-hover:underline">Leer más →</p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
            <div className="mt-8 text-center">
              <Link href="/blog"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-primary/30 px-6 text-sm font-semibold text-primary hover:bg-primary/5 transition-all">
                Ver todas las guías
              </Link>
            </div>
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
      <WhatsAppFloat phone={get("home.contact.whatsapp") || process.env.NEXT_PUBLIC_WHATSAPP || "595984009751"} message={get("whatsapp.defaultMessage") || "Hola! Quiero informacion"} />
      {h.contact?.map && <ExitIntentPopup />}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default function Page() {
  return <HomePage />
}
