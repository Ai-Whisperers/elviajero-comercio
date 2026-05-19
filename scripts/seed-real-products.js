const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envText = fs.readFileSync('/root/elviajero/.env.local', 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const catMap = {
  'Pezca': 'Pesca',
  'electronica': 'Electrónica',
  'accesorios pers.': 'Accesorios Personales',
  'Camping': 'Camping',
  'Equipo p/ Auto': 'Accesorios para Vehículos',
  'accesorios moto': 'Accesorios para Vehículos',
};

const raw = `1	1	Juego de anzuelos N04 50unid. Pinacle	Pezca
2	1	Juego de anzuelos N01 50unid. Pinacle	Pezca
3	1	Juego de anzuelos N08 50 unid. Pinacle	Pezca
4	1	Juego de anzuelos N06 50unid. Pinacle	Pezca
5	4	señuelos 90 multicolores	Pezca
6	3	señuelos 90 multicolores	Pezca
7	1	carrete ril con vara Rojo y blanco 1,45 10 a 20lb tricolor	Pezca
8	1	carrete ril con vara verde 1,45 10 a 20lb	Pezca
9	1	kit tucuna vara con ril gris 1,83 20lb doble pliegue	Pezca
10	1	Ril dakar 5000 verde	Pezca
11	1	kit vara con ril kim	Pezca
12	1	ril omega 5000	Pezca
13	1	ril nexus verde	Pezca
14	1	vara verde arara doble pliegue	Pezca
15	1	vara apolo enterizo	Pezca
16	1	vara verde sargen	Pezca
17	1	nikel 30 4"	Pezca
18	1	nikel 30 6"	Pezca
19	2	hilo multifilamento pemax	Pezca
20	4	hilo de pezca premiun	Pezca
21	1	tablet goodge 12 ran 64 gb	electronica
22	2	Cargador portatil ecopower	electronica
23	1	reloj smart para agua k950 Ultra waterpro	accesorios pers.
24	1	reloj smart luke ultra	accesorios pers.
25	1	drom lauply	electronica
26	1	Camara para agua sate	electronica
27	1	Linterna con picana electrica	accesorios pers.
28	2	vaso termico shopp 790ml	accesorios pers.
29	1	bolsa de dormir bestway	Camping
30	1	bolsa de dormir camuflayado	Camping
31	2	Mata mosca tipo raqueta	Camping
32	1	Mochila camuflayado GR P/Camping	Camping
33	1	mochila negro GR P/Camping	Camping
34	1	Mochila tactica verde	Camping
35	1	Mochila Negra chennson	accesorios pers.
36	2	Mochila C/ Maletin P/Notb neg chens	accesorios pers.
37	1	Carpa camping 3 personas colores	Camping
38	1	Carpa camping 3 personas color 79822	Camping
39	1	Carpa camping 3 personas camuflayado	Camping
40	1	carpa camping 5 personas camuflayado	Camping
41	1	carpa camping 2 personas camuflayado	Camping
42	1	catraca y tira remolque	Equipo p/ Auto
43	2	linterna con herramientas solar 	Camping
44	1	Lampara recargable con herramientas	Camping
45	1	linterna aluminio grande negro	Camping
46	1	linterna recargable shunchi	Camping
47	1	linterna recargable xx	Camping
48	1	inflador intex manual p colchones	Camping
49	1	capa protector para moto	accesorios moto
50	1	colchon inflable intex 1 persona	Camping
51	1	colchon inflable intex 2 persona	Camping
52	2	sillas pescador con porta vaso	Camping
53	1	linterna con lampara solar kf964	Camping
54	1	lampara para camping recargable	Camping
55	1	cuchillo 30cm con funda ck060	Camping
56	1	cuchillo 30cm con funda ck061	Camping
57	1	cuchillo rambo 50cm con funda ck023	Camping
58	1	cuchillo con funda verde ck001	Camping
59	1	binocular negro chico con funda	Camping
60	1	binocular jm 386 negro grande con funda	Camping
61	1	linterna con encendedor amarillo	Camping
62	2	linternita de mano con pila chico	Camping
63	1	linterna de mano negro pequeño	Camping
64	1	linterna para cabeza	Camping
65	1	linterna camuflayado kf969 con caja	Camping
66	1	linterna c zoom recargable	Camping
67	1	linterna vibol kf1521	Camping
68	1	riñonera piernera jm204 verde militar	accesorios pers.
69	1	mochila verde tactico jm266	accesorios pers.
70	1	mochila negra tactico jm266	accesorios pers.
71	1	mochila camping verde jm 365	accesorios pers.
72	2	pasa montañas	accesorios pers.
73	2	cantinplora con jarro y forro	accesorios pers.
74	1	brujula con regla jm232	accesorios pers.
75	1	brujula jm 426 marchin	accesorios pers.
76	1	corta pluma con cubiertos con forro	accesorios pers.
77	1	juego de cubiertos plegable con forro	accesorios pers.
78	1	gas pimienta chico	accesorios pers.
79	1	gas pimienta grande	accesorios pers.
80	5	pito con brujula y termometro	accesorios pers.`;

const products = [];
for (const line of raw.split('\n')) {
  const parts = line.split('\t');
  if (parts.length >= 4) {
    const stock = parseInt(parts[1], 10);
    const name = parts[2].trim();
    const cat = catMap[parts[3].trim()] || parts[3].trim();
    products.push({ stock, name, category: cat });
  }
}

async function seed() {
  console.log(`Seeding ${products.length} real products...`);

  // Truncate existing products
  const { error: delErr } = await supabase.from('ej_products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) {
    console.error('Delete error:', delErr);
    // Fallback: try truncate via RPC if available
  }

  // Insert in batches of 50
  const batch = products.map(p => ({
    id: crypto.randomUUID(),
    name: p.name,
    category: p.category,
    price: 'Gs. 0',
    price_before: null,
    description: '',
    brand: '',
    specs: '',
    stock: p.stock,
    weight: '',
    image_url: '',
    is_new: false,
    featured: false,
    cost_price: '',
  }));

  const { data, error } = await supabase.from('ej_products').insert(batch).select();
  if (error) {
    console.error('Insert error:', error);
    process.exit(1);
  }
  console.log(`Inserted ${data.length} products`);

  // Verify
  const { count } = await supabase.from('ej_products').select('*', { count: 'exact', head: true });
  console.log(`Total in DB: ${count}`);
}

seed().catch(e => { console.error(e); process.exit(1); });
