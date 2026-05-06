#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

VERSION=$(git rev-parse --short HEAD)
DATE=$(date +%Y%m%d-%H%M)
TAG="elviajero-comercio:prod-$VERSION-$DATE"
LATEST="elviajero-comercio:prod"

echo "--- build: $TAG"
npm run build

echo "--- docker: $TAG"
docker build -t "$TAG" -t "$LATEST" .

echo "--- deploy: elviajero-comercio_web"
docker stack deploy -c docker-compose.yml elviajero-comercio --with-registry-auth --resolve-image always

echo "--- done: $TAG"
