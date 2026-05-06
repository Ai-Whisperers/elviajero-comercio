import { createClient } from '@ai-whisperers/auth/supabase/server'

export const LOYALTY_POINTS_PER_GS = 0.01 // 1 point per Gs. 100 spent
export const LOYALTY_GS_PER_POINT = 50    // 50 points = Gs. 1 discount

export interface LoyaltyTier {
  name: string
  minPoints: number
  multiplier: number
  color: string
}

export const TIERS: LoyaltyTier[] = [
  { name: 'Bronce', minPoints: 0, multiplier: 1, color: '#CD7F32' },
  { name: 'Plata', minPoints: 1000, multiplier: 1.2, color: '#C0C0C0' },
  { name: 'Oro', minPoints: 5000, multiplier: 1.5, color: '#FFD700' },
  { name: 'Platino', minPoints: 20000, multiplier: 2, color: '#E5E4E2' },
]

export async function awardPoints(userId: string, orderTotal: number) {
  const supabase = await createClient()
  const points = Math.floor(orderTotal * LOYALTY_POINTS_PER_GS)
  await supabase.from('ej_loyalty_points').insert({ user_id: userId, points, source: 'order', source_id: '' })
}

export async function getUserPoints(userId: string): Promise<{ total: number; tier: LoyaltyTier }> {
  const supabase = await createClient()
  const { data } = await supabase.from('ej_loyalty_points').select('points').eq('user_id', userId)
  const total = (data || []).reduce((s, r: any) => s + r.points, 0)
  const tier = [...TIERS].reverse().find(t => total >= t.minPoints) || TIERS[0]
  return { total, tier }
}

export function referralCode(userId: string): string {
  return 'VIAJERO-' + userId.slice(0, 6).toUpperCase()
}
