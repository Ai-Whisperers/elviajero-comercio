#!/bin/bash
# Deploy El Viajero with Supabase
set -e

cd /root/elviajero-comercio

echo "=== Building Next.js ==="
npm run build

echo "=== Removing old db volume (no longer needed) ==="
docker volume rm elviajero-comercio_viajero_data 2>/dev/null || true

echo "=== Building Docker image ==="
docker build -t elviajero-comercio:prod .

echo "=== Deploying stack ==="
docker stack deploy -c docker-compose.yml elviajero-comercio --detach=false

echo "=== Done ==="
echo "Run the seed script after deployment if tables are empty:"
echo "  cd /root/elviajero-comercio"
echo "  npx tsx scripts/seed.ts"
