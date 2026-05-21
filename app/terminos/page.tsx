import { Breadcrumbs } from "@/components/ui"
import { renderLegalLines } from "@/components/legal-renderer"
import content from "@/content/es.json"

const c = content as any
const bc = c.breadcrumbs || {}

export default function TerminosPage() {
  const data = c.pages?.terminos || {}

  return (
    <>
<Breadcrumbs items={[{ label: bc.home || "Inicio", href: "/" }, { label: data.title || "Términos y Condiciones" }]} />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-2 text-4xl font-bold text-foreground">{data.title || "Términos y Condiciones"}</h1>
          <p className="mb-8 text-sm text-muted-foreground">{data.updated || "Última actualización: Abril 2026"}</p>
          <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-2">
            {renderLegalLines(data.content || "")}
          </div>
        </div>
      </section>
</>
  )
}
