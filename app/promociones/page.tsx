"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import content from "@/content/es.json"
import { useContent } from "@/lib/content-provider"

const c = content as any

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")
}

interface Promo {
  title: string
  description: string
  badge?: string
  image?: string
  ctaText?: string
  ctaHref?: string
  kitSlug?: string
}

interface KitItem {
  title: string
  description?: string
  price?: string
  priceBefore?: string
  badge?: string
  image?: string
  whatsappText?: string
}

export default function Promociones() {
  const { get } = useContent()

  // Static promotions from promociones section
  const heroHeadline = get("promociones.hero.headline") || c.promociones?.hero?.headline || "Promociones"
  const heroSubheadline = get("promociones.hero.subheadline") || c.promociones?.hero?.subheadline || ""
  const staticPromos: Promo[] = get("promociones.promotions") || c.promociones?.promotions || []

  // Kit carousel items (also shown as promos)
  const kitItems: KitItem[] = get("home.kitsCarousel.items") || c.home?.kitsCarousel?.items || []
  const kitTitle = get("home.kitsCarousel.title") || c.home?.kitsCarousel?.title || ""

  // Merge: static promos first, then kits
  const kitPromos: Promo[] = kitItems.map((kit) => ({
    title: kit.title,
    description: kit.description || "",
    badge: kit.badge || "",
    image: kit.image || "",
    ctaText: "Consultar por WhatsApp",
    ctaHref: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "595984009751"}?text=${encodeURIComponent(kit.whatsappText || `Hola! Quiero info del ${kit.title}`)}`,
  }))

  const allPromos = [...staticPromos, ...kitPromos]

  return (
    <>
      {/* Hero */}
      <section className="bg-accent py-12 text-center text-accent-foreground">
        <h1 className="text-4xl font-bold">{heroHeadline}</h1>
        <p className="mt-2 text-accent-foreground/80">{heroSubheadline}</p>
      </section>

      {/* All promotions */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          {allPromos.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {allPromos.map((p, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {p.image ? (
                    <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/25">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6">
                    {p.badge && (
                      <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                        {p.badge}
                      </span>
                    )}
                    <h3 className="mb-2 text-xl font-bold text-foreground">{p.title}</h3>
                    {p.description && (
                      <p className="mb-4 text-sm text-muted-foreground">{p.description}</p>
                    )}
                    {p.ctaHref && (
                      <a
                        href={p.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                      >
                        {p.ctaText || "Ver más"}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {allPromos.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No hay promociones activas en este momento.
            </div>
          )}
        </div>
      </section>
    </>
  )
}
