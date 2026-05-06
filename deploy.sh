#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

VERSION=$(git rev-parse --short HEAD)
DATE=$(date +%Y%m%d-%H%M)
TAG="elviajero:prod-$VERSION-$DATE"
LATEST="elviajero:prod"

echo "--- build: $TAG"
npm run build

echo "--- docker: $TAG"
docker build -t "$TAG" -t "$LATEST" .

echo "--- deploy: elviajero_web"
docker stack deploy -c docker-compose.yml elviajero --with-registry-auth --resolve-image always

echo "--- done: $TAG"
