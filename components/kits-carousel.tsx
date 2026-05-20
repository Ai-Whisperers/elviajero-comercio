"use client"
import { useState } from "react"
import Image from "next/image"

interface KitItem {
  title: string
  description?: string
  price: string
  priceBefore?: string
  image: string
  badge?: string
  whatsappText?: string
}

const ITEMS_PER_PAGE = 6

export function KitsCarousel({
  items,
  title,
  whatsappPhone,
}: {
  items: KitItem[]
  title?: string
  whatsappPhone?: string
}) {
  const [page, setPage] = useState(0)
  if (items.length === 0) return null

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const start = page * ITEMS_PER_PAGE
  const visible = items.slice(start, start + ITEMS_PER_PAGE)

  return (
    <section className="bg-gradient-to-b from-background to-surface py-16">
      <div className="mx-auto max-w-7xl px-4">
        {title && (
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Siguiente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {visible.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-xl border border-border bg-surface shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.title} width={300} height={225} className="h-full w-full object-contain p-3 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-4xl">🎒</div>
                )}
                {item.badge && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-3">
                <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-1">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex-1">{item.description}</p>
                )}

                {/* Price */}
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-primary">{item.price}</span>
                  {item.priceBefore && (
                    <span className="text-xs text-muted-foreground line-through">{item.priceBefore}</span>
                  )}
                </div>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${whatsappPhone || "595984009751"}?text=${encodeURIComponent(item.whatsappText || `Hola! Quiero info sobre ${item.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent/60 px-3 py-1.5 text-[11px] font-semibold text-accent hover:bg-accent/5 active:scale-[0.97] transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Page dots */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all ${i === page ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/30"}`}
                aria-label={`Página ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
