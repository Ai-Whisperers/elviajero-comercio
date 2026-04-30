import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"
const footer = (content as any).footer || {}
const whatsappData = (content as any).whatsapp || {}
const phone = whatsappData.phone || "595981234567"


export default function TerminosPage() {
  return (
    <>
      <Header />
      <section className="flex min-h-[30vh] items-center justify-center bg-surface px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Términos y Condiciones</h1>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4 text-muted-foreground leading-relaxed">
          <p className="mb-4">Al realizar una compra en El Viajero, aceptás los siguientes términos:</p>
          <ol className="list-decimal pl-6 space-y-3">
            <li><strong className="text-foreground">Pedidos:</strong> Todos los pedidos se realizan a través de WhatsApp. La confirmación está sujeta a disponibilidad de stock.</li>
            <li><strong className="text-foreground">Pagos:</strong> Aceptamos efectivo, transferencia bancaria, y tarjetas. El pago debe completarse antes del envío o entrega.</li>
            <li><strong className="text-foreground">Envíos:</strong> Realizamos entregas en Asunción y área metropolitana. Los tiempos de entrega se coordinan individualmente.</li>
            <li><strong className="text-foreground">Cambios:</strong> Aceptamos cambios dentro de los 7 días posteriores a la compra, con el producto en perfecto estado.</li>
            <li><strong className="text-foreground">Garantía:</strong> Todos nuestros productos cuentan con garantía. Consultá los términos específicos con nuestro equipo.</li>
          </ol>
        </div>
      </section>
      <Footer businessName="El Viajero" email={footer.email} whatsapp={phone} instagram={footer.instagram} facebook={footer.facebook} />
      <WhatsAppFloat phone={phone} />
    </>
  )
}
