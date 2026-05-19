"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { ProductModal } from "@/components/product-modal"
import { CookieConsent } from "@/components/cookie-consent"
import { CartToastListener } from "@/components/cart-toast-listener"
import { ProductCard } from "@/components/product-card"
import { SearchAndFilters, SortOption } from "@/components/search-filters"
import { StoreSidebar } from "@/components/store-sidebar"
import { FilterDrawer } from "@/components/filter-drawer"
import { Pagination } from "@/components/pagination"
import { ActiveFilters } from "@/components/active-filters"
import { useRecentlyViewed } from "@/lib/wishlist"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@ai-whisperers/auth/supabase/client"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

// NOTE: JSON import removed - using Supabase only
// Migration 008 created ej_site_config table as source of truth

function parseGs(priceStr: string) {
  return parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")
}

interface StoreProduct {
  id?: string
  slug?: string
  name: string
  category?: string
  price: string
  priceBefore?: string
  description?: string
  brand?: string
  specs?: string
  stock?: number
  weight?: number
  imageUrl?: string
  isNew?: boolean
  featured?: boolean
}

/* ------------------------------------------------------------------ */
/*  Skeleton card                                                       */
/* ------------------------------------------------------------------ */
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-5 w-1/2 rounded bg-muted animate-pulse" />
        <div className="h-9 w-full rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */
