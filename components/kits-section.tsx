"use client"

import { KITS } from "@/lib/constants/kits"
import Link from "next/link"

export default function KitsSection() {
  return (
    <section className="py-12 bg-surface-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Kits Especiales
          </h2>
          <p className="text-muted-foreground">
            Kits pre-armados con todo lo que necesitás para tu próxima aventura
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {KITS.map((kit) => (
            <div
              key={kit.id}
              className="rounded-xl border border-border bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-surface-light to-surface flex items-center justify-center text-6xl">
                  🎒
                </div>
                {kit.badge && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {kit.badge}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {kit.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {kit.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {new Intl.NumberFormat("es-PY", {
                        style: "currency",
                        currency: "PYG",
                        minimumFractionDigits: 0,
                      }).format(kit.discountPrice)}
                    </span>
                    {kit.discountPrice < kit.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {new Intl.NumberFormat("es-PY", {
                          style: "currency",
                          currency: "PYG",
                          minimumFractionDigits: 0,
                        }).format(kit.price)}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/tienda?kit=${kit.id}`}
                  className="block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-colors"
                >
                  Ver Kit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
