#!/usr/bin/env python3
"""Verify Supabase key and seed data"""
import json, base64, subprocess

SVC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMxODE1NSwiZXhwOjIwOTE4OTQxNTV9.rphBsAVMuI_2X8RCU7D0JiGd8pqqdpcQ7vpUrirU06g"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTgxNTUsImV4cCI6MjA5MTg5NDE1NX0.ww_-gt4beuTcr_HbUCv0HmuKCw-J-HWTAI441yDSXRg"
URL = "https://qyvokpribmbrosafntqa.supabase.co"

# Decode the JWT to verify
parts = SVC_KEY.split(".")
header = json.loads(base64.urlsafe_b64decode(parts[0] + "==").decode())
payload = json.loads(base64.urlsafe_b64decode(parts[1] + "==").decode())
print(f"Header alg: {header.get('alg')}")
print(f"Payload role: {payload.get('role')}")
print(f"Payload iss: {payload.get('iss')}")
print(f"Payload iat: {payload.get('iat')}")

# The key looks valid - test both with anon for apikey and service for auth
result = subprocess.run(
    ["curl", "-s", f"{URL}/rest/v1/ej_categories?select=count",
     "-H", f"apikey: {ANON_KEY}",
     "-H", f"Authorization: Bearer {SVC_KEY}"],
    capture_output=True, text=True, timeout=10
)
print(f"\nAuth with anon+bearer: {result.stdout[:100]}")

result = subprocess.run(
    ["curl", "-s", f"{URL}/rest/v1/ej_categories?select=count",
     "-H", f"apikey: {SVC_KEY}"],
    capture_output=True, text=True, timeout=10
)
print(f"Auth with svc only: {result.stdout[:100]}")
