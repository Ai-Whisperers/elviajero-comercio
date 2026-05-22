require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
sb.from('ej_site_config').select('value').eq('key', 'content_overrides_elviajero').single().then(r => {
  const cats = r.data?.value?.home?.productCatalog?.categories;
  console.log(cats ? JSON.stringify(cats, null, 2) : 'NO_OVERRIDE');
}).catch(e => { console.error(e.message); process.exit(1); });
