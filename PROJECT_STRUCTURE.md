# ACEP Platform - Project Structure & Styling Guide

**Date**: 2026-04-26  
**Status**: Living reference — align with `README.md` and `src/app/` for new routes.

---

## 📁 Project Structure

```
ACEP/
├── src/
│   ├── proxy.ts                      # Next.js 16 proxy: ACEP rewrites, legacy redirects
│   ├── app/                          # Next.js App Router pages
│   │   ├── globals.css              # ✅ Centralized styles (NO inline styles)
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── admin/                   # CMS dashboard (posts, media, events, portal moderation, public forms)
│   │   ├── portal/                  # Participant portal (auth, profile, organiser materials)
│   │   ├── e/                       # Public events (/e/[slug], registration, …)
│   │   ├── api/                     # Route handlers (admin, portal, public events, public forms, health)
│   │   ├── contracts/               # Contract Monitor pages
│   │   ├── electricity/             # Electricity Monitor pages
│   │   ├── oil-revenue/              # Oil Revenue Tracker pages
│   │   ├── tax/                      # OpenTax platform pages
│   │   ├── videos/                   # OilMoneyTV pages
│   │   ├── news-blog-posts/          # News & Blog listing
│   │   ├── research-and-policy-papers/ # Publications listing
│   │   ├── press-statements/         # Press statements listing
│   │   ├── annual-reports/           # Annual reports listing
│   │   ├── reports/                  # All reports page
│   │   └── acep/                     # ACEP content pages
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # ✅ Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── progress-bar.tsx      # ✅ NEW: Reusable progress bar
│   │   ├── layout/                   # Layout components
│   │   │   ├── header.tsx            # ✅ NO inline styles
│   │   │   ├── footer.tsx
│   │   │   └── sidebar-nav.tsx
│   │   ├── home/                     # Home page components
│   │   ├── contracts/                # Contract Monitor components
│   │   ├── electricity/             # Electricity Monitor components
│   │   ├── oil-revenue/               # Oil Revenue components
│   │   ├── tax/                       # OpenTax components
│   │   └── videos/                    # Video components
│   │
│   ├── lib/                          # Utilities and data
│   │   ├── data/                     # Data files
│   │   │   ├── contracts.ts
│   │   │   ├── electricity.ts
│   │   │   ├── oil-revenue.ts
│   │   │   ├── tax.ts
│   │   │   ├── videos.ts
│   │   │   └── posts.ts              # Posts/publications data
│   │   ├── utils.ts                  # Utility functions
│   │   ├── acep-snapshots.ts         # ACEP content handling
│   │   └── acep-extract.ts           # Content extraction
│   │
│   └── styles/                       # ✅ NEW: Organized style files
│       ├── components/               # Component-specific styles
│       │   ├── hero-sections.css     # Hero section classes
│       │   ├── stats-cards.css       # Stats card classes
│       │   └── iframe-containers.css # Iframe classes
│       ├── utilities/                # Utility classes
│       │   ├── progress-bars.css     # Progress bar utilities
│       │   └── animation-delays.css  # Animation delay utilities
│       └── patterns/                 # Background patterns
│           └── background-patterns.css
│
├── content/                          # Scraped content
│   ├── acep/                         # ACEP website content
│   │   ├── snapshots/                # HTML snapshots
│   │   ├── assets/                   # Images, CSS, JS
│   │   └── extracted/                # ✅ Extracted structured data
│   │       ├── all-posts.json
│   │       ├── news-blog-posts.json
│   │       ├── publications.json
│   │       ├── press-statements.json
│   │       └── reports.json
│   ├── contract-monitor/             # Contract Monitor content
│   ├── electricity-monitor/         # Electricity Monitor content
│   └── oil-revenue/                  # Oil Revenue content
│
├── scripts/                          # Build and scraping scripts
│   ├── scrape-acep.mjs
│   ├── extract-posts-publications.mjs # ✅ NEW: Content extraction
│   └── ...
│
└── public/                           # Static assets
```

---

## 🎨 Styling Architecture

### ✅ **NO INLINE STYLES** - All styles in external files

### Style Organization

1. **`globals.css`** - Centralized styles file
   - All Tailwind directives
   - All utility classes
   - All component classes
   - All pattern classes
   - Organized by category with clear sections

2. **Reusable Components**
   - `ProgressBar` component - Replaces all `style={{ width: 'X%' }}`
   - Uses CSS variables for dynamic widths
   - Variant-based styling (red, blue, orange, etc.)

3. **Utility Classes**
   - `.progress-bar-container` - Progress bar wrapper
   - `.progress-bar-fill` - Progress bar fill (uses CSS var)
   - `.animate-delay-*` - Animation delay classes
   - `.bg-grid-pattern` - Background pattern
   - `.iframe-container` - Iframe container

