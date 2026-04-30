
"use client"
import { useState, useEffect, useCallback } from "react"

export function useAutoRefresh(intervalMs = 30000) {
  const [counter, setCounter] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setCounter(c => c + 1), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, paused])

  const refresh = useCallback(() => setCounter(c => c + 1), [])

  return { refreshKey: counter, refresh, paused, setPaused }
}
