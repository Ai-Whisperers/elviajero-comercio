"use client"
import Link from "next/link"
import Image from "next/image"

function catSlug(cat: string) {
  return cat
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "")
}

const CATEGORY_META: Record<string, { emoji: string; color: string; image: string }> = {
  camping: { emoji: "🏕️", color: "from-green-500/20 to-emerald-500/10", image: "/images/categories/camping.webp" },
  pesca: { emoji: "🎣", color: "from-blue-500/20 to-cyan-500/10", image: "/images/categories/pesca.webp" },
  accesorios: { emoji: "🎒", color: "from-amber-500/20 to-orange-500/10", image: "/images/categories/accesorios.webp" },
  electronica: { emoji: "🔦", color: "from-purple-500/20 to-violet-500/10", image: "/images/categories/electronica.webp" },
  accesoriosparavehiculos: { emoji: "🚗", color: "from-red-500/20 to-rose-500/10", image: "/images/categories/vehiculos.webp" },
  accesoriospersonales: { emoji: "🎒", color: "from-teal-500/20 to-emerald-500/10", image: "/images/categories/accesorios.webp" },
}

const DEFAULT_ORDER = ["Camping", "Pesca", "Accesorios", "Electrónica", "Accesorios para Vehículos", "Accesorios Personales"]

export default function CategoryCarousel({ categories = [], products = [] }: { categories?: string[]; products?: any[] }) {
  const catList = categories.length > 0
    ? categories.sort((a, b) => {
        const ai = DEFAULT_ORDER.indexOf(a)
        const bi = DEFAULT_ORDER.indexOf(b)
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
      })
    : DEFAULT_ORDER

  if (catList.length === 0) return null

  return (
    <section className="bg-background py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Categorías</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {catList.map((cat) => {
            const slug = catSlug(cat)
            const meta = CATEGORY_META[slug] || { emoji: "📦", color: "from-gray-500/20 to-gray-400/10", image: "" }
            const count = products.filter((p: any) => p.category === cat).length
            return (
              <Link
                key={cat}
                href={"/categoria/" + slug}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${meta.color} opacity-50 transition-opacity group-hover:opacity-70`} />
                <div className="relative z-10">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-2xl shadow-sm backdrop-blur-sm">
                    {meta.emoji}
                  </div>
                  <h3 className="font-semibold text-foreground">{cat}</h3>
                  {count > 0 && <p className="mt-0.5 text-xs text-muted-foreground">{count} productos</p>}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
