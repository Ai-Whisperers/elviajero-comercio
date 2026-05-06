"use client"
import { useState } from "react"
import { useCart } from "@ai-whisperers/commerce/cart/cart-context"

export function CartMultiSelect() {
  const { items, removeItem } = useCart()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  const selectAll = () => {
    if (selected.length === items.length) setSelected([])
    else setSelected(items.map(i => i.name))
  }

  const deleteSelected = () => {
    selected.forEach(name => removeItem(name))
    setSelected([])
  }

  if (items.length === 0) return null

  return (
    <div className="border-b border-border px-4 py-2">
      <div className="flex items-center gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={selected.length === items.length && items.length > 0} onChange={selectAll} className="rounded border-border" />
          Seleccionar todos
        </label>
        {selected.length > 0 && (
          <button onClick={deleteSelected} className="text-destructive hover:underline">
            Eliminar ({selected.length})
          </button>
        )}
        <span className="text-muted-foreground">{selected.length} de {items.length}</span>
      </div>
    </div>
  )
}
