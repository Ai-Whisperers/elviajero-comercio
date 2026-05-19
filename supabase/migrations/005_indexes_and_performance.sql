-- Migration 005: Performance indexes
-- Run this in Supabase Dashboard > SQL Editor

-- ej_orders indexes
CREATE INDEX IF NOT EXISTS idx_ej_orders_status ON public.ej_orders(status);
CREATE INDEX IF NOT EXISTS idx_ej_orders_created_at ON public.ej_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ej_orders_customer_phone ON public.ej_orders(customer_phone);

-- ej_products indexes
CREATE INDEX IF NOT EXISTS idx_ej_products_name ON public.ej_products(name);
CREATE INDEX IF NOT EXISTS idx_ej_products_stock ON public.ej_products(stock);

-- ej_activity_log indexes (some already exist from 003)
CREATE INDEX IF NOT EXISTS idx_ej_activity_log_action ON public.ej_activity_log(action);

-- ej_site_config indexes
CREATE INDEX IF NOT EXISTS idx_ej_site_config_key ON public.ej_site_config(key);

-- profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
