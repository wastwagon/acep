# Deploy ACEP on Coolify (Docker Compose)

See also the repo **[README.md](./README.md)** for a full feature overview (CMS, events, participant portal, public forms).

This stack runs **four services** from `docker-compose.coolify.yml`:

| Service    | Role |
|-----------|------|
| `web`     | Next.js (standalone) on port **3100** |
| `backend` | Node/Express API on port **3001** (`/health`, `/ready`, Postgres + Redis checks) |
| `postgres` | PostgreSQL **16** (data volume `postgres_data`) |
| `redis`   | Redis **7** with AOF persistence (`redis_data`) |

## 1. Coolify: create the resource

1. Open your Coolify dashboard on the VPS.
2. **+ New Resource** → **Docker Compose** (not “Application” unless you only want one container).
3. Point the repository at this Git repo (or upload files).
4. Set **Base Directory** to the repo root (where `docker-compose.coolify.yml` lives).
5. Set **Docker Compose Location** to: `docker-compose.coolify.yml`.

## 2. Build-time vs runtime (Next.js)

`NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` are passed as **Docker build args** for the `web` service so Next.js can embed them at compile time. In Coolify, ensure the same values exist as **build-time** variables if your Coolify version separates “Build” and “Runtime” env (many UIs expose one list used for both). After changing them, **rebuild** the `web` image.

Validate the compose file locally (no stack start):

```bash
chmod +x scripts/verify-coolify-compose.sh
./scripts/verify-coolify-compose.sh
```

## 3. Environment variables

In Coolify → your compose stack → **Environment**, add at least:

- **`POSTGRES_PASSWORD`** — long random string (required; compose will fail without it).
- **`NEXT_PUBLIC_SITE_URL`** — public URL of the **frontend** (production: `https://www.acep.africa`). Used at **image build** time and at runtime.
- **`NEXT_PUBLIC_API_URL`** — public URL of the **API** as seen by the browser (use the same origin as the site if the API is not on a separate subdomain, e.g. `https://www.acep.africa`). Used at **build** time for any `NEXT_PUBLIC_*` client calls you add later.
- **`CMS_ADMIN_EMAIL`**, **`CMS_ADMIN_PASSWORD`**, and optionally **`CMS_ADMIN_NAME`** — bootstrap the first CMS admin during seed (e.g. `CMS_ADMIN_EMAIL=admin@acep.africa` so the account matches the **acep.africa** domain; sign in at `https://www.acep.africa/login` after deploy; you are redirected to `/admin`).

See `.env.coolify.example` for a template.

**Passwords in `DATABASE_URL`:** if `POSTGRES_PASSWORD` contains `@`, `#`, or `%`, URL-encode it in advanced setups. ASCII letters/digits are safest.

## 4. Domains and ports in Coolify

- Attach your **main domain** to service **`web`**, port **3100** (Coolify usually sets reverse proxy automatically).
- Attach a **second domain** (or subdomain) to **`backend`**, port **3001**, **or** put both behind one proxy with path rules (advanced).

`NEXT_PUBLIC_API_URL` must match whatever the **browser** uses to reach the API.

## 5. First deploy

Trigger **Deploy**. Coolify will:

1. Build `backend` from `./backend/Dockerfile`.
2. Build `web` from `./Dockerfile` (Next standalone), passing `NEXT_PUBLIC_*` as build args.
3. Start Postgres and Redis, wait for healthchecks, then start `backend` and `web`.

## 6. Verify

- Frontend: open `NEXT_PUBLIC_SITE_URL`.
- API health: `GET {NEXT_PUBLIC_API_URL}/health` → `{ "status": "ok" }`.
- Readiness: `GET {NEXT_PUBLIC_API_URL}/ready` → checks Postgres and Redis (used for orchestration / monitoring).

## 7. Local dry run (optional)

From the repo root (with a `.env` containing `POSTGRES_PASSWORD` and the public URLs, or export them in the shell):

```bash
docker compose -f docker-compose.coolify.yml --env-file .env up --build
```

Then visit `http://localhost:3100` and `http://localhost:3001/health`.

## 8. Healthchecks

Compose defines healthchecks for **Postgres**, **Redis**, **backend** (`/health`), and **web** (HTTP `GET /`). Coolify can use these for “wait until healthy” during rolling updates.

## 9. Optional Redis password

