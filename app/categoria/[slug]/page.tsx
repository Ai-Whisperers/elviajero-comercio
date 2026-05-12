import { CategoryContent } from "@/components/category-layout"

const CATEGORIES: Record<string, { name: string; emoji: string; description: string; heroImage?: string }> = {
  campo: { name: "Campo", emoji: "🌾", description: "Herramientas agrícolas, bebederos, comederos y más.", heroImage: "/images/marketing/hero-campo.png" },
  motos: { name: "Motos", emoji: "🏍️", description: "Cascos, guantes, rastreadores GPS y más.", heroImage: "/images/marketing/hero-motos.png" },
  autos: { name: "Automóviles", emoji: "🚗", description: "Dashcams, infladores, eslingas, extintores y más.", heroImage: "/images/marketing/hero-autos.png" },
  camping: { name: "Camping", emoji: "🏕️", description: "Carpas, bolsas de dormir, linternas, sillas, coolers y más.", heroImage: "/images/marketing/hero-camping.png" },
  pesca: { name: "Pesca", emoji: "🎣", description: "Cañas, señuelos, cajas, redes y equipo de pesca.", heroImage: "/images/marketing/hero-pesca.png" },
  accesorios: { name: "Acc. Personales", emoji: "🎒", description: "Mochilas, cuchillos, botas, termos, botiquines y más.", heroImage: "/images/marketing/hero-outdoor.png" },
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map(slug => ({ slug }))
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES[params.slug]
  if (!cat) return null
  return <CategoryContent slug={params.slug} name={cat.name} emoji={cat.emoji} description={cat.description} heroImage={cat.heroImage} />
}
