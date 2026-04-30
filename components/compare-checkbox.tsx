
"use client"
import { useState } from "react"

const KEY = "viajero_compare"

export function CompareCheckbox({ productName }: { productName: string }) {
  const [checked, setChecked] = useState(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(KEY) || "[]")
      return list.includes(productName)
    } catch { return false }
  })

  const toggle = () => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(KEY) || "[]")
      if (checked) {
        const updated = list.filter(n => n !== productName)
        localStorage.setItem(KEY, JSON.stringify(updated))
      } else {
        if (list.length >= 4) { alert("Máximo 4 productos para comparar"); return }
        localStorage.setItem(KEY, JSON.stringify([...list, productName]))
      }
      setChecked(!checked)
    } catch {}
  }

  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground" onClick={e => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={toggle} className="rounded border-border text-primary focus:ring-primary" />
      Comparar
    </label>
  )
}
