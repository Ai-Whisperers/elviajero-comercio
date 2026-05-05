export interface ShippingZone {
  id: string
  name: string
  fee: number
  freeFrom: number
  estimatedDays: string
}

export const SHIPPING_ZONES: ShippingZone[] = [
  { id: "asu", name: "Asunción", fee: 15000, freeFrom: 300000, estimatedDays: "24 hs" },
  { id: "central", name: "Área Metropolitana", fee: 25000, freeFrom: 400000, estimatedDays: "24-48 hs" },
  { id: "interior", name: "Interior del país", fee: 40000, freeFrom: 500000, estimatedDays: "48-72 hs" },
  { id: "pickup", name: "Retiro en tienda", fee: 0, freeFrom: 0, estimatedDays: "—" },
]

export function calculateShipping(zoneId: string, subtotal: number): { fee: number; free: boolean; zone: ShippingZone | undefined } {
  const zone = SHIPPING_ZONES.find(z => z.id === zoneId)
  if (!zone) return { fee: 0, free: false, zone: undefined }
  const free = subtotal >= zone.freeFrom
  return { fee: free ? 0 : zone.fee, free, zone }
}

export function formatGs(n: number): string {
  return "Gs. " + n.toLocaleString("es-PY")
}
