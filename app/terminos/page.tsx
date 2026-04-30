"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import content from "@/content/es.json"
const c = content as any

export default function TerminosPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Términos y Condiciones" }]} />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Términos y Condiciones</h1>
          <p className="mb-8 text-sm text-muted-foreground">Última actualización: Abril 2026</p>
          <div className="prose prose-gray max-w-none text-muted-foreground space-y-4 text-sm leading-relaxed">
            <p>Los presentes términos y condiciones regulan la relación entre <strong>El Viajero</strong> (RUC: 5.618.487-5) y los usuarios de su sitio web y servicios, en adelante "el Cliente".</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">1. Identificación del vendedor</h2>
            <p><strong>Nombre comercial:</strong> El Viajero<br/>
            <strong>RUC:</strong> 5.618.487-5<br/>
            <strong>Domicilio:</strong> Coronel Felipe Toledo, Barrio La Concordia, Mariano Roque Alonso, Paraguay<br/>
            <strong>Teléfono/WhatsApp:</strong> +595 981 234 567<br/>
            <strong>Email:</strong> info@tiendaelviajero.com.py</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">2. Productos y precios</h2>
            <p>Los precios de los productos están expresados en Guaraníes (Gs.) y, cuando se indique, en Dólares Americanos (USD). Los precios incluyen el Impuesto al Valor Agregado (IVA) según la legislación paraguaya.</p>
            <p>El Viajero se reserva el derecho de modificar los precios sin previo aviso. Los precios aplicables serán los vigentes al momento de la confirmación del pedido.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">3. Pedidos</h2>
            <p>Los pedidos pueden realizarse a través del sitio web www.tiendaelviajero.com.py o mediante WhatsApp al +595 981 234 567. La confirmación del pedido está sujeta a la disponibilidad de stock.</p>
            <p>Una vez confirmado el pedido, el Cliente recibirá un mensaje de confirmación con los detalles de la compra y las instrucciones de pago.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">4. Métodos de pago</h2>
            <p>Aceptamos los siguientes métodos de pago:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Efectivo (Guaraníes y Dólares Americanos)</li>
              <li>Transferencia bancaria</li>
              <li>Tarjetas de crédito y débito (Bancard)</li>
              <li>Mercado Pago</li>
              <li>Pagopar (con opción de cuotas)</li>
              <li>Tigo Money</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-foreground">5. Envíos</h2>
            <p>Realizamos envíos en Mariano Roque Alonso, Asunción y área metropolitana. El costo de envío varía según la zona y se calcula al momento de finalizar la compra.</p>
            <p>El envío es gratuito para compras superiores a Gs. 300.000 en zonas metropolitanas. También realizamos envíos a todo Paraguay a través de compañía de encomiendas. Los plazos de entrega son estimados y pueden variar según la zona y la disponibilidad del producto.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">6. Cambios y devoluciones</h2>
            <p>Aceptamos cambios dentro de los 7 (siete) días posteriores a la recepción del producto, siempre que:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>El producto se encuentre en su estado original, sin uso y con su empaque completo</li>
              <li>Se presente el comprobante de compra</li>
              <li>El producto no sea de uso personal (ropa interior, equipos de protección personal usados)</li>
            </ul>
            <p>Los gastos de envío asociados al cambio correrán por cuenta del Cliente, salvo que el motivo del cambio sea un error nuestro o un defecto de fábrica.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">7. Garantía</h2>
            <p>Todos nuestros productos cuentan con garantía contra defectos de fábrica. El período de garantía varía según el producto y la marca. Para hacer efectiva la garantía, el Cliente debe presentar el comprobante de compra y el producto en su estado original.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">8. Derechos del consumidor</h2>
            <p>En cumplimiento de la Ley N° 1334/98 de Defensa del Consumidor y del Usuario de la República del Paraguay, el Cliente tiene derecho a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Información clara y precisa sobre los productos y servicios</li>
              <li>Protección contra cláusulas abusivas</li>
              <li>Reparación por daños y perjuicios</li>
              <li>Reclamar ante la Secretaría de Defensa del Consumidor (SEDECO)</li>
            </ul>
            <p>Para reclamos, contactar a SEDECO: www.sedeco.gov.py | Tel: (021) 414 1900</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">9. Propiedad intelectual</h2>
            <p>Todos los contenidos del sitio web, incluyendo textos, imágenes, logotipos y diseños, son propiedad de El Viajero o se utilizan con licencia. Queda prohibida su reproducción total o parcial sin autorización expresa.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">10. Legislación y jurisdicción</h2>
            <p>Estos términos y condiciones se rigen por la legislación de la República del Paraguay. Para cualquier controversia, las partes se someten a los tribunales de la ciudad de Asunción, Paraguay, renunciando a cualquier otro fuero que pudiera corresponderles.</p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">11. Contacto</h2>
            <p>Para consultas sobre estos términos, contactenos a través de WhatsApp al +595 981 234 567 o por correo electrónico a info@tiendaelviajero.com.py.</p>
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