4. **Component Classes**
   - `.hero-section` - Hero section base
   - `.hero-heading` - Hero headings
   - `.stats-card` - Stats card styling
   - And more...

---

## 🔧 Reusable Components

### ProgressBar Component
**Location**: `src/components/ui/progress-bar.tsx`

**Usage**:
```tsx
<ProgressBar
  percentage={75}
  variant="blue"
  size="md"
  showLabel
  label="75%"
/>
```

**Replaces**:
```tsx
// ❌ OLD: Inline style
<div style={{ width: `${percentage}%` }} />

// ✅ NEW: Reusable component
<ProgressBar percentage={percentage} variant="blue" />
```

---

## 📋 Style Categories in globals.css

### 1. **Utility Classes - Progress Bars**
- `.progress-bar-container` - Container
- `.progress-bar-container-sm/md/lg` - Sizes
- `.progress-bar-fill` - Fill element (uses `--progress-width` CSS var)
- `.progress-bar-{color}` - Color variants

### 2. **Utility Classes - Animation Delays**
- `.animate-delay-0` through `.animate-delay-200`
- Replaces `style={{ animationDelay: 'Xms' }}`

### 3. **Pattern Utilities**
- `.bg-grid-pattern` - Grid background pattern
- `.bg-dot-pattern` - Dot pattern
- `.bg-diagonal-pattern` - Diagonal lines

### 4. **Component Classes - Hero Sections**
- `.hero-section` - Base hero
- `.hero-content` - Content container
- `.hero-heading` - Headings
- `.hero-badge` - Badge styling
- `.hero-wave-bottom` - Wave SVG container

### 5. **Component Classes - Stats Cards**
- `.stats-section` - Stats section wrapper
- `.stats-grid` - Grid layout
- `.stats-card` - Individual card
- `.stats-value` - Value display
- `.stats-label` - Label styling

### 6. **Component Classes - Iframe Containers**
- `.iframe-container` - Standard iframe (calc height)
- `.iframe-container-full` - Full height

---

## ✅ Refactoring Summary

### Before (Inline Styles)
```tsx
// ❌ Inline style for width
<div style={{ width: `${percentage}%` }} />

// ❌ Inline style for background
<div style={{ backgroundImage: 'url(...)' }} />

// ❌ Inline style for height
<iframe style={{ height: "calc(100vh - 120px)" }} />

// ❌ Inline style for animation
<div style={{ animationDelay: `${idx * 20}ms` }} />
```

### After (External Classes)
```tsx
// ✅ Reusable component
<ProgressBar percentage={percentage} variant="blue" />

// ✅ Utility class
<div className="bg-grid-pattern" />

// ✅ Component class
<iframe className="iframe-container" />

// ✅ Utility class
<div className="animate-delay-20" />
```

---

## 🎯 Benefits

1. **Maintainability**
   - All styles in one place (`globals.css`)
   - Easy to find and update
   - No hunting through components

2. **Reusability**
   - ProgressBar component used everywhere
   - Utility classes reusable across components
   - Consistent styling

3. **Performance**
   - CSS classes are more performant than inline styles
   - Better browser caching
   - Smaller bundle size

4. **Consistency**
   - Same classes = same styling
   - No style duplication
   - Easy to maintain design system

5. **Developer Experience**
   - Clear, organized structure
   - Easy to understand
   - Simple to extend

---

## 📝 Usage Guidelines

### When to Use ProgressBar Component
- Any progress bar or percentage-based visual indicator
- Revenue breakdowns
- Capacity charts
- Allocation displays

### When to Use Utility Classes
- Animation delays: `.animate-delay-*`
- Background patterns: `.bg-grid-pattern`
- Iframe containers: `.iframe-container`

### When to Use Component Classes
- Hero sections: `.hero-section`, `.hero-heading`
- Stats displays: `.stats-card`, `.stats-value`
- Consistent component styling

---

## 🔍 Finding Styles

### To modify progress bars:
1. Check `src/components/ui/progress-bar.tsx` for component logic
2. Check `globals.css` → "UTILITY CLASSES - Progress Bars" section

### To modify hero sections:
1. Check `globals.css` → "COMPONENT CLASSES - Hero Sections" section
2. Update classes, all hero components will update

### To add new utility:
1. Add to appropriate section in `globals.css`
2. Use `@layer utilities` for utilities
3. Use `@layer components` for component classes

---

## ✅ Verification

- [x] All inline styles removed
- [x] ProgressBar component created
- [x] Utility classes defined
- [x] Component classes defined
- [x] Background patterns externalized
- [x] Animation delays externalized
- [x] Iframe containers externalized
- [x] Build successful
- [x] No errors

---

**Status**: ✅ **COMPLETE - NO INLINE STYLES**  
**Report Generated**: 2026-01-27