export default function TiendaContent() {
  const { add: addRecent } = useRecentlyViewed()
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [dbProducts, setDbProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  /* --- Load products --- */
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("ej_products")
      .select("*")
      .order("name")
      .then(({ data }: { data: any[] | null }) => {
        if (data && data.length > 0) {
          setDbProducts(
            data.map((p: any): StoreProduct => ({
              id: p.id,
              slug: p.slug,
              name: p.name,
              category: p.category,
              price: p.price,
              priceBefore: p.price_before,
              description: p.description,
              brand: p.brand,
              specs: p.specs,
              stock: p.stock,
              weight: p.weight,
              imageUrl: p.image_url,
              isNew: p.is_new,
              featured: p.featured,
            }))
          )
        }
        setLoading(false)
      })
  }, [])

  // NOTE: No fallback to JSON - Supabase is source of truth
  const allProducts = dbProducts

  /* --- URL state helpers --- */
  const readArr = (key: string) => {
    const v = searchParams.get(key)
    return v ? v.split(",") : []
  }
  const readNum = (key: string, def: number) => {
    const v = searchParams.get(key)
    return v ? Number(v) || def : def
  }

  /* --- Filter state --- */
  const [search, setSearch] = useState(searchParams.get("q") || "")
  const [selectedCats, setSelectedCats] = useState<string[]>(() => readArr("cat"))
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => readArr("brand"))
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sort") as SortOption) || "")
  const [priceMin, setPriceMin] = useState(readNum("pmin", 0))
  const [priceMax, setPriceMax] = useState(readNum("pmax", 0))
  const [page, setPage] = useState(readNum("page", 1))
  const [itemsPerPage, setItemsPerPage] = useState(readNum("per", 24))

  /* --- Compute price bounds from data --- */
  const priceBounds = useMemo(() => {
    const prices = allProducts.map((p: StoreProduct) => parseGs(p.price)).filter((p) => p > 0)
    if (prices.length === 0) return { min: 0, max: 1000000 }
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [allProducts])

  /* --- Sync URL when filters change (debounced lightly) --- */
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (selectedCats.length) params.set("cat", selectedCats.join(","))
    if (selectedBrands.length) params.set("brand", selectedBrands.join(","))
    if (sortBy) params.set("sort", sortBy)
    if (priceMin > 0) params.set("pmin", String(priceMin))
    if (priceMax > 0 && priceMax < priceBounds.max) params.set("pmax", String(priceMax))
    if (page > 1) params.set("page", String(page))
    if (itemsPerPage !== 24) params.set("per", String(itemsPerPage))
    return params.toString()
  }, [search, selectedCats, selectedBrands, sortBy, priceMin, priceMax, page, itemsPerPage, priceBounds.max])

  useEffect(() => {
    const qs = buildQuery()
    const url = qs ? `${pathname}?${qs}` : pathname
    window.history.replaceState(null, "", url)
  }, [buildQuery, pathname])

  /* --- Filter logic --- */
  const filtered = useMemo(() => {
    let result = [...allProducts]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.specs || "").toLowerCase().includes(q)
      )
    }

    if (selectedCats.length) {
      result = result.filter((p) => p.category && selectedCats.includes(p.category))
    }

    if (selectedBrands.length) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand))
    }

    if (priceMin > 0) {
      result = result.filter((p) => parseGs(p.price) >= priceMin)
    }
    if (priceMax > 0) {
      result = result.filter((p) => parseGs(p.price) <= priceMax)
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => parseGs(a.price) - parseGs(b.price))
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => parseGs(b.price) - parseGs(a.price))
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    }

    return result
  }, [allProducts, search, selectedCats, selectedBrands, priceMin, priceMax, sortBy])

  /* --- Pagination --- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const safePage = Math.min(page, totalPages)
  const paginated = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, safePage, itemsPerPage])

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  /* --- Brand list --- */
  const brands = useMemo(() => {
    const b = new Set<string>()
    allProducts.forEach((p) => { if (p.brand) b.add(p.brand) })
    return Array.from(b).sort()
  }, [allProducts])

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allProducts.forEach((p) => {
      if (p.brand) counts[p.brand] = (counts[p.brand] || 0) + 1
    })
    return counts
  }, [allProducts])

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allProducts.forEach((p) => {
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [allProducts])

  /* --- Active filter pills data --- */
  const activeFilters = useMemo(() => {
    const out: { label: string; onRemove: () => void }[] = []
    if (search) out.push({ label: `Búsqueda: "${search}"`, onRemove: () => setSearch("") })
    selectedCats.forEach((c) => out.push({ label: c, onRemove: () => toggleCat(c) }))
    selectedBrands.forEach((b) => out.push({ label: b, onRemove: () => toggleBrand(b) }))
    if (priceMin > 0 || (priceMax > 0 && priceMax < priceBounds.max)) {
      const minLabel = priceMin > 0 ? `Gs. ${priceMin.toLocaleString("es-PY")}` : "Gs. 0"
      const maxLabel = priceMax > 0 && priceMax < priceBounds.max ? `Gs. ${priceMax.toLocaleString("es-PY")}` : "+∞"
      out.push({ label: `${minLabel} — ${maxLabel}`, onRemove: () => { setPriceMin(0); setPriceMax(0) } })
    }
    return out
  }, [search, selectedCats, selectedBrands, priceMin, priceMax, priceBounds.max])

  const activeCount = activeFilters.length

  /* --- Handlers --- */
  const toggleCat = (c: string) => {
    setSelectedCats((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])
    setPage(1)
  }
  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b])
    setPage(1)
  }
  const clearAll = () => {
    setSearch("")
    setSelectedCats([])
    setSelectedBrands([])
    setPriceMin(0)
    setPriceMax(0)
    setSortBy("")
    setPage(1)
  }
  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }
  const handleSort = (val: SortOption) => {
    setSortBy(val)
  }
  const handlePage = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const handleItemsPerPage = (n: number) => {
    setItemsPerPage(n)
    setPage(1)
  }

  /* --- Sidebar / drawer sections --- */
  // Extract unique categories from products
  const uniqueCats = useMemo(() => {
    const catSet = new Set<string>()
    allProducts.forEach((p) => {
      if (p.category) catSet.add(p.category)
    })
    return Array.from(catSet).sort()
  }, [allProducts])

  const filterSections = [
    ...(uniqueCats.length > 0 ? [{
      title: "Categoría",
      key: "category" as const,
      options: uniqueCats.map((c: string) => ({ label: c, value: c, count: catCounts[c] || 0 })),
      selected: selectedCats,
      onToggle: toggleCat,
    }] : []),
    ...(brands.length > 0 ? [{
      title: "Marca",
      key: "brand" as const,
      options: brands.map((b: string) => ({ label: b, value: b, count: brandCounts[b] || 0 })),
      selected: selectedBrands,
      onToggle: toggleBrand,
    }] : []),
  ]

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <CartToastListener />

      {/* Breadcrumbs */}
      <nav className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">Inicio</Link>
        <span>/</span>
        <span className="text-foreground">Tienda</span>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/90 to-primary py-16 text-center text-primary-foreground sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/images/marketing/tienda-hero-bg.webp"
            alt=""
            fill
            className="object-cover object-center opacity-25"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl px-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Tienda Online</h1>
          <p className="mt-3 text-base text-primary-foreground/70 sm:text-lg">
            Equipamiento para camping, pesca y aventura en Paraguay.
          </p>
        </div>
      </section>

      {/* Main store area */}
      <section className="bg-background py-8 sm:py-12">
        <div className="mx-auto flex max-w-7xl gap-8 px-4">
          {/* Sidebar (desktop) */}
          <div className="hidden w-60 shrink-0 lg:block">
            <StoreSidebar
              sections={filterSections}
              activeCount={activeCount}
              onClear={clearAll}
              priceRange={{ min: priceMin, max: priceMax }}
              priceBounds={priceBounds}
              onPriceChange={(min, max) => { setPriceMin(min); setPriceMax(max); setPage(1) }}
            />
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Search + sort bar */}
            <SearchAndFilters
              search={search}
              onSearchChange={handleSearch}
              sortBy={sortBy}
              onSortChange={handleSort}
              activeFiltersCount={activeCount}
              onOpenFilters={() => setDrawerOpen(true)}
              resultCount={filtered.length}
              totalCount={allProducts.length}
            />

            {/* Active filter pills */}
            <div className="mt-3">
              <ActiveFilters filters={activeFilters} onClearAll={clearAll} />
            </div>

            {/* Product grid */}
            <div className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : paginated.length === 0 ? (
                <div className="py-20 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-muted-foreground/30">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
                  </svg>
                  <p className="text-lg text-muted-foreground">No encontramos productos con esos filtros.</p>
                  <button onClick={clearAll} className="mt-3 text-sm font-medium text-primary hover:underline">
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {paginated.map((p, i) => (
                      <ProductCard
                        key={p.id || p.slug || p.name || i}
                        product={{
                          id: p.id,
                          slug: p.slug || slugify(p.name),
                          name: p.name,
                          price: p.price,
                          priceBefore: p.priceBefore,
                          imageUrl: p.imageUrl,
                          category: p.category,
                          stock: p.stock,
                          specs: p.specs,
                        }}
                        onClick={(p) => { addRecent(p.name); setSelectedProduct(p) }}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-10">
                    <Pagination
                      currentPage={safePage}
                      totalPages={totalPages}
                      onPageChange={handlePage}
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={handleItemsPerPage}
                      totalItems={filtered.length}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-t border-border bg-surface-light py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
                title: "Medios de pago",
                desc: "Visa, Mastercard, Bancard\nTransferencia, Efectivo",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                title: "Envíos a todo PY",
                desc: "Consultá cobertura en tu zona",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                title: "Garantía",
                desc: "Todos los productos tienen garantía",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
                title: "WhatsApp directo",
                desc: "Respondemos en el día",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2 text-center">
                {item.icon}
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="whitespace-pre-line text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CookieConsent />

      {/* Mobile filter drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sections={filterSections}
        activeCount={activeCount}
        onClear={clearAll}
      />
    </>
  )
}
