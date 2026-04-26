#!/usr/bin/env sh
# Unblocks P3009 for 20260426110650_add_portal_user_contributions.
# Use when the web app restarts in a loop and you cannot "exec" into web
# (process exits too fast). Run from a machine with DB access, same DATABASE_URL
# as the stack:
#
#   # From a shell on the Coolify host, if you can reach Postgres:
#   export DATABASE_URL="postgresql://USER:PASS@localhost:PUBLISHED_PG_PORT/acep"
#   ./scripts/resolve-failed-migration-20260426110650.sh
#
#   # Or with the built web image (avoids a local node_modules; needs same Docker network
#   #   as compose so "postgres" hostname works), e.g.:
#   docker run --rm -e DATABASE_URL=postgresql://acep:...@postgres:5432/acep \
#     --network acep_default your-registry/web:tag sh /app/scripts/resolve-failed-migration-20260426110650.sh
#
# After success, web should pass migrate and Traefik will show the site.
set -e
MIGRATION_NAME="20260426110650_add_portal_user_contributions"
if [ -z "${DATABASE_URL}" ]; then
  echo "DATABASE_URL is not set" >&2
  exit 1
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [ -d "${ROOT}/node_modules/prisma" ]; then
  PRISMA_CLI="${ROOT}/node_modules/prisma/build/index.js"
  (cd "${ROOT}" && node "${PRISMA_CLI}" migrate resolve --rolled-back "${MIGRATION_NAME}")
  (cd "${ROOT}" && node "${PRISMA_CLI}" migrate deploy)
elif [ -d /app/node_modules/prisma ]; then
  (cd /app && node /app/node_modules/prisma/build/index.js migrate resolve --rolled-back "${MIGRATION_NAME}")
  (cd /app && node /app/node_modules/prisma/build/index.js migrate deploy)
else
  echo "No Prisma CLI found. Install deps (npm install) in repo, or run inside web image at /app" >&2
  exit 1
fi
echo "Done: re-run the web service / redeploy; Traefik 'no available server' should clear once web stays healthy."
