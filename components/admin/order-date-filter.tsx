
"use client"
import { useState } from "react"

export function OrderDateFilter({ onFilter }: { onFilter: (start: string, end: string) => void }) {
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs text-gray-500">Desde:</span>
      <input type="date" value={start} onChange={e => { setStart(e.target.value); onFilter(e.target.value, end) }} className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white" />
      <span className="text-xs text-gray-500">Hasta:</span>
      <input type="date" value={end} onChange={e => { setEnd(e.target.value); onFilter(start, e.target.value) }} className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white" />
    </div>
  )
}
