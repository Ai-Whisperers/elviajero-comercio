"use client"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { CartBadge } from "@/components/header/cart-badge"
import { AuthMenu } from "@/components/header/auth-menu"
import { MobileNav } from "@/components/header/mobile-nav"
import { SearchOverlay } from "@/components/header/search-overlay"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CurrencySwitcher } from "@/components/currency-switcher"
import content from "@/content/es.json"

const c = content as any
const submenu = c.categoryMenu || {}
const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/productos", label: "Productos" },
  { href: "/blog", label: "Blog" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/promociones", label: "Ofertas" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
]

export function Header({ onCartClick }: { onCartClick?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-gray-600" aria-label="Abrir menú">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.svg" alt="El Viajero" className="h-8" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === item.href ? "text-[var(--color-primary)] bg-green-50" : "text-gray-600 hover:text-[var(--color-primary)] hover:bg-gray-50"
                  }`}>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-600 hover:text-[var(--color-primary)]" aria-label="Buscar">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <CurrencySwitcher />
              <LanguageSwitcher />
              <DarkModeToggle />
              <AuthMenu />
              <CartBadge onClick={onCartClick} />
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
