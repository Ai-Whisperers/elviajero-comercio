import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServicesSection } from "@/components/services-section"
import { FAQSection } from "@/components/faq-section"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"

const nav = [
  {label:"Inicio",href:"/"},{label:"Servicios",href:"/servicios"},{label:"Catálogo",href:"/catalogo"},
  {label:"Sobre",href:"/sobre"},{label:"Preguntas",href:"/faq"},{label:"Contacto",href:"/contacto"}
]
const svc = (content as any).home?.services || {}
const faqItems = ((content as any).home?.faq?.items || []).map((f: any) => ({ q: f.q, a: f.a }))

export default function ServiciosPage() {
  return (
    <>
      <Header logo="/images/covers/logo-blanco.svg" navItems={nav} />
      <section className="flex min-h-[30vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Servicios</h1>
          <p className="mt-3 text-lg text-muted-foreground">Portadas personalizadas, premades y maquetaci n interior</p>
        </div>
      </section>
      <ServicesSection data={svc} />
      <FAQSection title="Preguntas frecuentes sobre servicios" items={faqItems} />
      <Footer logo="/images/covers/logo-blanco.svg" businessName="Dayah LitWorks" email="dayahlitworks@gmail.com" whatsapp="595986868241" instagram="@dayah.litworks" facebook="https://www.facebook.com/bookc0verdesign/" />
      <WhatsAppFloat phone="595986868241" />
    </>
  )
}
