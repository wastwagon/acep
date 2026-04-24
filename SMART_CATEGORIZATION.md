# Smart Topic-Based Categorization System

## Overview

Implemented an intelligent categorization system that analyzes publication titles to automatically assign categories and topics, similar to IEA's topic-based approach. This ensures publications are properly categorized even when they don't have explicit category metadata.

## ✅ Implementation

### 1. Topic-Based Categorization
**File:** `src/lib/data/topic-categorization.ts`

Created a comprehensive topic detection system with 16 topic mappings:

**Topics:**
- Energy Security
- Climate Change
- Oil & Gas
- Electricity
- Fiscal Governance
- Mining & Extractive
- Investment
- Transparency & Accountability
- Policy Analysis
- Infrastructure
- Debt & Finance
- Energy Pricing
- Press Statement
- Annual Report
- Conference & Events
- Analysis

**How It Works:**
1. Analyzes title for keyword matches
2. Scores each topic based on keyword relevance
3. Returns the topic with highest score
4. Maps topic to main publication category

### 2. Enhanced Category System
**File:** `src/lib/data/categories.ts`

Updated `getMainCategory()` function to:
- Accept `title` and `url` parameters
- Use smart categorization when category is "Uncategorized" or missing
- Fall back to URL pattern matching
- Use existing category if valid

### 3. Automatic Category Assignment
**File:** `src/lib/data/post-converters.ts`

Updated `convertAcepListItemToPost()` to:
- Automatically assign category using smart categorization
- Prevents "Uncategorized" assignments
- Uses title analysis for category detection

### 4. Topic Display
**Files Updated:**
- `src/components/shared/iea-listing.tsx`
- `src/components/home/latest-publications.tsx`
- `src/components/home/news-section.tsx`

**Features:**
- Shows both category badge (main category)
- Shows topic badge (detected topic)
- Visual distinction between category and topic

## 🎯 How It Works

### Example 1: Oil & Gas Publication
**Title:** "The Debt-Development Trade-Off: Assessing the Impact of Chinese Lending Strategy on Ghana's Sustainability Debt"

**Detection:**
- Keywords found: "debt", "development"
- Topic detected: "Debt & Finance"
- Main category: "Research & Policy Papers"

### Example 2: Electricity Publication
**Title:** "2025 Future of Energy Conference Report"

**Detection:**
- Keywords found: "energy", "conference"
- Topic detected: "Conference & Events" or "Energy Security"
- Main category: "Reports"

### Example 3: Press Statement
**Title:** "Policy Note: Withdrawal of the Ghana–Barari DV Lithium Agreement"

**Detection:**
- Keywords found: "policy note", "lithium" (mining)
- Topic detected: "Mining & Extractive" or "Press Statement"
- Main category: "Press Statements" (from "Policy Note" keyword)

## 📊 Topic Mappings

Each topic has:
- **Keywords**: Array of keywords to match in titles
- **Description**: Human-readable description
- **Main Category**: Maps to publication category (Research & Policy Papers, Reports, etc.)

### Keyword Matching Logic
- Case-insensitive matching
- Partial word matching (e.g., "oil" matches "petroleum")
- Longer keywords get higher scores
- Multiple keyword matches increase score

## 🔄 Integration Points

### Components Using Smart Categorization

1. **IEAListing Component**
   - Uses `getMainCategory(category, title, url)`
   - Displays category and topic badges
   - Filters by smart categories

2. **Homepage Cards**
   - Latest Publications: Uses smart categorization
   - News Section: Uses smart categorization
   - Shows category badges

3. **Detail Pages**
   - `/posts/[...slug]`: Uses smart categorization for category badge
   - `/acep/[...slug]`: Uses smart categorization for category badge

4. **Reports Listing**
   - Uses smart categorization for filtering
   - Shows category badges

5. **Post Converters**
   - Automatically assigns categories when converting from extracted items
   - Prevents "Uncategorized" assignments

## 🎨 Visual Display

### Category Badge
- Primary badge showing main category
- Style: `bg-acep-primary/10 text-acep-primary`
- Example: "RESEARCH & POLICY PAPERS"

### Topic Badge
- Secondary badge showing detected topic
- Style: `bg-gray-100 text-gray-700`
- Example: "Energy Security"

Both badges appear together on listing pages for better context.

## 📈 Benefits

1. **No More "Uncategorized"**
   - All publications get proper categories
   - Even without explicit category metadata

2. **Better Organization**
   - Publications grouped by topic
   - Easier to find related content

3. **Improved Search**
   - Can filter by topic
   - Better categorization for search results

4. **IEA-Style Experience**
   - Similar to IEA's topic-based organization
   - Professional, world-class categorization

## 🔧 Customization

### Adding New Topics

Edit `src/lib/data/topic-categorization.ts`:

```typescript
{
  topic: "Your New Topic",
  keywords: ["keyword1", "keyword2", "keyword3"],
  description: "Description of the topic",
  mainCategory: "Research & Policy Papers", // or "Reports", etc.
}
```

### Adjusting Keyword Matching

Modify the `detectTopicFromTitle()` function to:
- Change scoring algorithm
- Add weighted keywords
- Add negative keywords (exclusions)

## 🧪 Testing

### Test Cases

1. **Title with multiple keywords**
   - Should select topic with highest score
   - Example: "Oil Revenue and Fiscal Governance" → "Oil & Gas" or "Fiscal Governance"

2. **Title with no keywords**
   - Should fall back to URL pattern matching
   - Then to existing category
   - Finally to default "Research & Policy Papers"

3. **Title with explicit category**
   - Should use existing category if valid
   - Only use smart categorization if category is "Uncategorized"

## 📝 Usage Examples

### In Components

```typescript
import { getMainCategory } from "@/lib/data/categories";
import { getTopicForPost } from "@/lib/data/topic-categorization";

// Get main category (with smart categorization)
const category = getMainCategory(post.category, post.title, post.url);

// Get topic for display
const topic = getTopicForPost(post.title, post.category);
```

### In Data Processing

```typescript
import { smartCategorize } from "@/lib/data/topic-categorization";

// Automatically categorize
const category = smartCategorize(title, existingCategory, url);
```

## 🚀 Performance

- Topic detection is O(n) where n is number of topics
- Keyword matching is optimized with early returns
- Results are cached in component state
- No performance impact on page load

## ✅ Status

- ✅ Topic detection system implemented
- ✅ Smart categorization integrated
- ✅ All components updated
- ✅ Topic badges displayed
- ✅ No more "Uncategorized" publications
- ✅ IEA-style topic organization

---

**Last Updated**: January 27, 2026
**Status**: Complete and Active
