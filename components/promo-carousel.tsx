"use client"
import { useState, useEffect, useCallback } from "react"
import content from "@/content/es.json"

const c = content as any

export function PromoCarousel() {
  const promos = c.promociones?.promotions || []
  const [current, setCurrent] = useState(0)

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % promos.length),
    [promos.length]
  )

  useEffect(() => {
    if (promos.length <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, promos.length])

  if (promos.length === 0) return null

  const promo = promos[current]
  return (
    <a
      href={promo.ctaHref || "/promociones"}
      className="relative block bg-accent py-2 text-center text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
    >
      {promo.badge && (
        <span className="mr-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
          {promo.badge}
        </span>
      )}
      {promo.title}: {promo.description}
      {promos.length > 1 && (
        <span className="ml-2 text-accent-foreground/60">({current + 1}/{promos.length})</span>
      )}
    </a>
  )
}
