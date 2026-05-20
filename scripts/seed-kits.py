#!/usr/bin/env python3
"""Insert 5 kits into ej_kits table using urllib"""
import json, urllib.request

API = "https://api.supabase.com/v1/projects/qyvokpribmbrosafntqa/database/query"
TOKEN = "sbp_e1bbe93b37047b37e7f6b27833053843ba49d437"

kits = [
    {"name": "Kit Camping Esencial", "description": "Todo lo que necesit\u00e1s para tu primera salida de camping", "price": "Gs. 450.000", "original_price": "Gs. 520.000", "badge": "Ahorr\u00e1 70.000 Gs.", "category": "Camping",
     "items": [{"name": "Bolsa de Dormir 0\u00b0C", "price": "Gs. 180.000", "quantity": 1}, {"name": "Colchoneta Inflable", "price": "Gs. 120.000", "quantity": 1}, {"name": "Linterna LED 1000lm", "price": "Gs. 65.000", "quantity": 1}, {"name": "Kit de Utensilios de Camping", "price": "Gs. 45.000", "quantity": 1}, {"name": "Mochila 60L Impermeable", "price": "Gs. 110.000", "quantity": 1}]},
    {"name": "Kit Pesca Completo", "description": "Equipate para la mejor jornada de pesca", "price": "Gs. 350.000", "original_price": "Gs. 410.000", "badge": "Ahorr\u00e1 60.000 Gs.", "category": "Pesca",
     "items": [{"name": "Ca\u00f1a Telesc\u00f3pica 3m", "price": "Gs. 150.000", "quantity": 1}, {"name": "Se\u00f1uelos Surtidos 10u", "price": "Gs. 45.000", "quantity": 1}, {"name": "Caja de Pesca", "price": "Gs. 80.000", "quantity": 1}, {"name": "Anzuelos Surtidos", "price": "Gs. 25.000", "quantity": 1}, {"name": "Hilo de Pesca 100m", "price": "Gs. 40.000", "quantity": 1}]},
    {"name": "Pack Aventurero", "description": "Combinaci\u00f3n ideal para camping y pesca", "price": "Gs. 750.000", "original_price": "Gs. 890.000", "badge": "Ahorr\u00e1 140.000 Gs.", "category": "Camping",
     "items": [{"name": "Carpa 4 Personas", "price": "Gs. 380.000", "quantity": 1}, {"name": "Bolsa de Dormir 0\u00b0C", "price": "Gs. 180.000", "quantity": 1}, {"name": "Linterna LED 1000lm", "price": "Gs. 65.000", "quantity": 1}, {"name": "Kit de Cocina Camping", "price": "Gs. 55.000", "quantity": 1}, {"name": "Mochila 60L Impermeable", "price": "Gs. 110.000", "quantity": 1}, {"name": "Silla Plegable", "price": "Gs. 100.000", "quantity": 1}]},
    {"name": "Kit Supervivencia", "description": "Equipo t\u00e1ctico para emergencias y exploraci\u00f3n", "price": "Gs. 250.000", "original_price": "Gs. 310.000", "badge": "Ahorr\u00e1 60.000 Gs.", "category": "Accesorios",
     "items": [{"name": "Cuchillo Multiuso", "price": "Gs. 85.000", "quantity": 1}, {"name": "Kit Botiqu\u00edn", "price": "Gs. 50.000", "quantity": 1}, {"name": "Linterna LED 1000lm", "price": "Gs. 65.000", "quantity": 1}, {"name": "Br\u00fajula", "price": "Gs. 35.000", "quantity": 1}, {"name": "Silbato de Emergencia", "price": "Gs. 15.000", "quantity": 1}]},
    {"name": "Auto Pack Viajero", "description": "Para los que viajan en auto con estilo y seguridad", "price": "Gs. 550.000", "original_price": "Gs. 650.000", "badge": "Ahorr\u00e1 100.000 Gs.", "category": "Accesorios para Veh\u00edculos",
     "items": [{"name": "Organizador de Ba\u00fal", "price": "Gs. 120.000", "quantity": 1}, {"name": "Soporte para Celular", "price": "Gs. 45.000", "quantity": 1}, {"name": "Cargador 12V", "price": "Gs. 35.000", "quantity": 1}, {"name": "Kit de Seguridad Vial", "price": "Gs. 80.000", "quantity": 1}, {"name": "Conservadora 20L", "price": "Gs. 180.000", "quantity": 1}, {"name": "Limpiaparabrisas", "price": "Gs. 40.000", "quantity": 1}]},
]

for kit in kits:
    items_json = json.dumps(kit['items'])
    sql = "INSERT INTO ej_kits (name, description, price, original_price, items, image_url, badge, category) VALUES ('{}', '{}', '{}', '{}', '{}'::jsonb, '', '{}', '{}');".format(
        kit['name'].replace("'", "''"),
        kit['description'].replace("'", "''"),
        kit['price'].replace("'", "''"),
        kit['original_price'].replace("'", "''"),
        items_json.replace("'", "''"),
        kit['badge'].replace("'", "''"),
        kit['category'].replace("'", "''"),
    )
    
    payload = json.dumps({"query": sql}).encode('utf-8')
    req = urllib.request.Request(API, data=payload, headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
        "User-Agent": "curl/8.4.0",
        "Accept": "application/json",
    }, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"OK: {kit['name']}")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"ERROR [{kit['name']}]: {body[:300]}")

# Verify
payload = json.dumps({"query": "SELECT name, price, badge FROM ej_kits ORDER BY name"}).encode('utf-8')
req = urllib.request.Request(API, data=payload, headers={
    "Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json", "User-Agent": "curl/8.4.0"
}, method="POST")
try:
    with urllib.request.urlopen(req) as resp:
        print(f"\nVerify: {resp.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"Verify ERROR: {e.read().decode()[:200]}")
