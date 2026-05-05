-- Run this in Supabase Dashboard > SQL Editor
-- Creates ej_ prefix tables with RLS policies for El Viajero admin

-- 1. ej_products
CREATE TABLE IF NOT EXISTS public.ej_products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  slug TEXT DEFAULT '',
  category TEXT DEFAULT '',
  price TEXT NOT NULL DEFAULT '0',
  price_before TEXT DEFAULT '',
  description TEXT DEFAULT '',
  brand TEXT DEFAULT '',
  specs TEXT DEFAULT '',
  stock INTEGER DEFAULT 0,
  weight TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  is_new BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_products ENABLE ROW LEVEL SECURITY;

-- 2. ej_categories
CREATE TABLE IF NOT EXISTS public.ej_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_categories ENABLE ROW LEVEL SECURITY;

-- 3. ej_orders
CREATE TABLE IF NOT EXISTS public.ej_orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  customer_name TEXT DEFAULT '',
  customer_phone TEXT DEFAULT '',
  customer_email TEXT DEFAULT '',
  total TEXT NOT NULL DEFAULT '0',
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado')),
  payment_method TEXT DEFAULT '',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_orders ENABLE ROW LEVEL SECURITY;

-- 4. ej_promo_codes
CREATE TABLE IF NOT EXISTS public.ej_promo_codes (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed')),
  value INTEGER NOT NULL DEFAULT 0,
  min_purchase INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_promo_codes ENABLE ROW LEVEL SECURITY;

-- 5. ej_reviews
CREATE TABLE IF NOT EXISTS public.ej_reviews (
  id SERIAL PRIMARY KEY,
  product_name TEXT NOT NULL,
  user_name TEXT DEFAULT 'Anónimo',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_reviews ENABLE ROW LEVEL SECURITY;

-- 6. ej_b2b_customers
CREATE TABLE IF NOT EXISTS public.ej_b2b_customers (
  id SERIAL PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  ruc TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_b2b_customers ENABLE ROW LEVEL SECURITY;

-- 7. ej_subscribers
CREATE TABLE IF NOT EXISTS public.ej_subscribers (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_subscribers ENABLE ROW LEVEL SECURITY;

-- 8. ej_stock_alerts
CREATE TABLE IF NOT EXISTS public.ej_stock_alerts (
  id SERIAL PRIMARY KEY,
  product_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_stock_alerts ENABLE ROW LEVEL SECURITY;

-- 9. ej_abandoned_carts
CREATE TABLE IF NOT EXISTS public.ej_abandoned_carts (
  id SERIAL PRIMARY KEY,
  phone TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total TEXT DEFAULT '0',
  reminders_sent INTEGER DEFAULT 0,
  recovered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_abandoned_carts ENABLE ROW LEVEL SECURITY;

-- 10. ej_customers
CREATE TABLE IF NOT EXISTS public.ej_customers (
  id SERIAL PRIMARY KEY,
  name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_customers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES for ej_ tables
-- ============================================================

-- ej_products: anyone can read, admins can write
CREATE POLICY "ej_products_select_anon" ON public.ej_products
  FOR SELECT USING (true);
CREATE POLICY "ej_products_insert_auth" ON public.ej_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_products_update_auth" ON public.ej_products
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "ej_products_delete_auth" ON public.ej_products
  FOR DELETE USING (auth.role() = 'authenticated');

-- ej_orders: authenticated users can CRUD
CREATE POLICY "ej_orders_insert_auth" ON public.ej_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_orders_select_auth" ON public.ej_orders
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_orders_update_auth" ON public.ej_orders
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "ej_orders_delete_auth" ON public.ej_orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- ej_promo_codes: anyone reads, auth writes
CREATE POLICY "ej_promos_select_anon" ON public.ej_promo_codes
  FOR SELECT USING (true);
CREATE POLICY "ej_promos_insert_auth" ON public.ej_promo_codes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_promos_delete_auth" ON public.ej_promo_codes
  FOR DELETE USING (auth.role() = 'authenticated');

-- ej_reviews: anyone reads, auth inserts
CREATE POLICY "ej_reviews_select_anon" ON public.ej_reviews
  FOR SELECT USING (true);
CREATE POLICY "ej_reviews_insert_auth" ON public.ej_reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_reviews_delete_auth" ON public.ej_reviews
  FOR DELETE USING (auth.role() = 'authenticated');

-- ej_b2b_customers: auth CRUD
CREATE POLICY "ej_b2b_select_auth" ON public.ej_b2b_customers
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_b2b_insert_auth" ON public.ej_b2b_customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_b2b_update_auth" ON public.ej_b2b_customers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ej_subscribers: anyone inserts
CREATE POLICY "ej_subs_insert_anon" ON public.ej_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "ej_subs_select_auth" ON public.ej_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

-- ej_stock_alerts: anyone inserts
CREATE POLICY "ej_alerts_insert_anon" ON public.ej_stock_alerts
  FOR INSERT WITH CHECK (true);
CREATE POLICY "ej_alerts_select_auth" ON public.ej_stock_alerts
  FOR SELECT USING (auth.role() = 'authenticated');

-- ej_abandoned_carts: anyone inserts
CREATE POLICY "ej_carts_insert_anon" ON public.ej_abandoned_carts
  FOR INSERT WITH CHECK (true);
CREATE POLICY "ej_carts_select_auth" ON public.ej_abandoned_carts
  FOR SELECT USING (auth.role() = 'authenticated');

-- ej_customers: auth CRUD
CREATE POLICY "ej_cust_select_auth" ON public.ej_customers
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_cust_insert_auth" ON public.ej_customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ej_orders_created ON public.ej_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ej_orders_status ON public.ej_orders(status);
CREATE INDEX IF NOT EXISTS idx_ej_products_category ON public.ej_products(category);
CREATE INDEX IF NOT EXISTS idx_ej_stock_alerts_product ON public.ej_stock_alerts(product_name);
