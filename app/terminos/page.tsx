import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/content/es.json"

const c = content as any

export default function TerminosPage() {
  return (
    <>
      <Header />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-8 text-4xl font-bold text-foreground">Términos y Condiciones</h1>
          <div className="prose prose-gray max-w-none text-muted-foreground">
            <p>Al realizar una compra o consulta en {c.businessName}, aceptas los siguientes términos y condiciones.</p>
            <h2 className="mt-8 text-xl font-semibold text-foreground">Productos y precios</h2>
            <p>Los precios están expresados en Guaraníes (Gs.) y Dólares Americanos (USD). Nos reservamos el derecho de modificar precios sin previo aviso.</p>
            <h2 className="mt-8 text-xl font-semibold text-foreground">Pedidos</h2>
            <p>Los pedidos se realizan a través de WhatsApp. La confirmación del pedido está sujeta a disponibilidad de stock.</p>
            <h2 className="mt-8 text-xl font-semibold text-foreground">Envíos</h2>
            <p>Realizamos envíos en Asunción y área metropolitana. El envío es gratuito en compras desde Gs. 300.000. Consulta por envíos al interior.</p>
            <h2 className="mt-8 text-xl font-semibold text-foreground">Cambios y devoluciones</h2>
            <p>Aceptamos cambios dentro de los 7 días posteriores a la compra, con el producto en su estado original y empaque.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
