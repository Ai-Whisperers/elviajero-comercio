import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"
const footer = (content as any).footer || {}
const whatsappData = (content as any).whatsapp || {}
const phone = whatsappData.phone || "595981234567"


export default function PromocionesPage() {
  return (
    <>
      <Header />
      <section className="flex min-h-[30vh] items-center justify-center bg-surface px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Promociones</h1>
          <p className="mt-3 text-lg text-muted-foreground">Aprovechá nuestras ofertas</p>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-accent">Ofertas Activas</h2>
            <p className="mb-6 text-muted-foreground">Consultá por WhatsApp nuestras promociones vigentes. Tenemos descuentos por cantidad y combos especiales.</p>
            <a href="{`https://wa.me/${phone}`}" target="_blank" rel="noopener noreferrer"
              className="inline-block rounded-lg bg-accent px-8 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90">
                Consultar promociones
            </a>
          </div>
        </div>
      </section>
      <Footer businessName="El Viajero" email={footer.email} whatsapp={phone} instagram={footer.instagram} facebook={footer.facebook} />
      <WhatsAppFloat phone={phone} />
    </>
  )
}
