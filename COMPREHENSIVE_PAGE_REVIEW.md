# Comprehensive Page Review - IEA Pages, Posts, Reports, Publications & Menu Systems

## Executive Summary

This document provides a thorough review of all page types, detail pages, and menu embedding systems across the ACEP website. It identifies patterns, inconsistencies, and recommendations for improvement.

---

## 1. IEA-Style Listing Pages

### ✅ Implemented Pages

#### `/research-and-policy-papers`
- **Component**: Uses `IEAListing` component
- **Data Source**: Combines `getPublications()` + `getReports()`
- **Features**:
  - ✅ IEA-style hero section with gradient
  - ✅ Search functionality
  - ✅ Category filtering
  - ✅ Sidebar with Resource Centre links
  - ✅ Intelligent categorization
  - ✅ Responsive design
- **Menu**: Sidebar with Resource Centre links (static)

#### `/news-blog-posts`
- **Component**: Uses `IEAListing` component
- **Data Source**: Combines `getNewsBlogPosts()` + `getPressStatements()`
- **Features**: Same as above
- **Menu**: Sidebar with Resource Centre links (static)

#### `/press-statements`
- **Component**: Uses `IEAListing` component
- **Data Source**: `getPressStatements()`
- **Features**: Same as above
- **Menu**: Sidebar with Resource Centre links (static)

### ⚠️ Pages That Could Use IEA Design

#### `/annual-reports`
- **Current**: Basic listing with snapshot extraction
- **Recommendation**: Convert to use `IEAListing` component
- **Menu**: Static sidebar with Resource Centre links

#### `/radar`
- **Current**: Basic listing with snapshot extraction
- **Recommendation**: Convert to use `IEAListing` component
- **Menu**: Static sidebar with Resource Centre links

#### `/reports`
- **Current**: Custom design with year grouping and stats cards
- **Features**: 
  - ✅ Year-based grouping
  - ✅ Statistics cards
  - ✅ Card-based layout
  - ❌ No search functionality
  - ❌ No category filtering
- **Recommendation**: Enhance with search/filter or integrate `IEAListing`
- **Menu**: No sidebar (full-width layout)

---

## 2. Single Detail Pages

### Post Detail Pages

#### `/posts/[...slug]/page.tsx`
- **Route Pattern**: `/posts/[category]/[post-slug]`
- **Data Source**: `getAllPosts()` + snapshot fallback
- **Layout**:
  - ✅ IEA-style hero section with gradient
  - ✅ Back button (context-aware)
  - ✅ Featured image
  - ✅ Main content area (8 columns)
  - ✅ Sidebar (4 columns) with Resource Centre links
  - ✅ PDF downloads section
- **Menu**: Static sidebar with Resource Centre links
- **Back Navigation**: Hardcoded to `/news-blog-posts`
- **Issue**: Back link doesn't adapt to post category

#### `/acep/[...slug]/page.tsx`
- **Route Pattern**: `/acep/[any-path]` (catch-all for ACEP content)
- **Data Source**: Snapshot HTML + extracted post data
- **Layout**:
  - ✅ IEA-style hero section
  - ✅ Context-aware back button (detects category from URL)
  - ✅ Featured image
  - ✅ Main content (8 columns)
  - ✅ Sidebar (4 columns) with Resource Centre links
  - ✅ PDF downloads section
- **Menu**: Static sidebar with Resource Centre links
- **Back Navigation Logic**:
  ```typescript
  - News/Blog → /news-blog-posts
  - Press → /press-statements
  - Report/Annual → /annual-reports
  - Research/Policy → /research-and-policy-papers
  - Default → /
  ```
- **Status**: ✅ Better implementation than `/posts/[...slug]`

### Contract Detail Pages

#### `/contracts/[id]/page.tsx`
- **Layout**: Full-width with contract-specific sidebar
- **Menu**: Uses `ContractsSidebar` component via layout
- **Features**:
  - ✅ Contract-specific information
  - ✅ Status badges
  - ✅ Detailed metadata
  - ✅ Related information cards
- **Sidebar**: Platform-specific navigation (Contract Monitor menu)

---

## 3. Menu Embedding Systems

### System 1: Platform-Specific Sidebars (Layout-Based)

**Used By**: `/contracts`, `/electricity`, `/oil-revenue`, `/tax`

#### Implementation Pattern:
```tsx
// layout.tsx
import { PlatformSidebar } from "@/components/platform/platform-sidebar";

export default function PlatformLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <PlatformSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
```

#### Sidebar Components:

1. **ContractsSidebar** (`/contracts`)
   - Items: Overview, All Contracts, Contract Map, Statistics
   - Uses: `SidebarNav` component
   - Base Path: `/contracts`

2. **ElectricitySidebar** (`/electricity`)
   - Items: Overview, Generation, Transmission, Distribution (Northern/Southern), Access, Consumption, Reported Challenges, Report a Challenge
   - Uses: `SidebarNav` component
   - Base Path: `/electricity`

