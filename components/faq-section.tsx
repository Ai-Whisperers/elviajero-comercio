'use client'
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export interface FAQItem { q: string; a: string }

export function FAQSection({ title, items }: { title?: string; items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  if (!items?.length) return null

  return (
    <section className="bg-surface-light py-16">
      <div className="mx-auto max-w-3xl px-4">
        {title && <h2 className="mb-8 text-center text-3xl font-bold text-foreground">{title}</h2>}
        <div className="space-y-3">
          {items.map((faq, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border bg-surface">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-foreground transition-colors hover:bg-surface-light"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="border-t border-border px-6 py-4 text-sm text-muted-foreground">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
