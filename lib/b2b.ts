import { createClient } from '@supabase/supabase-js'
import { createClient as createSupaClient } from '@ai-whisperers/auth/supabase/server'

export interface B2BCustomer {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string
  ruc: string
  creditLimit: number
  paymentTerms: string // 'contado' | '15dias' | '30dias' | '60dias'
  status: 'active' | 'suspended' | 'pending'
  createdAt: string
  lastOrderAt: string | null
}

export async function getB2BCustomers(): Promise<B2BCustomer[]> {
  const supabase = await createSupaClient()
  const { data } = await supabase.from('ej_b2b_customers').select('*').order('business_name')
  return (data || []).map(mapB2B)
}

export async function getB2BCustomer(id: string): Promise<B2BCustomer | null> {
  const supabase = await createSupaClient()
  const { data } = await supabase.from('ej_b2b_customers').select('*').eq('id', id).single()
  return data ? mapB2B(data) : null
}

export async function createB2BCustomer(c: Omit<B2BCustomer, 'id' | 'createdAt' | 'lastOrderAt' | 'status'>) {
  const supabase = await createSupaClient()
  const { data, error } = await supabase.from('ej_b2b_customers').insert({
    business_name: c.businessName, contact_name: c.contactName,
    email: c.email, phone: c.phone, ruc: c.ruc,
    credit_limit: c.creditLimit, payment_terms: c.paymentTerms,
  }).select().single()
  if (error) throw error
  return mapB2B(data)
}

export async function updateB2BCustomer(id: string, updates: Partial<B2BCustomer>) {
  const supabase = await createSupaClient()
  const dbUpdates: any = {}
  if (updates.businessName) dbUpdates.business_name = updates.businessName
  if (updates.contactName) dbUpdates.contact_name = updates.contactName
  if (updates.creditLimit !== undefined) dbUpdates.credit_limit = updates.creditLimit
  if (updates.paymentTerms) dbUpdates.payment_terms = updates.paymentTerms
  if (updates.status) dbUpdates.status = updates.status
  await supabase.from('ej_b2b_customers').update(dbUpdates).eq('id', id)
}

export function calculateBulkPrice(basePrice: number, quantity: number): number {
  if (quantity >= 50) return basePrice * 0.7  // 30% off
  if (quantity >= 20) return basePrice * 0.8  // 20% off
  if (quantity >= 10) return basePrice * 0.85 // 15% off
  if (quantity >= 5) return basePrice * 0.9   // 10% off
  return basePrice
}

function mapB2B(row: any): B2BCustomer {
  return {
    id: row.id, businessName: row.business_name, contactName: row.contact_name,
    email: row.email, phone: row.phone, ruc: row.ruc,
    creditLimit: row.credit_limit, paymentTerms: row.payment_terms,
    status: row.status, createdAt: row.created_at, lastOrderAt: row.last_order_at,
  }
}
