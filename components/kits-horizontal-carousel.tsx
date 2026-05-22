"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

function whatsappHref(text: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "595984009751"
  return `https://wa.me/${phone}?text=${encodeURIComponent(text || "Hola! Quiero información sobre los kits y promociones de El Viajero")}`
}

export function KitsHorizontalCarousel({ kits, title }: { kits: any[]; title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", checkScroll, { passive: true })
    window.addEventListener("resize", checkScroll)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll])

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    // Scroll by roughly one card width + gap
    const distance = el.clientWidth * 0.7
    el.scrollBy({ left: dir === "left" ? -distance : distance, behavior: "smooth" })
  }

  if (kits.length === 0) return null

  return (
    <section id="kits-promos" className="bg-surface py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Kits listos para salir
            </p>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">
              Combos armados para camping, pesca, vehículo y aventura. Consultá stock por WhatsApp.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-foreground"
              aria-label="Anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-foreground"
              aria-label="Siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <Link
              href="/promociones"
              className="ml-2 hidden sm:inline-flex h-9 items-center justify-center rounded-full border border-primary/30 px-4 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
            >
              Ver todas
            </Link>
          </div>
        </div>

        {/* Scrollable Track */}
        <div className="relative">
          {/* Fade edges */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-surface to-transparent" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-surface to-transparent" />
          )}

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {kits.map((kit: any, i: number) => (
              <article
                key={`${kit.title || "kit"}-${i}`}
                className="group relative flex w-56 flex-shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex w-full flex-col">
                  {/* Small image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-white">
                    {kit.image ? (
                      <Image
                        src={kit.image}
                        alt={kit.title || "Kit promocional"}
                        fill
                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                        sizes="224px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">🎒</div>
                    )}
                    {kit.badge && (
                      <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow">
                        {kit.badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-1">
                      {kit.title}
                    </h3>
                    {kit.description && (
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 flex-1">
                        {kit.description}
                      </p>
                    )}

                    {/* Price + CTA */}
                    <div className="mt-2">
                      {kit.priceBefore && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          {kit.priceBefore}
                        </span>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-black text-primary">{kit.price || "Consultar"}</p>
                        <a
                          href={whatsappHref(kit.whatsappText)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-7 shrink-0 items-center justify-center rounded-lg bg-[#25D366] px-2.5 text-[10px] font-bold text-white shadow-sm transition-all hover:bg-[#1fb957]"
                        >
                          Consultar
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
