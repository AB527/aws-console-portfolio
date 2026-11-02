# AB Console — portfolio

Personal portfolio for Atharva Bedekar, built to look and behave like a cloud management console.
Each "service" in the console is a section of the portfolio.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Zustand, @dnd-kit.

## Commands
```
npm run dev      # dev server on http://localhost:3000
npm run build    # production build
npm run lint     # eslint
npx tsc --noEmit # type-check
```
Run lint and the type-check before calling a change done.

## Next.js 16 — read the docs first
This version has breaking changes; APIs, conventions and file structure may differ from what you
remember. Read the relevant guide in `node_modules/next/dist/docs/` before using a Next API, and
heed deprecation notices.

- `params` and `searchParams` in pages/layouts are **Promises** — always `await` them
  ```tsx
  const { bucketId } = await params
  const { view } = await searchParams
  ```
- `useSearchParams()` must sit inside a `<Suspense>` boundary
- Use `next/navigation` only — never `next/router`
- Server Components by default; add `"use client"` only for hooks, interactivity or browser APIs
- Import JSON data directly in Server Components — no API routes for static data
- Viewport/theme colour go in `export const viewport` (root layout), not in `metadata`

## Services
Route ids keep the short console-style names; everything the visitor reads uses the portfolio title.
Never print a route id as a label — call `serviceTitle(id)` from `src/lib/serviceTitle.ts`.

| Route id     | Title shown | Content                                   | Data file(s)                          |
|--------------|-------------|-------------------------------------------|---------------------------------------|
| `ec2`        | Projects    | Projects and project types                | `ec2-projects.json`                   |
| `s3`         | Documents   | Resumes, letters, certifications          | `s3.json` + files in `public/s3/`     |
| `iam`        | Skills      | Skill groups, skills, role history        | `iam-groups.json`, `iam-users.json`, `iam-console.json` |
| `vpc`        | Connect     | Links, social, contact                    | `vpc.json`                            |
| `cloudtrail` | Experience  | Work history timeline                     | derived from `iam-users.json` in `src/lib/cloudtrail.ts` |

Service definitions (id, title, iconId, colour, regions) live in `src/data/services.json`.
Icons are `public/icons/<iconId>.png`; the browser-tab favicon switches to the current service's
icon (see `ConsoleLayout.tsx`).

## Routes
```
/                               → redirects to /console/home
/console/home                   dashboard
/console/services               all services
/getting-started  /privacy  /terms
/ec2/home                       ?view=instances | instance-types | instance-type-finder, ?project=, ?type=
/s3/home                        buckets list
/s3/buckets/[bucketId]          bucket detail
/s3/buckets/[bucketId]/[objectKey]
/iam/home  /iam/groups  /iam/groups/[groupId]  /iam/skills  /iam/users  /iam/users/[userId]
/vpc/home  /vpc/connects  /vpc/connects/[connectId]  /vpc/subnets  /vpc/route-tables
/cloudtrail/home  /cloudtrail/events  /cloudtrail/trails
/[serviceId]/home               generic fallback for any other service id
```
Each service folder has its own `layout.tsx` (sidebar + top bar), so it never falls into the
`[serviceId]` catch-all. Opening a service calls `visitService(id)` in the store.

## Directory structure
```
src/
├── app/                 routes (see above); layout.tsx wraps everything in ConsoleLayout
├── components/
│   ├── layout/          Topbar, SearchBar, ServicesMenu, dropdowns, ConsoleFooter, the Q and
│   │                    shell panels, MobileMoreMenu, MobileNavToggle, ServiceTopBar, breadcrumbs
│   ├── home/            DashboardGrid, AddWidgetsPanel, WidgetInfoPanel and the widgets
│   ├── services/        ec2/, s3/, iam/, vpc/, cloudtrail/, GenericServicePage
│   └── ui/              Badge, StatusBadge, PolicyTag, ServiceIcon, FavoriteStar, SidebarIcons
├── data/                all content, as JSON
├── store/useConsoleStore.ts
├── hooks/useRegion.ts
└── lib/                 formatDate, serviceTitle, constants, awsFont, fileExt, s3Files, vpc, cloudtrail
public/
├── icons/               service icons (png) and misc svg
└── s3/<object id>/      the actual document files — see public/s3/README.md
```

## Data rules
- Content belongs in `src/data/*.json`, not in components. Page and browser-tab titles come from
  `site.json`; sidebar/table copy for a service comes from its `*-console.json` / data file.