Set **`REDIS_PASSWORD`** in Coolify (or `.env`) to enable `--requirepass` on Redis.

- **`backend`** builds `REDIS_URL` automatically as `redis://:PASSWORD@redis:6379` when `REDIS_URL` is unset (password is URL-encoded). You can still override with an explicit **`REDIS_URL`**.
- **`web`** defaults to `REDIS_URL=redis://redis:6379`. When Redis has a password, set **`REDIS_URL`** for the `web` service to `redis://:YOUR_PASSWORD@redis:6379` (URL-encode the password if it contains `@`, `#`, `%`, etc.) before any Next.js code connects to Redis.

## 10. Database migrations & seeding

- **On every `web` container start**, `docker/entrypoint-web.sh` runs `prisma migrate deploy` then `node prisma/seed.cjs` when `DATABASE_URL` is set (Coolify production).
- **Manual retry:** log into **`/login`** with your seeded CMS admin account (you land on **`/admin`**), open **`/admin/settings`**, then run **Run migrations** or **Run seed** (calls `/api/admin/migrate` and `/api/admin/seed` under your authenticated session).
- If no CMS admin account exists, set `CMS_ADMIN_EMAIL` and `CMS_ADMIN_PASSWORD` in Coolify and redeploy so seed can create one.

## 11. Production go-live checklist (VPS + Coolify)

**Before first production deploy**

1. **DNS** — Point your real domains to the VPS (A/AAAA records). Wait for propagation.
2. **Secrets in Coolify** — Set a long random **`POSTGRES_PASSWORD`** (never commit it). Set **`CMS_ADMIN_EMAIL`** (e.g. `admin@acep.africa`) and **`CMS_ADMIN_PASSWORD`** so deployment seed creates your first admin login. Prefer also **`REDIS_PASSWORD`** in production; then set **`REDIS_URL`** for `web` as in §9.
3. **Public URLs** — Set **`NEXT_PUBLIC_SITE_URL`** to your live site (e.g. `https://www.acep.africa`) and **`NEXT_PUBLIC_API_URL`** to the URL the browser should use for the API (same origin, or a dedicated API host). Use **https** exactly as visitors will. These are baked into the **`web`** image at **build** time—after any change, trigger a **rebuild** of `web`.
4. **Domains in Coolify** — Map the main site to **`web:3100`** and the API host to **`backend:3001`** (or your chosen proxy). Confirm TLS/HTTPS is enabled in Coolify for both if exposed publicly.
5. **Ports** — Default published ports are **`WEB_PUBLISH_PORT=3100`** and **`API_PUBLISH_PORT=3001`**. Change only if Coolify assigns different host ports; keep container targets **3100** / **3001** unless you change the Dockerfiles.

**Right after deploy**

6. Open **`NEXT_PUBLIC_SITE_URL`** — homepage loads, no mixed-content warnings (all https if you use https).
7. **`GET {NEXT_PUBLIC_API_URL}/health`** — `{"status":"ok"}`.
8. **`GET {NEXT_PUBLIC_API_URL}/ready`** — `ready: true` and Postgres + Redis checks `ok`.
9. **Smoke test** — Navigate main menus, one publication detail, `/publications`, `/reports` if you use them.

**Ongoing operations**

10. **Backups** — Schedule **Postgres** dumps or Coolify **volume** backups for `postgres_data` (and `redis_data` if you rely on persisted Redis).
11. **Updates** — Push to Git → redeploy in Coolify; bump **`NEXT_PUBLIC_*`** only when URLs change, then rebuild `web`.
12. **Hardening** — Prefer not exposing **Postgres** or **Redis** ports publicly (this compose does not publish them by default—only `web` and `backend`). Restrict **`API_PUBLISH_PORT`** if the API is only for internal or same-origin use.

## 12. Notes

- **Postgres user / database:** `POSTGRES_USER` and `POSTGRES_DB` default to `acep`. The Postgres healthcheck uses the same values via compose substitution—keep them aligned with the env you set.
- The Next app does not yet call the API everywhere; **`DATABASE_URL` / `REDIS_URL` / `API_INTERNAL_URL`** are wired for Phase 2 (server actions, queues, sessions).
- **Backups:** snapshot Coolify volumes or use Postgres backup jobs for `postgres_data`.
- **Updates:** push to Git and redeploy from Coolify; rebuild picks up new `NEXT_PUBLIC_*` when you change env and redeploy.
