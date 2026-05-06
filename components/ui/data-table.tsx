"use client"

import { useState, useMemo } from "react"
import { cn } from "@ai-whisperers/ui/cn"
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react"

interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  searchable?: boolean
  searchKeys?: (keyof T)[]
  pageSize?: number
  emptyMessage?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  searchable = true,
  searchKeys,
  pageSize = 15,
  emptyMessage = "No data found",
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(0)

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    const keys = (searchKeys || Object.keys(data[0] || {})) as string[]
    return data.filter(item =>
      keys.some(k => String(item[k] ?? "").toLowerCase().includes(q))
    )
  }, [data, search, searchKeys])

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = typeof aVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize)

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            className="w-full max-w-sm h-9 rounded-lg border border-zinc-800 bg-zinc-900/50 pl-9 pr-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50"
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800/60 bg-zinc-900/30">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider",
                    col.sortable && "cursor-pointer hover:text-zinc-300 select-none",
                    col.className
                  )}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      sortKey === col.key
                        ? sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        : <ChevronsUpDown className="h-3 w-3 opacity-30" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-zinc-600">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map(item => (
                <tr
                  key={keyExtractor(item)}
                  className={cn(
                    "hover:bg-zinc-800/20 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map(col => (
                    <td key={col.key} className={cn("px-4 py-3 text-zinc-300", col.className)}>
                      {col.render ? col.render(item) : String(item[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>{sorted.length} results</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              Prev
            </button>
            <span className="px-3 py-1">
              {page + 1} / {pages}
            </span>
            <button
              className="px-3 py-1 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              disabled={page >= pages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
