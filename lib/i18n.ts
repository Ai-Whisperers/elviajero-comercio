type Lang = "es" | "en" | "gn"

let currentLang: Lang = "es"

export function getLang(): Lang {
  if (typeof window === "undefined") return "es"
  try {
    const saved = localStorage.getItem("viajero_lang") as Lang | null
    if (saved && ["es", "en", "gn"].includes(saved)) return saved
    const urlLang = new URLSearchParams(window.location.search).get("lang") as Lang | null
    if (urlLang && ["es", "en", "gn"].includes(urlLang)) return urlLang
  } catch {}
  return "es"
}

export function setLang(lang: Lang) {
  currentLang = lang
  if (typeof window !== "undefined") localStorage.setItem("viajero_lang", lang)
}

export function t(key: string): string {
  const lang = getLang()
  if (lang === "es") return key // Spanish is the source
  try {
    const data = require(`@/content/${lang}.json`)
    const parts = key.split(".")
    let val: any = data
    for (const p of parts) { if (val && typeof val === "object") val = val[p]; else return key }
    if (typeof val === "string") return val
  } catch {}
  return key // fallback to Spanish
}
