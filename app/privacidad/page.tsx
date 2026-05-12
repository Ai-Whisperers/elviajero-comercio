"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import { renderLegalLines } from "@/components/legal-renderer"
import content from "@/content/es.json"
import { getLang } from "@/lib/i18n"

const c = content as any
const bc = c.breadcrumbs || {}

export default function PrivacidadPage() {
  const lang = getLang()
  const data = lang === "gn" ? (c.pages?.privacidad || {}) : (c.pages?.privacidad || {})

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: bc.home || "Inicio", href: "/" }, { label: data.title || "Política de Privacidad" }]} />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-2 text-4xl font-bold text-foreground">{data.title || "Política de Privacidad"}</h1>
          <p className="mb-8 text-sm text-muted-foreground">{data.updated || "Última actualización: Abril 2026"}</p>
          <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-2">
            {renderLegalLines(data.content || "")}
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
