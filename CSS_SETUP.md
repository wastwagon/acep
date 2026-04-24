# CSS Setup & Architecture

**Date**: 2026-01-27  
**Project**: ACEP Platform

---

## 🎨 CSS Framework & Tools

### Primary CSS Framework: **Tailwind CSS v3.4.17**

The project uses **Tailwind CSS** as the primary CSS framework, which is a utility-first CSS framework.

---

## 📦 CSS Dependencies

### Core CSS Libraries
```json
{
  "tailwindcss": "^3.4.17",           // Main CSS framework
  "postcss": "^8.4.49",               // CSS processor
  "autoprefixer": "^10.4.20",         // Automatic vendor prefixes
  "tailwindcss-animate": "^1.0.7"    // Animation utilities
}
```

---

## 🏗️ CSS Architecture

### 1. **Tailwind CSS** (Utility-First Framework)
- **Location**: `src/app/globals.css`
- **Configuration**: `tailwind.config.ts`
- **PostCSS Config**: `postcss.config.mjs`

### 2. **CSS Layers** (Tailwind's @layer directive)

The project uses Tailwind's layer system for organized CSS:

#### **@layer base**
- CSS custom properties (CSS variables)
- Base element styles
- Dark mode variables

#### **@layer components**
- Reusable component classes
- Hero sections
- Stats cards
- Iframe containers

#### **@layer utilities**
- Custom utility classes
- Progress bars
- Animation delays
- Background patterns
- Responsive utilities

---

## 📁 CSS File Structure

```
src/
├── app/
│   └── globals.css              # ✅ Main CSS file (ALL styles here)
│
└── styles/                       # Reference organization (not imported)
    ├── components/
    │   ├── hero-sections.css
    │   ├── stats-cards.css
    │   ├── iframe-containers.css
    │   └── animation-delays.css
    ├── utilities/
    │   └── progress-bars.css
    └── patterns/
        └── background-patterns.css
```

**Note**: All styles are consolidated in `globals.css` for easier maintenance. The `styles/` directory contains organized reference files.

---

## 🎯 CSS Features Used

### 1. **Tailwind Utility Classes**
Primary method for styling components:
```tsx
<div className="bg-gradient-to-br from-acep-primary via-blue-800 to-acep-dark text-white py-16">
```

### 2. **Custom CSS Variables**
Defined in `@layer base`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --acep-primary: #1e3a8a;
  --acep-secondary: #f59e0b;
  /* ... */
}
```

### 3. **Custom Component Classes**
Defined in `@layer components`:
```css
.hero-section {
  @apply relative text-white py-16 sm:py-20 md:py-24 overflow-hidden;
}
```

### 4. **Custom Utility Classes**
Defined in `@layer utilities`:
```css
.progress-bar-container {
  @apply w-full bg-gray-200 rounded-full overflow-hidden;
}
```

### 5. **@apply Directive**
Used to compose Tailwind utilities:
```css
.stats-card {
  @apply bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-lg;
}
```

---

## 🎨 Brand Colors (ACEP)

Defined in `tailwind.config.ts`:
```typescript
acep: {
  primary: "#1e3a8a",    // Deep blue
  secondary: "#f59e0b",  // Amber/Gold
  accent: "#10b981",     // Green for energy
  dark: "#0f172a",       // Dark slate
  light: "#f1f5f9",      // Light gray
}
```

**Usage**:
```tsx
<div className="bg-acep-primary text-acep-secondary">
```

---

## 📐 Responsive Design

### Breakpoints (Tailwind Default)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1400px

### Mobile-First Approach
All styles are mobile-first:
```tsx
<div className="text-sm sm:text-base lg:text-lg">
```

---

## 🛠️ CSS Processing Pipeline

```
globals.css
    ↓
PostCSS (postcss.config.mjs)
    ↓
Tailwind CSS (tailwind.config.ts)
    ↓
Autoprefixer
    ↓
