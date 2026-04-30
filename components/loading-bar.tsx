
"use client"
import { useEffect, useState } from "react"

export function PageLoadingBar() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    const start = () => { setLoading(true) }
    const end = () => { timer = setTimeout(() => setLoading(false), 300) }
    window.addEventListener("beforeunload", start)
    // Use MutationObserver to detect page changes
    const observer = new MutationObserver(() => {
      setLoading(true)
      clearTimeout(timer)
      timer = setTimeout(() => setLoading(false), 500)
    })
    observer.observe(document.querySelector("main") || document.body, { childList: true, subtree: true })
    return () => { window.removeEventListener("beforeunload", start); clearTimeout(timer); observer.disconnect() }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-muted">
      <div className={"h-full bg-primary transition-all duration-300 " + (loading ? "w-3/4" : "w-0")} />
    </div>
  )
}
