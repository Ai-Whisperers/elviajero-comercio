"use client"
import { useState, useMemo } from "react"
export function useDateFilter(orders: any[]) {
  const [startDate, setStart] = useState("")
  const [endDate, setEnd] = useState("")
  const filtered = useMemo(() => {
    if (!startDate && !endDate) return orders
    return orders.filter((o: any) => {
      const d = new Date(o.date).getTime()
      if (startDate && d < new Date(startDate).getTime()) return false
      if (endDate && d > new Date(endDate).setHours(23, 59, 59, 999)) return false
      return true
    })
  }, [orders, startDate, endDate])
  const ui = (
    <div className="flex gap-3 mb-4">
      <input type="date" value={startDate} onChange={e => setStart(e.target.value)} className="rounded-lg border border-input bg-surface px-3 py-2 text-sm" />
      <span className="self-center text-muted-foreground">a</span>
      <input type="date" value={endDate} onChange={e => setEnd(e.target.value)} className="rounded-lg border border-input bg-surface px-3 py-2 text-sm" />
    </div>
  )
  return { filtered, filterUI: ui }
}
