"use client"
import { use } from "react"
import { Breadcrumbs } from "@/components/ui"
import { ArticleJsonLd } from "@/components/article-json-ld"
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

const c = content as any
const posts = (c.tienda?.blog?.index?.posts || [])

const fullContent: Record<string, {
  sections: { title: string; text: string }[]
  relatedProducts: string[]
  cta: string
}> = {
  "guia-elegir-carpa": {
    sections: [
      { title: "¿Qué tipo de carpa necesitás?", text: "El primer paso para elegir tu carpa ideal es definir el uso que le vas a dar. ¿Buscás una carpa para camping de fin de semana, para expediciones largas o para el jardín? En Paraguay, las carpas más populares son las tipo domo (fáciles de armar), las tipo túnel (más espacio interior) y las automáticas (se abren en segundos)." },
      { title: "Capacidad: no te dejes engañar", text: "Una carpa para 4 personas significa que entran 4 bolsas de dormir lado a lado, sin espacio para equipaje. Si viajás con equipo, siempre elegí una capacidad superior: si son 2 personas, llevá una de 3 o 4. La comodidad marca la diferencia entre una buena y una mala experiencia de camping." },
      { title: "Impermeabilidad: el factor clave", text: "En Paraguay las tormentas de verano son impredecibles. Buscá carpas con un mínimo de 1500mm de impermeabilidad en el toldo y 3000mm en el piso. Las costuras selladas y los pisos reforzados son imprescindibles. No ahorres en esto: una carpa mojada arruina cualquier viaje." },
      { title: "Materiales y peso", text: "Las carpas de poliéster son más económicas y pesan menos. Las de nylon son más resistentes pero más caras. Si transportás la carpa en moto o a pie, priorizá el peso (idealmente menos de 3kg para una de 2 personas). Si viajás en auto, podés ir por más resistencia y espacio." },
      { title: "Armado: practicá antes de salir", text: "Nunca estrenes tu carpa en medio de una tormenta oscura. Armala en tu casa o jardín al menos una vez para entender el mecanismo. Las carpas automáticas son ideales para principiantes: se abren solas al sacarlas de la bolsa." },
    ],
    relatedProducts: ["Carpa 4 Personas", "Bolsa de Dormir 0°C", "Colchoneta Inflable"],
    cta: "En El Viajero tenemos carpas para todos los presupuestos y niveles de experiencia. Consultanos y te ayudamos a elegir la ideal."
  },
  "mejores-lugares-pesca-paraguay": {
    sections: [
      { title: "1. Río Paraguay — Asunción y zona sur", text: "El Río Paraguay ofrece excelentes puntos de pesca urbana. Las zonas de Itá Enramada, San Antonio y la desembocadura del Río Salado son ideales para pescar dorados, surubíes y pacúes. La mejor temporada va de agosto a noviembre. Llevá cañas de 2.7m a 3m con carrete frontal." },
      { title: "2. Embalse de Yacyretá — Ituzaingó", text: "A 300 km de Asunción, es uno de los mejores destinos de pesca deportiva del país. Famoso por sus dorados de gran tamaño y surubíes. Hay guías locales que alquilan embarcaciones. Ideal para un fin de semana de pesca intensiva." },
      { title: "3. Río Paraná — Encarnación y alrededores", text: "El sur del país ofrece pesca de primera calidad. Las zonas de Carmen del Paraná y Coronel Bogado son excelentes para la pesca de variadas especies. La pesca desde costa es productiva en la mayoría de las playas del río Paraná." },
      { title: "4. Lago Ypacaraí — San Bernardino", text: "El lago más famoso de Paraguay es ideal para principiantes y pesca familiar. Se pescan tarariras, bagres y boga. Las mejores horas son al amanecer y al atardecer. Cualquier caña de 2.4m funciona bien." },
      { title: "5. Río Tebicuary — Villa Florida", text: "Considerado uno de los ríos más limpios del Paraguay. Famoso por su biodiversidad y la pesca de mandi'i y mbocaja. El acceso es fácil y hay varios campings a la orilla. Llevá repelente: los mosquitos son intensos." },
    ],
    relatedProducts: ["Caña Telescópica 3m", "Señuelos Surtidos (10u)", "Chaleco Salvavidas"],
    cta: "Equipate para tu próxima jornada de pesca. Tenemos cañas, señuelos, cajas y accesorios."
  },
  "checklist-camping": {
    sections: [
      { title: "Equipo básico (imposible salir sin esto)", text: "Carpa · Bolsa de dormir · Colchoneta o colchón inflable · Linterna o farol · Bolsa de residuos · Cuchillo multiuso · Encendedor o fósforos. Revisá cada elemento antes de guardarlo en la mochila. Una linterna sin pilas o una carpa sin estacas puede arruinar la noche." },
      { title: "Cocina y comida", text: "Cocina portátil a gas · Garrafa · Olla mediana · Sartén · Platos y cubiertos de acero inoxidable · Taza térmica · Abrelatas · Bolsas herméticas para alimentos · Agua potable (mínimo 3 litros por persona por día) · Hielo y conservadora para carnes/lácteos. No confíes en encontrar agua potable en el destino." },
      { title: "Higiene y primeros auxilios", text: "Kit botiquín básico (vendas, gasa, apósitos, alcohol, yodo) · Protector solar · Repelente de mosquitos · Jabón biodegradable · Papel higiénico · Toalla de secado rápido · Cepillo y pasta dental. El repelente en Paraguay no es opcional." },
      { title: "Ropa recomendada", text: "Camisetas térmicas (para la noche) · Pantalones cargo o de montaña · Impermeable o piloto · Botas o calzado cerrado · Gorra o sombrero · Medias extra (siempre más de las que creés necesitar). El clima paraguayo cambia drásticamente del día a la noche." },
      { title: "Extras que marcan la diferencia", text: "Hamaca para la siesta · Silla plegable para la fogata · Mochila impermeable de 60L · Termo con agua caliente para el mate · Cargador portátil (power bank). La hamaca es casi obligatoria en Paraguay." },
    ],
    relatedProducts: ["Mochila 60L Impermeable", "Cuchillo Multiuso", "Linterna LED 1000lm", "Kit Botiquín"],
    cta: "En El Viajero tenemos TODO lo que necesitás para tu próxima acampada. Pedinos tu checklist completa."
  },
  "elegir-cana-pescar": {
    sections: [
      { title: "Tipos de caña según el material", text: "Fibra de vidrio: ideales para principiantes. Son resistentes, económicas y perdonan errores. Carbono: más livianas y sensibles. Permiten sentir cada movimiento del señuelo. Recomendadas para pescadores con algo de experiencia. Telescópicas: prácticas para transportar, ideales para viajes en moto o transporte público." },
      { title: "Longitud de la caña", text: "Cañas de 1.8m a 2.4m: ideales para pesca en costa cerrada o con mucha vegetación. Cañas de 2.7m a 3m: las más versátiles. Sirven para la mayoría de las situaciones en ríos y lagos paraguayos. Cañas de 3.6m o más: para pesca de costa con mucho espacio o para lances largos." },
      { title: "Acción de la caña", text: "Acción rápida: la punta dobla solo en el último tercio. Ideal para lances precisos y señuelos pesados. Acción media: la caña dobla hasta la mitad. La más recomendada para principiantes. Acción lenta: dobla desde la base. Ideal para pesca con boya y líneas livianas." },
      { title: "Carrete: frontal o rotativo", text: "Frontal (baitcasting): más preciso, ideal para señuelos pesados. Requiere práctica para evitar enredos. Rotativo (spinning): más fácil de usar. El 90% de los pescadores paraguayos usa este tipo. Recomendado para empezar." },
      { title: "Mantenimiento básico", text: "Después de cada salida, lavá la caña con agua dulce para sacar la sal o el barro. Secala bien antes de guardar. Aplicá una gota de aceite ligero al carrete cada 3-4 salidas. Guardá la caña en su funda, nunca apoyada contra la pared (se deforma)." },
    ],
    relatedProducts: ["Caña Telescópica 3m", "Caja Herramientas Pesca", "Señuelos Surtidos (10u)"],
    cta: "Tenemos cañas para todos los niveles. Si no sabés cuál elegir, escribinos y te asesoramos."
  },
  "mantenimiento-equipo-camping": {
    sections: [
      { title: "Cuidado de la carpa después de cada viaje", text: "Nunca guardes la carpa mojada o húmeda. La humedad genera hongos que arruinan el tejido impermeable. Abrí la carpa al llegar a casa y dejala secar a la sombra 24 horas. Cepillá la tierra y los restos de hojas antes de guardar. Lavá con agua y jabón neutro si es necesario, nunca con detergente fuerte." },
      { title: "Bolsas de dormir: cómo alargar su vida", text: "Guardá la bolsa de dormir suelta (en una bolsa de tela grande) en lugar de comprimida. La compresión constante daña el relleno. Lavala cada 3-4 viajes con jabón especial para plumas o fibras sintéticas. Secala en horizontal para que el relleno no se desplace." },
      { title: "Linternas y equipos eléctricos", text: "Sacá las pilas de linternas y faroles cuando no los uses por más de un mes. Las pilas pueden corroerse y dañar los contactos. Cargá las linternas recargables cada 3 meses aunque no las uses. La batería de litio se degrada si está descargada mucho tiempo." },
      { title: "Cuchillos y herramientas", text: "Aceitá la hoja de los cuchillos después de cada lavado. Afilalos con piedra de agua cada 3-4 usos intensivos. Guardalos en funda de cuero o nylon, nunca sueltos en una mochila (se desafilan). Las multiherramientas necesitan una gota de aceite en cada junta móvil." },
      { title: "Mochilas y bolsos", text: "Vaciá todos los compartimentos al volver del viaje. Las migas de comida atraen hormigas y roedores. Lavá a mano con cepillo suave y jabón neutro. Nunca metas la mochila al lavarropas (daña los cierres y la impermeabilidad). Para impermeabilizar, usá spray especial." },
    ],
    relatedProducts: ["Cuchillo Multiuso", "Mochila 60L Impermeable", "Linterna LED 1000lm"],
    cta: "¿Necesitás reponer o actualizar tu equipo de camping? En El Viajero tenemos todo."
  },
  "destinos-aventura-paraguay": {
    sections: [
      { title: "Saltos del Monday — Alto Paraná", text: "A 280 km de Asunción, los Saltos del Monday son una de las maravillas naturales más impresionantes de Paraguay. Una cascada de 45 metros rodeada de selva. Hay miradores, senderos y áreas de picnic. Ideal para una excursión de día completo. Llevá calzado cómodo, repelente y mucha agua." },
      { title: "Cerro Corá — Departamento de Amambay", text: "El parque nacional más grande de Paraguay. Hogar de cerros, arroyos cristalinos y una biodiversidad impresionante. Hay campings habilitados y senderos señalizados. Famoso por el Cerro Corá (244 m) y el Pico Tacurí (420 m). Ideal para camping de fin de semana." },
      { title: "San Bernardino — Cordillera", text: "A solo 50 km de Asunción, es el destino de escapada más popular. El lago Ypacaraí ofrece natación, paseos en bote y pesca. Hay restaurants, bares y alojamiento para todos los gustos. Ideal para un día o un fin de semana ligero sin equipo pesado de camping." },
      { title: "Parque Nacional Ybycuí — Paraguarí", text: "A 150 km de la capital, este parque protege una porción del Bosque Atlántico del Alto Paraná. Tiene senderos que llevan a saltos de agua como el Salto Mbocaruzú (40 m) y el Salto Monday (45 m). Se puede acampar dentro del parque. Llevá carpa y bolsa de dormir." },
      { title: "Misiones Jesuíticas — Itapúa y Misiones", text: "Las ruinas jesuíticas de Trinidad, Jesús y San Cosme son Patrimonio de la Humanidad. Trinidad está techada y se puede visitar en cualquier clima. San Cosme tiene un observatorio astronómico jesuita restaurado. Ideal para combinar cultura y naturaleza." },
    ],
    relatedProducts: ["Mochila 60L Impermeable", "Carpa 4 Personas", "Linterna LED 1000lm"],
    cta: "Antes de salir, pasá por El Viajeros. Tenemos todo lo que necesitás para tu próxima aventura."
  }
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const post = posts.find((p: any) => p.slug === slug)
  if (!post) notFound()

  const postContent = fullContent[post.slug]
  const products = c.home?.productCatalog?.products || []
  const whatsapp = c.home?.productCatalog?.whatsappPhone || "595984009751"

  return (
    <>
      <ArticleJsonLd title={post.title} description={post.excerpt} image={post.image} date={post.date} author={post.author} />
<Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />
      
      <section className="bg-primary py-12 text-center text-primary-foreground">
        <h1 className="text-4xl font-bold max-w-3xl mx-auto px-4">{post.title}</h1>
        <div className="mt-3 flex items-center justify-center gap-4 text-sm text-primary-foreground/70">
          <span>{post.category}</span>
          <span>{post.date}</span>
          <span>{post.author}</span>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          {post.image && (
            <Image src={post.image} alt={post.title} width={800} height={450} className="mb-8 w-full rounded-xl shadow-sm" />
          )}

          {postContent ? (
            <div className="space-y-8">
              {postContent.sections.map((section, i) => (
                <div key={i}>
                  <h2 className="text-xl font-bold text-foreground mb-3">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          )}

          {/* CTA */}
          {postContent && (
            <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
              <p className="text-foreground font-medium mb-4">{postContent.cta}</p>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Consultar por WhatsApp
              </a>
            </div>
          )}

          {/* Related products */}
          {postContent && postContent.relatedProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-foreground mb-4">Productos relacionados</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {postContent.relatedProducts.map((name: string) => {
                  const p = products.find((pr: any) => pr.name.toLowerCase().includes(name.toLowerCase()))
                  if (!p) return null
                  const slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
                  return (
                    <Link key={slug} href={`/producto/${slug}`} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 hover:shadow-md transition-all">
                      <div className="h-16 w-16 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={64} height={64} className="h-full w-full object-contain" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</p>
                        <p className="text-sm font-bold text-primary">{p.price}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-8 border-t border-border pt-6 text-center">
            <Link href="/blog" className="text-primary hover:underline">← Volver al blog</Link>
          </div>
        </div>
      </section>
</>
  )
}
