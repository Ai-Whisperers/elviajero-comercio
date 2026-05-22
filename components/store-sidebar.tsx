"use client"

import { useState } from "react"

interface CategoryOption {
  label: string
  value: string
  count?: number
  subcategories?: { id: string; name: string; slug: string }[]
}

interface FilterSection {
  title: string
  key: string
  options: CategoryOption[]
  selected: string[]
  onToggle: (value: string) => void
  hasSubcategories?: boolean
}

interface StoreSidebarProps {
  sections: FilterSection[]
  categories?: { id: string; name: string; slug: string; subcategories: { id: string; name: string; slug: string }[] }[]
  activeCount: number
  onClear: () => void
  priceRange: { min: number; max: number }
  priceBounds: { min: number; max: number }
  onPriceChange: (min: number, max: number) => void
  selectedCats?: string[]
  selectedSubcats?: string[]
  onSubcatToggle?: (subcat: string) => void
}

function SectionHeader({ title, open, onToggle }: { title: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between py-3 text-sm font-semibold text-foreground hover:text-primary transition-colors"
    >
      {title}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
  )
}

function ChevronRight({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      className={`shrink-0 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}

export function StoreSidebar({
  sections, categories = [], activeCount, onClear,
  priceRange, priceBounds, onPriceChange,
  selectedCats = [], selectedSubcats = [], onSubcatToggle,
}: StoreSidebarProps) {

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const s = new Set<string>()
    sections.forEach((sec) => s.add(sec.key))
    s.add("price")
    return s
  })

  // Track which category accordions are expanded
  const [openCats, setOpenCats] = useState<Set<string>>(() => {
    const s = new Set<string>()
    // Default open: first category that has subcategories
    return s
  })

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const toggleCatAccordion = (catName: string) => {
    setOpenCats((prev) => {
      const next = new Set(prev)
      next.has(catName) ? next.delete(catName) : next.add(catName)
      return next
    })
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Filtros</h2>
          {activeCount > 0 && (
            <button
              onClick={onClear}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
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
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Gs.</span>
                  <input
                    type="number"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange.min || ""}
                    onChange={(e) => onPriceChange(Number(e.target.value) || 0, priceRange.max)}
                    placeholder={String(priceBounds.min)}
                    className="w-full rounded-lg border border-border bg-background pl-7 pr-2 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
                <span className="text-muted-foreground text-xs">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Gs.</span>
                  <input
                    type="number"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange.max || ""}
                    onChange={(e) => onPriceChange(priceRange.min, Number(e.target.value) || priceBounds.max)}
                    placeholder={String(priceBounds.max)}
                    className="w-full rounded-lg border border-border bg-background pl-7 pr-2 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              {/* Preset pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "< 50k", min: 0, max: 50000 },
                  { label: "50k - 150k", min: 50000, max: 150000 },
                  { label: "150k - 300k", min: 150000, max: 300000 },
                  { label: "> 300k", min: 300000, max: priceBounds.max },
                ].map((preset) => {
                  const isActive = priceRange.min === preset.min && priceRange.max === preset.max
                  return (
                    <button
                      key={preset.label}
                      onClick={() => onPriceChange(isActive ? 0 : preset.min, isActive ? priceBounds.max : preset.max)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-150 ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
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

        {/* Dynamic sections from categories / brands */}
        {categories.length > 0 ? (
          /* New: hierarchical category + subcategory rendering */
          <div className="border-t border-border">
            <SectionHeader title="Categoría" open={openSections.has("category")} onToggle={() => toggleSection("category")} />
            {openSections.has("category") && (
              <div className="pb-4 space-y-1">
                {categories.map((cat) => {
                  const catSelected = selectedCats.includes(cat.name)
                  const hasSubs = cat.subcategories && cat.subcategories.length > 0
                  const catOpen = openCats.has(cat.name)

                  return (
                    <div key={cat.id} className="rounded-lg overflow-hidden">
                      <div className="flex items-center">
                        <label className="flex cursor-pointer items-center gap-2.5 py-2 flex-1 min-w-0">
                          <div
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150 ${
                              catSelected ? "border-primary bg-primary shadow-sm" : "border-border bg-background hover:border-primary/50"
                            }`}
                            onClick={() => {
                              if (hasSubs) toggleCatAccordion(cat.name)
                            }}
                          >
                            {catSelected && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                <path d="M20 6 9 17l-5-5"/>
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={catSelected}
                            onChange={() => {
                              if (!hasSubs) sections[0]?.onToggle(cat.name)
                            }}
                          />
                          <span className={`flex-1 text-sm truncate transition-colors ${catSelected ? "text-foreground font-medium" : "text-foreground/80"}`}>
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground mr-1">
                            ({cat.subcategories?.length || 0})
                          </span>
                          {hasSubs && (
                            <span onClick={() => toggleCatAccordion(cat.name)} className="cursor-pointer p-0.5 hover:bg-muted rounded transition-colors">
                              <ChevronRight open={catOpen} />
                            </span>
                          )}
                        </label>
                      </div>

                      {/* Subcategories */}
                      {hasSubs && catOpen && (
                        <div className="pl-7 pb-1 space-y-0.5">
                          {cat.subcategories.map((sub) => {
                            const subSelected = selectedSubcats.includes(sub.name)
                            return (
                              <label key={sub.id} className="flex cursor-pointer items-center gap-2 py-1.5 rounded-md hover:bg-muted/60 px-2 transition-colors">
                                <div
                                  className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-all duration-150 ${
                                    subSelected ? "border-primary bg-primary shadow-sm" : "border-border bg-background hover:border-primary/50"
                                  }`}
                                >
                                  {subSelected && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                      <path d="M20 6 9 17l-5-5"/>
                                    </svg>
                                  )}
                                </div>
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={subSelected}
                                  onChange={() => onSubcatToggle?.(sub.name)}
                                />
                                <span className={`flex-1 text-xs transition-colors ${subSelected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                  {sub.name}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          /* Fallback: flat category list from filterSections */
          sections.map((section) => (
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
                        <input type="checkbox" className="sr-only" checked={checked} onChange={() => section.onToggle(opt.value)} />
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
          ))
        )}

        {/* Brand section (always flat) */}
        {categories.length > 0 && sections.filter(s => s.key === "brand").map((section) => (
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
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => section.onToggle(opt.value)} />
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