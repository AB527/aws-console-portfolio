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
- No API routes for static data — see "Data loading" for how JSON reaches a page
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

Service definitions (id, title, iconId, colour, regions) live in `public/data/services.json`.
Icons are `public/icons/<iconId>.png`; the browser-tab favicon switches to the current service's
icon (see `ConsoleLayout.tsx`).

## Sidebars
There is one sidebar component, `src/components/layout/ServiceSidebar.tsx`. Do not write a sidebar
per service — add or edit the service's entry in `public/data/sidebars.json`.

- `<ServiceSidebar serviceId="ec2" />` renders the title, the close button and the links for that
  id. A service with no entry gets the `default` one (`%s` in an href becomes the service id).
- An entry has an optional `title` (defaults to `serviceTitle(id)`), top-level `items` and
  collapsible `sections`. An item is `{ label, href }`, plus `activeViews` when it covers several
  `?view=` values or `match` when it covers a whole path prefix.
- The close button only closes the sidebar; it never navigates. From `lg` up the sidebar collapses
  to a thin rail with an expand button, below `lg` the drawer slides away.
- Service-specific extras go in as children (see the Connect filter in `VpcShell.tsx`).
- Console home uses the same panel (`SidebarPanel`, entry `console`) with its own open state,
  closed by default; its hamburger is blue only while the panel is open.
- `sidebarNav(id)` / `sidebarLinks(id)` give the same data to breadcrumbs.

