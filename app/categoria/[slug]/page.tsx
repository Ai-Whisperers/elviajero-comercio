import { CategoryContent } from "@/components/category-layout"

const CATEGORIES: Record<string, { name: string; emoji: string; description: string; heroImage?: string }> = {
  campo: { name: "Campo", emoji: "🌾", description: "Herramientas agrícolas, bebederos, comederos y más.", heroImage: "/images/marketing/hero-campo.webp" },
  motos: { name: "Motos", emoji: "🏍️", description: "Cascos, guantes, rastreadores GPS y más.", heroImage: "/images/marketing/hero-motos.webp" },
  autos: { name: "Automóviles", emoji: "🚗", description: "Dashcams, infladores, eslingas, extintores y más.", heroImage: "/images/marketing/hero-autos.webp" },
  automviles: { name: "Automóviles", emoji: "🚗", description: "Dashcams, infladores, eslingas, extintores y más.", heroImage: "/images/marketing/hero-autos.webp" },
  camping: { name: "Camping", emoji: "🏕️", description: "Carpas, bolsas de dormir, linternas, sillas, coolers y más.", heroImage: "/images/marketing/hero-camping.webp" },
  pesca: { name: "Pesca", emoji: "🎣", description: "Cañas, señuelos, cajas, redes y equipo de pesca.", heroImage: "/images/marketing/hero-pesca.webp" },
  playaypesca: { name: "Playa y Pesca", emoji: "🌊", description: "Sombrillas, sillas de playa, conservadoras y equipo para jornadas de río.", heroImage: "/images/marketing/hero-playa.webp" },
  accesorios: { name: "Acc. Personales", emoji: "🎒", description: "Mochilas, cuchillos, botas, termos, botiquines y más.", heroImage: "/images/marketing/hero-outdoor.webp" },
  accpersonales: { name: "Acc. Personales", emoji: "🎒", description: "Mochilas, cuchillos, botas, termos, botiquines y más.", heroImage: "/images/marketing/hero-outdoor.webp" },
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map(slug => ({ slug }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = CATEGORIES[slug]
  if (!cat) return null
  return <CategoryContent slug={slug} name={cat.name} emoji={cat.emoji} description={cat.description} heroImage={cat.heroImage} />
}
