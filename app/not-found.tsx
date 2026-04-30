import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"

export default function NotFound() {
  return (
    <>
      <Header logo="/images/covers/logo-blanco.svg" navItems={[
        {label:"Inicio",href:"/"},{label:"Servicios",href:"/servicios"},{label:"Catálogo",href:"/catalogo"},
        {label:"Sobre",href:"/sobre"},{label:"Preguntas",href:"/faq"},{label:"Contacto",href:"/contacto"}
      ]} />
      <section className="flex min-h-[60vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
          <p className="mb-8 text-lg text-muted-foreground">Esta página se movió. Visitá nuestro nuevo sitio.</p>
          <Link href="/" className="inline-block rounded-lg bg-secondary px-8 py-3 font-semibold text-secondary-foreground transition-all hover:scale-105">
            Ir al inicio
          </Link>
        </div>
      </section>
      <Footer logo="/images/covers/logo-blanco.svg" businessName="Dayah LitWorks" email="dayahlitworks@gmail.com" whatsapp="595986868241" instagram="@dayah.litworks" facebook="https://www.facebook.com/bookc0verdesign/" />
      <WhatsAppFloat phone="595986868241" />
    </>
  )
}
