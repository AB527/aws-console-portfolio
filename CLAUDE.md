@AGENTS.md

## Project Overview
AWS Management Console-style personal portfolio for Atharva Bedekar.
Built with Next.js 16 (App Router), Tailwind CSS, TypeScript, Zustand, @dnd-kit.

## Critical Next.js 16 Rules
- `params` and `searchParams` in page components are **Promises** — always `await` them
  ```tsx
  const { serviceId } = await params
  const { region = "ap-south-1" } = await searchParams
  ```
- `useSearchParams()` requires a `<Suspense>` wrapper at the page level
- Use `next/navigation` only — never `next/router`
- Server Components by default; add `"use client"` only for hooks/interactivity/browser APIs
- Import JSON data files directly in Server Components — no API routes needed for static data

## Directory Structure
```
src/
├── app/                        # All routes (App Router)
│   ├── layout.tsx              # Root layout — wraps everything in ConsoleLayout
│   ├── page.tsx                # / → Console home dashboard
│   ├── getting-started/        # /getting-started
│   ├── s3/home/                # /s3/home → buckets list
│   │   └── [bucketId]/         # /s3/home/[bucketId] → bucket detail
│   │       └── [objectKey]/    # /s3/home/[bucketId]/[objectKey] → object detail
│   ├── iam/
│   │   ├── home/               # /iam/home → IAM dashboard
│   │   ├── groups/             # /iam/groups → all groups
│   │   │   └── [groupId]/      # /iam/groups/[groupId] → group detail
│   │   └── users/              # /iam/users → all users
│   │       └── [userId]/       # /iam/users/[userId] → user detail
│   ├── ec2/home/               # /ec2/home → projects list
│   └── [serviceId]/home/       # fallback generic service page
├── components/
│   ├── layout/                 # Topbar, Sidebar, ConsoleLayout, SettingsDropdown, Breadcrumb
│   ├── home/                   # Dashboard widgets (DashboardGrid, RecentlyVisited, etc.)
│   ├── services/               # s3/, iam/, ec2/, GenericServicePage
│   └── ui/                     # Badge, StatusBadge, PolicyTag, ServiceIcon
├── data/                       # ALL content lives here as JSON — never hardcode strings
│   ├── services.json           # Service definitions (id, title, iconId, regions, color)
│   ├── s3.json                 # Buckets + objects
│   ├── iam-groups.json         # Skill groups + skills
│   ├── iam-users.json          # Experience/role users + policies
│   ├── ec2-projects.json       # Projects as EC2 instances
│   ├── solutions.json          # Solutions widget tabs + items
│   ├── know-me.json            # Know Me widget items
│   ├── explore.json            # Achievements/highlights
│   ├── dashboard-layout.json   # Default widget grid layout
│   └── getting-started.json    # Getting started page sections
├── store/
│   └── useConsoleStore.ts      # Zustand store (persisted to localStorage)
├── hooks/
│   └── useRegion.ts            # Syncs ?region= URL param ↔ Zustand
├── lib/
│   └── formatDate.ts           # formatDate, formatPeriod, formatMonthYear
└── assets/icons/               # SVG icons named by iconId from services.json
```

## State Management (Zustand)
Store: `src/store/useConsoleStore.ts` — persisted to localStorage key `"aws-console-state"`

| State field       | Type                              | Purpose                                      |
|-------------------|-----------------------------------|----------------------------------------------|
| selectedRegion    | "ap-south-1" \| "ap-south-17"    | Active region — synced with ?region= param   |
| recentlyVisited   | string[]                          | Last 8 visited serviceIds, deduped           |
| widgetLayout      | WidgetLayout[]                    | colSpan/rowSpan/order/visible per widget      |
| activeBucket      | string \| null                    | S3 drill-down state                          |
| visualMode        | "browser-default" \| "light"      | Theme — applied as data-theme on <html>      |
| hiddenWidgets     | string[]                          | Widget IDs removed from dashboard            |

## Region System
- Two regions: `ap-south-1` (Mumbai) and `ap-south-17` (Raipur)
- Region stored in Zustand AND as `?region=` URL query param — always kept in sync
- `useRegion.ts` hook handles the sync — use it in any component that reads/sets region
- Services with `global: true` in services.json ignore region (always accessible)
- Services with `global: false` check if selectedRegion is in their `regions` array
- If region mismatch → show "Service not available in this region" empty state

