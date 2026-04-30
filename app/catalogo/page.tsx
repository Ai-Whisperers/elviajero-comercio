import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PortfolioFiltered } from "@/components/portfolio-filtered"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"

const nav = [
  {label:"Inicio",href:"/"},{label:"Servicios",href:"/servicios"},{label:"Catálogo",href:"/catalogo"},
  {label:"Sobre",href:"/sobre"},{label:"Preguntas",href:"/faq"},{label:"Contacto",href:"/contacto"}
]
const portfolio = (content as any).home?.portfolio || {}

export default function CatalogoPage() {
  return (
    <>
      <Header logo="/images/covers/logo-blanco.svg" navItems={nav} />
      <section className="flex min-h-[30vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Catalogo</h1>
          <p className="mt-3 text-lg text-muted-foreground">Portadas disponibles y trabajos recientes</p>
        </div>
      </section>
      <PortfolioFiltered title={portfolio.title || "Trabajos Recientes"} subtitle={portfolio.subtitle} items={portfolio.items || []} />
      <Footer logo="/images/covers/logo-blanco.svg" businessName="Dayah LitWorks" email="dayahlitworks@gmail.com" whatsapp="595986868241" instagram="@dayah.litworks" facebook="https://www.facebook.com/bookc0verdesign/" />
      <WhatsAppFloat phone="595986868241" />
    </>
  )
}
