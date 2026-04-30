import { Hero, ServicesSection, PortfolioSection, TestimonialsSection, WhatsAppFloat } from "@ai-whisperers/sections"
import { resolveContent } from "@ai-whisperers/engine"
import content from "@/content/es.json"

export default function Home() {
  const hero = resolveContent(content, "home.hero") as any
  const services = resolveContent(content, "home.services") as any
  const portfolio = resolveContent(content, "home.portfolio") as any
  const testimonials = resolveContent(content, "home.testimonials") as any

  return (
    <main>
      {hero && (
        <Hero
          headline={hero.headline}
          subheadline={hero.subheadline}
          ctaPrimary={{ text: hero.ctaPrimaryText || "Ver Catálogo", href: hero.ctaPrimaryHref || "/s/es/dayah-litworks/catalogo" }}
          ctaSecondary={{ text: hero.ctaSecondaryText || "WhatsApp", href: hero.ctaSecondaryHref || "https://wa.me/595986868241" }}
          backgroundImage={hero.backgroundImage}
          overlayColor={hero.overlayColor}
        />
      )}
      {services && <ServicesSection title={services.title} subtitle={services.subtitle} items={services.items} />}
      {portfolio && <PortfolioSection title={portfolio.title} subtitle={portfolio.subtitle} items={portfolio.items} />}
      {testimonials && <TestimonialsSection title={testimonials.title} subtitle={testimonials.subtitle} items={testimonials.items} />}
      <WhatsAppFloat phone="595986868241" message="Hola! Quiero info sobre portadas" />
    </main>
  )
}
