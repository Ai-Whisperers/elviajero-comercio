"use client"
import content from "@/content/es.json"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"

const c = content as any

export function Header({ onCartClick }: { onCartClick?: () => void }) {
  const [open, setOpen] = useState(false)
  const { itemCount } = useCart()
  const nav = c.navigation.items || []
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo.svg" alt="El Viajero" className="h-9 w-auto" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.filter((x:any)=>x.href!=="/").slice(0, 5).map((n:any) => (
            <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-light">{n.label}</Link>
          ))}
          <button onClick={onCartClick} className="relative ml-2 flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {itemCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">{itemCount > 99 ? "99+" : itemCount}</span>}
          </button>
          <a href={c.navigation.ctaHref} target="_blank" rel="noopener noreferrer" className="ml-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">{c.navigation.ctaText}</a>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={onCartClick} className="relative flex h-9 w-9 items-center justify-center rounded-md text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {itemCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">{itemCount > 99 ? "99+" : itemCount}</span>}
          </button>
          <button onClick={()=>setOpen(!open)} className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
        </div>
      </div>
      {open && <div className="border-t border-border bg-white px-4 py-2 md:hidden"><div className="flex flex-col gap-1">{[...nav, {label:c.navigation.ctaText, href:c.navigation.ctaHref}].map((n:any) => (
        <a key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-light" onClick={()=>setOpen(false)}>{n.label}</a>
      ))}</div></div>}
    </header>
  )
}
