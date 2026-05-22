"use client"
import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react"
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

  // Memoize merged content to stabilize reference
  const content = useMemo(() => deepMerge({}, overrides), [overrides])

  const get = useCallback((path: string) => {
    // Use the already-deep-merged content so partial overrides don't kill
    // default fields (e.g. kitsCarousel disappearing when DepiFlash overrides
    // have a "home" key without kitsCarousel).
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

function deepMerge(defaults: any, overrides: any): any {
  if (typeof defaults !== "object" || defaults === null) return overrides ?? defaults
  if (typeof overrides !== "object" || overrides === null) return overrides ?? defaults
  if (Array.isArray(defaults) || Array.isArray(overrides)) return overrides ?? defaults
  
  const result: any = { ...defaults }
  for (const key of Object.keys(overrides)) {
    if (key in defaults) {
      result[key] = deepMerge(defaults[key], overrides[key])
    } else {
      result[key] = overrides[key]
    }
  }
  return result
}
