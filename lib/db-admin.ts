// lib/db-admin.ts - Direct PostgreSQL connection using connection string from Supabase pooler
// The direct connection string is available via the `DATABASE_URL` env or we build it from pooler info

import { createClient } from '@supabase/supabase-js';

const env: Record<string, string> = {};
try {
  require('fs').readFileSync(require('path').join(process.cwd(), '.env.local'), 'utf8')
    .split('\n').forEach((line: string) => {
      const [key, ...vals] = line.split('=');
      if (key && vals.length) env[key.trim()] = vals.join('=').trim();
    });
} catch {}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || '';

// For DDL we need direct pg connection.
// Supabase provides direct connection via: postgresql://postgres:{password}@db.{ref}.supabase.co:5432/postgres
// The password is the one from Settings > Database (not the service role key)
// 
// Alternative: Use Supabase Management API via the access token from ~/.config/supabase/config.json
// or use the `supabase` CLI that should be installed on the VPS
//
// Let's try using the supabase CLI or direct psql

export async function runMigrationSQL(sql: string): Promise<{ success: boolean; output: string }> {
  // Try using supabase CLI
  try {
    const { execSync } = require('child_process');
    // Check if supabase CLI is available
    const version = execSync('supabase --version 2>/dev/null || echo "not found"', { encoding: 'utf8' }).trim();
    if (version !== 'not found') {
      console.log('Supabase CLI available:', version);
    }
    return { success: false, output: 'supabase CLI not configured for script execution' };
  } catch {
    return { success: false, output: 'Could not run via supabase CLI' };
  }
}

// Export supabase clients for data operations
export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  db: { schema: 'public' }
});

export const supabasePublic = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || '',
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);