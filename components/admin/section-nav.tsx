"use client"

export type Section = { key: string; label: string }

export const SECTIONS: Section[] = [
  { key: "general", label: "General" },
  { key: "hero", label: "Hero / Portada" },
  { key: "about", label: "Nosotros" },
  { key: "contacto", label: "Contacto" },
  { key: "footer", label: "Footer" },
  { key: "faq", label: "FAQ" },
  { key: "stats", label: "Estadísticas" },
  { key: "features", label: "Características" },
  { key: "testimonials", label: "Testimonios" },
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
