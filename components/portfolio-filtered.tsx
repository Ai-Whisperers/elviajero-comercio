'use client'
import { useState } from "react"
import Image from "next/image"

interface PortfolioItem {
  title: string; image?: string; imageUrl?: string; category?: string
}

export function PortfolioFiltered({ title, subtitle, items }: {
  title: string; subtitle?: string; items: PortfolioItem[]
}) {
  const [cat, setCat] = useState("all")
  if (!items?.length) return null

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))] as string[]
  const filtered = cat === "all" ? items : items.filter(i => i.category === cat)

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <button onClick={() => setCat("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                cat === "all" ? 'bg-secondary text-secondary-foreground' : 'bg-surface-light text-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`}>Todos</button>
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  cat === c ? 'bg-secondary text-secondary-foreground' : 'bg-surface-light text-foreground hover:bg-secondary hover:text-secondary-foreground'
                }`}>{c}</button>
            ))}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item, i) => (
            <div key={i} className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-surface-light">
              {(item.image || item.imageUrl) ? (
                <Image src={item.image || item.imageUrl || ""} alt={item.title} fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading={i < 4 ? "eager" : "lazy"} fetchPriority={i < 4 ? "high" : undefined}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-secondary">
                  <span className="text-4xl font-bold text-white/30">{item.title.charAt(0)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  {item.category && <p className="text-sm text-white/80">{item.category}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
