"use client"
import { useState, useEffect } from "react"

type Lang = "es" | "en" | "gn"

const labels: Record<Lang, string> = { es: "ES", en: "EN", gn: "GN" }
const flags: Record<Lang, string> = { es: "🇵🇾", en: "🇺🇸", gn: "🇵🇾" }
const langs: Lang[] = ["es", "en", "gn"]

export function LanguageSwitcher() {
  const [lang, setLangState] = useState<Lang>("es")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("viajero_lang") as Lang | null
      if (saved && langs.includes(saved)) setLangState(saved)
    } catch {}
  }, [])

  const switchLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem("viajero_lang", l)
    // Reload content by re-rendering (simple approach: reload)
    const url = new URL(window.location.href)
    url.searchParams.set("lang", l)
    window.location.href = url.toString()
  }

  return (
    <div className="flex items-center gap-1">
      {langs.map((l) => (
        <button key={l} onClick={() => switchLang(l)}
          className={`flex h-6 w-7 items-center justify-center rounded text-[10px] font-bold transition-all ${
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}>
          {labels[l]}
        </button>
      ))}
    </div>
  )
}
