"use client"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CurrencySwitcher } from "@/components/currency-switcher"
import { SearchAutocomplete } from "@/components/search-autocomplete"
import { createClient } from "@/lib/supabase/client"
import content from "@/content/es.json"

const c = content as any
const submenu = c.categoryMenu || {}
const allProducts = c.home?.productCatalog?.products || []

export function Header({ onCartClick }: { onCartClick?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSub, setActiveSub] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { itemCount } = useCart()
  const pathname = usePathname()
  const supabase = createClient()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from("profiles").select("name, role").eq("id", session.user.id).single().then(({ data }) => {
          setUser({ id: session.user.id, email: session.user.email, name: data?.name || session.user.email?.split("@")[0] || "", role: data?.role || "customer" })
        })
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.from("profiles").select("name, role").eq("id", session.user.id).single().then(({ data }) => {
          setUser({ id: session.user.id, email: session.user.email, name: data?.name || session.user.email?.split("@")[0] || "", role: data?.role || "customer" })
        })
      } else {
        setUser(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const nav = c.navigation.items || []

  // Predictive search results
  const searchResults = searchQuery.trim().length > 0
    ? allProducts.filter((p: any) =>
        (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    setSearchQuery("")
    window.location.href = `/producto/${slug}`
  }

  const getInitials = (name: string) => {
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <header className={`sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm transition-all ${scrolled ? "shadow-sm" : ""}`}>
      {/* Search bar (collapsible) */}
      {searchQuery.length > 0 && (
        <div className="border-b border-border bg-surface px-4 py-3 relative">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl gap-2">
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscá productos, marcas, categorías..."
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
                autoFocus
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-border bg-white shadow-lg overflow-hidden">
                  {searchResults.map((p: any) => {
                    const slug = (p.name || "").toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
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
            <button type="button" onClick={() => setSearchQuery("")} className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0 md:flex">
          {nav.map((n: any) => {
            const isActive = pathname === n.href || (n.href !== "/" && n.href && pathname.startsWith(n.href))
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
                  href={n.href || "/"}
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

        <div className="flex items-center gap-1.5">
          {/* Desktop search toggle */}
          <button
            onClick={() => setSearchQuery(searchQuery ? "" : " ")}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-light"
            title="Buscar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <CurrencySwitcher />
          <DarkModeToggle />

          {/* User menu — switches login/mi-cuenta based on auth */}
          {user ? (
            <div className="relative group">
              <Link
                href="/mi-cuenta"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                title={user.name}
              >
                <span className="text-xs font-bold">{getInitials(user.name)}</span>
              </Link>
              {/* Hover dropdown */}
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-border bg-white p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                <div className="border-b border-border pb-2 mb-2 px-3">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Link href="/mi-cuenta" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-surface-light transition-colors">Mi Cuenta</Link>
                <Link href="/mi-cuenta/pedidos" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-surface-light transition-colors">Mis Pedidos</Link>
                <Link href="/mi-cuenta/direcciones" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-surface-light transition-colors">Direcciones</Link>
                <Link href="/mi-cuenta/favoritos" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-surface-light transition-colors">Favoritos</Link>
                <Link href="/mi-cuenta/configuracion" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-surface-light transition-colors">Configuración</Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="block rounded-md px-3 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors font-medium">Panel Admin</Link>
                )}
                <div className="border-t border-border mt-2 pt-2">
                  <button
                    onClick={async () => { await supabase.auth.signOut(); setUser(null) }}
                    className="w-full text-left rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className="hidden sm:inline">Ingresar</span>
            </Link>
          )}

          {/* Cart button */}
          <button onClick={onCartClick} className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={mobileOpen ? "M18 6 6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 py-2 md:hidden shadow-lg">
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

          {/* Mobile user section */}
          {user ? (
            <div className="mb-3 rounded-xl border border-border bg-surface p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{getInitials(user.name)}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Link href="/mi-cuenta" onClick={() => setMobileOpen(false)} className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">Mi Cuenta</Link>
                <Link href="/mi-cuenta/pedidos" onClick={() => setMobileOpen(false)} className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">Pedidos</Link>
                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-md bg-green-600/10 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-600/20 transition-colors">Admin</Link>
                )}
                <button onClick={async () => { await supabase.auth.signOut(); setUser(null); setMobileOpen(false) }} className="rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors">Salir</button>
              </div>
            </div>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-primary p-3 text-sm font-semibold text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Iniciar Sesión / Registrarse
            </Link>
          )}

          <div className="flex flex-col gap-1">
            {nav.map((n: any) => {
              const key = n.label.toLowerCase()
              const subKey = key === "accesorios" ? "outdoor" : key === "automóviles" ? "autos" : key
              const items = submenu[subKey] || []

              return (
                <div key={n.href}>
                  <Link
                    href={n.href || "/"}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-light ${pathname === n.href ? "text-primary" : "text-foreground"}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {n.label}
                  </Link>
                  {items.length > 0 && (
                    <div className="ml-4 flex flex-col border-l border-border pl-3">
                      {items.slice(0, 6).map((item: string) => (
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
            {/* WhatsApp CTA in mobile */}
            <a
              href={c.navigation.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-500 mt-2"
              onClick={() => setMobileOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/></svg>
              {c.navigation.ctaText}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
