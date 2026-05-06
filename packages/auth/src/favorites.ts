"use client"
import { useState, useCallback } from "react"
const STORAGE_KEYS = { WISHLIST: "wishlist", FAVORITES_USER: (userId: string) => `favorites_${userId}` }
import type { User } from "./types"

export function useAuthFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  // Called by AuthProvider when user changes
  const initFavorites = useCallback((user: User | null) => {
    if (user) {
      const key = STORAGE_KEYS.FAVORITES_USER(user.id)
      const favs: string[] = JSON.parse(localStorage.getItem(key) || "[]")
      setFavorites(favs)
    } else {
      setFavorites([])
    }
  }, [])

  const toggleFavorite = useCallback((productName: string, user: User | null) => {
    if (!user) return
    const key = STORAGE_KEYS.FAVORITES_USER(user.id)
    const favs: string[] = JSON.parse(localStorage.getItem(key) || "[]")
    const idx = favs.indexOf(productName)
    if (idx >= 0) favs.splice(idx, 1)
    else favs.push(productName)
    localStorage.setItem(key, JSON.stringify(favs))
    setFavorites([...favs])
  }, [])

  const isFavorite = useCallback((productName: string) => favorites.includes(productName), [favorites])

  return { favorites, setFavorites, initFavorites, toggleFavorite, isFavorite }
}
