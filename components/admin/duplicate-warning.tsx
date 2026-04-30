
"use client"
import { useState, useEffect } from "react"

export function DuplicateProductWarning({ allProducts, newName }: { allProducts: any[]; newName: string }) {
  const [warnings, setWarnings] = useState<string[]>([])

  useEffect(() => {
    const lower = newName.toLowerCase().trim()
    if (!lower) { setWarnings([]); return }
    const matches = allProducts.filter(p => p.name?.toLowerCase().includes(lower))
    setWarnings(matches.length > 0 ? matches.map(p => p.name) : [])
  }, [newName, allProducts])

  if (warnings.length === 0) return null

  return (
    <div className="rounded-lg bg-yellow-900/20 border border-yellow-800 px-4 py-3 mb-4">
      <p className="text-xs text-yellow-300 font-medium">⚠️ Posible duplicado</p>
      <p className="text-xs text-yellow-400/80 mt-1">{warnings.length} producto{warnings.length > 1 ? "s" : ""} similar{warnings.length > 1 ? "es" : ""} encontrado{warnings.length > 1 ? "s" : ""}:</p>
      <ul className="mt-1 space-y-0.5">{warnings.map((w, i) => <li key={i} className="text-xs text-gray-400">• {w}</li>)}</ul>
    </div>
  )
}
