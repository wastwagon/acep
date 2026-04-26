# ACEP Platform

Consolidated public website and operational tools for **ACEP** (Africa Centre for Energy Policy): marketing pages, data sub-sites, **CMS**, **events**, **participant portal**, and deployment to **Render** or **Coolify**.

## Stack

| Layer | Technology |
|--------|----------------|
| App | **Next.js 16** (App Router), **React 18**, **TypeScript** |
| Styling | **Tailwind CSS**, Radix-based UI primitives, ACEP brand tokens |
| Data | **PostgreSQL** + **Prisma ORM** |
| Email | **Resend** (optional; falls back to server logs in dev) |
| Rate limits | In-memory or **Upstash Redis** (optional) for public APIs |
| Quality | `npm run check` → ESLint (`src`) + Vitest + `tsc` |

## Public front end

- **Home** (`/`) — hero, platforms, publications/news feeds (JSON extracts + optional CMS posts), events teaser, galleries.
- **Resource & IEA-style listings** — e.g. `/news-blog-posts`, `/press-statements`, `/publications`, `/reports`, `/annual-reports`, `/radar`, `/resource-centre`, `/programs`, `/events`, organisation pages (`/about-us`, `/team`, …).
- **ACEP legacy HTML** — many paths **rewritten** to `/acep/...` via `src/proxy.ts` (Next.js 16 proxy) using the generated route map (`npm run gen:acep:routes`).
- **Sub-platforms (rich static / scraped content)**  
  - **Contract Monitor** — `/contracts`  
  - **Electricity Monitor** — `/electricity` (+ complaints form → **stored** when DB is available)  
  - **Oil Revenue** — `/oil-revenue`  
  - **OpenTax** — `/tax` (whistleblower form → **stored** when DB is available)  
  - **Videos** — `/videos`
- **Public events** — `/e` index, **`/e/[slug]`** (published events: registration, exhibitor flows, calendar links, **shared materials** approved from portal).

## Database-backed features (Prisma)

- **CMS** — users, sessions, **posts**, **media**, **marketing pages/hubs**, **website content entries**, **app settings**.
- **Events** — `Event`, attendee + exhibitor registrations, speakers, check-in codes, exports.
- **Participant portal** — `PortalUser`, sessions, password reset, **organiser materials** (`EventContribution`) with **moderation** (`PENDING` / `APPROVED` / `REJECTED`) and public display on `/e/[slug]` when approved.
- **Public form inbox** — `PublicFormSubmission` (electricity complaints, tax whistleblower) for staff review under **Admin → Public form inbox**.

## Admin dashboard (`/admin`)

**Sign in:** use **`/login`** (header “Sign in”). One form checks **CMS** (`CmsUser`) then **participant portal** (`PortalUser`); success sends you to **`/admin`** or **`/portal`** respectively. If both accounts share the same password, **CMS wins**. Legacy **`/admin/login`** and **`/portal/login`** redirect to `/login`.

After seeding a CMS user (`CMS_ADMIN_EMAIL` / `CMS_ADMIN_PASSWORD` in `.env` then `npm run db:seed`):

- **News & posts**, **Media**, **Events** (CRUD-style management, registrations, speakers, CSV export, check-in).
- **Organiser materials (portal)** — approve / reject / unpublish participant submissions for the public event page.
- **Public form inbox** — view JSON payloads from electricity / OpenTax forms.
- **Public website** keys, **Marketing** pages & hubs, **Settings**.

## Participant portal (`/portal`)

- Register at **`/portal/register`**, sign in via **`/login`**, forgot/reset password, **profile**, **materials for organisers** (draft → submit → staff moderation → optional public visibility on `/e/...`).

## Backend services

- **Next.js** hosts all primary **API routes** under `/api/*` (admin CMS, public events, portal, health).
- **Coolify stack** (`docker-compose.coolify.yml`): optional **Node/Express** service on port **3001** for `/health` and `/ready` (Postgres + Redis checks). See **[COOLIFY.md](./COOLIFY.md)**.

## Scripts

```bash
npm run dev              # Next dev server on :3100 (binds 0.0.0.0)
npm run build            # prisma generate + next build
npm start                # Production server :3100
npm run check            # lint + test + typecheck
npm run lint             # eslint src --max-warnings 0
npm run test             # vitest
npm run typecheck        # tsc --noEmit
npm run db:migrate       # prisma migrate deploy
npm run db:seed          # prisma db seed
npm run docker:dev       # docker compose (hot reload)
npm run docker:dev:db    # compose + Postgres profile
```

Content pipelines: `scrape:acep`, `scrape:contracts`, `scrape:electricity`, `scrape:oil-revenue`, matching `verify:*` scripts — see `package.json`.

## Configuration

Copy **`.env.example`** → **`.env`**. Important variables:

- **`DATABASE_URL`** — required for CMS, events, portal, and public form storage.
- **`NEXT_PUBLIC_SITE_URL`** — canonical site URL (emails and links).
- **`RESEND_API_KEY`** + **`EVENT_EMAIL_FROM`** — event confirmation emails.
- **`PORTAL_SUBMISSION_NOTIFY_EMAIL`** — optional; staff inbox when portal organiser materials are **submitted** for review.
- **`PUBLIC_FORM_NOTIFY_EMAIL`** — optional; staff alert when a **public form** (electricity complaint or tax whistleblower) is stored.
- **`UPSTASH_*`** — optional shared rate limiting for multi-instance public APIs.

Prisma applies a **PostgreSQL `connect_timeout`** on the client URL when missing, so a down database does not hang the whole Node process indefinitely.

## Deployment

- **Render** — step-by-step: **[DEPLOYMENT.md](./DEPLOYMENT.md)** (build `npm install && npm run build`, start `npm start`, run `prisma migrate deploy` as appropriate).
- **Coolify / Docker Compose** — **[COOLIFY.md](./COOLIFY.md)**.

## Local development

See **[LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)** and **[QUICK_START.md](./QUICK_START.md)**.

## Documentation index

Historical verification and design notes live in the repo root (`*_VERIFICATION.md`, `*_SUMMARY.md`). For an ordered list, see **[docs/README.md](./docs/README.md)**.

## Contributing

1. Branch from `main`.
2. Run **`npm run check`** before pushing.
3. Open a PR with a clear description.

## Licence & contact

© 2026 Africa Centre for Energy Policy. All rights reserved.

- **Website:** [acep.africa](https://acep.africa)  
- **Email:** info@acep.africa  
- **Phone:** (+233) 302 900 730  

Built with Next.js, TypeScript, Tailwind CSS, and Prisma.