Optimized CSS (Next.js)
```

---

## 📋 CSS Categories in globals.css

### 1. **Base Layer** (`@layer base`)
- CSS custom properties (variables)
- Base element styles
- Dark mode support

### 2. **Custom Scrollbar**
- Webkit scrollbar styling
- Custom track and thumb styles

### 3. **Utility Classes** (`@layer utilities`)
- Progress bars (`.progress-bar-*`)
- Animation delays (`.animate-delay-*`)
- Background patterns (`.bg-grid-pattern`, `.bg-dot-pattern`)
- Responsive utilities (`.container-mobile`, `.text-responsive`)
- Rich content styles (`.acep-rich`)

### 4. **Component Classes** (`@layer components`)
- Hero sections (`.hero-section`, `.hero-heading`, etc.)
- Stats cards (`.stats-card`, `.stats-value`, etc.)
- Iframe containers (`.iframe-container`)

---

## 🎯 Styling Approach

### Primary Method: **Tailwind Utility Classes**
```tsx
// Direct Tailwind classes (most common)
<div className="bg-white p-6 rounded-lg shadow-md">
```

### Secondary Method: **Custom Component Classes**
```tsx
// Reusable component classes
<section className="hero-section">
  <h1 className="hero-heading">Title</h1>
</section>
```

### Tertiary Method: **Reusable Components**
```tsx
// React components with built-in styles
<ProgressBar percentage={75} variant="blue" />
```

---

## ✅ CSS Best Practices Followed

1. **No Inline Styles** ✅
   - All styles in external CSS files
   - Only CSS variables for dynamic values

2. **Organized Structure** ✅
   - Clear layer separation
   - Commented sections
   - Logical grouping

3. **Reusability** ✅
   - Custom utility classes
   - Component classes
   - Reusable React components

4. **Maintainability** ✅
   - Centralized in `globals.css`
   - Clear naming conventions
   - Well-documented

5. **Performance** ✅
   - Tailwind's JIT (Just-In-Time) compilation
   - Only used classes are included
   - Optimized by Next.js

---

## 🔧 Configuration Files

### `tailwind.config.ts`
- Content paths
- Theme extensions
- Custom colors (ACEP brand)
- Plugins (tailwindcss-animate)

### `postcss.config.mjs`
- Tailwind CSS plugin
- Autoprefixer plugin

### `globals.css`
- Tailwind directives
- Custom CSS variables
- Custom classes
- All project styles

---

## 📊 CSS Usage Statistics

### Tailwind Classes Used
- **Utility Classes**: 100+ (colors, spacing, typography, etc.)
- **Custom Utilities**: 20+ (progress bars, animations, patterns)
- **Component Classes**: 15+ (hero, stats, iframe)

### CSS Variables
- **Base Variables**: 20+ (colors, spacing, borders)
- **Dark Mode Variables**: 20+ (dark theme support)

---

## 🎨 Design System

### Typography
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first sizing
- **Utilities**: `.text-responsive`, `.heading-responsive`

### Colors
- **Primary**: ACEP Blue (#1e3a8a)
- **Secondary**: ACEP Gold (#f59e0b)
- **Accent**: Green (#10b981)
- **Semantic**: Success, Error, Warning, Info

### Spacing
- **Tailwind Scale**: 0.25rem increments
- **Container**: Responsive padding
- **Utilities**: `.container-mobile`

---

## 🚀 Performance

### CSS Optimization
- ✅ Tailwind JIT compilation
- ✅ Next.js CSS optimization
- ✅ Automatic purging of unused styles
- ✅ Minified in production

### Bundle Size
- Tailwind generates only used classes
- Custom classes are minimal
- No large CSS frameworks

---

## 📝 Summary

**CSS Framework**: Tailwind CSS v3.4.17  
**CSS Processor**: PostCSS  
**Vendor Prefixes**: Autoprefixer  
**Animation**: tailwindcss-animate  
**Architecture**: Utility-first with custom component classes  
**Approach**: Mobile-first, responsive design  
**Organization**: Centralized in `globals.css`  
**Best Practices**: ✅ All followed

---

**Status**: ✅ **PRODUCTION READY**  
**Report Generated**: 2026-01-27
