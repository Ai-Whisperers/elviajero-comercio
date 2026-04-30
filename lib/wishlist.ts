"use client"
import { useState, useEffect } from "react"

const STORAGE_KEY = "viajero-wishlist"
const RECENT_KEY = "viajero-recently-viewed"

export function getWishlistCount(): number {
  if (typeof window === "undefined") return 0
  try { const f = JSON.parse(localStorage.getItem("viajero_favs") || "[]"); return f.length } catch { return 0 }
}

export function useWishlist() {
  const [items, setItems] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, loaded])

  const toggle = (name: string) => {
    setItems((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
  }

  const isWished = (name: string) => items.includes(name)
  const clear = () => setItems([])

  return { items, toggle, isWished, clear }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  const add = (name: string) => {
    setItems((prev) => {
      const next = [name, ...prev.filter((n) => n !== name)].slice(0, 8)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      return next
    })
  }

  return { items, add }
}
