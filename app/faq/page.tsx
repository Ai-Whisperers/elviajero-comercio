"use client"
import { FaqJsonLd } from "@/components/faq-json-ld"
import { useContent } from "@/lib/content-provider"
import Link from "next/link"

export default function FaqPage() {
  const { get } = useContent()
  const faq = get("faq") || {}
  const faqs: any[] = faq.items || []
  const hero = faq.hero || {}

  return (
    <>
      <FaqJsonLd />
<section className="relative flex items-center justify-center min-h-[250px] bg-gradient-to-br from-primary/90 to-primary">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold text-primary-foreground">{hero.headline || "FAQ"}</h1>
          <p className="mt-2 text-primary-foreground/80">{hero.subheadline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-4">
          {faqs.map((item: any, i: number) => (
            <details key={i} className="group rounded-xl border border-border bg-surface p-4 open:ring-1 open:ring-primary/20 transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-foreground">
                {item.question}
                <svg className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-muted py-16 text-center">
        <p className="text-sm text-muted-foreground">¿No encontraste lo que buscabas?</p>
        <Link href="/contacto" className="mt-2 inline-block text-sm font-semibold text-primary hover:text-primary/80">
          Contactanos →
        </Link>
      </section>
</>
  )
}
