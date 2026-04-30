"use client"
import content from "@/content/es.json"
import Link from "next/link"
import { useState } from "react"

const c = content as any

export function Header() {
  const [open, setOpen] = useState(false)
  const nav = c.navigation.items || []
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">EV</div>
          <span className="hidden text-lg font-bold text-foreground sm:inline">{c.navigation.businessName}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.filter((x:any)=>x.href!="/").slice(0,6).map((n:any) => (
            <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-light">{n.label}</Link>
          ))}
          <a href={c.navigation.ctaHref} target="_blank" rel="noopener noreferrer" className="ml-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">{c.navigation.ctaText}</a>
        </nav>
        <button onClick={()=>setOpen(!open)} className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium md:hidden"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
      </div>
      {open && <div className="border-t border-border bg-white px-4 py-2 md:hidden"><div className="flex flex-col gap-1">{[...nav, {label:c.navigation.ctaText, href:c.navigation.ctaHref}].map((n:any) => (
        <a key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-light" onClick={()=>setOpen(false)}>{n.label}</a>
      ))}</div></div>}
    </header>
  )
}
