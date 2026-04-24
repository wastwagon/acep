# Library-Style Categorization System

## Overview

Implemented a comprehensive library-style categorization system that expands filtering capabilities to include sectors, topics, and subcategories. This provides a much more granular and library-like browsing experience, similar to IEA's topic system but expanded for ACEP's diverse publications.

## ✅ Implementation

### 1. Comprehensive Topic & Sector System
**File:** `src/lib/data/library-categorization.ts`

**7 Main Sectors:**
1. **Energy** - Energy sector analysis and policy
2. **Extractive Industries** - Petroleum, mining, lithium, critical minerals
3. **Fiscal Governance** - Revenue, tax, budget, debt management
4. **Climate & Environment** - Climate change, methane, carbon emissions
5. **Infrastructure** - Energy, social, transport infrastructure
6. **Transparency & Accountability** - Contract transparency, revenue transparency
7. **Investment & Finance** - FDI, project finance, PPPs

**30+ Detailed Topics:**
- Energy: Energy Security, Energy Access, Renewable Energy, Energy Transition, Energy Pricing
- Extractive: Petroleum, Oil & Gas, Mining, Lithium, Critical Minerals, Extractive Governance
- Fiscal: Revenue Management, Debt Management, Budget Analysis, Tax Policy
- Climate: Climate Change, Methane Emissions, Carbon Emissions
- Infrastructure: Energy Infrastructure, Social Infrastructure
- Transparency: Contract Transparency, Revenue Transparency
- Investment: Foreign Direct Investment, Project Finance
- And more...

**Subcategories:**
- Petroleum: Exploration, Production, Revenue, Contracts, Upstream, Downstream
- Mining: Gold, Diamond, Bauxite, Manganese, Lithium, Other Minerals

### 2. Library-Style Listing Component
**File:** `src/components/shared/library-listing.tsx`

**Features:**
- ✅ **Triple Filter System**: Category, Sector, Topic filters
- ✅ **Filter Type Selector**: Toggle between Category/Sector/Topic views
- ✅ **Enhanced Search**: Searches titles, excerpts, categories, topics, and sectors
- ✅ **Sidebar Browsing**: Browse by Sector, Topic, and Category with counts
- ✅ **Hierarchical Display**: Shows Category → Sector → Topic badges
- ✅ **Library Feel**: Multiple ways to discover content

### 3. Updated All Listing Pages
**Pages Updated:**
- `/research-and-policy-papers` → Uses `LibraryListing`
- `/news-blog-posts` → Uses `LibraryListing`
- `/press-statements` → Uses `LibraryListing`
- `/annual-reports` → Uses `LibraryListing`
- `/radar` → Uses `LibraryListing`

## 🎯 Filter System

### Filter Types

1. **Category Filter** (Main Publication Types)
   - Research & Policy Papers
   - Reports
   - Press Statements
   - News & Blog Posts
   - ACEP Radar

2. **Sector Filter** (Industry Sectors)
   - Energy
   - Extractive Industries
   - Fiscal Governance
   - Climate & Environment
   - Infrastructure
   - Transparency & Accountability
   - Investment & Finance

3. **Topic Filter** (Specific Topics)
   - 30+ granular topics
   - Examples: Petroleum, Lithium, Methane Emissions, Energy Security, etc.

### Filter UI

**Top Bar:**
- Search bar (searches across all fields)
- Filter type selector (Category/Sector/Topic buttons)
- Filter dropdown (shows options for selected filter type)
- Clear filters button

**Sidebar:**
- Browse by Sector (with topic counts)
- Browse by Topic (with sector labels)
- Browse by Category (with publication counts)
- Resource Centre links

## 📊 Topic Coverage

### Energy Topics
- Energy Security
- Energy Access
- Renewable Energy
- Energy Transition
- Energy Pricing
- Energy Policy
- Energy Efficiency
- Energy Infrastructure

### Extractive Topics
- Petroleum
- Oil & Gas
- Mining
- Lithium
- Gold Mining
- Diamond Mining
- Bauxite
- Manganese
- Critical Minerals
- Extractive Governance

### Fiscal Topics
- Revenue Management
- Tax Policy
- Budget Analysis
- Debt Management
- Public Finance
- Fiscal Transparency
- Revenue Allocation
- Economic Policy

### Climate Topics
- Climate Change
- Methane Emissions
- Carbon Emissions
- Environmental Policy
- Sustainability
- Green Energy
- Climate Finance
- Adaptation

### Infrastructure Topics
- Energy Infrastructure
- Transport Infrastructure
- Social Infrastructure
- Water & Sanitation
- Healthcare Infrastructure
- Education Infrastructure
- Digital Infrastructure

