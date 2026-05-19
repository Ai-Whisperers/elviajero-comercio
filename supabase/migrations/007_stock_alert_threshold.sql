-- Migration 007: Add per-product stock alert threshold
-- Run this in Supabase Dashboard > SQL Editor

ALTER TABLE public.ej_products
ADD COLUMN IF NOT EXISTS stock_alert_threshold INTEGER NOT NULL DEFAULT 5;

-- Ensure existing rows have the default value
UPDATE public.ej_products
SET stock_alert_threshold = 5
WHERE stock_alert_threshold IS NULL;
