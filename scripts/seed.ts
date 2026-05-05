import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE env vars')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  // 1. Seed products from content/es.json
  const content = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'es.json'), 'utf-8'))
  const prodCatalog = content.home?.productCatalog
  if (prodCatalog?.products?.length > 0) {
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
    if (count === 0) {
      const { error } = await supabase.from('products').insert(
        prodCatalog.products.map((p: any) => ({
          name: p.name,
          category: p.category || '',
          price: p.price || '0',
          price_before: p.priceBefore || '',
          description: p.description || '',
          brand: p.brand || '',
          specs: p.specs || '',
          stock: p.stock ?? 0,
          weight: p.weight || '',
          image_url: p.imageUrl || '',
          is_new: p.isNew || false,
          featured: p.featured || false,
        }))
      )
      if (error) console.error('Products insert error:', error.message)
      else console.log(`Seeded ${prodCatalog.products.length} products`)
    } else {
      console.log(`Products table already has ${count} rows, skipping`)
    }
  }

  // 2. Seed categories
  if (prodCatalog?.categories?.length > 0) {
    const { count } = await supabase.from('categories').select('*', { count: 'exact', head: true })
    if (count === 0) {
      const { error } = await supabase.from('categories').insert(
        prodCatalog.categories.map((name: string) => ({ name }))
      )
      if (error) console.error('Categories insert error:', error.message)
      else console.log(`Seeded ${prodCatalog.categories.length} categories`)
    }
  }

  // 3. Create admin user (from env or first registered user)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@elviajero.com.py'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'

  const { data: existing } = await supabase.auth.admin.listUsers()
  const adminUser = existing?.users?.find((u: any) => u.email === adminEmail)
  if (!adminUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: 'Admin' },
    })
    if (error) console.error('Admin user creation error:', error.message)
    else {
      // Set admin role in profiles
      if (data?.user?.id) {
        await supabase.from('profiles').update({ role: 'admin' }).eq('id', data.user.id)
        console.log(`Admin user created: ${adminEmail}`)
      }
    }
  } else {
    console.log(`Admin user already exists: ${adminEmail}`)
  }

  console.log('Seed complete!')
}

seed().catch(console.error)
