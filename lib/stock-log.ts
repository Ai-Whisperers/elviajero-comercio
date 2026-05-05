import { createClient } from '@/lib/supabase/server'

export async function logStockMovement(productId: string, productName: string, quantityChange: number, reason: string, referenceId?: string) {
  const supabase = await createClient()
  await supabase.from('ej_stock_movements').insert({
    product_id: productId, product_name: productName,
    quantity_change: quantityChange, reason, reference_id: referenceId || '',
  })
}

export async function getStockMovements(productId: string): Promise<any[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('ej_stock_movements').select('*').eq('product_id', productId).order('created_at', { ascending: false }).limit(50)
  return data || []
}
