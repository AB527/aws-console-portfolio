# Contributing

Thanks for your interest! Bug reports, fixes and small improvements are welcome.

## Workflow

1. Open an issue first for anything larger than a small fix.
2. Fork the repo and branch from `main`. Keep one change per pull request.
3. Set up locally: `npm install`, then `npm run dev` (see the [README](README.md)).
4. Before opening a PR, make sure these pass:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
5. Describe what changed and, for UI changes, add a screenshot (desktop and mobile if relevant).

Pull requests that change the personal content (resume, projects, skills, documents, contact
details) are not accepted.

## Conventions

The full guide is [CLAUDE.md](CLAUDE.md). The essentials:

- **Content lives in `public/data/*.json`**, never hardcoded in components. Content files are fetched
  at runtime with `useData()`; only the "frame" files (site, services, sidebars, help, settings, ...)
  are imported.
- **Never print a route id** (`ec2`, `s3`, ...) as a label. Use `serviceTitle(id)`.
- **One sidebar component.** Add or change a service's sidebar in `public/data/sidebars.json`, not in code.
- **Described, not hand-built.** Settings cards come from `settings.json`; Studio screens come from
  `src/components/studio/sections/`. Add a field or section there instead of writing a page.
- **Dates** are `"YYYY-MM-DD"` and always rendered through `src/lib/formatDate.ts`.
- **Dark mode:** colour page content with the theme tokens (`bg-surface`, `text-ink`, `border-line`, ...),
  not bare hex values or `bg-white`.
- **Responsive:** desktop (`lg`, 1024px and up) is the reference and must stay visually unchanged.
  Add mobile behaviour with `max-lg:` / `max-md:` variants.
- **Next.js 16:** `params` and `searchParams` are Promises (await them); use `next/navigation`;
  wrap `useSearchParams()` in `<Suspense>`; add `"use client"` only when needed.
- **TypeScript:** no `any`.
- **Dependencies:** don't add runtime packages without discussing it in an issue first.
- **Studio** route files are `page.dev.tsx` / `layout.dev.tsx` on purpose; don't rename them.

## Reporting bugs

Include the page URL, browser, screen width and steps to reproduce.