- Dates are `"YYYY-MM-DD"` strings. Periods are `periodFrom` / `periodTo`; an empty `periodTo`
  means "Present".
- Always render dates through `formatDate()` / `formatPeriod()` / `formatMonthYear()` in
  `src/lib/formatDate.ts`.
- Counts in labels (e.g. `"${tab.name} (${tab.items.length})"`) are computed, never stored.
- A document's Open / Download buttons enable only when its file exists under `public/s3/<id>/`.

## State (Zustand)
`src/store/useConsoleStore.ts`, persisted to localStorage key `"aws-console-state"`.

Persisted (listed in `partialize`):

| Field             | Purpose                                              |
|-------------------|------------------------------------------------------|
| selectedRegion    | `"ap-south-1"` \| `"ap-south-17"`, synced with `?region=` |
| recentlyVisited   | last 8 visited service ids, deduped                  |
| widgetLayout      | colSpan / rowSpan / order / visible per widget       |
| hiddenWidgets     | widget ids removed from the dashboard                |
| favorites         | starred service ids                                  |
| visualMode        | `"browser-default"` \| `"light"` → `data-theme` on `<html>` |
| notificationsRead | bell badge cleared                                   |
| activeBucket      | Documents drill-down state                           |

Session-only UI flags (do **not** add these to `partialize`): `cloudShellOpen`, `amazonQOpen`,
`mobileNavOpen`, `addWidgetsOpen`, `sidebarCollapsed`.

The store's `merge` drops widgets that no longer exist and appends new defaults, so changing
`dashboard-layout.json` is safe for returning visitors.

## Regions
- Two regions, defined in `src/data/regions.json`: `ap-south-1` (Mumbai) and `ap-south-17` (Raipur).
  UI copy calls them "AB Region".
- The region lives in the store **and** in the `?region=` query param; `useRegion()` keeps them in
  sync — use it wherever region is read or set.
- Services with `global: true` ignore the region. Others are only available in the regions listed
  in their `regions` array.

## Dashboard
- Widgets and their limits are declared in `dashboard-layout.json` (default/min/max col and row
  span, `defaultVisible`, `removable`).
- Desktop: 4-column grid. Each widget sets `--col` / `--row` CSS variables that are applied as grid
  spans only from `lg` up. Below `lg` the grid is a single column.
- Reorder with @dnd-kit (drag handle on the widget header); resize with the bottom-right handle.
  Both are desktop-only.
- "+ Add widgets" opens a side panel of widgets not on the dashboard — drag one onto the grid or
  click to append. "Reset to default layout" restores the JSON defaults.

## Responsive rules
Desktop is the reference design. **Anything at `lg` (1024px) and wider must stay visually
unchanged** — add mobile behaviour with `max-lg:` / `max-md:` variants instead of editing the
desktop classes.

- `lg` switches the service sidebars and the dashboard; `md` switches the top bar.
- Service sidebars become a slide-in drawer below `lg`: apply `mobileDrawerClass(mobileNavOpen)`
  from `ui/SidebarIcons.tsx` to the `<aside>` and render `<MobileNavToggle />` in the service top bar.
- Top bar below `md`: search collapses to an icon that expands on focus; Help, Settings, Region and
  Account move into the full-screen "More" panel (`MobileMoreMenu`).
- Tables keep their columns and scroll sideways inside an `overflow-x-auto` wrapper. No page-level
  horizontal scroll at 360–390px.
- Page gutters are `px-4 lg:px-6`.

## Styling
Tailwind only. Console chrome uses Open Sans via `openSans` from `src/lib/awsFont.ts`; the rest
uses Inter.

```
Top bar / dark panels   #0f1620, #161d26, #1b232d
Footer                  #232f3e
Settings panel          #1a2332
Page background         #f2f3f3
Links                   #0073bb (light) / #006ce0 (console) / #75b8ff, #42b4ff (on dark)
CTA orange              #ff9900
Cards                   white, rounded, border-gray-200, shadow-sm
Fixed chrome            top bar 56px, footer 32px
```

## Packages
Runtime dependencies are `next`, `react`, `react-dom`, `zustand` and the three `@dnd-kit` packages.
Do not add others without asking.

## Do not
- Use `any` in TypeScript
- Use `next/router`, or forget to `await` `params` / `searchParams`
- Render `useSearchParams()` outside `<Suspense>`
- Add `"use client"` to files that don't need it
- Create API routes for static JSON
- Hardcode content strings or service names in components
- Change how the desktop layout looks while working on mobile
