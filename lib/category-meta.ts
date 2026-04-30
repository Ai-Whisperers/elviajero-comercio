
export function getCategoryMeta(slug: string): { title: string; description: string } {
  const map: Record<string, { title: string; description: string }> = {
    camping: { title: "Equipamiento de Camping en Paraguay | El Viajero", description: "Carpa, bolsa de dormir, linterna, silla y más equipo de camping. Todo para tu próxima aventura al aire libre en Paraguay." },
    pesca: { title: "Artículos de Pesca en Paraguay | El Viajero", description: "Cañas, señuelos, carretes y accesorios de pesca. Encontrá todo para tu equipo de pesca en Asunción." },
    accesorios: { title: "Accesorios Outdoor en Paraguay | El Viajero", description: "Mochilas térmicas, linternas, navajas y más accesorios para tus actividades al aire libre." },
    autos: { title: "Accesorios para Autos en Paraguay | El Viajero", description: "Accesorios, herramientas y equipos para tu automóvil. Todo para tu vehículo en Paraguay." },
    motos: { title: "Equipamiento para Motos en Paraguay | El Viajero", description: "Cascos, guantes, candados y accesorios para motociclistas. Equipá tu moto en Paraguay." },
    campo: { title: "Equipamiento de Campo en Paraguay | El Viajero", description: "Herramientas, equipos y accesorios para el campo. Todo para tus actividades rurales en Paraguay." },
  }
  return map[slug] || { title: slug + " | El Viajero", description: "Productos de " + slug + " en El Viajero, Paraguay." }
}
