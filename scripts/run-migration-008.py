"""Run migration 008 via Supabase Management API"""
import json
import urllib.request
import re

SUPABASE_URL = "https://api.supabase.com/v1/projects/qyvokpribmbrosafntqa/database/query"
API_KEY = "sbp_e1bbe93b37047b37e7f6b27833053843ba49d437"

with open('/root/elviajero/migrations/008_create_site_config.sql', 'r') as f:
    sql = f.read()

# Clean up
sql_clean = re.sub(r'COMMENT ON.*?;', '', sql, flags=re.DOTALL)
sql_clean = re.sub(r'--.*\n', '\n', sql_clean)

statements = [s.strip() for s in sql_clean.split(';') if s.strip()]

for i, stmt in enumerate(statements):
    if not stmt:
        continue
    payload = json.dumps({"query": stmt}).encode('utf-8')
    req = urllib.request.Request(
        SUPABASE_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            result = resp.read().decode()
            print(f"[{i+1}/{len(statements)}] OK: {result[:100]}")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"[{i+1}/{len(statements)}] ERROR {e.code}: {body[:200]}")

print("\nDone!")