3. **OilRevenueSidebar** (`/oil-revenue`)
   - Items: Overview, Collection, Allocation, Management, Projects, Resource Centre, Contact Us
   - Uses: `SidebarNav` component
   - Base Path: `/oil-revenue`

4. **TaxSidebar** (`/tax`)
   - Items: Overview, Tax Revenue, Revenue Trends, Tax Sources, Whistleblower, Tax Compliance, About OpenTax
   - Uses: `SidebarNav` component
   - Base Path: `/tax`

**Characteristics**:
- ✅ Consistent design across platforms
- ✅ Sticky sidebar on desktop
- ✅ Mobile drawer menu
- ✅ Active state highlighting
- ✅ Icon support

### System 2: Static Resource Centre Sidebar (Inline)

**Used By**: 
- `/research-and-policy-papers` (via `IEAListing`)
- `/news-blog-posts` (via `IEAListing`)
- `/press-statements` (via `IEAListing`)
- `/posts/[...slug]` (detail page)
- `/acep/[...slug]` (detail page)
- `/annual-reports`
- `/radar`

#### Implementation Pattern:
```tsx
<aside className="lg:col-span-4">
  <div className="sticky top-24 space-y-6">
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Resource Centre</h3>
        <div className="space-y-2 text-sm">
          <Link href="/research-and-policy-papers">Research & Policy Papers</Link>
          <Link href="/press-statements">Press Statements</Link>
          {/* ... more links */}
        </div>
      </CardContent>
    </Card>
  </div>
</aside>
```

**Characteristics**:
- ✅ Consistent across Resource Centre pages
- ✅ Sticky positioning
- ✅ Simple link list
- ⚠️ Hardcoded links (not dynamic)
- ⚠️ No active state indication

### System 3: No Sidebar (Full-Width)

**Used By**: 
- `/reports` (has stats cards instead)
- `/` (homepage)
- Various program pages

**Characteristics**:
- Full-width content
- No navigation sidebar
- May have other navigation elements (cards, tabs, etc.)

---

## 4. Menu Consistency Analysis

### ✅ Consistent Patterns

1. **Platform Pages** (`/contracts`, `/electricity`, `/oil-revenue`, `/tax`)
   - All use `SidebarNav` component
   - All have layout-based sidebar
   - All have mobile drawer support
   - All have active state highlighting

2. **Resource Centre Pages** (IEA-style listings)
   - All use same sidebar structure
   - All have same links
   - All use sticky positioning

3. **Detail Pages** (`/posts/[...slug]`, `/acep/[...slug]`)
   - Both use Resource Centre sidebar
   - Both have similar layout structure
   - Both have PDF download sections

### ⚠️ Inconsistencies Found

1. **Back Navigation**:
   - `/posts/[...slug]`: Always goes to `/news-blog-posts` (hardcoded)
   - `/acep/[...slug]`: Context-aware (detects category from URL)
   - **Recommendation**: Make `/posts/[...slug]` context-aware like `/acep/[...slug]`

2. **Sidebar Links**:
   - IEA-style pages: Include "All Reports" link
   - Detail pages: Don't include "All Reports" link
   - **Recommendation**: Standardize sidebar links across all pages

3. **Search/Filter**:
   - IEA-style pages: Have search and category filter
   - `/reports`: No search/filter
   - `/annual-reports`, `/radar`: No search/filter
   - **Recommendation**: Add search/filter to all listing pages

4. **Category Display**:
   - IEA-style pages: Show category badges
   - `/reports`: Shows category in card header
   - Detail pages: No category display
   - **Recommendation**: Add category badges to detail pages

---

## 5. Page Type Breakdown

### Listing Pages

| Page | Component | Search | Filter | Sidebar | Status |
|------|-----------|--------|--------|---------|--------|
| `/research-and-policy-papers` | IEAListing | ✅ | ✅ | Resource Centre | ✅ Complete |
| `/news-blog-posts` | IEAListing | ✅ | ✅ | Resource Centre | ✅ Complete |
| `/press-statements` | IEAListing | ✅ | ✅ | Resource Centre | ✅ Complete |
| `/annual-reports` | Snapshot | ❌ | ❌ | Resource Centre | ⚠️ Needs IEA |
| `/radar` | Snapshot | ❌ | ❌ | Resource Centre | ⚠️ Needs IEA |
| `/reports` | Custom | ❌ | ❌ | None | ⚠️ Needs Enhancement |

### Detail Pages

| Page | Route Pattern | Back Navigation | Sidebar | PDF Support | Status |
|------|---------------|----------------|---------|-------------|--------|
| `/posts/[...slug]` | `/posts/*` | Hardcoded | Resource Centre | ✅ | ⚠️ Needs Fix |
| `/acep/[...slug]` | `/acep/*` | Context-aware | Resource Centre | ✅ | ✅ Complete |
| `/contracts/[id]` | `/contracts/:id` | Via sidebar | Platform sidebar | N/A | ✅ Complete |

