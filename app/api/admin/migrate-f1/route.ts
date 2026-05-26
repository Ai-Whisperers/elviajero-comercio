import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST || '10.60.193.35',
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE || 'postgres',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  max: 1,
  ssl: { rejectUnauthorized: false }
});

export async function GET(req: Request) {
  // Debug: return environment info
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  
  // Return what we received for debugging
  if (key === 'debug') {
    return NextResponse.json({
      has_pgpassword: !!process.env.PGPASSWORD,
      has_pghost: !!process.env.PGHOST,
      pghost: process.env.PGHOST || 'not set',
      pgport: process.env.PGPORT || 'not set',
      pgdatabase: process.env.PGDATABASE || 'not set',
      pguser: process.env.PGUSER || 'not set'
    });
  }

  if (key !== 'elviajero-migrate-2026') {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized', received_key: key, has_auth: false }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unauthorized', reason: 'bad_key' }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    const results = [];

    // Create ej_categories
    await client.query(`
      CREATE TABLE IF NOT EXISTS ej_categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        order_index INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    results.push('ej_categories: created/verified');

    // Create ej_subcategories
    await client.query(`
      CREATE TABLE IF NOT EXISTS ej_subcategories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        category_id UUID REFERENCES ej_categories(id) ON DELETE CASCADE,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        order_index INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    results.push('ej_subcategories: created/verified');

    // Create ej_content_sections
    await client.query(`
      CREATE TABLE IF NOT EXISTS ej_content_sections (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        section_key TEXT NOT NULL UNIQUE,
        content JSONB NOT NULL DEFAULT '{}',
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    results.push('ej_content_sections: created/verified');

    // Create ej_site_config
    await client.query(`
      CREATE TABLE IF NOT EXISTS ej_site_config (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        config_key TEXT NOT NULL UNIQUE,
        config_value JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    results.push('ej_site_config: created/verified');

    // Populate categories
    const cats = [
      { name: 'Camping', slug: 'camping', order: 0 },
      { name: 'Artículos de pesca', slug: 'articulos-de-pesca', order: 1 },
      { name: 'Exploración y táctico', slug: 'exploracion-y-tactico', order: 2 },
      { name: 'Ruta y Aventura', slug: 'ruta-y-aventura', order: 3 }
    ];

    for (const cat of cats) {
      await client.query(
        `INSERT INTO ej_categories (name, slug, order_index, active) VALUES ($1, $2, $3, true) ON CONFLICT (name) DO UPDATE SET order_index = $3, active = true`,
        [cat.name, cat.slug, cat.order]
      );
    }

    // Verify categories
    const { rows } = await client.query('SELECT name, slug, order_index FROM ej_categories ORDER BY order_index');
    results.push('ej_categories: ' + JSON.stringify(rows));

    return NextResponse.json({ status: 'migration_complete', results });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
}