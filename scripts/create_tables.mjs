const SUPABASE_ACCESS_TOKEN = 'sbp_e1535079b4cfb2d2cd6de97735fb2bfe372c8a9b'
const PROJECT_REF = 'qyvokpribmbrosafntqa'

const sql = `
CREATE TABLE IF NOT EXISTS public.ej_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '0',
  price_before TEXT DEFAULT '',
  description TEXT DEFAULT '',
  brand TEXT DEFAULT '',
  specs TEXT DEFAULT '',
  stock INTEGER DEFAULT 0,
  weight TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  is_new BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_products ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ej_orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total TEXT NOT NULL DEFAULT '0',
  status TEXT NOT NULL DEFAULT 'pendiente',
  address_id TEXT DEFAULT '',
  payment_method TEXT DEFAULT '',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ej_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  user_name TEXT DEFAULT 'Anonimo',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_reviews ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ej_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ej_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT DEFAULT '',
  name TEXT DEFAULT '',
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT '',
  zip TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_addresses ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ej_promo_codes (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed')),
  value INTEGER NOT NULL DEFAULT 0,
  min_purchase INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_promo_codes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ej_subscribers (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_subscribers ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ej_abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total TEXT DEFAULT '0',
  reminders_sent INTEGER DEFAULT 0,
  recovered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ej_stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_stock_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "ejp_read_public" ON public.ej_products FOR SELECT USING (true);
CREATE POLICY "ejp_write_admin" ON public.ej_products FOR ALL USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "ejo_read_own" ON public.ej_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ejo_read_admin" ON public.ej_orders FOR ALL USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "ejo_insert_own" ON public.ej_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ejr_read_public" ON public.ej_reviews FOR SELECT USING (true);
CREATE POLICY "ejr_insert_auth" ON public.ej_reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ejr_delete_admin" ON public.ej_reviews FOR DELETE USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "ejc_read_public" ON public.ej_categories FOR SELECT USING (true);
CREATE POLICY "ejc_write_admin" ON public.ej_categories FOR ALL USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "eja_manage_own" ON public.ej_addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "ejp2_read_public" ON public.ej_promo_codes FOR SELECT USING (true);
CREATE POLICY "ejp2_write_admin" ON public.ej_promo_codes FOR ALL USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "ejs_insert_public" ON public.ej_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "ejs_read_admin" ON public.ej_subscribers FOR SELECT USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "ejac_insert_public" ON public.ej_abandoned_carts FOR INSERT WITH CHECK (true);
CREATE POLICY "ejac_read_admin" ON public.ej_abandoned_carts FOR SELECT USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "ejsa_insert_public" ON public.ej_stock_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "ejsa_read_admin" ON public.ej_stock_alerts FOR SELECT USING (auth.jwt()->>'role' = 'service_role');

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;

async function main() {
  // Split into statements and execute one by one
  const statements = sql.split(';').filter(s => s.trim().length > 0);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (!stmt) continue;
    
    const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: stmt + ';' }),
    });
    
    const text = await res.text();
    if (text && !text.includes('already exists') && !text.startsWith('[')) {
      console.log(`Statement ${i + 1} error:`, text.substring(0, 200));
    } else {
      const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
      console.log(`✓ ${i + 1}/${statements.length}: ${preview}...`);
    }
  }
  
  console.log('Migration complete!');
}

main().catch(console.error);