### Platform Pages

| Page | Sidebar Type | Menu Items | Status |
|------|--------------|------------|--------|
| `/contracts` | Platform | 4 items | ✅ Complete |
| `/electricity` | Platform | 9 items | ✅ Complete |
| `/oil-revenue` | Platform | 7 items | ✅ Complete |
| `/tax` | Platform | 7 items | ✅ Complete |

---

## 6. Recommendations

### High Priority

1. **Standardize Detail Page Back Navigation**
   - Update `/posts/[...slug]` to use context-aware back navigation like `/acep/[...slug]`
   - Use categorization system to determine correct back link

2. **Convert Remaining Listing Pages to IEA Design**
   - Convert `/annual-reports` to use `IEAListing`
   - Convert `/radar` to use `IEAListing`
   - Enhance `/reports` with search/filter or convert to `IEAListing`

3. **Standardize Sidebar Links**
   - Create a shared constant for Resource Centre sidebar links
   - Ensure all pages use the same links
   - Add active state indication

4. **Add Category Information to Detail Pages**
   - Display category badge in hero section
   - Show related posts by category
   - Add category-based navigation

### Medium Priority

5. **Enhance Search Functionality**
   - Add full-text search (currently client-side only)
   - Add search result highlighting
   - Add search analytics

6. **Improve Menu System**
   - Create a unified sidebar component that can handle both platform and resource centre menus
   - Add breadcrumb navigation
   - Add "Related Posts" section in detail page sidebars

7. **Add Filtering to Reports Page**
   - Add category filter
   - Add year filter
   - Add search functionality

### Low Priority

8. **Add Navigation Breadcrumbs**
   - Show full path: Home > Resource Centre > Research & Policy Papers > Post Title
   - Make breadcrumbs clickable

9. **Add Related Content Sections**
   - Show related posts in detail page sidebars
   - Group by category or tags
   - Show "You might also like" section

10. **Enhance Mobile Navigation**
    - Improve mobile menu for platform pages
    - Add swipe gestures for mobile sidebar
    - Optimize touch targets

---

## 7. Code Structure Analysis

### Component Hierarchy

```
Layout System:
├── Root Layout (Header + Footer)
├── Platform Layouts
│   ├── ContractsLayout → ContractsSidebar
│   ├── ElectricityLayout → ElectricitySidebar
│   ├── OilRevenueLayout → OilRevenueSidebar
│   └── TaxLayout → TaxSidebar
└── Default Layout (no sidebar)

Listing Components:
├── IEAListing (IEA-style with search/filter)
├── Snapshot-based listings (basic)
└── Custom listings (reports page)

Detail Components:
├── PostDetail (via /posts/[...slug])
├── AcepDetail (via /acep/[...slug])
└── ContractDetail (via /contracts/[id])
```

### Menu Component Structure

```
SidebarNav (Base Component)
├── ContractsSidebar
├── ElectricitySidebar
├── OilRevenueSidebar
└── TaxSidebar

Static Sidebars:
└── Resource Centre Sidebar (inline in pages)
```

---

## 8. Testing Checklist

### Functionality Tests

- [ ] All listing pages display content correctly
- [ ] Search works on IEA-style pages
- [ ] Category filtering works correctly
- [ ] Back navigation works on detail pages
- [ ] Sidebar links are correct on all pages
- [ ] Mobile menus work on all platform pages
- [ ] PDF downloads work on detail pages
- [ ] Active states show correctly in sidebars

### Design Consistency Tests

- [ ] All IEA-style pages have consistent hero sections
- [ ] All sidebars have consistent styling
- [ ] All detail pages have consistent layouts
- [ ] Category badges display correctly
- [ ] Responsive design works on all pages

### Navigation Tests

- [ ] Platform sidebars navigate correctly
- [ ] Resource Centre sidebars navigate correctly
- [ ] Back buttons navigate to correct pages
- [ ] Breadcrumbs (if added) work correctly
- [ ] Mobile navigation works on all pages

---

## 9. Summary

### Strengths

1. ✅ Consistent platform sidebar system
2. ✅ IEA-style design on main listing pages
3. ✅ Context-aware navigation on `/acep/[...slug]`
4. ✅ Responsive design across all pages
5. ✅ Intelligent categorization system

### Weaknesses

1. ⚠️ Inconsistent back navigation on detail pages
2. ⚠️ Some listing pages not using IEA design
3. ⚠️ Hardcoded sidebar links (not centralized)
4. ⚠️ Missing search/filter on some pages
5. ⚠️ No category display on detail pages

### Next Steps

1. Fix `/posts/[...slug]` back navigation
2. Convert `/annual-reports` and `/radar` to IEA design
3. Enhance `/reports` with search/filter
4. Centralize sidebar link definitions
5. Add category information to detail pages

---

**Last Updated**: January 27, 2026
**Review Status**: Complete
**Action Items**: 5 high priority, 3 medium priority, 2 low priority
