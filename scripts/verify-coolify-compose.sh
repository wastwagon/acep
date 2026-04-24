#!/usr/bin/env bash
# Validates docker-compose.coolify.yml (no Docker daemon required beyond `docker compose config`).
set -euo pipefail
cd "$(dirname "$0")/.."
export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-ci_verify_pass}"
docker compose -f docker-compose.coolify.yml config >/dev/null
echo "docker-compose.coolify.yml: OK"
