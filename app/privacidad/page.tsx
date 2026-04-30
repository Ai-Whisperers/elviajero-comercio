import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"
const footer = (content as any).footer || {}
const whatsappData = (content as any).whatsapp || {}
const phone = whatsappData.phone || "595981234567"


export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <section className="flex min-h-[30vh] items-center justify-center bg-surface px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Política de Privacidad</h1>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4 text-muted-foreground leading-relaxed">
          <p className="mb-4">En El Viajero nos tomamos tu privacidad en serio. Esta política explica cómo recopilamos, usamos y protegemos tu información personal.</p>
          <h2 className="mb-3 mt-8 text-xl font-semibold text-foreground">Información que recopilamos</h2>
          <p className="mb-4">Recopilamos la información que nos proporcionas voluntariamente: nombre, número de teléfono, dirección de correo electrónico, y dirección de entrega.</p>
          <h2 className="mb-3 mt-8 text-xl font-semibold text-foreground">Uso de la información</h2>
          <p className="mb-4">Usamos tu información para procesar tus pedidos, coordinar entregas, y comunicarnos sobre tus compras.</p>
          <h2 className="mb-3 mt-8 text-xl font-semibold text-foreground">Contacto</h2>
          <p>Si tenés preguntas sobre esta política, escribinos por WhatsApp al 0981 234 567.</p>
        </div>
      </section>
      <Footer businessName="El Viajero" email={footer.email} whatsapp={phone} instagram={footer.instagram} facebook={footer.facebook} />
      <WhatsAppFloat phone={phone} />
    </>
  )
}
