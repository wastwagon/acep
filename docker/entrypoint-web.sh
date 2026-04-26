#!/bin/sh
set -e
cd /app

if [ -n "${DATABASE_URL:-}" ]; then
  # One-time P3009 recovery from Coolify without host SSH: set in the web service env, deploy once, then remove.
  if [ -n "${PRISMA_RESOLVE_ROLLED_BACK_MIGRATION:-}" ]; then
    echo "[entrypoint] PRISMA_RESOLVE_ROLLED_BACK_MIGRATION is set; running: migrate resolve --rolled-back ${PRISMA_RESOLVE_ROLLED_BACK_MIGRATION}"
    node node_modules/prisma/build/index.js migrate resolve --rolled-back "${PRISMA_RESOLVE_ROLLED_BACK_MIGRATION}"
  fi
  echo "[entrypoint] Running Prisma migrations..."
  if ! node node_modules/prisma/build/index.js migrate deploy; then
    echo "[entrypoint] migrate deploy failed. If you see P3009 (failed migration), see prisma/ops/PORTAL_MIGRATION_P3009.txt in the image (/app) or the repo."
    exit 1
  fi
  echo "[entrypoint] Running database seed..."
  node prisma/seed.cjs
  echo "[entrypoint] Seed completed."
else
  echo "[entrypoint] DATABASE_URL is not set; skipping migrations and seed."
fi

exec node server.js
