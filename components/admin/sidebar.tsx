"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, ShoppingBag, Users, BarChart3,
  Package, Tags, Wand2, Image, Upload, FileText,
  Percent, Star, Briefcase,
  Settings, UserCog, Mail, Palette,
} from "lucide-react"

const iconMap: Record<string, any> = {
  LayoutDashboard, ShoppingBag, Users, BarChart3,
  Package, Tags, Wand2, Image, Upload, FileText,
  Percent, Star, Briefcase,
  Settings, UserCog, Mail, Palette,
}

const SECTIONS = [
  {
    label: "Operaciones",
    items: [
      { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/admin/pedidos", label: "Pedidos", icon: "ShoppingBag" },
      { href: "/admin/clientes", label: "Clientes", icon: "Users" },
      { href: "/admin/reportes", label: "Reportes", icon: "BarChart3" },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/productos", label: "Productos", icon: "Package" },
      { href: "/admin/categorias", label: "Categorías", icon: "Tags" },
      { href: "/admin/enriquecer", label: "Enriquecer", icon: "Wand2" },
      { href: "/admin/fotos", label: "Fotos", icon: "Image" },
      { href: "/admin/importar", label: "Importar", icon: "Upload" },
      { href: "/admin/blog", label: "Blog", icon: "FileText" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/promos", label: "Promos", icon: "Percent" },
      { href: "/admin/resenas", label: "Reseñas", icon: "Star" },
      { href: "/admin/b2b", label: "B2B", icon: "Briefcase" },
    ],
  },
  {
    label: "Configuración",
    items: [
      { href: "/admin/contenido", label: "Contenido", icon: "Settings" },
      { href: "/admin/usuarios", label: "Usuarios", icon: "UserCog" },
      { href: "/admin/suscriptores", label: "Suscriptores", icon: "Mail" },
      { href: "/admin/tema", label: "Tema", icon: "Palette" },
    ],
  },
]

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#0f0f10] border-r border-zinc-800/60 min-h-screen flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-zinc-800/60">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">El Viajero</p>
            <p className="text-[10px] text-zinc-500 font-medium">Administración</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {SECTIONS.map(section => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.12em]">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = iconMap[item.icon]
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/5"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                    }`}
                  >
                    {Icon && <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-emerald-400" : ""}`} />}
                    <span>{item.label}</span>
                    {isActive && <div className="ml-auto w-1 h-4 rounded-full bg-emerald-400" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-zinc-800/60">
        <Link href="/" onClick={onNavigate}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all">
          <LayoutDashboard className="w-3.5 h-3.5" />
          Volver al sitio
        </Link>
      </div>
    </aside>
  )
}
