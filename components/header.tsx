"use client"
import { useCart } from "@/lib/cart-context"
import { useRecentlyViewed } from "@/lib/wishlist"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CurrencySwitcher } from "@/components/currency-switcher"
import { SearchAutocomplete } from "@/components/search-autocomplete"
import content from "@/content/es.json"

const c = content as any
const submenu = c.categoryMenu || {}
const allProducts = c.home?.productCatalog?.products || []

export function Header({ onCartClick }: { onCartClick?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSub, setActiveSub] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const { itemCount } = useCart()
  const pathname = usePathname()

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const nav = c.navigation.items || []

  // Predictive search results
  const searchResults = searchQuery.trim().length > 0
    ? allProducts.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/tienda?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const handleSelectProduct = (slug: string) => {
    setSearchOpen(false)
    setSearchQuery("")
    window.location.href = `/producto/${slug}`
  }

  return (
    <header className={`sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm transition-all ${scrolled ? "py-0 shadow-sm" : ""}`}>
      {/* Search bar (collapsible) */}
      {searchOpen && (
        <div className="border-b border-border bg-surface px-4 py-3 relative">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscá productos, marcas, categorías..."
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
                autoFocus
              />
              {/* Predictive results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-border bg-white shadow-lg overflow-hidden">
                  {searchResults.map((p: any) => {
                    const slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => handleSelectProduct(slug)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-surface-light transition-colors"
                      >
                        <span className="text-xs font-medium text-muted-foreground line-clamp-1">{p.brand ? `${p.brand} - ` : ""}{p.name}</span>
                        <span className="ml-auto text-xs font-bold text-primary shrink-0">{p.price}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
              Buscar
            </button>
            <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery("") }} className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </form>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/images/logo.svg" alt="El Viajero" className="h-9 w-auto" />
          </Link>
        </div>

        {/* Desktop nav with mega menu */}
        <nav className="hidden items-center gap-0 md:flex">
          {nav.map((n: any) => {
            const isActive = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href))
            const key = n.label.toLowerCase()
            const hasSub = key === "camping" || key === "pesca" || key === "accesorios" || key === "automóviles" || key === "motos" || key === "campo"
            const subKey = key === "accesorios" ? "outdoor" : key === "automóviles" ? "autos" : key
            const items = submenu[subKey] || []

            return (
              <div
                key={n.href}
                className="relative"
                onMouseEnter={() => setActiveSub(key)}
                onMouseLeave={() => setActiveSub(null)}
              >
                <Link
                  href={n.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-light relative ${
                    isActive ? "text-primary" : "text-foreground"
                  } ${activeSub === key ? "bg-surface-light" : ""}`}
                >
                  {n.label}
                  {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />}
                </Link>
                {hasSub && activeSub === key && items.length > 0 && (
                  <div className="absolute left-0 top-full z-50 min-w-[200px] rounded-xl border border-border bg-white p-3 shadow-lg">
                    <div className="flex flex-col gap-1">
                      {items.map((item: string) => (
                        <Link
                          key={item}
                          href={`/tienda?cat=${encodeURIComponent(item.toLowerCase().replace(/[^a-z0-9]/g, "-"))}`}
                          className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-light hover:text-foreground"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <div className="hidden md:block w-48 lg:w-64"><SearchAutocomplete /></div>

          {/* User menu */}
          <CurrencySwitcher />
          <LanguageSwitcher />
          <Link href="/mi-cuenta" className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-light" title="Mi cuenta">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
          {/* Cart */}
          <DarkModeToggle />
          <button onClick={onCartClick} className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* WhatsApp CTA */}
          <a
            href={c.navigation.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/></svg>
            {c.navigation.ctaText}
          </a>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 py-2 md:hidden">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="mb-3 flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscá productos..."
              className="flex-1 rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
            />
            <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </form>

          <div className="flex flex-col gap-1">
            {[...nav, { label: c.navigation.ctaText, href: c.navigation.ctaHref }].map((n: any) => {
              const key = n.label.toLowerCase()
              const subKey = key === "accesorios" ? "outdoor" : key === "automóviles" ? "autos" : key
              const items = submenu[subKey] || []

              return (
                <div key={n.href}>
                  <Link
                    href={n.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-light"
                    onClick={() => setMobileOpen(false)}
                  >
                    {n.label}
                  </Link>
                  {items.length > 0 && (
                    <div className="ml-4 flex flex-col border-l border-border pl-3">
                      {items.slice(0, 4).map((item: string) => (
                        <Link
                          key={item}
                          href={`/tienda?cat=${encodeURIComponent(item.toLowerCase().replace(/[^a-z0-9]/g, "-"))}`}
                          className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
