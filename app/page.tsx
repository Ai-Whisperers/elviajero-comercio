"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { HeroCarousel } from "@/components/hero-carousel"
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/animations/scroll-reveal"
import { RecentlyViewed } from "@/components/recently-viewed"
import { ExitIntentPopup } from "@/components/exit-intent"
import { NewsletterForm } from "@/components/newsletter-form"
import { useContent } from "@/lib/content-provider"
import { ProductCard } from "@/components/product-card"

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  camping: "/images/categories/camping.webp",
  pesca: "/images/categories/pesca.webp",
  accesoriospersonales: "/images/categories/accesorios.webp",
  electronica: "/images/categories/electronica.webp",
  accesoriosparavehiculos: "/images/categories/vehiculos.webp",
  equipotacticoexplorador: "/images/categories/outdoor.svg",
  accesoriosparaviajes: "/images/categories/accesorios.webp",
}

const DEFAULT_HOME_CATEGORIES = [
  "Camping",
  "Pesca",
  "Accesorios Personales",
  "Electrónica",
  "Accesorios para Vehículos",
]

function catSlug(cat: string) {
  return cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "")
}

function categoryHref(cat: string) {
  return `/tienda?cat=${encodeURIComponent(cat)}`
}

function whatsappHref(text: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "595984009751"
  return `https://wa.me/${phone}?text=${encodeURIComponent(text || "Hola! Quiero información sobre los kits y promociones de El Viajero")}`
}

function HomePage() {
  const { get } = useContent()
  const h = get("home") || {}
  const contentCategories: any[] = h.productCatalog?.categories || []
  const categories: string[] = contentCategories.length > 0 ? contentCategories : DEFAULT_HOME_CATEGORIES
  const kitsCarousel = h.kitsCarousel || {}
  const kits: any[] = Array.isArray(kitsCarousel.items) ? kitsCarousel.items : []
  const blogSection = get("tienda.blog") || {}
  const posts: any[] = blogSection?.index?.posts || []
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/home").then(r => r.json()).then(json => {
      setDbProducts(json.products || [])
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  const featuredProducts = dbProducts.filter((p: any) => p.featured)

  return (
    <>
      <HeroCarousel />

      {/* Kits / Promos */}
      {kits.length > 0 && kitsCarousel.enabled !== false && (
        <section id="kits-promos" className="bg-surface py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <FadeUp>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Kits listos para salir</p>
                <h2 className="text-3xl font-bold text-foreground">{kitsCarousel.title || "Kits y Promociones"}</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Combos armados con productos clave para camping, pesca, vehículo y aventura. Consultá stock directo por WhatsApp.
                </p>
              </FadeUp>
              <Link href="/promociones" className="inline-flex h-10 items-center justify-center rounded-xl border border-primary/30 px-5 text-sm font-semibold text-primary transition-all hover:bg-primary/5">
                Ver todas las promos
              </Link>
            </div>
            <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kits.slice(0, 6).map((kit: any, i: number) => (
                <StaggerItem key={`${kit.title || "kit"}-${i}`}>
                  <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {kit.image ? (
                        <Image src={kit.image} alt={kit.title || "Kit promocional"} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">Kit promocional</div>
                      )}
                      {kit.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-lg">
                          {kit.badge}
                        </span>
                      )}
                      {kit.priceBefore && (
                        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-muted-foreground line-through shadow">
                          {kit.priceBefore}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-foreground">{kit.title}</h3>
                      <p className="mt-2 min-h-[2.5rem] text-sm text-muted-foreground line-clamp-2">{kit.description}</p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Precio promo</p>
                          <p className="text-xl font-black text-primary">{kit.price || "Consultar"}</p>
                        </div>
                        <Link href={whatsappHref(kit.whatsappText)} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-[#1fb957]">
                          Consultar
                        </Link>
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* Product Categories */}
      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-4">
          <FadeUp>
            <h2 className="mb-2 text-center text-2xl font-bold text-foreground">Nuestras Categorías</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">Todo lo que necesitás para tu próxima aventura</p>
          </FadeUp>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((cat: any) => (
              <Link key={cat} href={categoryHref(cat)}
                className="group relative flex h-40 items-end overflow-hidden rounded-2xl bg-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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

      {/* Destacados */}
      {loaded && featuredProducts.length > 0 && (
        <section className="bg-background py-10">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-5 flex items-center justify-between">
              <FadeUp>
                <h2 className="text-2xl font-bold text-foreground">{h.featuredProducts?.title || "Destacados"}</h2>
              </FadeUp>
              <Link href="/tienda" className="text-sm font-semibold text-primary hover:underline">Ver todos</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {featuredProducts.slice(0, 10).map((p: any) => (
                <ProductCard key={p.id} product={{ id: p.id, slug: p.slug, name: p.name, price: p.price, priceBefore: p.price_before, imageUrl: p.image_url, category: p.category, stock: p.stock, specs: p.specs }} onClick={() => {}} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog / Guías */}
      {posts.length > 0 && (
        <section className="bg-surface py-10">
          <div className="mx-auto max-w-7xl px-4">
            <FadeUp>
              <h2 className="mb-5 text-center text-2xl font-bold text-foreground">{get("blog.title") || "Blog y Guías"}</h2>
            </FadeUp>
            <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <section className="bg-background py-10">
          <div className="mx-auto max-w-7xl px-4">
            <FadeUp>
              <h2 className="mb-5 text-center text-2xl font-bold text-foreground">{h.gallery?.title || "Galería"}</h2>
            </FadeUp>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
      <section className="bg-gradient-to-r from-primary/90 to-accent/90 py-10">
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
        <section className="relative bg-background py-12">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-4xl font-bold text-foreground">{h.finalCta.title || "¿Listo para tu próxima aventura?"}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{h.finalCta.description}</p>
            <Link href={h.finalCta.buttonHref || h.finalCta.buttonLink || "/tienda"}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90">
              {h.finalCta.buttonText || "Ver Productos"}
            </Link>
          </div>
        </section>
      )}

      <RecentlyViewed />
      {h.contact?.map && <ExitIntentPopup />}
    </>
  )
}

export default function Page() {
  return <HomePage />
}
