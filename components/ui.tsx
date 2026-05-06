"use client"
import { useEffect, useState } from "react"
import { useCart } from "@ai-whisperers/commerce/cart/cart-context"
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"

const c = content as any

export function Toast({ message, type = "success", onClose }: { message: string; type?: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-24 right-6 z-50 rounded-xl px-6 py-4 shadow-lg text-sm font-medium transition-all ${type === "success" ? "bg-green-700 text-white" : "bg-destructive text-destructive-foreground"}`}>
      {message}
    </div>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="bg-surface border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-3 text-xs text-muted-foreground">
        {items.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-1">/</span>}
            {item.href ? <Link href={item.href} className="hover:text-primary">{item.label}</Link> : <span className="text-foreground">{item.label}</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

export function EmptyState({ icon, title, description, action }: { icon: string; title: string; description: string; action?: { label: string; href: string } }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && <Link href={action.href} className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">{action.label}</Link>}
    </div>
  )
}

export function NewsletterSuccess() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (window.location.search.includes("subscribed=true")) {
      setShow(true)
      window.history.replaceState({}, "", "/")
    }
  }, [])
  if (!show) return null
  return <Toast message="¡Gracias por suscribirte! Te enviaremos novedades." onClose={() => setShow(false)} />
}

export function CartEmptyState() {
  const featured = c.home?.productCatalog?.products?.slice(0, 4) || []
  return (
    <div className="p-4">
      <p className="py-10 text-center text-muted-foreground">Tu carrito está vacío</p>
      <p className="text-xs font-semibold text-foreground mb-3">Productos que te pueden interesar</p>
      <div className="grid grid-cols-2 gap-3">
        {featured.map((p: any, i: number) => {
          const slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
          return (
            <Link key={i} href={`/producto/${slug}`} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-surface">
              <div className="h-12 w-12 shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={48} height={48} className="h-full w-full object-contain" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground line-clamp-1">{p.name}</p>
                <p className="text-xs font-bold text-primary">{p.price}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
