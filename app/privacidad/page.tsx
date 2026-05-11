"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import content from "@/content/es.json"
import { getLang } from "@/lib/i18n"
import { useState } from "react"

const c = content as any
const bc = c.breadcrumbs || {}

function renderLegal(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-bold text-foreground mb-6">{line.replace("# ", "")}</h1>
    if (line.startsWith("## ")) return <h2 key={i} className="mt-8 text-xl font-semibold text-foreground mb-3">{line.replace("## ", "")}</h2>
    if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="mt-2 font-semibold" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
    if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-sm">{line.replace("- ", "")}</li>
    if (line.trim() === "") return <br key={i} />
    return <p key={i} className="mt-1" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
  })
}

export default function PrivacidadPage() {
  const lang = getLang()
  const data = lang === "gn" ? (c.pages?.privacidad || c.pages?.privacidad) : (c.pages?.privacidad || {})
  const [md, setMd] = React.useState("")
  
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: bc.home || "Inicio", href: "/" }, { label: data.title || "Política de Privacidad" }]} />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-2 text-4xl font-bold text-foreground">{data.title || "Política de Privacidad"}</h1>
          <p className="mb-8 text-sm text-muted-foreground">{data.updated || "Última actualización: Abril 2026"}</p>
          <div className="prose prose-gray max-w-none text-muted-foreground text-sm leading-relaxed space-y-2">
            {renderLegal(data.content || "")}
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
