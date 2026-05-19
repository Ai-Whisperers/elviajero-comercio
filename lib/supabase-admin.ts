import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create admin client for schema operations
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Direct PostgreSQL connection for schema changes
// Uses pooler connection format: postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
// Note: Requires DATABASE_PASSWORD env var
export async function executeMigration(sql: string): Promise<any> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  })

  try {
    const client = await pool.connect()
    try {
      const result = await client.query(sql)
      return result
    } finally {
      client.release()
    }
  } finally {
    await pool.end()
  }
}

export { supabaseAdmin }
