
"use client"
import { useState } from "react"

interface Props { min: number; max: number; onChange: (min: number, max: number) => void }

export function PriceRangeSlider({ min = 0, max = 2000000, onChange }: Props) {
  const [localMin, setLocalMin] = useState(min)
  const [localMax, setLocalMax] = useState(max)

  const fmt = (n: number) => "Gs. " + n.toLocaleString("es-PY")

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Rango de precio</label>
      <div className="flex items-center gap-3">
        <input type="number" value={localMin} onChange={e => { setLocalMin(Number(e.target.value)); onChange(Number(e.target.value), localMax) }}
          className="w-28 rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-ring" placeholder="Mín" />
        <span className="text-muted-foreground">a</span>
        <input type="number" value={localMax} onChange={e => { setLocalMax(Number(e.target.value)); onChange(localMin, Number(e.target.value)) }}
          className="w-28 rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-ring" placeholder="Máx" />
      </div>
      <input type="range" min={0} max={5000000} step={10000} value={localMax}
        onChange={e => { setLocalMax(Number(e.target.value)); onChange(localMin, Number(e.target.value)) }}
        className="w-full accent-primary" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{fmt(localMin)}</span>
        <span>{fmt(localMax)}</span>
      </div>
    </div>
  )
}
