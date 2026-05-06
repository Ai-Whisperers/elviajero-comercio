#!/bin/bash
# Deploy El Viajero with Supabase
set -e

cd /root/elviajero

echo "=== Building Next.js ==="
npm run build

echo "=== Removing old db volume (no longer needed) ==="
docker volume rm elviajero_viajero_data 2>/dev/null || true

echo "=== Building Docker image ==="
docker build -t elviajero:prod .

echo "=== Deploying stack ==="
docker stack deploy -c docker-compose.yml elviajero --detach=false

echo "=== Done ==="
echo "Run the seed script after deployment if tables are empty:"
echo "  cd /root/elviajero"
echo "  npx tsx scripts/seed.ts"
