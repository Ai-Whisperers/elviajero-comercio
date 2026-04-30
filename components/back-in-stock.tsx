"use client"
import { useState } from "react"

const KEY = "viajero_backinstock"

interface StockRequest {
  productName: string
  email: string
  createdAt: number
}

export function BackInStockForm({ productName }: { productName: string }) {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const requests: StockRequest[] = JSON.parse(localStorage.getItem(KEY) || "[]")
    if (requests.some((r) => r.productName === productName && r.email === email)) return
    requests.push({ productName, email, createdAt: Date.now() })
    localStorage.setItem(KEY, JSON.stringify(requests))
    setDone(true)
  }

  if (done) return <p className="text-sm text-success">Te avisaremos cuando esté disponible</p>

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com"
        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring" />
      <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Avísame</button>
    </form>
  )
}
