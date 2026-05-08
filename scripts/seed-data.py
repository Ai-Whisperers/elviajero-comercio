#!/usr/bin/env python3
"""Generate seed SQL for El Viajero from content/es.json"""
import json

with open("/root/elviajero/content/es.json") as f:
    c = json.load(f)

prods = c.get("home",{}).get("productCatalog",{}).get("products",[])
cats = c.get("home",{}).get("productCatalog",{}).get("categories",[])
testimonials = c.get("home",{}).get("testimonials",[])
promotions = c.get("promociones",{}).get("promotions",[])

sql = []

# Categories (are strings)
for cat in cats:
    if cat:
        safe = cat.replace("'","''")
        sql.append(f"INSERT INTO ej_categories (name) VALUES ('{safe}') ON CONFLICT (name) DO NOTHING;")

# Products
for p in prods:
    n = p.get("name","").replace("'", "''")
    slug = n.lower().replace(" ","-")
    for ch in ["'",'"',"/","\\","(",")","&","|","!","?","¿","¡",":","."]:
        slug = slug.replace(ch,"")
    slug = slug[:60] or "producto"
    cat = p.get("category","").replace("'", "''")
    price_str = p.get("price","Gs. 0").replace("Gs. ","").replace(".","")
    try:
        price = int(price_str)
    except:
        price = 0
    desc = p.get("description","").replace("'", "''")
    brand = p.get("brand","").replace("'", "''")
    specs = p.get("specs","").replace("'", "''")
    img = p.get("imageUrl","")
    is_new = "true" if p.get("isNew", False) else "false"
    
    if n and price > 0:
        sql.append(f"INSERT INTO ej_products (name, slug, category, price, description, brand, specs, image_url, is_new, featured, stock) VALUES ('{n}', '{slug}', '{cat}', {price}, '{desc}', '{brand}', '{specs}', '{img}', {is_new}, true, 10) ON CONFLICT DO NOTHING;")

# Reviews
for t in testimonials:
    name = t.get("name","Anónimo").replace("'", "''")
    txt = t.get("text","").replace("'", "''")
    rating = t.get("rating", 5)
    sql.append(f"INSERT INTO ej_reviews (product_name, user_name, rating, text) VALUES ('Producto', '{name}', {rating}, '{txt}') ON CONFLICT DO NOTHING;")

# Promos
promo_names = [
    ("CAMPING10", "percentage", 10),
    ("ENVIOGRATIS", "percentage", 15),
    ("BIENVENIDO", "percentage", 20),
]
for code, typ, val in promo_names:
    sql.append(f"INSERT INTO ej_promo_codes (code, type, value, max_uses) VALUES ('{code}', '{typ}', {val}, 100) ON CONFLICT DO NOTHING;")

# Subscribers
for email in ['contacto@elviajero.com.py', 'ofertas@elviajero.com.py', 'cliente@email.com']:
    sql.append(f"INSERT INTO ej_subscribers (email) VALUES ('{email}') ON CONFLICT DO NOTHING;")

# B2B customers
b2bs = [
    ("Constructora MRA S.A.", "Carlos Benitez", "595981111222", "carlos@constructora.com.py", "123456-1"),
    ("Colegio San Jose", "Maria Lopez", "595982333444", "maria@sanjose.edu.py", "789012-1"),
    ("Grupo Adventura", "Pedro Gonzalez", "595983555666", "pedro@grupoaventura.com.py", "345678-1"),
]
for biz, cnt, ph, em, ruc in b2bs:
    sql.append(f"INSERT INTO ej_b2b_customers (business_name, contact_name, phone, email, ruc) VALUES ('{biz}', '{cnt}', '{ph}', '{em}', '{ruc}') ON CONFLICT DO NOTHING;")

# Orders
orders = [
    ("ORD-001", '[{"name":"Carpa 4 Personas","price":450000,"qty":1}]', "Juan Perez", "595981123456", "450000", "entregado"),
    ("ORD-002", '[{"name":"Bolsa de Dormir 0°C","price":180000,"qty":2},{"name":"Linterna LED 1000lm","price":65000,"qty":1}]', "Ana Martinez", "595984777888", "425000", "pendiente"),
    ("ORD-003", '[{"name":"Silla Plegable Pescador","price":85000,"qty":4},{"name":"Caña Telescopica 3m","price":140000,"qty":2}]', "Luis Ramirez", "595985555777", "620000", "enviado"),
]
for oid, items, name, phone, total, status in orders:
    sql.append(f"INSERT INTO ej_orders (id, items, customer_name, customer_phone, total, status, payment_method) VALUES ('{oid}', '{items}', '{name}', '{phone}', '{total}', '{status}', 'Pagopar') ON CONFLICT (id) DO NOTHING;")

# Stock alerts
sql.append("INSERT INTO ej_stock_alerts (product_name, email) VALUES ('Carpa 4 Personas', 'alertas@elviajero.com.py') ON CONFLICT DO NOTHING;")

with open("/tmp/elviajero-seed.sql", "w") as f:
    f.write("-- El Viajero sample data seed\n-- Run in Supabase SQL Editor\n\n" + "\n".join(sql))

print(f"Generated {len(sql)} SQL statements")
print(f"Written to /tmp/elviajero-seed.sql")
print(f"\nTables seeded: categories={len(cats)}, products={len(prods)}, reviews={len(testimonials)}, orders=3, promos=3, b2b=3, subscribers=3")
