# Local Development Guide - ACEP Platform

Complete guide for setting up and running the ACEP Platform locally on your macOS machine.

## 🖥️ System Requirements

- macOS (your current system)
- Node.js 20.x (LTS)
- npm 10.x or later
- Docker Desktop (installed)
- GitHub Desktop (installed)
- 2GB+ free disk space

## 🚀 Quick Start (5 Minutes)

### Option 1: Standard Development (Recommended for Development)

```bash
# 1. Navigate to project
cd /Users/OceanCyber/Downloads/ACEP

# 2. Install dependencies (if not done)
npm install

# 3. Start development server
npm run dev
```

Open browser: http://localhost:3100

Press `Ctrl + C` to stop the server.

---

### Option 2: Docker Development (hot reload — recommended for “everything in Docker”)

The default Compose service runs **Next.js in dev mode** with your repo bind-mounted, polling-based file watching for Docker Desktop, and named volumes for `node_modules` and `.next` so edits on the host reload in the browser without rebuilding the image.

```bash
cd /Users/OceanCyber/Downloads/ACEP

# Start app (hot reload on http://localhost:3100)
npm run docker:dev
# equivalent: docker compose up --build
```

- First start: image build + `npm ci` into the `node_modules` volume (can take a few minutes).
- After that: **save a file → page refreshes**; no `docker compose build` for normal code changes.
- Stop: `Ctrl+C` or `docker compose down`.

**Optional PostgreSQL** (Compose profile `with-db`):

```bash
npm run docker:dev:db
```

Use **`DATABASE_URL`** from [`.env.example`](./.env.example) (default example uses host port **54320** when using the compose profile). The app adds **`connect_timeout=10`** to PostgreSQL URLs when missing so a stopped DB does not hang every page.

**Production-like container** (standalone build, no hot reload — for deployment checks):

```bash
npm run docker:prod
```

#### One-off Docker commands (production image)

```bash
npm run docker:build
npm run docker:run
```

#### After changing `package.json` / `package-lock.json` in Docker dev

```bash
docker compose exec web npm ci
```

---

## Project overview (high level)

```
ACEP/
├── prisma/                 # Schema, migrations, seed (CMS user, settings, …)
├── src/
│   ├── app/
│   │   ├── page.tsx        # Public home
│   │   ├── admin/          # CMS + events + portal moderation + public form inbox
│   │   ├── portal/         # Participant login, profile, organiser materials
│   │   ├── e/              # Public event pages (/e/[slug], registration, …)
│   │   ├── api/            # REST-style route handlers (admin, portal, public events, forms)
│   │   ├── contracts|electricity|oil-revenue|tax|videos/   # Sub-platforms
│   │   └── …               # Publications, ACEP snapshots, marketing pages, etc.
│   ├── components/         # UI by domain (admin, home, layout, …)
│   ├── lib/                # db, auth, mail, rate-limit, data loaders
│   └── proxy.ts            # ACEP rewrites, legacy redirects (Next.js 16 proxy)
├── content/                # Scraped JSON + assets (acep, contracts, …)
├── backend/                # Optional Express health service (Coolify stack)
├── docker-compose*.yml
└── package.json
```

---

## What is implemented today

1. **Public site** — Home, resource listings, publications, scraped ACEP paths, contracts / electricity / oil-revenue / tax / videos.
2. **PostgreSQL + Prisma** — CMS, events, portal users, organiser materials, public form submissions.
3. **Admin (`/admin`)** — Posts, media, events (registrations, exhibitors, speakers, export, check-in), organiser materials moderation, **public form inbox**, marketing & website keys, settings.
4. **Participant portal (`/portal`)** — Auth, profile, materials linked to events; submissions can appear on `/e/[slug]` after approval.
5. **Public APIs** — Event registration, exhibitor flows, portal APIs, **`POST /api/public/form-submissions`** (rate limited), health route.

---

## 🛠️ Development Workflow

### Making Changes

1. **Edit Files**
   - Files auto-reload in dev mode (`npm run dev`)
   - Save and see changes instantly in browser

2. **Check Browser**
   - Desktop: Resize browser window
   - Mobile: Open DevTools (Cmd+Option+I) → Toggle device toolbar

3. **Common Files to Edit**
   - Pages: `src/app/*/page.tsx`
   - Components: `src/components/**/*.tsx`
   - Styles: `src/app/globals.css` or Tailwind classes

### Adding a New Page

Example: Create `/about` page

```bash
# Create directory and file
mkdir -p src/app/about
touch src/app/about/page.tsx
```

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">About ACEP</h1>
      <p>Your content here...</p>
    </div>
  );
}
```

Page automatically available at: http://localhost:3100/about

### Using ACEP Brand Colors

```tsx
// Tailwind classes
className="bg-acep-primary"      // Deep blue
className="text-acep-secondary"   // Amber/Gold
className="bg-acep-accent"        // Green
className="bg-acep-dark"          // Dark slate
className="bg-acep-light"         // Light gray

