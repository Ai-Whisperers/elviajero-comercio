import siteConfig from '@/config/site.json'
import promosConfig from '@/config/promos.json'

export type SiteConfig = typeof siteConfig
export type PromosConfig = typeof promosConfig

export function getSiteConfig(): SiteConfig {
  return siteConfig as SiteConfig
}

export function getPromosConfig(): PromosConfig {
  return promosConfig as PromosConfig
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || siteConfig.publicUrl || (siteConfig as any).siteUrl || 'https://el-viajero.paragu-ai.com'
}

export function getShippingZones() {
  return getSiteConfig().settings.delivery.zones.map((z, i) => ({
    id: ['asu', 'central', 'interior', 'pickup'][i] || `zone-${i}`,
    name: z,
    fee: [15000, 25000, 40000, 0][i] || 0,
    freeFrom: [300000, 400000, 500000, 0][i] || 0,
    estimatedDays: ['24 hs', '24-48 hs', '48-72 hs', '—'][i] || '',
  }))
}

export function formatCurrency(amount: number): string {
  const config = getSiteConfig()
  const symbol = (config as any).settings?.currencySymbol || 'Gs.'
  const locale = (config as any).settings?.locale || 'es-PY'
  return `${symbol} ${amount.toLocaleString(locale)}`
}
