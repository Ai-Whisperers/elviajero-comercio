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

export function KitsCarousel({
  items,
  title,
  whatsappPhone,
}: {
  items: KitItem[]
  title?: string
  whatsappPhone?: string
}) {
  const [current, setCurrent] = useState(0)
  if (items.length === 0) return null

  const item = items[current]

  return (
    <section className="bg-gradient-to-b from-background to-surface py-16">
      <div className="mx-auto max-w-7xl px-4">
        {title && (
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">{title}</h2>
        )}
        <div className="relative mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="relative flex flex-col sm:flex-row">
              {item.image && (
                <div className="relative flex h-56 items-center justify-center bg-muted sm:h-auto sm:w-2/5">
                  <Image src={item.image} alt={item.title} width={400} height={300} className="h-full w-full object-contain p-4" />
                  {item.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                )}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">{item.price}</span>
                  {item.priceBefore && (
                    <span className="text-sm text-muted-foreground line-through">{item.priceBefore}</span>
                  )}
                </div>
                <a
                  href={`https://wa.me/${whatsappPhone || "595981234567"}?text=${encodeURIComponent(item.whatsappText || `Hola! Quiero info sobre ${item.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-accent px-6 py-2.5 text-sm font-semibold text-accent hover:bg-accent/5 active:scale-[0.97] transition-all sm:self-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
          {items.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrent((p) => (p - 1 + items.length) % items.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted transition-colors"
                aria-label="Anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/30"}`}
                    aria-label={`Ir a slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrent((p) => (p + 1) % items.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted transition-colors"
                aria-label="Siguiente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
