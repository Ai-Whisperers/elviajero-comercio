"use client"

import { useState } from "react"

export type SortOption = "" | "price_asc" | "price_desc" | "name" | "newest"

interface SearchAndFiltersProps {
  search: string
  onSearchChange: (s: string) => void
  sortBy: SortOption
  onSortChange: (s: SortOption) => void
  activeFiltersCount: number
  onOpenFilters: () => void
  resultCount: number
  totalCount: number
}

export function SearchAndFilters({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  activeFiltersCount,
  onOpenFilters,
  resultCount,
  totalCount,
}: SearchAndFiltersProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {/* Search */}
        <div className={`relative flex-1 transition-all duration-200 ${focused ? "ring-1 ring-ring/30 rounded-xl" : ""}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Buscá productos..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-colors focus:border-ring"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring"
          >
            <option value="">Ordenar por</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
            <option value="name">A - Z</option>
            <option value="newest">Más recientes</option>
          </select>

          {/* Mobile filter button */}
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            Filtros
            {activeFiltersCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        {resultCount} {totalCount > 0 ? `de ${totalCount}` : ""} productos
      </p>
    </div>
  )
}