## Routes
```
/                               → redirects to /console/home
/console/home                   dashboard
/console/services               all services
/settings/home                  Unified settings, User settings tab
/settings/account               Unified settings, Account settings tab
/settings/[section]/edit        edit page for one settings card
/privacy  /terms
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
│   │                    shell panels, MobileMoreMenu, MobileNavToggle, ServiceTopBar, ServiceSidebar, HelpPanel, breadcrumbs
│   ├── home/            DashboardGrid, AddWidgetsPanel, WidgetInfoPanel and the widgets
│   ├── services/        ec2/, s3/, iam/, vpc/, cloudtrail/, GenericServicePage
│   └── ui/              Badge, StatusBadge, PolicyTag, ServiceIcon, FavoriteStar, SidebarIcons, DataStatus
├── store/useConsoleStore.ts
├── hooks/               useRegion, useData
└── lib/                 formatDate, serviceTitle, constants, awsFont, fileExt, s3Files, vpc, cloudtrail
public/
├── data/                all content, as JSON (import alias `@data/*`)
├── icons/               service icons (png) and misc svg
└── s3/<object id>/      the actual document files — see public/s3/README.md
```

## Data rules
- Content belongs in `public/data/*.json`, not in components. Page and browser-tab titles come from
  `site.json`; sidebar/table copy for a service comes from its `*-console.json` / data file.
- Dates are `"YYYY-MM-DD"` strings. Periods are `periodFrom` / `periodTo`; an empty `periodTo`
  means "Present".
- Always render dates through `formatDate()` / `formatPeriod()` / `formatMonthYear()` in
  `src/lib/formatDate.ts`.
- Counts in labels (e.g. `"${tab.name} (${tab.items.length})"`) are computed, never stored.
- A document's Open / Download buttons enable only when its file exists under `public/s3/<id>/`.
  The server lists those files with `objectFileUrls()` and passes the list to the client component.

## Data loading
Everything in `public/data/` is also a public URL (`/data/<name>.json`). The files fall in two groups.

**Frame files** — `site`, `services`, `services-menu`, `regions`, `dashboard-layout`, `iam-console`,
`sidebars`, `help`, `settings`.
They drive the top bar, sidebars, tab titles and the store defaults, so they are imported
(`import site from "@data/site.json"`) and are there on first paint.

**Content files** — the other 13. The browser fetches them at runtime:
```tsx
const { data, error, reload } = useData("vpc")   // src/hooks/useData.ts; data is null while loading
```
- Never `import` a content file into a component. A type-only import is fine, and
  `ContentData["vpc"]` from `useData.ts` gives the same type.
- Nothing is cached: `useData` fetches with `cache: "no-store"` every time a component mounts.
  Components that mount together share the one request that is in flight.
- While `data` is null, keep headings and table headers on screen and render `<DataStatus>` (or
  `<DataStatusRow>` inside a `<tbody>`) where the rows will go. Computed counts show `–`.
  Pass `error` and `reload` so a failed fetch shows a Retry button.
- The shared tables (`ResourceTable`, `ResourceSplitView`, `TrailsTable`, `EventsTable`) take a
  `status` prop for this.
- Helpers in `src/lib/vpc.ts` and `src/lib/cloudtrail.ts` are functions that take the fetched data.
- Loading and error copy lives under `data` in `site.json`.
- Server pages may import a content file only for `generateMetadata`, `generateStaticParams` and
  `notFound()`. The page body still fetches it in the browser.
- A new content file needs an entry in `ContentData` in `useData.ts`.

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
| visualMode        | `"browser-default"` \| `"light"` \| `"dark"`, see "Dark mode"  |
| notificationsRead | bell badge cleared                                   |
| activeBucket      | Documents drill-down state                           |
| language, favoritesBarDisplay, favoritesBarIconSize, qHelpLinks | Unified settings values that are only remembered |
| rememberRecentlyVisited | off: `visitService` records nothing            |
| hiddenRegions, hiddenServices | ids hidden on the Account settings tab     |

Session-only UI flags (do **not** add these to `partialize`): `cloudShellOpen`, `amazonQOpen`,
`mobileNavOpen`, `addWidgetsOpen`, `sidebarCollapsed`, `helpTopic`.

The store's `merge` drops widgets that no longer exist and appends new defaults, so changing
`dashboard-layout.json` is safe for returning visitors.

## Unified settings
The gear dropdown links to `/settings/home` ("See all user settings"). The pages are **described,
not hand-built**: every card is a section in `public/data/settings.json` (title, copy, `tab`,
`groups` of `fields`), rendered by `components/settings/SettingsHome.tsx` (cards with current
values) and `SettingsEdit.tsx` (the Edit page). To add a setting, add a field there and a key to
`ConsoleSettings` in the store; do not write a page for it.

- A field's `key` is a `ConsoleSettings` key. `control` is `select`, `radio`, `toggle` or
  `checklist`; options are inline or `optionsFrom: "regions" | "services"`.
- A checklist stores what is **hidden**, so an empty list means "all visible". It cannot be saved
  with everything unticked.
- An edit page changes nothing until Save, which calls `applySettings(patch)`. "Reset all" calls
  `resetUserSettings()` and leaves the account tab alone.
- `hiddenRegions` filters the Region menu and the Default Region select; `hiddenServices` filters
  the services menu, search and the All services page. A new list of regions or services should
  honour them too.
- Helpers (options, card summaries) are in `src/lib/settings.ts`.

## Dark mode
`visualMode` resolves to `data-theme="light"` or `"dark"` on `<html>` (`resolveTheme()` in
`src/lib/theme.ts`). Browser default follows the system setting. An inline script in the root layout
sets the attribute before first paint; `ConsoleLayout` keeps it in sync afterwards.

Page content is coloured with tokens declared in `globals.css` (`@theme` holds the light values,
`:root[data-theme="dark"]` the dark ones). The already-dark chrome (top bar, footer, dropdown
panels, `Sidebar`, `CloudShellPanel`) does not use them and looks the same in both modes.

| Token | Light | Dark | Use |
|---|---|---|---|
| `page` | `#f2f3f3` | `#0f141a` | page background |
| `surface` | `#ffffff` | `#161d26` | cards, tables, modals, panels |
| `surface-subtle` | `#f9f9fa` | `#1b232d` | table headers, chips, neutral hover |
| `surface-selected` | `#f0fbff` | `#001129` | hover and selected rows |
| `line` / `line-subtle` / `line-strong` | `#c6c6cd` / `#ebebf0` / `#8c8c94` | `#424650` / `#232b37` / `#656871` | borders, dividers |
| `ink` / `ink-body` / `ink-muted` / `ink-disabled` | `#0f141a` / `#424650` / `#656871` / `#b4b4bb` | `#ebebf0` / `#c6c6cd` / `#a4a4ad` / `#656871` | text |
| `link` / `link-hover` | `#006ce0` / `#002b66` | `#42b4ff` / `#75cfff` | links, outlined buttons, focus rings |
| `success` / `warning` / `warning-surface` / `danger` | `#00802f` / `#855900` / `#fffef0` / `#d91515` | `#2bb534` / `#fbd332` / `#2a2410` / `#ff7a7a` | status text |

- New page content uses the token utilities (`bg-surface`, `text-ink`, `border-line`, …), never a
  bare light hex or `bg-white`.
- An older class whose light value differs from the token (`text-gray-900`, `border-gray-200`,
  `text-[#0073bb]`) stays, with a dark variant beside it: `text-gray-900 dark:text-ink`. That keeps
  light mode unchanged.
- Fills that keep their colour in both modes keep fixed text too: orange CTA
  `bg-[#ff9900] text-[#0f141a]`, blue `bg-[#006ce0] text-white`, white toggle knobs `bg-white`.
- SVG strokes use `currentColor` or `var(--color-…)`, not a hex.

## Regions
- Two regions, defined in `public/data/regions.json`: `ap-south-1` (Mumbai) and `ap-south-17` (Raipur).
  UI copy calls them "AB Region".
- The region lives in the store **and** in the `?region=` query param; `useRegion()` keeps them in
  sync — use it wherever region is read or set.
- `s3`, `iam` and `vpc` are `global: true`: on their pages the Region selector reads "Global"
  (`globalLabel` in `regions.json`) and its list is disabled. `ec2` and `cloudtrail` are regional;
  Experience filters its trails and events to the selected Region in `useTrails()`
  (`CloudTrailData.tsx`), while Skills still lists every role.
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

## Help panel
`src/components/layout/HelpPanel.tsx` is the right-hand help panel. Console home and every service
layout render it beside the page content. It shows the topic in the store's `helpTopic`, and
closes when the visitor navigates to another page.

- Every "Info" beside a heading is `<InfoLink topic="…" />` (`ui/InfoLink.tsx`). Never write a
  bare "Info" link. Shared tables (`ResourceTable`, `ResourceSplitView`, `VpcTable`) take an
  `infoTopic` prop. Dashboard widgets use their widget id as the topic.
- Topics, the Yes / No feedback links and the Learn more links are all in `public/data/help.json`.
  A new Info link needs a topic there, with a `title`. Text may use `**bold**` and
  `[label](href)`. No em dashes in help copy.
- Top bars carry the info icon (`layout/HelpToggle.tsx`), filled blue while the panel is open.
  `ServiceTopBar` adds it on every service page and picks the topic from `pages` in `help.json`
  (keyed by path, or `path?view=`; an unlisted page uses its closest listed parent). A new page
  needs an entry there.
- The panel and Add widgets share the right-hand slot, so the store closes one when the other opens.

The All services page (`/console/services`) uses the same top bar as console home
(`ConsoleHomeShell` with a `breadcrumb`) and lays out `all-services.json` as "Services by category".

## Studio (development only)
`/studio` is an admin for the data files, organised by service and use case (Projects, Documents,
Skills, Connect, home widgets, console settings, text labels). `/studio/[section]` is a list with
Add / Edit / Delete and a form, or a single settings form. The footer shows a "Studio" link in
development.

- Its route files are named `page.dev.tsx` / `layout.dev.tsx`. `next.config.mjs` adds the `dev.tsx`
  page extension only under `next dev`, so the routes and their code are absent from a production
  build. Never rename them to plain `page.tsx`.
- Screens are **described, not hand-built**. A use case is one `Section` object in
  `src/components/studio/sections/content.ts` (portfolio content) or `console.ts` (console
  structure and text): the file, where its records live (`source`), the list `columns` and the
  form `fields`. The types are in `schema.ts`. To cover a new data file or key, add a section or a
  field there; do not write a page for it.
- `engine.ts` holds the pure logic (read records, build and read back a form, add / update /
  remove / move, validation, delete checks). A record must come back byte-identical when opened
  and saved unchanged: use `omitEmpty` on a field whose key is absent from some records.
- Ids are generated on create (`auto`) and locked afterwards (`lock`) because other data and
  links point at them. `guard` on a section blocks deleting a record that is still used; the
  cross-references are computed in `loadLookups()` in `src/lib/studio.ts`.
- Saving goes through Server Actions in `src/app/studio/actions.ts`, which refuse outside
  development. `saveDataFile` only overwrites an existing file and writes 2-space JSON.
  `uploadDocument` stores a document at `public/s3/<id>/file.<ext>`; saving `s3.json` regenerates
  the table in `public/s3/README.md`.
- Studio labels are written in the studio code, not in `public/data/`, because that folder ships
  to production.
- The production build type-checks with `tsconfig.build.json`, which leaves out the dev server's
  generated route types in `.next/dev`.

## Responsive rules
Desktop is the reference design. **Anything at `lg` (1024px) and wider must stay visually
unchanged** — add mobile behaviour with `max-lg:` / `max-md:` variants instead of editing the
desktop classes.

- `lg` switches the service sidebars and the dashboard; `md` switches the top bar.
- Sidebars become a slide-in drawer below `lg`. `ServiceSidebar` handles this itself; render
  `<MobileNavToggle />` in the service top bar (`ServiceTopBar` already does).
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
