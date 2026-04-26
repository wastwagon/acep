# Documentation index

Use these as the **canonical** guides (kept in sync with the codebase):

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Project overview, stack, features, scripts, env, deploy pointers |
| [../QUICK_START.md](../QUICK_START.md) | Fast local preview: URLs, smoke tests |
| [../LOCAL_DEVELOPMENT.md](../LOCAL_DEVELOPMENT.md) | Dev workflow, Docker, database, troubleshooting |
| [../DEPLOYMENT.md](../DEPLOYMENT.md) | Render deployment |
| [../COOLIFY.md](../COOLIFY.md) | Coolify / `docker-compose.coolify.yml` full stack |
| [../PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) | Folders, styling layout, content layout |

## Historical / audit notes (root)

Files such as `IMPLEMENTATION_SUMMARY.md`, `*_VERIFICATION.md`, `HOMEPAGE_*`, `IEA_DESIGN_IMPLEMENTATION.md`, etc. capture past audits and refactors. They may overlap; when in doubt, trust **README.md** and the **code** (`src/`, `prisma/`).

Operational email hooks (all optional, see `.env.example`): **`PORTAL_SUBMISSION_NOTIFY_EMAIL`**, **`PUBLIC_FORM_NOTIFY_EMAIL`**, plus **`RESEND_API_KEY`** / **`EVENT_EMAIL_FROM`** for delivery.
