'use client'
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"
const footer = (content as any).footer || {}
const whatsappData = (content as any).whatsapp || {}
const phone = whatsappData.phone || "595981234567"


const faqItems = [{'q': '¿Dónde están ubicados?', 'a': 'Estamos en Mariano Roque Alonso, La Concordia, sobre Coronel Felipe Toledo (detrás de Mariam Lubricantes).'}, {'q': '¿Cuál es el horario de atención?', 'a': 'Lunes a Viernes de 08:00 a 19:00. Sábados de 08:00 a 17:00. Domingos y feriados cerrado.'}, {'q': '¿Hacen envíos?', 'a': 'Sí, hacemos entregas en Asunción y área metropolitana. Consultanos por tu zona.'}, {'q': '¿Cómo puedo pedir un producto?', 'a': 'Escribinos por WhatsApp al 0981 234 567 con el producto que te interesa. Te confirmamos disponibilidad y coordinamos la entrega.'}, {'q': '¿Qué métodos de pago aceptan?', 'a': 'Aceptamos efectivo (Gs. y USD), transferencia bancaria, y tarjetas de crédito y débito.'}, {'q': '¿Tienen garantía?', 'a': 'Sí, todos nuestros productos cuentan con garantía. Consultá los detalles con nuestro equipo.'}, {'q': '¿Puedo cambiar un producto?', 'a': 'Aceptamos cambios dentro de los 7 días posteriores a la compra, con el producto en perfecto estado y su embalaje original.'}]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <>
      <Header />
      <section className="flex min-h-[30vh] items-center justify-center bg-surface px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Preguntas Frecuentes</h1>
          <p className="mt-3 text-lg text-muted-foreground">Resolvé tus dudas</p>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-border bg-surface">
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-foreground transition-colors hover:bg-surface-light">
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="border-t border-border px-6 py-4 text-sm text-muted-foreground">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer businessName="El Viajero" email={footer.email} whatsapp={phone} instagram={footer.instagram} facebook={footer.facebook} />
      <WhatsAppFloat phone={phone} />
    </>
  )
}
