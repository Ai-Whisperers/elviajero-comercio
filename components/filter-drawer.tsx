"use client"

import { useEffect } from "react"

interface FilterSection {
  title: string
  key: string
  options: { label: string; value: string; count?: number }[]
  selected: string[]
  onToggle: (value: string) => void
}

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  sections: FilterSection[]
  activeCount: number
  onClear: () => void
}

export function FilterDrawer({ open, onClose, sections, activeCount, onClear }: FilterDrawerProps) {
  // Lock scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface shadow-2xl">
        {/* Handle */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">Filtros</h3>
            {activeCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button onClick={onClear} className="text-xs font-medium text-muted-foreground hover:text-foreground underline">
                Limpiar
              </button>
            )}
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {sections.map((section) => (
            <div key={section.key}>
              <h4 className="mb-3 text-sm font-semibold text-foreground">{section.title}</h4>
              <div className="space-y-2">
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
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 border-t border-border bg-surface p-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Ver {activeCount > 0 ? "resultados filtrados" : "todos los productos"}
          </button>
        </div>
      </div>
    </div>
  )
}
