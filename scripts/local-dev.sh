#!/usr/bin/env bash
# One command: Postgres in Docker (port 54320) + Next.js on :3100
set -euo pipefail
cd "$(dirname "$0")/.."

if lsof -iTCP:3100 -sTCP:LISTEN -n -P 2>/dev/null | grep -q .; then
  echo "Port 3100 is already in use. Nothing will start until you free the port."
  lsof -iTCP:3100 -sTCP:LISTEN -n -P
  echo ""
  echo "If the ACEP dev container is bound there:  docker stop acep-web-dev"
  echo "Then run:  npm run dev   or   bash scripts/local-dev.sh"
  exit 1
fi

echo "Starting Postgres (acep-postgres on localhost:54320)..."
docker compose --profile with-db up -d postgres

echo "Waiting for Postgres to be ready..."
for i in $(seq 1 40); do
  if docker compose --profile with-db exec -T postgres pg_isready -U acep -d acep 2>/dev/null; then
    break
  fi
  if [ "$i" -eq 40 ]; then
    echo "Postgres did not become ready. Check: docker ps --filter name=acep-postgres / docker logs acep-postgres"
    exit 1
  fi
  sleep 1
done

echo "Starting Next.js (http://localhost:3100) — Ctrl+C to stop"
exec npm run dev
