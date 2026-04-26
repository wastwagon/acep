#!/usr/bin/env bash
# Health check for local ACEP dev: Docker, Postgres, Prisma, optional Next on :3100
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
FAIL=0
step() { echo ""; echo "=== $* ==="; }

step "1) Docker daemon"
if docker info &>/dev/null; then
  echo "OK: Docker is running."
else
  echo "FAIL: Docker is not running. Open Docker Desktop."
  exit 1
fi

step "2) ACEP Postgres container (acep-postgres)"
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^acep-postgres$'; then
  echo "OK: acep-postgres is up."
  docker ps --filter name=acep-postgres --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
else
  echo "FAIL: acep-postgres is not running. Start: docker compose --profile with-db up -d postgres"
  FAIL=1
fi

step "3) .env and DATABASE_URL"
if [ ! -f .env ]; then
  echo "FAIL: .env missing. Run: npm run setup:local"
  exit 1
fi
# shellcheck disable=SC1091
set -a
source .env
set +a
DBPORT=$(echo "$DATABASE_URL" | sed -E 's|.*@localhost:([0-9]+)/.*|\1|')
echo "DATABASE_URL port: ${DBPORT:-?} (use 54320 with docker-compose with-db to avoid local Postgres on 5432)"
echo "OK: .env loaded."
PORT="${DBPORT:-54320}"

step "4) TCP to Postgres (from host)"
if command -v nc &>/dev/null; then
  if nc -z 127.0.0.1 "$PORT" 2>/dev/null; then
    echo "OK: 127.0.0.1:$PORT accepts connections."
  else
    echo "FAIL: Nothing listening on 127.0.0.1:$PORT (start postgres or fix DATABASE_URL)."
    FAIL=1
  fi
else
  echo "SKIP: nc not installed; using psql/prisma only."
fi

step "5) Prisma: validate + migrate status + query"
if [ ! -d node_modules/@prisma/client ]; then
  echo "RUN: npm install"
  npm install
fi
npx prisma validate
npx prisma migrate status
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.\$connect()
  .then(() => p.cmsUser.count())
  .then((n) => { console.log('OK: Prisma query CmsUser count =', n); return p.\$disconnect(); })
  .catch((e) => { console.error('FAIL: Prisma:', e.message); process.exit(1); });
" && echo "OK: Prisma client can connect and query." || { echo "FAIL: Prisma DB access"; FAIL=1; }

step "6) Next.js on :3100 (optional — run npm run dev first)"
HTTP_FAIL=0
if CODE=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 2 http://127.0.0.1:3100/ 2>/dev/null) && [ -n "$CODE" ] && [ "$CODE" != "000" ]; then
  echo "GET / => HTTP $CODE"
  L=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 2 -X POST http://127.0.0.1:3100/api/admin/auth/login -H 'Content-Type: application/json' -d '{}')
  echo "POST /api/admin/auth/login (empty JSON) => HTTP $L  (expect: GET 200, login 400)"
  if [ "$CODE" = "500" ] || [ "$L" = "500" ]; then
    echo "FAIL: 500 = Next server error. If you use 'docker compose' for the web app, the web_node_modules volume may lack @prisma/client."
    echo "  Fix: run on host: cd \"$ROOT\" && npm install && npm run dev  — OR: docker compose up -d --build web && wait for [docker-entrypoint] install."
    HTTP_FAIL=1
  fi
else
  echo "SKIP: Nothing on :3100 — start dev: cd \"$ROOT\" && npm run dev  (use host dev + Docker Postgres: docker compose --profile with-db up -d postgres)"
fi

echo ""
if [ "$FAIL" = "1" ] || [ "$HTTP_FAIL" = "1" ]; then
  echo "Database checks may still be OK; fix the HTTP/Next issue above for a working site."
  [ "$FAIL" = "1" ] && exit 1
  [ "$HTTP_FAIL" = "1" ] && exit 1
fi
echo "All checks passed (or only skipped optional Next step)."
