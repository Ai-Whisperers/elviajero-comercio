"use client"
import { useState, useMemo } from "react"
import content from "@/content/es.json"
import { useCart } from "@/lib/cart-context"
import { ProductModal } from "@/components/product-modal"

const c = content as any

export function SearchAndFilters({
  products,
  categories,
  onFilteredProducts,
}: {
  products: any[]
  categories: string[]
  onFilteredProducts: (products: any[]) => void
}) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [stockFilter, setStockFilter] = useState("")

  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0

  const filtered = useMemo(() => {
    let result = [...products]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.specs || "").toLowerCase().includes(q)
      )
    }

    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter)
    }

    if (priceMin) {
      const min = parseGs(priceMin)
      result = result.filter((p) => parseGs(p.price) >= min)
    }
    if (priceMax) {
      const max = parseGs(priceMax)
      result = result.filter((p) => parseGs(p.price) <= max)
    }

    if (stockFilter === "in_stock") {
      result = result.filter((p) => (p.stock ?? 0) > 0)
    } else if (stockFilter === "low_stock") {
      result = result.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5)
    } else if (stockFilter === "out_of_stock") {
      result = result.filter((p) => (p.stock ?? 0) === 0)
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => parseGs(a.price) - parseGs(b.price))
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => parseGs(b.price) - parseGs(a.price))
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [search, categoryFilter, sortBy, priceMin, priceMax, stockFilter, products])

  // Return filtered products to parent
  if (typeof onFilteredProducts === "function") {
    // We call it via setTimeout to avoid re-render loops
    setTimeout(() => onFilteredProducts(filtered), 0)
  }

  return (
    <div className="mb-8 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Buscar</label>
          <input
            type="text"
            placeholder="Buscá por producto, marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
          />
        </div>

        {/* Category filter */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Categoría</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Ordenar</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring"
          >
            <option value="">Por defecto</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
            <option value="name">A-Z</option>
          </select>
        </div>

        {/* Stock filter */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Disponibilidad</label>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring"
          >
            <option value="">Todos</option>
            <option value="in_stock">En stock</option>
            <option value="low_stock">Pocas unidades (≤5)</option>
            <option value="out_of_stock">Agotado</option>
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-end justify-end">
          <p className="text-xs text-muted-foreground">
            {filtered.length} de {products.length} productos
          </p>
        </div>
      </div>
    </div>
  )
}
