-- Migration 009: Add subcategory column to ej_products
-- Run this in Supabase Dashboard > SQL Editor

ALTER TABLE public.ej_products
ADD COLUMN IF NOT EXISTS subcategory TEXT DEFAULT NULL;

END IF;  