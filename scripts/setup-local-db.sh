#!/usr/bin/env bash
# Local dev: npm install, Docker Postgres, Prisma migrate + seed.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Creating default .env for local Docker Postgres + CMS."
  cat > .env << 'ENVFILE'
NODE_ENV=development
PORT=3100
NEXT_PUBLIC_SITE_URL=http://localhost:3100
DATABASE_URL=postgresql://acep:acep_dev@localhost:54320/acep
CMS_ADMIN_EMAIL=admin@acep.africa
CMS_ADMIN_PASSWORD=AcepLocalDev-2026
CMS_ADMIN_NAME="ACEP Africa Administrator"
ENVFILE
fi

echo "npm install (runs prisma generate via postinstall)..."
npm install

if ! docker info &>/dev/null; then
  echo "Error: Docker is not running. Open Docker Desktop, then re-run: ./scripts/setup-local-db.sh"
  exit 1
fi

echo "Starting Postgres (profile with-db)..."
docker compose --profile with-db up -d postgres

echo "Waiting for Postgres to accept connections..."
for i in $(seq 1 30); do
  if docker compose --profile with-db exec -T postgres pg_isready -U acep -d acep &>/dev/null; then
    break
  fi
  sleep 1
done

set -a
# shellcheck disable=SC1091
source .env
set +a

echo "Prisma migrate + generate + seed..."
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

echo ""
echo "Done. Log in: http://localhost:3100/login (CMS → /admin)"
echo "  Email:    (see CMS_ADMIN_EMAIL in .env)"
echo "  Password: (see CMS_ADMIN_PASSWORD in .env)"
echo "Then run: npm run dev"
