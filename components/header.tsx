"use client"
import content from "@/content/es.json"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useRecentlyViewed } from "@/lib/wishlist"

const c = content as any
const submenu = c.categoryMenu || {}

export function Header({ onCartClick, onSearchToggle }: { onCartClick?: () => void; onSearchToggle?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSub, setActiveSub] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { itemCount } = useCart()

  const nav = c.navigation.items || []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/tienda?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
      {/* Search bar (collapsible) */}
      {searchOpen && (
        <div className="border-b border-border bg-surface px-4 py-3">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscá productos, marcas, categorías..."
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
              autoFocus
            />
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
          {nav.filter((x: any) => x.href !== "/").map((n: any) => {
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
                  className={`rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-light ${activeSub === key ? "bg-surface-light" : ""}`}
                >
                  {n.label}
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
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-light"
            aria-label="Buscar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>

          {/* Cart */}
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
