'use client'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface NavItem { label: string; href: string }

export function Header({ logo, navItems, locale = "es" }: {
  logo?: string; navItems?: NavItem[]; locale?: string
}) {
  const pathname = usePathname()
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === `/s/${locale}/dayah-litworks`
    return pathname.includes(href)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {logo && <Image src={logo} alt="Dayah LitWorks" width={120} height={40} className="h-8 w-auto" />}
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems?.map((item, i) => (
            <Link key={i} href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href) ? 'bg-secondary text-secondary-foreground' : 'text-foreground hover:bg-surface-light'
              }`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <a href="https://wa.me/595986868241" target="_blank" rel="noopener noreferrer"
            className="ml-3 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:scale-105">
            Contactanos
          </a>
          <div className="ml-4 flex gap-1">
            <Link href="/" className={`rounded px-2 py-1 text-xs font-medium ${locale === 'es' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>ES</Link>
            <Link href="/en" className={`rounded px-2 py-1 text-xs font-medium ${locale === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>EN</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
