-- El Viajero E-commerce Schema
-- Migration 001: Create all tables with RLS policies

-- 1. profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 4. orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total TEXT NOT NULL DEFAULT '0',
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado')),
  address_id TEXT DEFAULT '',
  payment_method TEXT DEFAULT '',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. addresses
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT DEFAULT '',
  name TEXT DEFAULT '',
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT '',
  zip TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 6. promo_codes
CREATE TABLE IF NOT EXISTS public.promo_codes (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed')),
  value INTEGER NOT NULL DEFAULT 0,
  min_purchase INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- 7. reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  user_name TEXT DEFAULT 'Anónimo',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 8. subscribers
CREATE TABLE IF NOT EXISTS public.subscribers (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 9. abandoned_carts
CREATE TABLE IF NOT EXISTS public.abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total TEXT DEFAULT '0',
  reminders_sent INTEGER DEFAULT 0,
  recovered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- 10. stock_alerts
CREATE TABLE IF NOT EXISTS public.stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Increment promo code usage counter
CREATE OR REPLACE FUNCTION public.increment_promo_uses(code_text TEXT)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.promo_codes SET used_count = used_count + 1 WHERE code = code_text;
END;
$$;
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- profiles
CREATE POLICY "profiles_read_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_read_admin" ON public.profiles
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- products
CREATE POLICY "products_read_public" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "products_write_admin" ON public.products
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "products_write_own_admin" ON public.products
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- categories
CREATE POLICY "categories_read_public" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "categories_write_admin" ON public.categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- orders
CREATE POLICY "orders_read_own" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_read_admin" ON public.orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- addresses
CREATE POLICY "addresses_manage_own" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

-- promo_codes
CREATE POLICY "promos_read_public" ON public.promo_codes
  FOR SELECT USING (true);
CREATE POLICY "promos_write_admin" ON public.promo_codes
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- reviews
CREATE POLICY "reviews_read_public" ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY "reviews_insert_auth" ON public.reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "reviews_delete_admin" ON public.reviews
  FOR DELETE USING (auth.jwt() ->> 'role' = 'service_role');

-- subscribers
CREATE POLICY "subscribers_insert_public" ON public.subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "subscribers_read_admin" ON public.subscribers
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- abandoned_carts
CREATE POLICY "carts_insert_public" ON public.abandoned_carts
  FOR INSERT WITH CHECK (true);
CREATE POLICY "carts_read_admin" ON public.abandoned_carts
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- stock_alerts
CREATE POLICY "alerts_insert_public" ON public.stock_alerts
  FOR INSERT WITH CHECK (true);
CREATE POLICY "alerts_read_admin" ON public.stock_alerts
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_name);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_product ON public.stock_alerts(product_name);