// Or use the Tailwind defaults (mapped to ACEP colors)
className="bg-primary"            // Same as acep-primary
```

---

## 🐛 Troubleshooting

### Development Server Won't Start

**Error**: "Port 3100 already in use"

```bash
# Find and kill process on port 3100
lsof -ti:3100 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**Error**: "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

**Error**: "Docker daemon not running"

1. Open Docker Desktop
2. Wait for "Docker Desktop is running"
3. Try command again

**Error**: "Port 3100 already allocated"

```bash
# Stop all Docker containers
docker-compose down

# Or stop specific container
docker ps
docker stop [container-id]
```

**Clean Docker Build** (if changes not reflecting)

```bash
# Remove old images and rebuild
docker-compose down
docker-compose up --build --force-recreate
```

### Build Errors

**TypeScript Errors**

```bash
# Check for errors
npm run build

# Common fixes:
# 1. Add missing types
npm install --save-dev @types/[package-name]

# 2. Check tsconfig.json is valid
```

**CSS Not Loading**

```bash
# Ensure Tailwind is configured
# Check: tailwind.config.ts and globals.css exist
```

---

## 📱 Testing Mobile Design

### Using Browser DevTools

1. Open Chrome/Safari
2. Press `Cmd+Option+I` (DevTools)
3. Click device toggle icon (or `Cmd+Shift+M`)
4. Select device:
   - iPhone 14 Pro (mobile)
   - iPad Pro (tablet)
   - Responsive (custom size)

### Testing Different Breakpoints

```
Mobile:  375px - 640px   (sm)
Tablet:  640px - 1024px  (md, lg)
Desktop: 1024px+         (lg, xl)
```

### Mobile-First Classes Example

```tsx
// Base (mobile) → sm → md → lg → xl
className="text-sm sm:text-base md:text-lg lg:text-xl"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
className="p-4 sm:p-6 lg:p-8"
```

---

## 🔄 Git Workflow with GitHub Desktop

### Initial Setup (One-time)

1. Open GitHub Desktop
2. File → "Add Local Repository"
3. Choose: `/Users/OceanCyber/Downloads/ACEP`
4. Click "Publish repository"

### Daily Workflow

1. **Make Changes**
   - Edit files in your code editor
   - Save changes

2. **Review Changes** (GitHub Desktop)
   - See changed files on left
   - View diff on right

3. **Commit Changes**
   - Write commit message (bottom left)
   - Click "Commit to main"

4. **Push to GitHub**
   - Click "Push origin" (top right)
   - Changes now on GitHub!

### Branch Workflow (Optional)

```bash
# Create feature branch
git checkout -b feature/contract-monitor

# Make changes, commit

# Push branch
git push -u origin feature/contract-monitor

# Create PR on GitHub
```

---

## 🔍 Useful Commands

```bash
# Development
npm run dev              # Start dev server (hot reload)
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Check code quality

# Docker
npm run docker:dev      # Dev server in Docker (hot reload)
npm run docker:dev:db   # Dev + PostgreSQL
npm run docker:prod     # Production-like Compose build
npm run docker:build    # Build production image only
npm run docker:run      # Run production image

# Cleanup
rm -rf .next            # Clear Next.js cache
rm -rf node_modules     # Remove dependencies
npm install             # Reinstall dependencies

# Check versions
node --version          # Should be 20.x
npm --version           # Should be 10.x
docker --version        # Verify Docker installed
```

---

## 📊 Performance Tips

### Development Mode (npm run dev)

- **Fast**: Hot module reloading
- **Slow**: No optimization, larger bundles
- **Use for**: Active development

### Production Mode (npm run build + npm start)

- **Fast**: Optimized bundles
- **Slow**: Requires rebuild for changes
- **Use for**: Testing production build

### Docker Mode (`npm run docker:dev`)

- **Fast**: Same hot reload as local Node; source is mounted into the container.
- **Slow**: First-time `npm ci` into the volume; run `docker compose exec web npm ci` when dependencies change.
- **Use for**: Full-stack in Docker Desktop without installing Node on the host.

---

## 🎯 Next Development Steps

1. **Create Contract Monitor Pages**
   - File: `src/app/contracts/page.tsx`
   - Component: Contract list with map

2. **Create Electricity Monitor**
   - File: `src/app/electricity/page.tsx`
   - Dashboard with charts

3. **Create Oil Revenue Tracker**
   - File: `src/app/oil-revenue/page.tsx`
   - Interactive visualizations

4. **Create Video Platform**
   - File: `src/app/videos/page.tsx`
   - Video grid with filtering

---

## 📞 Getting Help

**Common Resources:**
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React: https://react.dev

**For This Project:**
- Check README.md for overview
- Check DEPLOYMENT.md for Render setup
- Check component examples in `src/components/`

---

## ✅ Development Checklist

Before committing code:

- [ ] Code runs without errors (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] Tested on mobile size (DevTools)
- [ ] Tested on desktop size
- [ ] No console errors in browser
- [ ] Committed with clear message
- [ ] Pushed to GitHub

---

**Happy Coding! 🚀**

If you get stuck, check the examples in the home page components (`src/components/home/`) for reference.
