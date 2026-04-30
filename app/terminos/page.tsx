import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const nav = [
  {label:"Inicio",href:"/"},{label:"Servicios",href:"/servicios"},{label:"Catálogo",href:"/catalogo"},
  {label:"Sobre",href:"/sobre"},{label:"Preguntas",href:"/faq"},{label:"Contacto",href:"/contacto"}
]

export default function TerminosPage() {
  return (
    <>
      <Header logo="/images/covers/logo-blanco.svg" navItems={nav} />
      <section className="flex min-h-[30vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">T rminos y Condiciones</h1>
        </div>
      </section>
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4 text-muted-foreground leading-relaxed">
          <p className="mb-4">Al solicitar un servicio de Dayah LitWorks, acept s los siguientes t rminos:</p>
          <ol className="list-decimal pl-6 space-y-3">
            <li><strong className="text-foreground">Referencias primero:</strong> El cliente debe enviar referencias visuales, ideas, tipograf as y colores ANTES de solicitar el dise o.</li>
            <li><strong className="text-foreground">D as h biles:</strong> El trabajo se realiza de lunes a viernes, con el tiempo acordado para una entrega de calidad.</li>
            <li><strong className="text-foreground">Sin reembolso:</strong> Si el cliente cancela el proyecto despu s de iniciado, el anticipo no es reembolsable.</li>
            <li><strong className="text-foreground">Revisi n del cliente:</strong> El cliente es responsable de revisar el dise o y los textos antes de la impresi n o publicaci n.</li>
            <li><strong className="text-foreground">Cambios de alcance:</strong> Cambios en la orientaci n del proyecto pueden implicar ajustes en el presupuesto.</li>
            <li><strong className="text-foreground">Derechos reservados:</strong> Los derechos del dise o pertenecen a Dayah LitWorks hasta el pago completo.</li>
            <li><strong className="text-foreground">Portafolio:</strong> Dayah LitWorks puede mostrar los trabajos realizados en su portafolio y redes sociales.</li>
          </ol>
        </div>
      </section>
      <Footer logo="/images/covers/logo-blanco.svg" businessName="Dayah LitWorks" email="dayahlitworks@gmail.com" whatsapp="595986868241" instagram="@dayah.litworks" facebook="https://www.facebook.com/bookc0verdesign/" />
      <WhatsAppFloat phone="595986868241" />
    </>
  )
}
