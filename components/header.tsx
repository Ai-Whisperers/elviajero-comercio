import Link from "next/link"
import Image from "next/image"

export function Header({ logo }: { logo?: string }) {
  const navItems = [
    {label:"Inicio", href:"/"},
    {label:"Tienda", href:"/tienda"},
    {label:"Productos", href:"/productos"},
    {label:"Nosotros", href:"/nosotros"},
    {label:"Contacto", href:"/contacto"},
    {label:"FAQ", href:"/faq"},
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">EV</div>
          <span className="hidden text-lg font-bold text-foreground sm:inline">El Viajero</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-light">
              {item.label}
            </Link>
          ))}
          <a href="https://wa.me/595981234567" target="_blank" rel="noopener noreferrer"
            className="ml-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}