### Transparency Topics
- Contract Transparency
- Revenue Transparency
- Open Data
- Anti-Corruption
- Whistleblower Protection
- Public Disclosure
- Accountability Mechanisms

### Investment Topics
- Foreign Direct Investment
- Project Finance
- Infrastructure Investment
- Energy Investment
- Public-Private Partnerships
- Development Finance

## 🎨 Visual Display

### Badge System
Publications now show three types of badges:

1. **Category Badge** (Primary)
   - Style: `bg-acep-primary/10 text-acep-primary`
   - Example: "RESEARCH & POLICY PAPERS"

2. **Sector Badge** (Secondary)
   - Style: `bg-blue-50 text-blue-700`
   - Example: "Extractive Industries"

3. **Topic Badge** (Tertiary)
   - Style: `bg-gray-100 text-gray-700`
   - Example: "Lithium"

### Example Display
```
[RESEARCH & POLICY PAPERS] [Extractive Industries] [Lithium]
May 7, 2025
Policy Note: Withdrawal of the Ghana–Barari DV Lithium Agreement
```

## 🔍 Search Capabilities

Enhanced search now searches across:
- Title
- Excerpt
- Category
- Topic (detected from title)
- Sector (detected from title)
- Keywords

## 📚 Library-Style Browsing

### Browse by Sector
- Shows all 7 sectors
- Displays topic count per sector
- Click to filter by sector

### Browse by Topic
- Shows all 30+ topics
- Displays sector label for each topic
- Shows publication count
- Click to filter by topic

### Browse by Category
- Shows main publication categories
- Displays publication count
- Click to filter by category

## 🎯 User Experience

### Multiple Discovery Paths

1. **Search**: Type keywords to find publications
2. **Browse by Sector**: Start broad (e.g., "Extractive Industries")
3. **Browse by Topic**: Start specific (e.g., "Lithium")
4. **Browse by Category**: Start by publication type (e.g., "Research & Policy Papers")
5. **Combined Filters**: Use multiple filters together

### Example User Journeys

**Journey 1: Find Lithium Publications**
1. Click "Topic" filter type
2. Select "Lithium" from dropdown
3. See all lithium-related publications

**Journey 2: Find Extractive Sector Publications**
1. Click "Sector" filter type
2. Select "Extractive Industries"
3. See all extractive-related publications (petroleum, mining, lithium, etc.)

**Journey 3: Find Methane Publications**
1. Type "methane" in search
2. Or click "Topic" → "Methane Emissions"
3. See all methane-related publications

## 🔧 Technical Details

### Smart Categorization
- Analyzes title for keywords
- Detects sector and topic simultaneously
- Assigns main category based on sector/topic
- Falls back to URL patterns if needed
- Uses existing category if valid

### Performance
- Topic/sector detection is O(n) where n is number of topics
- Results cached in component state
- Efficient filtering with useMemo
- No performance impact on page load

### Data Structure
```
Publication
├── Main Category (Research & Policy Papers, Reports, etc.)
├── Sector (Energy, Extractive Industries, etc.)
└── Topic (Petroleum, Lithium, Methane Emissions, etc.)
```

## 📈 Benefits

1. **Granular Filtering**: 30+ topics vs. 5 categories
2. **Sector-Based Discovery**: Browse by industry sector
3. **Topic-Based Discovery**: Browse by specific topics
4. **Library Feel**: Multiple browsing paths
5. **Better Search**: Searches topics and sectors too
6. **Visual Hierarchy**: Clear category → sector → topic display
7. **Comprehensive Coverage**: Covers all ACEP publication areas

## 🎯 Coverage Areas

### Energy Topics ✅
- Energy Security, Access, Pricing, Transition, Renewable Energy

### Extractive Topics ✅
- Petroleum, Oil & Gas, Mining, Lithium, Critical Minerals

### Fiscal Topics ✅
- Revenue, Tax, Budget, Debt Management

### Climate Topics ✅
- Climate Change, Methane Emissions, Carbon Emissions

### Infrastructure Topics ✅
- Energy, Social, Transport Infrastructure

### Transparency Topics ✅
- Contract Transparency, Revenue Transparency, Anti-Corruption

### Investment Topics ✅
- FDI, Project Finance, PPPs

## ✅ Status

- ✅ Comprehensive topic system (30+ topics)
- ✅ Sector-based organization (7 sectors)
- ✅ Library-style browsing interface
- ✅ Triple filter system (Category/Sector/Topic)
- ✅ Enhanced search capabilities
- ✅ All listing pages updated
- ✅ Visual badge system
- ✅ Sidebar browsing panels

---

**Last Updated**: January 27, 2026
**Status**: Complete - Library-style categorization system fully implemented
