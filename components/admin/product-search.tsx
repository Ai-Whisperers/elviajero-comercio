
"use client"
import { useState } from "react"

interface Props { products: any[]; onFilter: (filtered: any[]) => void }

export function AdminProductSearch({ products, onFilter }: Props) {
  const [query, setQuery] = useState("")
  const [stockFilter, setStockFilter] = useState("all")

  const handleSearch = (q: string) => {
    setQuery(q)
    applyFilters(q, stockFilter)
  }

  const handleStock = (s: string) => {
    setStockFilter(s)
    applyFilters(query, s)
  }

  const applyFilters = (q: string, s: string) => {
    let filtered = products
    if (q.trim()) {
      const lower = q.toLowerCase()
      filtered = filtered.filter((p: any) => p.name?.toLowerCase().includes(lower) || p.category?.toLowerCase().includes(lower) || p.brand?.toLowerCase().includes(lower))
    }
    if (s === "low") filtered = filtered.filter((p: any) => (p.stock || 0) <= 3 && (p.stock || 0) > 0)
    else if (s === "oos") filtered = filtered.filter((p: any) => (p.stock || 0) === 0)
    else if (s === "in") filtered = filtered.filter((p: any) => (p.stock || 0) > 5)
    onFilter(filtered)
  }

  return (
    <div className="mb-4 flex items-center gap-3">
      <input value={query} onChange={e => handleSearch(e.target.value)} placeholder="Buscar productos..." className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white outline-none focus:border-green-500" />
      <select value={stockFilter} onChange={e => handleStock(e.target.value)} className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white">
        <option value="all">Todo el stock</option>
        <option value="in">En stock</option>
        <option value="low">Stock bajo</option>
        <option value="oos">Agotados</option>
      </select>
    </div>
  )
}
