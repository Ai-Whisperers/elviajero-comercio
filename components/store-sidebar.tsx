"use client"

import { useState } from "react"

interface FilterSection {
  title: string
  key: string
  options: { label: string; value: string; count?: number }[]
  selected: string[]
  onToggle: (value: string) => void
}

interface StoreSidebarProps {
  sections: FilterSection[]
  activeCount: number
  onClear: () => void
  priceRange: { min: number; max: number }
  priceBounds: { min: number; max: number }
  onPriceChange: (min: number, max: number) => void
}

function SectionHeader({ title, open, onToggle }: { title: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between py-3 text-sm font-semibold text-foreground"
    >
      {title}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
  )
}

export function StoreSidebar({ sections, activeCount, onClear, priceRange, priceBounds, onPriceChange }: StoreSidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    // Default all open
    const s = new Set<string>()
    sections.forEach((sec) => s.add(sec.key))
    s.add("price")
    return s
  })

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Filtros</h2>
          {activeCount > 0 && (
            <button
              onClick={onClear}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpiar ({activeCount})
            </button>
          )}
        </div>

        {/* Price range */}
        <div className="border-t border-border">
          <SectionHeader title="Precio" open={openSections.has("price")} onToggle={() => toggleSection("price")} />
          {openSections.has("price") && (
            <div className="pb-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceRange.min || ""}
                  onChange={(e) => onPriceChange(Number(e.target.value) || 0, priceRange.max)}
                  placeholder="Min"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
                />
                <span className="text-muted-foreground">—</span>
                <input
                  type="number"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceRange.max || ""}
                  onChange={(e) => onPriceChange(priceRange.min, Number(e.target.value) || priceBounds.max)}
                  placeholder="Max"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
                />
              </div>
              {/* Preset pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "< Gs. 50k", min: 0, max: 50000 },
                  { label: "Gs. 50k - 150k", min: 50000, max: 150000 },
                  { label: "Gs. 150k - 300k", min: 150000, max: 300000 },
                  { label: "> Gs. 300k", min: 300000, max: priceBounds.max },
                ].map((preset) => {
                  const isActive = priceRange.min === preset.min && priceRange.max === preset.max
                  return (
                    <button
                      key={preset.label}
                      onClick={() => onPriceChange(isActive ? 0 : preset.min, isActive ? priceBounds.max : preset.max)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {preset.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.key} className="border-t border-border">
            <SectionHeader title={section.title} open={openSections.has(section.key)} onToggle={() => toggleSection(section.key)} />
            {openSections.has(section.key) && (
              <div className="pb-4 space-y-2">
                {section.options.map((opt) => {
                  const checked = section.selected.includes(opt.value)
                  return (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-2.5">
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                        checked ? "border-primary bg-primary" : "border-border bg-background"
                      }`}>
                        {checked && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M20 6 9 17l-5-5"/>
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => section.onToggle(opt.value)}
                      />
                      <span className="flex-1 text-sm text-foreground">{opt.label}</span>
                      {opt.count !== undefined && (
                        <span className="text-xs text-muted-foreground">({opt.count})</span>
                      )}
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
