'use client'
import { useState } from "react"

export interface ProcessStep {
  number: number
  title: string
  description: string
  duration?: string
}

export function ProcessSection({
  title, subtitle, steps, ctaText, ctaHref
}: {
  title?: string; subtitle?: string; steps: ProcessStep[]
  ctaText?: string; ctaHref?: string
}) {
  const [active, setActive] = useState<number | null>(null)
  if (!steps?.length) return null

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4">
        {title && <h2 className="mb-4 text-center text-3xl font-bold text-foreground">{title}</h2>}
        {subtitle && <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-muted-foreground">{subtitle}</p>}

        <div className="relative">
          <div className="absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary max-md:hidden md:left-1/2 md:-ml-0.5" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={step.number}
                className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                onMouseEnter={() => setActive(step.number)}
                onMouseLeave={() => setActive(null)}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className={`ml-16 max-w-sm rounded-lg border border-border bg-surface p-6 transition-all duration-300 md:m-0 lg:max-w-md ${active === step.number ? 'scale-105' : ''}`}>
                    <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                      Paso {step.number}
                    </span>
                    <h3 className="mb-2 text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    {step.duration && <p className="mt-2 text-xs text-muted-foreground">Duración: {step.duration}</p>}
                  </div>
                </div>

                <div className="absolute left-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary md:left-1/2 md:-ml-5">
                  <span className="text-sm font-bold text-primary-foreground">{step.number}</span>
                </div>

                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>

        {ctaText && ctaHref && (
          <div className="mt-12 text-center">
            <a href={ctaHref} className="inline-block rounded-lg bg-secondary px-8 py-4 font-semibold text-secondary-foreground transition-all hover:scale-105">
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
