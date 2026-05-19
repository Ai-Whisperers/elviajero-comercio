-- Add slug column to ej_products
-- This allows URL-friendly product paths

-- Add the slug column if it doesn't exist
ALTER TABLE ej_products ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create a unique index on slug for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_ej_products_slug ON ej_products(slug);

-- Generate slugs from existing product names
-- This slugify function converts: "Binocular JM 386 Negro Grande" -> "binocular-jm-386-negro-grande"
UPDATE ej_products
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(name, '[^\w\s-]', '', 'g'),  -- Remove special chars
      '\s+', '-', 'g'                          -- Replace spaces with hyphens
    ),
    '-+', '-', 'g'                             -- Collapse multiple hyphens
  )
)
WHERE slug IS NULL OR slug = '';

-- Set NOT NULL constraint after populating
ALTER TABLE ej_products ALTER COLUMN slug SET NOT NULL;
