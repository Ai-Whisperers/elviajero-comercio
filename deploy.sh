#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
set -a
source ./.env
set +a

VERSION=$(git rev-parse --short HEAD)
DATE=$(date +%Y%m%d-%H%M)
TAG="elviajero:prod-$VERSION-$DATE"
LATEST="elviajero:prod"

echo "--- build: $TAG"
npm run build

echo "--- docker: $TAG"
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -t "$TAG" -t "$LATEST" .

echo "--- deploy: elviajero_web (rolling update)"
docker service update --image "$TAG" elviajero_web

echo "--- done: $TAG"
