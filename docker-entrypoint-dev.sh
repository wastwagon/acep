#!/bin/sh
set -e
cd /app

# Named volume hides image layers; install when Next is missing or stack is incomplete
# (e.g. only `next` present but not @prisma/client after adding Prisma).
if [ ! -f node_modules/.bin/next ] || [ ! -d node_modules/@prisma/client ] || [ ! -d node_modules/.prisma ]; then
  echo "[docker-entrypoint] Installing dependencies (Next / Prisma required)..."
  npm ci
fi
if [ ! -d node_modules/.prisma/client ] && [ -f node_modules/.bin/prisma ]; then
  npx prisma generate
fi

exec "$@"
