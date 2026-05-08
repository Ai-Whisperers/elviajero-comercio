#!/usr/bin/env python3
"""Seed El Viajero sample data via Supabase REST API"""
import json, urllib.request

SVC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMxODE1NSwiZXhwOjIwOTE4OTQxNTV9.rphBsAVMuI_2X8RCU7D0JiGd8pqqdpcQ7vpUrirU06g"
URL = "https://qyvokpribmbrosafntqa.supabase.co"

def post(path, data):
    req = urllib.request.Request(
        f"{URL}/rest/v1/{path}",
        data=json.dumps(data).encode(),
        headers={
            "apikey": SVC_KEY,
            "Authorization": f"Bearer {SVC_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
        },
        method="POST",
    )
    try:
        resp = urllib.request.urlopen(req)
        return f"OK ({resp.status})"
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return f"FAIL: {body[:120]}"

def count(path):
    try:
        req = urllib.request.Request(
            f"{URL}/rest/v1/{path}?select=count",
            headers={"apikey": SVC_KEY, "Authorization": f"Bearer {SVC_KEY}"},
        )
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read())[0]["count"]
    except:
        return "ERR"

# Seed subscribers
print("Subscribers:", post("ej_subscribers", [
    {"email": "contacto@elviajero.com.py"},
    {"email": "ofertas@elviajero.com.py"},
    {"email": "cliente@email.com"},
]))

# Seed reviews
print("Reviews:", post("ej_reviews", [
    {"product_name": "Carpa 4 Personas", "user_name": "Carlos Mendoza", "rating": 5, "text": "Excelente atencion. Encontre todo para mi viaje."},
    {"product_name": "Bolsa de Dormir 0°C", "user_name": "Maria Gonzalez", "rating": 5, "text": "Me asesoraron muy bien para elegir mi caña."},
    {"product_name": "Silla Plegable Pescador", "user_name": "Luis Ramirez", "rating": 4, "text": "Todo de buena calidad y a buen precio."},
    {"product_name": "Linterna LED 1000lm", "user_name": "Ana Benitez", "rating": 5, "text": "Productos que no se consiguen en otros lados."},
]))

# Seed promo codes
print("Promos:", post("ej_promo_codes", [
    {"code": "CAMPING10", "type": "percentage", "value": 10, "max_uses": 100},
    {"code": "ENVIOGRATIS", "type": "percentage", "value": 15, "max_uses": 100},
    {"code": "BIENVENIDO", "type": "percentage", "value": 20, "max_uses": 100},
]))

# Seed B2B customers
print("B2B:", post("ej_b2b_customers", [
    {"business_name": "Constructora MRA S.A.", "contact_name": "Carlos Benitez", "phone": "595981111222", "email": "carlos@constructora.com.py", "ruc": "123456-1"},
    {"business_name": "Colegio San Jose", "contact_name": "Maria Lopez", "phone": "595982333444", "email": "maria@sanjose.edu.py", "ruc": "789012-1"},
    {"business_name": "Grupo Adventura", "contact_name": "Pedro Gonzalez", "phone": "595983555666", "email": "pedro@grupoaventura.com.py", "ruc": "345678-1"},
]))

# Seed orders (items as JSON string)
print("Orders:", post("ej_orders", [
    {"id": "ORD-001", "items": json.dumps([{"name":"Carpa 4 Personas","price":450000,"qty":1}]), "total": "450000", "status": "entregado", "payment_method": "Pagopar"},
    {"id": "ORD-002", "items": json.dumps([{"name":"Bolsa de Dormir 0°C","price":180000,"qty":2},{"name":"Linterna LED 1000lm","price":65000,"qty":1}]), "total": "425000", "status": "pendiente", "payment_method": "Pagopar"},
    {"id": "ORD-003", "items": json.dumps([{"name":"Silla Plegable Pescador","price":85000,"qty":4},{"name":"Caña Telescopica 3m","price":140000,"qty":2}]), "total": "620000", "status": "enviado", "payment_method": "Pagopar"},
]))

# Seed stock alerts
print("Stock alerts:", post("ej_stock_alerts", [
    {"product_name": "Carpa 4 Personas", "phone": "595990000000"},
]))

print("\n=== COUNTS ===")
for t in ["ej_subscribers","ej_reviews","ej_promo_codes","ej_b2b_customers","ej_orders","ej_stock_alerts"]:
    print(f"{t}: {count(t)}")
