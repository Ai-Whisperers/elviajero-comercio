#!/usr/bin/env python3
"""Seed El Viajero sample data via Supabase REST API"""
import subprocess, json

SVC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMxODE1NSwiZXhwOjIwOTE4OTQxNTV9.rphBsAVMuI_2X8RCU7D0JiGd8pqqdpcQ7vpUrirU06g"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTgxNTUsImV4cCI6MjA5MTg5NDE1NX0.ww_-gt4beuTcr_HbUCv0HmuKCw-J-HWTAI441yDSXRg"
URL = "https://qyvokpribmbrosafntqa.supabase.co"

def curl(method, path, data=None):
    hdrs = [f'apikey: {SVC_KEY}', 'Content-Type: application/json']
    if method == 'POST':
        hdrs.append('Prefer: resolution=merge-duplicates')
    cmd = ['curl', '-s', '-X', method, f'{URL}/rest/v1/{path}']
    for h in hdrs:
        cmd.extend(['-H', h])
    if data:
        cmd.extend(['--data-binary', json.dumps(data)])
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
    if result.returncode != 0:
        return f"CURL ERROR: {result.stderr[:100]}"
    body = result.stdout
    if 'Invalid API key' in body or 'PGRST301' in body:
        return f"AUTH FAIL: {body[:100]}"
    if 'PGRST204' in body:
        j = json.loads(body)
        return f"SCHEMA ERROR: {j.get('message','?')[:120]}"
    return f"OK ({len(body)} bytes)"

def count(path):
    cmd = ['curl', '-s', f'{URL}/rest/v1/{path}?select=count', '-H', f'apikey: {SVC_KEY}']
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
    try:
        return json.loads(result.stdout)[0]['count']
    except:
        return f"ERR: {result.stdout[:80]}"

# Test auth
print("Auth test:", count("ej_categories"))

# Subscribers
r = curl("POST", "ej_subscribers", [
    {"email": "contacto@elviajero.com.py"},
    {"email": "ofertas@elviajero.com.py"},
    {"email": "cliente@email.com"},
])
print(f"Subscribers: {r}")

# Reviews
r = curl("POST", "ej_reviews", [
    {"product_name": "Carpa 4 Personas", "user_name": "Carlos Mendoza", "rating": 5, "text": "Excelente atencion. Encontre todo para mi viaje."},
    {"product_name": "Bolsa de Dormir 0°C", "user_name": "Maria Gonzalez", "rating": 5, "text": "Me asesoraron muy bien."},
    {"product_name": "Silla Plegable Pescador", "user_name": "Luis Ramirez", "rating": 4, "text": "Todo de buena calidad."},
    {"product_name": "Linterna LED 1000lm", "user_name": "Ana Benitez", "rating": 5, "text": "Productos unicos."},
])
print(f"Reviews: {r}")

# Promos
r = curl("POST", "ej_promo_codes", [
    {"code": "CAMPING10", "type": "percentage", "value": 10, "max_uses": 100},
    {"code": "ENVIOGRATIS", "type": "percentage", "value": 15, "max_uses": 100},
    {"code": "BIENVENIDO", "type": "percentage", "value": 20, "max_uses": 100},
])
print(f"Promos: {r}")

# B2B
r = curl("POST", "ej_b2b_customers", [
    {"business_name": "Constructora MRA S.A.", "contact_name": "Carlos Benitez", "phone": "595981111222", "email": "carlos@constructora.com.py", "ruc": "123456-1"},
    {"business_name": "Colegio San Jose", "contact_name": "Maria Lopez", "phone": "595982333444", "email": "maria@sanjose.edu.py", "ruc": "789012-1"},
    {"business_name": "Grupo Adventura", "contact_name": "Pedro Gonzalez", "phone": "595983555666", "email": "pedro@grupoaventura.com.py", "ruc": "345678-1"},
])
print(f"B2B: {r}")

# Orders
r = curl("POST", "ej_orders", [
    {"id": "ORD-001", "items": '[{"name":"Carpa 4 Personas","price":450000,"qty":1}]', "total": "450000", "status": "entregado", "payment_method": "Pagopar"},
    {"id": "ORD-002", "items": '[{"name":"Bolsa de Dormir 0°C","price":180000,"qty":2},{"name":"Linterna LED 1000lm","price":65000,"qty":1}]', "total": "425000", "status": "pendiente", "payment_method": "Pagopar"},
    {"id": "ORD-003", "items": '[{"name":"Silla Plegable Pescador","price":85000,"qty":4},{"name":"Caña Telescopica 3m","price":140000,"qty":2}]', "total": "620000", "status": "enviado", "payment_method": "Pagopar"},
])
print(f"Orders: {r}")

# Stock alerts
r = curl("POST", "ej_stock_alerts", [
    {"product_name": "Carpa 4 Personas", "phone": "595990000000"},
])
print(f"Stock alerts: {r}")

print("\n=== COUNTS ===")
for t in ["ej_subscribers","ej_reviews","ej_promo_codes","ej_b2b_customers","ej_orders","ej_stock_alerts"]:
    print(f"{t}: {count(t)}")
