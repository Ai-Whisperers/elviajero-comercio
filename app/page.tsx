import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StatsCounter } from "@/components/stats"
import { PortfolioFiltered } from "@/components/portfolio-filtered"
import { TestimonialsGrid } from "@/components/testimonials"
import { ProcessSection } from "@/components/process"
import { CTABanner } from "@/components/cta-banner"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ServicesSection } from "@/components/services-section"
import heroContent from "@/content/es.json"

export default function Home() {
  const h = heroContent.home?.hero || {}
  const stats = heroContent.home?.stats?.items || []
  const svc = heroContent.home?.services || {}
  const portfolio = heroContent.home?.portfolio || {}
  const testimonials = heroContent.home?.testimonials || {}
  const process = heroContent.home?.process || {}
  const cta = heroContent.ctaBanner || {}
  const footer = heroContent.footer || {}
  const overlayColor = h.overlayColor || "rgba(10,10,20,0.85)"

  const bgStyle = h.backgroundImage
    ? { backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url(${h.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {}

  const statsUnder = (h as any).stats || []

  return (
    <>
      <Header logo="/images/covers/logo-blanco.svg"
        navItems={[
          {label:"Inicio",href:"/"},
          {label:"Servicios",href:"/servicios"},
          {label:"Catálogo",href:"/catalogo"},
          {label:"Sobre",href:"/sobre"},
          {label:"Preguntas",href:"/faq"},
          {label:"Contacto",href:"/contacto"},
        ]}
      />

      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden" style={bgStyle}>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur-2xl sm:p-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">{h.headline || "Portadas que venden."}</h1>
            {h.subheadline && <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">{h.subheadline}</p>}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {h.ctaPrimaryText && (
                <a href="/catalogo" className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-8 text-sm font-semibold text-secondary-foreground shadow-xs transition-all hover:scale-105">
                  {h.ctaPrimaryText}
                </a>
              )}
              {h.ctaSecondaryText && (
                <a href={h.ctaSecondaryHref || "https://wa.me/595986868241"} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-md border-2 border-white/60 px-8 text-sm font-semibold text-white transition-all hover:bg-white/15">
                  {h.ctaSecondaryText}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar under hero */}
        {statsUnder.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-3xl justify-center gap-8 px-4 py-4">
              {statsUnder.map((s: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-xl font-bold text-primary sm:text-2xl">{s.value}</div>
                  <div className="text-xs font-medium text-white/90">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Stats Counter */}
      <StatsCounter items={stats} />

      {/* Services */}
      {svc.items?.length > 0 && <ServicesSection data={svc} />}

      {/* Portfolio */}
      {portfolio.items?.length > 0 && <PortfolioFiltered title={portfolio.title} subtitle={portfolio.subtitle} items={portfolio.items} />}

      {/* Testimonials */}
      {testimonials.items?.length > 0 && <TestimonialsGrid title={testimonials.title} subtitle={testimonials.subtitle} items={testimonials.items.map((t: any) => ({ quote: t.text || t.quote, author: t.author || t.name, role: t.role, rating: t.rating }))} />}

      {/* Process */}
      {process.steps?.length > 0 && (
        <ProcessSection title={process.title} subtitle={process.subtitle} steps={process.steps} ctaText="Iniciar mi proceso" ctaHref="https://wa.me/595986868241" />
      )}

      {/* CTA Banner */}
      {cta.title && <CTABanner title={cta.title} subtitle={cta.subtitle} buttonText={cta.buttonText} buttonHref={cta.buttonHref} />}

      <Footer
        logo="/images/covers/logo-blanco.svg"
        businessName="Dayah LitWorks"
        email={footer.email || "dayahlitworks@gmail.com"}
        whatsapp="595986868241"
        instagram="@dayah.litworks"
        facebook="https://www.facebook.com/bookc0verdesign/"
      />
      <WhatsAppFloat phone="595986868241" message="Hola! Quiero info sobre portadas" />
    </>
  )
}
