#!/usr/bin/env node
// Seed script - run with: npx tsx scripts/seed.ts
import fs from "fs"
import path from "path"

const contentPath = path.join(process.cwd(), "content", "es.json")
const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"))

// Add more testimonials
content.home.testimonials = [
  ...(content.home.testimonials || []),
  { name: "Laura Cabral", text: "Excelente atención y productos de primera calidad. La carpa que compré me salvó el fin de semana.", rating: 5 },
  { name: "Marcos Benítez", text: "Compré artículos de pesca y llegaron rápido. Muy recomendado.", rating: 5 },
  { name: "Sofía Ramírez", text: "Buena variedad y precios accesibles. Volveré a comprar.", rating: 4 },
]

// Add more products if needed
if (!content.home.productCatalog.products.find((p: any) => p.name === "Linterna LED Recargable")) {
  content.home.productCatalog.products.push(
    { name: "Linterna LED Recargable", category: "Camping", price: "Gs. 95.000", priceBefore: "Gs. 120.000", description: "Linterna LED recargable USB, 3 modos de luz.", brand: "OutdoorTech", specs: "1000 lúmenes | USB-C | 8h batería", stock: 15, weight: "0.3 kg", imageUrl: "/images/product-placeholder.svg", isNew: true },
    { name: "Kit de Supervivencia 12pza", category: "Camping", price: "Gs. 180.000", description: "Kit completo de supervivencia con brújula, silbato, multiherramienta.", brand: "SurvivorPro", specs: "12 piezas | Estuche incluido | 450g", stock: 8, weight: "0.45 kg", imageUrl: "/images/product-placeholder.svg" },
    { name: "Red de Pesca 3m", category: "Pesca", price: "Gs. 65.000", description: "Red de pesca profesional de 3 metros.", brand: "FishMaster", specs: "3m | Nylon reforzado | Malla 2cm", stock: 20, weight: "0.5 kg", imageUrl: "/images/product-placeholder.svg" }
  )
}
content.home.productCatalog.categories = [...new Set(content.home.productCatalog.products.map((p: any) => p.category))]

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), "utf-8")
console.log("✅ Seed data added to es.json")
