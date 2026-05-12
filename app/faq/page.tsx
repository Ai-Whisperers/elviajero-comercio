"use client"
import { useContent } from "@/lib/content-provider"
import Link from "next/link"

function Input({ label, value, onChange, multiline, placeholder }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  const id = label.replace(/\s+/g, "-").toLowerCase()
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
      {multiline ? (
        <textarea id={id} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 min-h-[80px]" />
      ) : (
        <input id={id} type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
      )}
    </div>
  )
}

export default function FaqPage() {
  const { get } = useContent()
  const faq = get("faq") || {}
  const faqs: any[] = faq.items || []
  const hero = faq.hero || {}

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[250px] bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold text-white">{hero.headline || "FAQ"}</h1>
          <p className="mt-2 text-emerald-100/80">{hero.subheadline}</p>
        </div>
      </section>

      {/* FAQ items */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-4">
          {faqs.map((item: any, i: number) => (
            <details key={i} className="group rounded-xl border border-zinc-700/60 bg-zinc-900/50 p-4 open:ring-1 open:ring-emerald-500/20 transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-white">
                {item.question}
                <svg className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </summary>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-zinc-900/50 py-16 text-center">
        <p className="text-sm text-zinc-400">¿No encontraste lo que buscabas?</p>
        <Link href="/contacto" className="mt-2 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300">
          Contactanos →
        </Link>
      </section>
    </>
  )
}
