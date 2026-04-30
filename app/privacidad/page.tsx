import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/content/es.json"

const c = content as any

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-8 text-4xl font-bold text-foreground">Política de Privacidad</h1>
          <div className="prose prose-gray max-w-none text-muted-foreground">
            <p>En {c.businessName} respetamos tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.</p>
            <h2 className="mt-8 text-xl font-semibold text-foreground">Información que recopilamos</h2>
            <p>Recopilamos la información que nos proporcionas voluntariamente a través de nuestros formularios de contacto, WhatsApp y redes sociales: nombre, número de teléfono, dirección de correo electrónico y detalles de tu consulta.</p>
            <h2 className="mt-8 text-xl font-semibold text-foreground">Uso de la información</h2>
            <p>Usamos tu información para responder a tus consultas, procesar pedidos, mejorar nuestros servicios y enviar comunicaciones promocionales si has dado tu consentimiento.</p>
            <h2 className="mt-8 text-xl font-semibold text-foreground">Protección de datos</h2>
            <p>Implementamos medidas de seguridad para proteger tu información contra acceso no autorizado, alteración, divulgación o destrucción.</p>
            <h2 className="mt-8 text-xl font-semibold text-foreground">Tus derechos</h2>
            <p>Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento. Contactanos para ejercer estos derechos.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
