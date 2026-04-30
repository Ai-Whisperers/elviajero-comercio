"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/cart-context"

export function BottomNav({ onCartClick }: { onCartClick?: () => void }) {
  const pathname = usePathname()
  const { itemCount } = useCart()

  const items = [
    { label: "Inicio", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Tienda", href: "/tienda", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
    { label: "Carrito", href: "", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z", action: true },
    { label: "Blog", href: "/blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
    { label: "Cuenta", href: "/mi-cuenta", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 backdrop-blur-sm md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1">
        {items.map((item) => {
          const isActive = item.href ? pathname === item.href : false
          const content = (
            <div className="flex flex-col items-center gap-0.5 px-3 py-1.5">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isActive ? "0" : "2"} className={isActive ? "text-primary" : "text-muted-foreground"}>
                  <path d={item.icon} />
                </svg>
                {item.label === "Carrito" && itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-accent text-[8px] font-bold text-accent-foreground px-0.5">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span>
            </div>
          )
          if (item.action) {
            return <button key={item.label} onClick={onCartClick} className="relative">{content}</button>
          }
          return <Link key={item.label} href={item.href || "#"}>{content}</Link>
        })}
      </div>
    </nav>
  )
}
