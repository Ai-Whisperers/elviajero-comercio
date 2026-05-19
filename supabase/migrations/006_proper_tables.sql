-- Migration 006: Create proper tables for invoices, returns, blog posts
-- Run this in Supabase Dashboard > SQL Editor

-- ============================================================
-- 1. ej_invoices — proper table instead of ej_site_config JSON
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ej_invoices (
  id SERIAL PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  order_id TEXT NOT NULL,
  customer_name TEXT DEFAULT '',
  total TEXT DEFAULT '0',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'issued', 'cancelled')),
  type TEXT DEFAULT 'nota_remision' CHECK (type IN ('factura', 'nota_remision')),
  ruc TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ej_invoices_select_auth" ON public.ej_invoices
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_invoices_insert_auth" ON public.ej_invoices
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_invoices_update_auth" ON public.ej_invoices
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_ej_invoices_order ON public.ej_invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_ej_invoices_status ON public.ej_invoices(status);

-- ============================================================
-- 2. ej_returns — proper table instead of ej_site_config JSON
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ej_returns (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_name TEXT DEFAULT '',
  quantity INTEGER DEFAULT 1,
  reason TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_returns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ej_returns_select_auth" ON public.ej_returns
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_returns_insert_auth" ON public.ej_returns
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_returns_update_auth" ON public.ej_returns
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_ej_returns_order ON public.ej_returns(order_id);
CREATE INDEX IF NOT EXISTS idx_ej_returns_status ON public.ej_returns(status);

-- ============================================================
-- 3. ej_blog_posts — proper table instead of ej_site_config JSON
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ej_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  image_url TEXT DEFAULT '',
  author TEXT DEFAULT '',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ej_blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ej_blog_posts_select_public" ON public.ej_blog_posts
  FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "ej_blog_posts_admin" ON public.ej_blog_posts
  FOR ALL USING (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_ej_blog_posts_slug ON public.ej_blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_ej_blog_posts_published ON public.ej_blog_posts(published, created_at DESC);
