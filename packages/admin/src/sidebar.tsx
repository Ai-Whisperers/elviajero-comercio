"use client"
import Link from "next/link"
import { Home, ShoppingBag, Package, Users, FileText, Settings, HelpCircle } from "lucide-react"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { label: "Productos", href: "/admin/productos", icon: Package },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Contenido", href: "/admin/contenido", icon: FileText },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings },
  { label: "Ayuda", href: "/admin/ayuda", icon: HelpCircle },
]

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] w-64 flex-col border-r bg-white">
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
