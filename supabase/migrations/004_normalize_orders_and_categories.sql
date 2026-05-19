-- Migration 004: Normalize ej_orders.note and add category FK
-- Run this in Supabase Dashboard > SQL Editor

-- ============================================================
-- 1. Add normalized columns to ej_orders
-- ============================================================
ALTER TABLE public.ej_orders
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS delivery_zone_id TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS delivery_cost TEXT DEFAULT '0',
  ADD COLUMN IF NOT EXISTS promo_code TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS discount_applied TEXT DEFAULT '0',
  ADD COLUMN IF NOT EXISTS internal_notes TEXT DEFAULT '';

-- ============================================================
-- 2. Migrate existing data from note JSON to columns
-- ============================================================
UPDATE public.ej_orders
SET
  payment_status = COALESCE(
    (note::jsonb->>'payment_status'),
    'pending'
  ),
  payment_confirmed_at = CASE
    WHEN note::jsonb->>'payment_confirmed_at' IS NOT NULL
    THEN (note::jsonb->>'payment_confirmed_at')::timestamptz
    ELSE NULL
  END,
  payment_proof_url = COALESCE(note::jsonb->>'payment_proof_url', ''),
  delivery_zone_id = COALESCE(note::jsonb->>'delivery_zone_id', ''),
  delivery_cost = COALESCE(note::jsonb->>'delivery_cost', '0'),
  promo_code = COALESCE(note::jsonb->>'promo_code', ''),
  discount_applied = COALESCE(note::jsonb->>'discount_applied', '0'),
  internal_notes = COALESCE(note::jsonb->>'internal_notes', note)
WHERE note IS NOT NULL AND note != '';

-- ============================================================
-- 3. Add category_id to ej_products
-- ============================================================
ALTER TABLE public.ej_products
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.ej_categories(id) ON DELETE SET NULL;

-- ============================================================
-- 4. Migrate category names to category_ids
-- ============================================================
UPDATE public.ej_products p
SET category_id = c.id
FROM public.ej_categories c
WHERE p.category = c.name;

-- ============================================================
-- 5. Add indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ej_orders_payment_status ON public.ej_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_ej_orders_user_id ON public.ej_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_ej_products_category_id ON public.ej_products(category_id);
