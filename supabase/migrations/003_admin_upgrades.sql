-- El Viajero Admin Upgrades
-- Migration 003: Stock movements, activity log, price history, notifications
-- Run this in Supabase Dashboard > SQL Editor

-- ============================================================
-- 1. Add cost_price and updated_at to ej_products
-- ============================================================
ALTER TABLE public.ej_products ADD COLUMN IF NOT EXISTS cost_price TEXT DEFAULT '';
ALTER TABLE public.ej_products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ============================================================
-- 2. ej_stock_movements — every stock change is logged
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ej_stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.ej_products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('add', 'remove', 'adjustment', 'sale', 'return')),
  quantity INTEGER NOT NULL,
  stock_before INTEGER NOT NULL DEFAULT 0,
  stock_after INTEGER NOT NULL DEFAULT 0,
  reference TEXT DEFAULT '',       -- order ID, note, etc.
  note TEXT DEFAULT '',
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ej_stock_movements_select_auth" ON public.ej_stock_movements
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_stock_movements_insert_auth" ON public.ej_stock_movements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_ej_stock_movements_product ON public.ej_stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_ej_stock_movements_created ON public.ej_stock_movements(created_at DESC);

-- ============================================================
-- 3. ej_price_history — every price change is logged
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ej_price_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.ej_products(id) ON DELETE CASCADE,
  field TEXT NOT NULL DEFAULT 'price',  -- 'price', 'cost_price', 'price_before'
  old_value TEXT DEFAULT '',
  new_value TEXT DEFAULT '',
  changed_by TEXT DEFAULT '',
  reason TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ej_price_history_select_auth" ON public.ej_price_history
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_price_history_insert_auth" ON public.ej_price_history
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_ej_price_history_product ON public.ej_price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_ej_price_history_created ON public.ej_price_history(created_at DESC);

-- ============================================================
-- 4. ej_activity_log — full audit trail
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ej_activity_log (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,              -- 'product.update', 'order.status_change', 'product.create', etc.
  entity_type TEXT NOT NULL,         -- 'product', 'order', 'category', 'promo', etc.
  entity_id TEXT DEFAULT '',
  summary TEXT DEFAULT '',           -- Human-readable: "Updated price of Carpa X"
  details JSONB DEFAULT '{}'::jsonb,
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ej_activity_log_select_auth" ON public.ej_activity_log
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_activity_log_insert_auth" ON public.ej_activity_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_ej_activity_log_created ON public.ej_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ej_activity_log_entity ON public.ej_activity_log(entity_type, entity_id);

-- ============================================================
-- 5. ej_notifications — in-app notification center
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ej_notifications (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'info',   -- 'info', 'success', 'warning', 'error'
  title TEXT NOT NULL DEFAULT '',
  body TEXT DEFAULT '',
  link TEXT DEFAULT '',                -- Optional deep link to admin page
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ej_notifications_select_auth" ON public.ej_notifications
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_notifications_insert_auth" ON public.ej_notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_notifications_update_auth" ON public.ej_notifications
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_ej_notifications_unread ON public.ej_notifications(read, created_at DESC);

-- ============================================================
-- 6. Add tracking fields to ej_orders
-- ============================================================
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS carrier TEXT DEFAULT '';
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS tracking_number TEXT DEFAULT '';
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS tracking_url TEXT DEFAULT '';
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMPTZ;
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
