"use client"
import { useState, useMemo, useEffect } from "react"

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
  const [pricePreset, setPricePreset] = useState("")
  const [brandFilter, setBrandFilter] = useState("")

  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0

  // Extract unique brands
  const brands = useMemo(() => {
    const b = new Set<string>()
    products.forEach((p: any) => { if (p.brand) b.add(p.brand) })
    return Array.from(b).sort()
  }, [products])

  const filtered = useMemo(() => {
    let result = [...products]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.specs || "").toLowerCase().includes(q)
      )
    }

    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter)
    }

    if (brandFilter) {
      result = result.filter((p) => p.brand === brandFilter)
    }

    // Price presets override manual inputs
    if (pricePreset) {
      const [min, max] = pricePreset.split("-").map(Number)
      result = result.filter((p) => {
        const price = parseGs(p.price)
        return price >= (min || 0) && (max ? price <= max : true)
      })
    } else {
      if (priceMin) {
        const min = parseGs(priceMin)
        result = result.filter((p) => parseGs(p.price) >= min)
      }
      if (priceMax) {
        const max = parseGs(priceMax)
        result = result.filter((p) => parseGs(p.price) <= max)
      }
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
  }, [search, categoryFilter, brandFilter, sortBy, priceMin, priceMax, stockFilter, pricePreset, products])

  // Report filtered results to parent — use effect instead of setTimeout
  useEffect(() => {
    onFilteredProducts(filtered)
  }, [filtered, onFilteredProducts])

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Buscar</label>
          <input
            type="text"
            placeholder="Buscá por producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/30"
          />
        </div>

        {/* Category filter */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Categoría</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/30"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Brand filter */}
        {brands.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Marca</label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/30"
            >
              <option value="">Todas</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sort */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Ordenar</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/30"
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
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/30"
          >
            <option value="">Todos</option>
            <option value="in_stock">En stock</option>
            <option value="low_stock">Pocas unidades (≤5)</option>
            <option value="out_of_stock">Agotado</option>
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-end justify-end lg:col-span-6">
          <p className="text-xs text-muted-foreground">
            {filtered.length} de {products.length} productos
          </p>
        </div>
      </div>

      {/* Price preset buttons */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="self-center text-xs font-medium text-muted-foreground">Precio:</span>
        {[
          { label: "Hasta Gs. 50mil", value: "0-50000" },
          { label: "Gs. 50mil-150mil", value: "50000-150000" },
          { label: "Gs. 150mil-300mil", value: "150000-300000" },
          { label: "Más de Gs. 300mil", value: "300000-0" },
        ].map((preset) => (
          <button
            key={preset.value}
            onClick={() => setPricePreset(pricePreset === preset.value ? "" : preset.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              pricePreset === preset.value
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border bg-white text-muted-foreground hover:bg-surface hover:border-primary/30"
            }`}
          >
            {preset.label}
          </button>
        ))}
        {pricePreset && (
          <button onClick={() => setPricePreset("")} className="text-xs text-muted-foreground hover:text-foreground underline ml-1">
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
