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
import { CurrencySwitcher } from "@ai-whisperers/commerce/currency-switcher"
import content from "@/content/es.json"

const c = content as any
const nav = c.navigation?.ui || []
const ui = c.ui || {}

export function Header({ onCartClick }: { onCartClick?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-gray-600" aria-label={ui.openMenu || "Abrir menú"}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.svg" alt={c.businessName} className="h-8 w-auto" />
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {nav.map((item: any) => (
                <Link key={item.href} href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === item.href ? "text-[var(--color-primary)] bg-green-50" : "text-gray-600 hover:text-[var(--color-primary)] hover:bg-gray-50"
                  }`}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-600 hover:text-[var(--color-primary)]" aria-label={ui.search || "Buscar"}>
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