## Routing Conventions
- Service home pages: `/[serviceId]/home?region=`
- Special pages with sub-routes: `/s3/home/...` and `/iam/...` (defined before `[serviceId]`)
- `s3` and `iam` and `ec2` have their own `src/app/s3/`, `src/app/iam/`, `src/app/ec2/` folders
  so they don't fall into the `[serviceId]` catch-all
- Navigating to any service calls `visitService(serviceId)` in Zustand

## Data Rules
- ALL content is in `src/data/*.json` — zero hardcoded strings in components
- Dates always stored as `"YYYY-MM-DD"` strings in JSON
- Periods stored as `periodFrom: "YYYY-MM-DD"` and `periodTo: "YYYY-MM-DD" | ""`
- Empty `periodTo` means "Present"
- Always display dates via `formatDate()` / `formatPeriod()` / `formatMonthYear()` from `src/lib/formatDate.ts`
- Solutions widget tab labels computed as `"${tab.name} (${tab.items.length})"` — never in JSON

## Dashboard Grid
- 4-column CSS grid: `grid-template-columns: repeat(4, 1fr)`
- Each widget: `style={{ gridColumn: "span N", gridRow: "span M" }}`
- Drag to reorder: `@dnd-kit/sortable` — drag handle (⠿) appears on widget header hover
- Resize: bottom-right corner handle (⤡) cycles colSpan between min↔max from dashboard-layout.json
- Layout persisted in Zustand widgetLayout
- "Reset to default layout" reloads from dashboard-layout.json defaults
- No "+ Add widgets" button (future feature)
- Each widget card has: drag handle top-left | title + Info badge | ⋮ menu (Remove only) | resize handle bottom-right

## IAM Service
- Groups (`iam-groups.json`): skill categories with skill list and level badges
- Users (`iam-users.json`): experiences/roles — each user has `groups: string[]` (can belong to multiple)
- Skill levels: Advanced = green badge, Intermediate = blue badge, Beginner = grey badge
- Policy effect: Allow = green badge, Deny = red badge
- User status: Active = green badge, Inactive = grey badge
- `/iam/users/[userId]` has two tabs: Summary and Permissions (N) where N = policy count

## EC2 / Projects Service
- Projects displayed as EC2 instances list (`ec2-projects.json`)
- Status "running" = green dot, "stopped" = grey dot
- Clicking a row opens an inline detail drawer (no separate route)
- Detail shows: name, status, description, tags as chips, details paragraph, link button, period

## S3 / Documents Service
- `/s3/home` → buckets list
- `/s3/home/[bucketId]` → bucket detail with tabs (Objects active, rest "Coming soon")
- `/s3/home/[bucketId]/[objectKey]` → object detail with Open button (disabled if url is empty)
- Breadcrumb on all nested S3 pages

## Topbar
- Left: orange "AB" logo square + grid icon + search bar (⌘K styled, not functional yet)
- Right: bell | ? | gear (→ SettingsDropdown) | region dropdown | "Soul Texture (027825871572)"
- Region dropdown: ap-south-1 Asia Pacific (Mumbai) / ap-south-17 Asia Pacific (Raipur)

## Settings Dropdown
- Dark panel bg-[#1a2332]
- "Current user settings" heading
- Language: dropdown showing "English" only (non-interactive, styled)
- Visual mode — *beta*: Browser default (◉) | Light (○) | Dark (○ disabled, greyed)
- No "See all user settings" link
- Visual mode updates Zustand visualMode → applies data-theme to <html>

## Styling Constants
```
Page background:   #f0f2f5
Topbar:            #232f3e
Topbar hover:      #37475a
Settings panel:    #1a2332
Links / accent:    #0073bb
CTA orange:        #ff9900
Widget card:       white, rounded-sm, border-gray-200, shadow-sm
Font:              Inter, system-ui, sans-serif
```

## Packages
```json
"zustand": "latest",
"@dnd-kit/core": "latest",
"@dnd-kit/sortable": "latest",
"@dnd-kit/utilities": "latest"
```
No other additional packages. Use Tailwind for all styling.

## Do Not
- Do not hardcode any content strings in components
- Do not use `next/router` (use `next/navigation`)
- Do not forget `await params` / `await searchParams` in page components
- Do not use `any` in TypeScript
- Do not add `"use client"` to files that don't need it
- Do not create API routes for static JSON data
- Do not render `useSearchParams()` outside a `<Suspense>` boundary
```