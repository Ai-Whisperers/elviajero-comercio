"use client"
import { useState, useEffect } from "react"
import content from "@/content/es.json"

const c = content as any
const config = c.cookieConsent || {}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem("viajero-cookies-accepted")
    if (!accepted && config.enabled !== false) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem("viajero-cookies-accepted", "true")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white p-4 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {config.message || "Usamos cookies para mejorar tu experiencia."}
          {config.moreInfoLink && (
            <>
              {" "}
              <a
                href={config.moreInfoLink || "/privacidad"}
                className="text-primary underline hover:no-underline"
              >
                {config.moreInfoText || "Más información"}
              </a>
            </>
          )}
        </p>
        <button
          onClick={accept}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          {config.acceptText || "Aceptar"}
        </button>
      </div>
    </div>
  )
}
