"use client"

export type Section = { key: string; label: string }

export const SECTIONS: Section[] = [
  { key: "general", label: "General" },
  { key: "branding", label: "Branding / Logo" },
  { key: "hero", label: "Hero / Portada" },
  { key: "categories", label: "Categorías" },
  { key: "about", label: "Nosotros" },
  { key: "contacto", label: "Contacto" },
  { key: "footer", label: "Footer" },
  { key: "faq", label: "FAQ" },
  { key: "kits", label: "Kits / Promos" },
  { key: "promociones", label: "Página Promociones" },
  { key: "stats", label: "Estadísticas" },
  { key: "features", label: "Características" },
  { key: "testimonials", label: "Testimonios" },
  { key: "navigation", label: "Navegación" },
  { key: "storeLocator", label: "Ubicación / Local" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "shipping", label: "Envío" },
  { key: "deliveryZones", label: "Zonas de Envío" },
  { key: "paymentMethods", label: "Medios de Pago" },
  { key: "cookieConsent", label: "Cookies" },
  { key: "newsletter", label: "Newsletter" },
  { key: "blog", label: "Blog" },
  { key: "storeTexts", label: "Textos Tienda" },
  { key: "productPage", label: "Página Producto" },
  { key: "uiLabels", label: "Etiquetas UI" },
  { key: "seo", label: "SEO" },
]

interface SectionNavProps {
  sections: Section[]
  active: string
  onChange: (key: string) => void
}

export function SectionNav({ sections, active, onChange }: SectionNavProps) {
  return (
    <div className="w-48 flex-shrink-0 space-y-1">
      {sections.map(s => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
            active === s.key
              ? "bg-emerald-600 text-white font-medium"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
