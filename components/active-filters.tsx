"use client"

interface ActiveFilter {
  label: string
  onRemove: () => void
}

interface ActiveFiltersProps {
  filters: ActiveFilter[]
  onClearAll: () => void
}

export function ActiveFilters({ filters, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
        >
          {f.label}
          <button
            onClick={f.onRemove}
            className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/10"
            aria-label={`Quitar filtro ${f.label}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-1"
      >
        Limpiar todo
      </button>
    </div>
  )
}
