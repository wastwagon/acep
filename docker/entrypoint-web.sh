#!/bin/sh
set -e
cd /app

if [ -n "${DATABASE_URL:-}" ]; then
  echo "[entrypoint] Running Prisma migrations..."
  node node_modules/prisma/build/index.js migrate deploy
  echo "[entrypoint] Running database seed..."
  node prisma/seed.cjs
  echo "[entrypoint] Seed completed."
else
  echo "[entrypoint] DATABASE_URL is not set; skipping migrations and seed."
fi

exec node server.js
