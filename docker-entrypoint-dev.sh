#!/bin/sh
set -e
cd /app

# Named volume hides image layers; install when volume is empty or Next is missing.
if [ ! -f node_modules/.bin/next ]; then
  echo "[docker-entrypoint] Installing dependencies (first run or empty node_modules volume)..."
  npm ci
fi

exec "$@"
