import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"
const footer = (content as any).footer || {}
const whatsappData = (content as any).whatsapp || {}
const phone = whatsappData.phone || "595981234567"


export default function NosotrosPage() {
  return (
    <>
      <Header />
      <section className="flex min-h-[30vh] items-center justify-center bg-surface px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Nosotros</h1>
          <p className="mt-3 text-lg text-muted-foreground">Conocé nuestra historia</p>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Nuestra Historia</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                El Viajero nació de la pasión por el aire libre y la aventura. Somos una tienda paraguaya especializada en camping, pesca, accesorios para auto y moto, y equipo outdoor.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nuestro objetivo es ofrecer productos de calidad a precios accesibles, con el asesoramiento que necesitás para elegir el equipo correcto para cada aventura.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex h-72 w-72 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/50 text-6xl font-bold text-white">
                EV
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer businessName="El Viajero" email={footer.email} whatsapp={phone} instagram={footer.instagram} facebook={footer.facebook} />
      <WhatsAppFloat phone={phone} />
    </>
  )
}
