import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"

const footer = (content as any).footer || {}
const whatsappData = (content as any).whatsapp || {}
const phone = whatsappData.phone || "595981234567"

const nav = [
  {label:"Inicio",href:"/"},{label:"Tienda",href:"/tienda"},{label:"Productos",href:"/productos"},
  {label:"Nosotros",href:"/nosotros"},{label:"Contacto",href:"/contacto"},{label:"FAQ",href:"/faq"},
]

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="flex min-h-[60vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
          <p className="mb-8 text-lg text-muted-foreground">Página no encontrada</p>
          <Link href="/" className="inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90">
            Volver al inicio
          </Link>
        </div>
      </section>
      <Footer businessName="El Viajero" email={footer.email} whatsapp={phone} instagram={footer.instagram} facebook={footer.facebook} />
      <WhatsAppFloat phone={phone} />
    </>
  )
}
