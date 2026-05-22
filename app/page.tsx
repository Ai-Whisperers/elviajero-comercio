"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { HeroCarousel } from "@/components/hero-carousel"
import { PromoCarousel } from "@/components/promo-carousel"
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/animations/scroll-reveal"
import { RecentlyViewed } from "@/components/recently-viewed"
import { ExitIntentPopup } from "@/components/exit-intent"
import { NewsletterForm } from "@/components/newsletter-form"
import { useContent } from "@/lib/content-provider"
import { ProductCard } from "@/components/product-card"
import { KitsHorizontalCarousel } from "@/components/kits-horizontal-carousel"
import {
  StatsSection,
  NewArrivalsSection,
  FeaturesSection,
  TestimonialsSection,
  PaymentMethodsSection,
  FinalCtaSection,
} from "@/components/home/home-sections"

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
  "Camping", "Pesca", "Accesorios Personales",
  "Electrónica", "Accesorios para Vehículos",
]

function catSlug(cat: string) {
  return cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "")
}

function categoryHref(cat: string) {
  return "/tienda?cat=" + encodeURIComponent(cat)
}

function DebugPanel({ h }: { h: any }) {
  return (
    <div style={{background:"#fff3cd",padding:"1rem",margin:"1rem",fontSize:"12px",fontFamily:"monospace",border:"2px solid red",position:"relative",zIndex:9999}}>
      <strong style={{color:"red"}}>DEBUG PANEL</strong>
      <div>h keys: {Object.keys(h || {}).join(", ")}</div>
      <div>stats count: {(h?.stats?.items || []).length}</div>
      <div>features count: {(h?.features?.items || []).length}</div>
      <div>testimonials count: {(h?.testimonials || []).length}</div>
      <div>stats raw: <pre style={{margin:0}}>{JSON.stringify(h?.stats, null, 2)?.slice(0,300)}</pre></div>
      <div>features title: {JSON.stringify(h?.features?.title)}</div>
    </div>
  )
}

function HomePage() {
  const { get } = useContent()
  const h = get("home") || {}
  const contentCategories = h.productCatalog?.categories || []
  const categories = contentCategories.length > 0 ? contentCategories : DEFAULT_HOME_CATEGORIES
  const kitsCarousel = h.kitsCarousel || {}
  const kits = Array.isArray(kitsCarousel.items) ? kitsCarousel.items : []

  const stats = h.stats?.items || []
  const features = h.features?.items || []
  const testimonials = h.testimonials || []

  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/home").then(r => r.json()).then(json => {
      setDbProducts(json.products || [])
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  const featuredProducts = dbProducts.filter((p: any) => p.featured)
  const newArrivals = dbProducts.filter((p: any) => p.is_new)

  return (
    <>
      <DebugPanel h={h} />

      <PromoCarousel />
      <HeroCarousel />

      <section data-section="stats" style={{background:"#e8f5e9",padding:"2rem",textAlign:"center"}}>
        <h2 style={{color:"green"}}>STATS SECTION (stats={stats.length})</h2>
        <p>stats data: {JSON.stringify(stats).slice(0,200)}</p>
      </section>

      {stats.length > 0 ? (
        <StatsSection stats={stats} />
      ) : (
        <div style={{background:"#ffcccc",padding:"1rem",textAlign:"center"}}>
          <strong>StatsSection HIDDEN - stats.length = 0</strong>
        </div>
      )}

      {kits.length > 0 && (
        <KitsHorizontalCarousel kits={kits} title={kitsCarousel.title || "Kits y Promociones"} />
      )}

      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-4">
          <FadeUp>
            <h2 className="mb-2 text-center text-2xl font-bold text-foreground">Nuestras Categorías</h2>
          </FadeUp>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((cat: any) => {
              const imgKey = catSlug(String(cat))
              const imgSrc = CATEGORY_IMAGE_MAP[imgKey]
              return (
                <Link key={String(cat)} href={categoryHref(String(cat))}
                  className="group relative flex h-40 items-end overflow-hidden rounded-2xl bg-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                  {imgSrc && (
                    <Image src={imgSrc} alt={String(cat)} fill className="object-cover transition-all duration-500 group-hover:scale-105 brightness-90 group-hover:brightness-100" sizes="(max-width: 768px) 100vw, 25vw" />
                  )}
                  <div className="relative z-20 p-5">
                    <h3 className="text-lg font-bold text-white drop-shadow-sm">{cat}</h3>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {features.length > 0 ? (
        <FeaturesSection features={features} title={h.features?.title || "¿Por qué elegir El Viajero?"} />
      ) : (
        <div style={{background:"#ffcccc",padding:"1rem",textAlign:"center"}}>
          <strong>FeaturesSection HIDDEN - features.length = 0</strong>
        </div>
      )}

      {testimonials.length > 0 ? (
        <TestimonialsSection testimonials={testimonials} />
      ) : (
        <div style={{background:"#ffcccc",padding:"1rem",textAlign:"center"}}>
          <strong>TestimonialsSection HIDDEN - testimonials.length = 0</strong>
        </div>
      )}

      <PaymentMethodsSection installmentsText="Hasta 12 cuotas con tarjetas selectas" />

      {h.finalCta ? (
        <FinalCtaSection finalCta={h.finalCta} />
      ) : (
        <div style={{background:"#ffcccc",padding:"1rem",textAlign:"center"}}>
          <strong>FinalCtaSection HIDDEN - no finalCta</strong>
        </div>
      )}

      <section className="bg-gradient-to-r from-primary/90 to-accent/90 py-10">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Mantenete al tanto</h2>
          <p className="mt-2 text-white/80">Recibí ofertas y novedades</p>
          <div className="mt-6"><NewsletterForm /></div>
        </div>
      </section>
    </>
  )
}

export default function Page() {
  return <HomePage />
}