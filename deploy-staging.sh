#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

ENV_FILE=".env.staging"
STACK="elviajero_staging"
SERVICE="${STACK}_web"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE. Copy .env.staging.example to .env.staging and fill staging Supabase keys."
  exit 1
fi

set -a
source "./$ENV_FILE"
set +a

: "${NEXT_PUBLIC_SUPABASE_URL:?Missing NEXT_PUBLIC_SUPABASE_URL in $ENV_FILE}"
: "${NEXT_PUBLIC_SUPABASE_ANON_KEY:?Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in $ENV_FILE}"
: "${SUPABASE_SERVICE_ROLE_KEY:?Missing SUPABASE_SERVICE_ROLE_KEY in $ENV_FILE}"
: "${NEXT_PUBLIC_BASE_URL:?Missing NEXT_PUBLIC_BASE_URL in $ENV_FILE}"

VERSION=$(git rev-parse --short HEAD)
DATE=$(date +%Y%m%d-%H%M)
BRANCH=$(git rev-parse --abbrev-ref HEAD | tr '/_' '--')
TAG="elviajero:staging-$BRANCH-$VERSION-$DATE"
LATEST="elviajero:staging"
export IMAGE_TAG="$TAG"

echo "--- build staging: $TAG"
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -t "$TAG" -t "$LATEST" .

echo "--- deploy staging stack: $STACK"
docker stack deploy -c docker-compose.staging.yml "$STACK" --with-registry-auth

if docker service inspect "$SERVICE" >/dev/null 2>&1; then
  docker service update --image "$TAG" "$SERVICE"
fi

echo "--- staging done: $TAG"
echo "--- verify: $NEXT_PUBLIC_BASE_URL/api/health"
