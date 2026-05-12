const { createClient } = require('@supabase/supabase-js');

async function main() {
  const supabase = createClient(
    'https://qyvokpribmbrosafntqa.supabase.co',
    'sb_secret_J7n1igQHaVSKn35OrMe93A_p-_FEBvH'
  );

  const sql = `
ALTER TABLE public.ej_products ADD COLUMN IF NOT EXISTS cost_price TEXT DEFAULT '';
ALTER TABLE public.ej_products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
CREATE TABLE IF NOT EXISTS public.ej_stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.ej_products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('add', 'remove', 'adjustment', 'sale', 'return')),
  quantity INTEGER NOT NULL,
  stock_before INTEGER NOT NULL DEFAULT 0,
  stock_after INTEGER NOT NULL DEFAULT 0,
  reference TEXT DEFAULT '',
  note TEXT DEFAULT '',
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_stock_movements ENABLE ROW LEVEL SECURITY;
CREATE TABLE IF NOT EXISTS public.ej_price_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.ej_products(id) ON DELETE CASCADE,
  field TEXT NOT NULL DEFAULT 'price',
  old_value TEXT DEFAULT '',
  new_value TEXT DEFAULT '',
  changed_by TEXT DEFAULT '',
  reason TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_price_history ENABLE ROW LEVEL SECURITY;
CREATE TABLE IF NOT EXISTS public.ej_activity_log (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  details JSONB DEFAULT '{}'::jsonb,
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_activity_log ENABLE ROW LEVEL SECURITY;
CREATE TABLE IF NOT EXISTS public.ej_notifications (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL DEFAULT '',
  body TEXT DEFAULT '',
  link TEXT DEFAULT '',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ej_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ej_stock_movements_select_auth" ON public.ej_stock_movements
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_stock_movements_insert_auth" ON public.ej_stock_movements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_price_history_select_auth" ON public.ej_price_history
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_price_history_insert_auth" ON public.ej_price_history
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_activity_log_select_auth" ON public.ej_activity_log
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_activity_log_insert_auth" ON public.ej_activity_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_notifications_select_auth" ON public.ej_notifications
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ej_notifications_insert_auth" ON public.ej_notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ej_notifications_update_auth" ON public.ej_notifications
  FOR UPDATE USING (auth.role() = 'authenticated');
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS carrier TEXT DEFAULT '';
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS tracking_number TEXT DEFAULT '';
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS tracking_url TEXT DEFAULT '';
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMPTZ;
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE public.ej_orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
CREATE INDEX IF NOT EXISTS idx_ej_stock_movements_product ON public.ej_stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_ej_stock_movements_created ON public.ej_stock_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ej_price_history_product ON public.ej_price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_ej_price_history_created ON public.ej_price_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ej_activity_log_created ON public.ej_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ej_activity_log_entity ON public.ej_activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ej_notifications_unread ON public.ej_notifications(read, created_at DESC);
`;

  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  console.log('exec_sql:', JSON.stringify({ data, error }));
}

main().catch(e => console.error('FATAL:', e));
