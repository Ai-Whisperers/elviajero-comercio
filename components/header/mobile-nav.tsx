"use client"
import Link from "next/link"

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/blog", label: "Blog" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/promociones", label: "Ofertas" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
]

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}>
      <div className="w-72 h-full bg-white shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-lg">Menú</span>
          <button onClick={onClose} className="p-2 text-gray-500" aria-label="Cerrar menú">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose} className="text-gray-700 hover:text-[var(--color-primary)] py-2 border-b border-gray-100">{item.label}</Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
