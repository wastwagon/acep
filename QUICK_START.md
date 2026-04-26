# Quick start — ACEP platform

## Prerequisites

- **Node.js 20+**
- **npm**
- **PostgreSQL** (optional for static-only browsing; required for CMS, events, portal, stored public forms)

## Run locally

```bash
cd ACEP
npm install
cp .env.example .env   # then edit DATABASE_URL, etc.
npx prisma migrate deploy   # or `npx prisma db push` for a throwaway dev DB
npm run db:seed             # CMS admin user — see .env.example
npm run db:portal-test-users   # optional: 3 portal demo accounts (attendee / speaker / exhibitor)
npm run verify:unified-login   # optional: verify those + CMS passwords in DB (no HTTP)
npm run dev
```

Open **http://localhost:3100**

### Try unified `/login` (with dev server running)

Portal demos use password **`TestPortal123!`** (override with `PORTAL_TEST_PASSWORD` when running `db:portal-test-users`):

```bash
curl -sS -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"portal-attendee@acep.local","password":"TestPortal123!"}'
# expect: {"ok":true,"redirect":"/portal","role":"portal"}
```

Use **`portal-speaker@acep.local`** and **`portal-exhibitor@acep.local`** the same way. CMS admin uses your **`CMS_ADMIN_EMAIL`** / **`CMS_ADMIN_PASSWORD`** and should return **`"redirect":"/admin"`**.

## Useful URLs

| Area | URL |
|------|-----|
| Home | `/` |
| Sign in (CMS + portal) | `/login` (redirects to `/admin` or `/portal` by account) |
| Legacy URLs | `/admin/login` and `/portal/login` redirect to `/login` |
| Public events index | `/e` |
| Contract Monitor | `/contracts` |
| Electricity Monitor | `/electricity` |
| Oil Revenue | `/oil-revenue` |
| OpenTax | `/tax` |
| Videos | `/videos` |

## Quality gate

```bash
npm run check    # eslint (src) + vitest + TypeScript
```

## Docker

- **`npm run docker:dev`** — Next in Compose with bind mount (hot reload).
- **`npm run docker:dev:db`** — adds Postgres (set `DATABASE_URL` to match compose; see `.env.example`).

## Deploy

- **Render:** [DEPLOYMENT.md](./DEPLOYMENT.md)  
- **Coolify:** [COOLIFY.md](./COOLIFY.md)

## Troubleshooting

- **Port 3100 in use:** `lsof -nP -iTCP:3100 -sTCP:LISTEN` then stop the PID, or change port in the dev command.
- **Home page slow / hanging:** ensure `DATABASE_URL` points at a **running** Postgres, or unset it for JSON-only home content (no CMS posts).
- **Stale build:** `rm -rf .next && npm run dev`

More detail: [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md).
