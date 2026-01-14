# Erasmus Mundus Tracker - Design Guidelines

## Design Approach

**Selected System:** Material Design 3 with academic/educational refinements
**Rationale:** Information-dense application requiring excellent data hierarchy, filtering UI, and scannable program cards. Material Design's elevation system and component library excel at organizing complex information while maintaining clarity.

## Typography System

**Font Stack:**
- Headers: Inter (weights: 600, 700)
- Body: Inter (weights: 400, 500)
- Data/Numbers: SF Mono for deadline displays

**Hierarchy:**
- Page titles: text-4xl font-bold
- Section headers: text-2xl font-semibold
- Card titles: text-lg font-semibold
- Body text: text-base
- Metadata/labels: text-sm text-gray-600

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-6
- Card spacing: gap-4
- Section margins: my-8
- Container max-width: max-w-7xl

**Grid System:**
- Program cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Filters sidebar: Fixed 280px on desktop, full-width drawer on mobile
- Detail pages: Two-column split (2/3 content + 1/3 sidebar on desktop)

## Core Components

**Program Card:**
- Elevated card (shadow-md hover:shadow-lg transition)
- Structure: University badge → Program name → Key stats grid (3 columns) → Deadline indicator → CTA
- Deadline urgency: Color-coded badge (green: >30 days, yellow: 7-30 days, red: <7 days)

**Filter Panel:**
- Sticky sidebar with sections: Field dropdown, Country multi-select, Deadline range slider, Funding toggles
- Collapsible sections on mobile
- Clear filters button at bottom

**Navigation:**
- Top app bar: Logo + Search + "Compare" counter badge + User icon
- Breadcrumbs for detail pages
- Bottom tab bar on mobile (Home, Programs, Timeline, Saved)

**Data Displays:**
- Stats cards: Large number display with icon and label (Total Programs, Countries, Avg Deadline)
- Timeline: Horizontal scrollable month view with program dots
- Comparison table: Sticky column headers, alternating row backgrounds

**Forms/Inputs:**
- Material-style outlined text fields
- Dropdown selects with search capability
- Range sliders with value labels
- Chip-based multi-select for countries/fields

## Images

**Hero Section (Home page only):**
- Large background image: European university campus scene (warm, inviting) with subtle gradient overlay
- Centered search bar with blurred-background button overlay
- Height: 60vh on desktop, 50vh on mobile

**Program Detail Pages:**
- University/consortium logo at top (max 120px height)
- Optional: Campus photo gallery (4 images, grid layout)

**Icons:**
- Heroicons for UI elements
- Flag icons via CDN for country indicators

## Page-Specific Layouts

**Home:**
- Hero with search (60vh)
- Stats row (4 cards, grid)
- Featured programs carousel
- Upcoming deadlines section
- Footer with quick links

**Program Listing:**
- Filter sidebar (left, 280px)
- Main content area: Sort controls + grid of program cards
- Pagination at bottom
- "No results" state with filter reset suggestions

**Program Detail:**
- Hero: University name + logo + Apply button (blurred background if image)
- Two-column: Left (Requirements, Dates, Consortium, Description), Right (Quick facts card sticky + Contact info)
- Similar programs section at bottom

**Timeline:**
- Month selector tabs
- Calendar grid with program markers
- Click opens program quick-view modal

## Animations

**Minimal Approach:**
- Card hover: subtle lift (translateY -2px)
- Filter changes: smooth fade transition (200ms)
- Page transitions: none (instant)
- Loading states: simple spinner, no skeleton screens

## Accessibility

- Consistent focus rings (ring-2 ring-blue-500)
- ARIA labels on filter controls
- Keyboard navigation for card grids
- High contrast deadline badges (WCAG AA compliant)

---

**Design Philosophy:** Academic clarity over visual flair. Every element serves the user's goal: find the right program before the deadline passes.