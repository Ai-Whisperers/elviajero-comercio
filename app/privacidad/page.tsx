"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import content from "@/content/es.json"
const c = content as any

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Política de Privacidad" }]} />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Política de Privacidad</h1>
          <p className="mb-8 text-sm text-muted-foreground">Última actualización: Abril 2026</p>
          <div className="prose prose-gray max-w-none text-muted-foreground space-y-4 text-sm leading-relaxed">
            <p>En <strong>El Viajero</strong> (en adelante, "el responsable"), en cumplimiento con la Ley N° 6534/2020 de Protección de Datos Personales de la República del Paraguay, ponemos a su disposición la presente Política de Privacidad.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">1. Responsable del tratamiento</h2>
            <p><strong>Nombre comercial:</strong> El Viajero<br/>
            <strong>RUC:</strong> 5.618.487-5<br/>
            <strong>Dirección:</strong> Coronel Felipe Toledo, Barrio La Concordia, Mariano Roque Alonso, Paraguay<br/>
            <strong>Contacto:</strong> info@tiendaelviajero.com.py<br/>
            <strong>WhatsApp:</strong> +595 981 234 567</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">2. Datos que recopilamos</h2>
            <p>Recopilamos la siguiente información personal cuando usted interactúa con nuestro sitio web:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nombre y apellido</li>
              <li>Número de teléfono / WhatsApp</li>
              <li>Dirección de correo electrónico</li>
              <li>Dirección de envío</li>
              <li>Historial de compras y navegación</li>
              <li>Dirección IP y datos de navegación (cookies)</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-foreground">3. Finalidad del tratamiento</h2>
            <p>Sus datos personales serán tratados con las siguientes finalidades:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Procesar y gestionar sus pedidos y compras</li>
              <li>Enviar información sobre el estado de su pedido</li>
              <li>Responder a sus consultas a través de WhatsApp y formularios de contacto</li>
              <li>Enviar comunicaciones comerciales (con su consentimiento previo)</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Cumplir con obligaciones legales y fiscales</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-foreground">4. Base legal del tratamiento</h2>
            <p>El tratamiento de sus datos se basa en:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>La ejecución de un contrato (compra de productos)</li>
              <li>Su consentimiento explícito (comunicaciones comerciales)</li>
              <li>El interés legítimo del responsable (mejora del servicio)</li>
              <li>El cumplimiento de obligaciones legales (Ley N° 125/91 del Comercio, Ley N° 6380/19 de Modernización Tributaria)</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-foreground">5. Derechos del titular</h2>
            <p>De acuerdo con la Ley N° 6534/2020, usted tiene derecho a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Acceder</strong> a sus datos personales</li>
              <li><strong>Rectificar</strong> datos inexactos o incompletos</li>
              <li><strong>Cancelar</strong> o suprimir sus datos</li>
              <li><strong>Oponerse</strong> al tratamiento de sus datos</li>
              <li><strong>Revocar</strong> su consentimiento en cualquier momento</li>
            </ul>
            <p>Para ejercer estos derechos, contactenos a través de WhatsApp al +595 981 234 567 o por correo electrónico a info@tiendaelviajero.com.py. Responderemos a su solicitud en un plazo máximo de 15 días hábiles.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">6. Plazo de conservación</h2>
            <p>Conservaremos sus datos personales mientras sea necesario para cumplir con las finalidades descritas, o mientras exista una obligación legal de conservación. Una vez cumplidas estas finalidades, sus datos serán eliminados de forma segura.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">7. Destinatarios de datos</h2>
            <p>No compartimos sus datos personales con terceros, excepto:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Empresas de encomiendas y logística para la entrega de pedidos</li>
              <li>Procesadores de pago (Pagopar, Bancard, Mercado Pago)</li>
              <li>Autoridades competentes cuando la ley lo requiera</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-foreground">8. Cookies</h2>
            <p>Este sitio web utiliza cookies propias y de terceros para mejorar su experiencia de navegación. Al continuar navegando, usted acepta el uso de cookies. Puede configurar su navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">9. Seguridad</h2>
            <p>Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, alteración, divulgación o destrucción, de acuerdo con el estado de la tecnología y la naturaleza de los datos almacenados.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">10. Legislación aplicable</h2>
            <p>Esta Política de Privacidad se rige por la legislación de la República del Paraguay. Cualquier controversia relacionada con el tratamiento de datos personales será sometida a los tribunales de la ciudad de Asunción, Paraguay.</p>
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
