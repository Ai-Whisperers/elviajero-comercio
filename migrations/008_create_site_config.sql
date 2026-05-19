-- Migration 008: Create site_config table for JSON content
-- Replaces content/es.json static data with Supabase source of truth
-- Implements Fase 2: Remove JSON imports

CREATE TABLE IF NOT EXISTS ej_site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast key lookups
CREATE INDEX IF NOT EXISTS idx_site_config_key ON ej_site_config(key);

-- Insert default site metadata (from content/es.json)
INSERT INTO ej_site_config (key, value) VALUES
  ('siteName', '"El Viajero"'),
  ('businessName', '"El Viajero"'),
  ('tagline', '"Todo para tu Aventura"'),
  ('founded', '"2018"'),
  ('whatsappNumber', '"+595984009751"'),
  ('whatsappMessage', '"Hola! Quisiera informacion sobre productos"')
ON CONFLICT (key) DO NOTHING;

-- Navigation items structure:
-- {
--   "items": [
--     { "label": "Inicio", "href": "/" },
--     { "label": "Tienda", "href": "/tienda" },
--     ...
--   ]
-- }
INSERT INTO ej_site_config (key, value) VALUES
  ('navigation', '{
    "businessName": "El Viajero",
    "ctaText": "Pedir por WhatsApp",
    "ctaHref": "https://wa.me/595984009751?text=Hola!%20Quisiera%20informacion%20sobre%20productos",
    "items": [
      { "label": "Inicio", "href": "/" },
      { "label": "Tienda", "href": "/tienda" },
      { "label": "Blog", "href": "/blog" },
      { "label": "Nosotros", "href": "/nosotros" },
      { "label": "Ofertas", "href": "/promociones" },
      { "label": "FAQ", "href": "/faq" },
      { "label": "Contacto", "href": "/contacto" }
    ]
  }')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE ej_site_config ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read access to everyone (public site content)
CREATE POLICY "Allow public read access to ej_site_config"
  ON ej_site_config FOR SELECT
  USING (true);

-- Policy: Allow write access to authenticated users only
CREATE POLICY "Allow authenticated write access to ej_site_config"
  ON ej_site_config FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to get site config by key
CREATE OR REPLACE FUNCTION get_site_config(p_key TEXT)
RETURNS JSONB AS $$
  SELECT value FROM ej_site_config WHERE key = p_key LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Create function to get all site config
CREATE OR REPLACE FUNCTION get_all_site_config()
RETURNS JSONB AS $$
  SELECT jsonb_object_agg(key, value) FROM ej_site_config;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

COMMENT ON TABLE ej_site_config IS 'Site-wide configuration and static content (replaces content/es.json)';
COMMENT ON FUNCTION get_site_config(TEXT) IS 'Fetch single config value by key';
COMMENT ON FUNCTION get_all_site_config() IS 'Fetch all site config as JSON object';
