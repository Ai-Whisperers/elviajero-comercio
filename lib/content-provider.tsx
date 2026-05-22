"use client"
import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react"
import defaultContent from "@/content/es.json"
type ContentData = Record<string, any>

interface ContentContextType {
  content: ContentData
  get: (path: string) => any
  loading: boolean
  refresh: () => Promise<void>
}

const ContentContext = createContext<ContentContextType>({
  content: {} as ContentData,
  get: () => undefined,
  loading: false,
  refresh: async () => {},
})

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<ContentData>({})
  const [loading, setLoading] = useState(true)
  const fetchedRef = useRef(false)

  // Deep merge defaults (content/es.json) with admin overrides from Supabase
  // This ensures all default content (stats, features, testimonials, etc.)
  // is available even when Supabase only has partial overrides
  const content = useMemo(() => deepMerge(deepMerge({}, defaultContent), overrides), [overrides])

  const get = useCallback((path: string) => {
    return deepGet(content, path)
  }, [content])

  const fetchOverrides = useCallback(async () => {
    try {
      const res = await fetch("/api/content/overrides")
      if (res.ok) {
        const data = await res.json()
        if (data && typeof data === "object") {
          setOverrides(data)
        }
      }
    } catch {
      // Silent fail — defaults will be used
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true
      fetchOverrides()
    }
  }, [fetchOverrides])

  return (
    <ContentContext.Provider value={{ content, get, loading, refresh: fetchOverrides }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}

function deepGet(obj: any, path: string): any {
  const parts = path.split(".")
  let cur = obj
  for (const p of parts) {
    if (cur?.[p] === undefined || cur?.[p] === null) return undefined
    cur = cur[p]
  }
  return cur
}

function deepMerge(base: any, overrides: any): any {
  if (typeof base !== "object" || base === null) return overrides ?? base
  if (typeof overrides !== "object" || overrides === null) return overrides ?? base
  if (Array.isArray(base) || Array.isArray(overrides)) return overrides ?? base

  const result: any = { ...base }
  for (const key of Object.keys(overrides)) {
    if (key in base) {
      result[key] = deepMerge(base[key], overrides[key])
    } else {
      result[key] = overrides[key]
    }
  }
  return result
}