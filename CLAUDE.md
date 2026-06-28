@AGENTS.md

# ToolHub — Project Guide

ToolHub is a website hosting a growing collection of **free, browser-based
tools**. It has a marketing surface (landing, about, contact) plus the tools
themselves. This file is the source of truth for how the project is built and
how to extend it.

## What this site is

- A public, official-feeling website with a polished landing page, About and
  Contact pages, and a `/tools` section.
- Four initial tools, with more added over time:
  1. **Calculator** — everyday arithmetic.
  2. **Investment & ROI Calculator** — future value, total gain, ROI + chart.
  3. **YouTube Thumbnail Downloader** — thumbnails from any YouTube URL.
  4. **Invoice Generator** — build an invoice, export a PDF.
- **Frontend-only.** There is no backend, database, or server-side API. Every
  tool runs in the browser. Hosted on **Vercel** (free tier).

## Tech stack

- **Next.js 16 (App Router)** + **React 19** + **TypeScript** — note: this
  Next.js version has breaking changes vs. older docs (see `@AGENTS.md`).
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in
  `src/app/globals.css`. Theme tokens (indigo primary, chart colors) are CSS
  variables in that file. There is **no `tailwind.config.js`**.
- **shadcn/ui** — components live in `src/components/ui/`. This setup uses the
  **Base UI** primitives (`@base-ui/react`), **not** Radix.
  - ⚠️ Buttons do **not** support `asChild`. To render a Button as a link, use
    the `render` prop: `<Button render={<Link href="/x" />}>Label</Button>`.
  - `Select`'s `onValueChange` passes `string | null` — guard it:
    `onValueChange={(v) => v && setX(v)}`.
- **lucide-react** for icons — but **brand icons were removed** from this
  version. YouTube/GitHub/X/LinkedIn glyphs are custom SVGs in
  `src/components/icons/brand-icons.tsx`.
- **recharts** — investment growth chart.
- **jspdf** + **jspdf-autotable** — client-side invoice PDF (lazy-imported).

## Architecture: the tool registry

`src/lib/tools.ts` is the **single source of truth** for every tool. The home
showcase, the `/tools` grid and the footer all `map` over the `tools` array.
Each entry has `slug`, `name`, `description`, `longDescription`, `icon`,
`category`, `keywords`.

### Adding a new tool (the standard pattern)

1. Build the UI in `src/components/tools/<name>.tsx` (`"use client"` if
   interactive).
2. Add the route `src/app/tools/<slug>/page.tsx` — copy an existing tool page.
   It reads metadata from `getTool(slug)` and wraps the component in
   `<ToolPageShell tool={tool}>`.
3. Append an entry to the `tools` array in `src/lib/tools.ts`.

The tool then shows up everywhere automatically. Keep `slug` identical to the
route folder name.

## Conventions

- **File naming:** components are kebab-case files exporting PascalCase
  components (e.g. `tool-card.tsx` → `ToolCard`).
- **Imports:** use the `@/` alias (maps to `src/`).
- **Server vs client:** pages under `app/` are Server Components by default and
  export `metadata`. Interactive tool UIs are `"use client"` components imported
  into those pages. Keep `metadata` on the server page, not the client tool.
- **SEO:** every route exports `metadata` (pulled from the registry for tools).
  Global metadata + Open Graph live in `src/app/layout.tsx`, driven by
  `src/lib/site.ts`.
- **Styling:** Tailwind utility classes + theme tokens (`bg-primary`,
  `text-muted-foreground`, etc.). Compose classes with `cn()` from
  `src/lib/utils.ts`. Prefer existing shadcn/ui primitives over hand-rolled ones.
- **Branding/config:** never hard-code the brand name, email or social links in
  components — read them from `src/lib/site.ts`.
- **No backend:** do not add API routes, server actions that hit a DB, or
  env-var-dependent secrets. If a future tool needs a network call, prefer a
  public no-key endpoint or a third-party service called from the client.

## Commands

```bash
npm run dev      # dev server (http://localhost:3000)
npm run build    # production build — run this to verify type-safety
npm run lint     # ESLint
npm start        # serve the production build
```

Before declaring a change done, run `npm run build` (it type-checks all routes)
and `npm run lint`.

## Key files

- `src/lib/site.ts` — brand, contact, socials.
- `src/lib/tools.ts` — tool registry.
- `src/lib/invoice-pdf.ts` — invoice PDF generation.
- `src/app/layout.tsx` — root layout, global metadata, Navbar/Footer/Toaster.
- `src/app/globals.css` — Tailwind import + theme tokens.
- `src/components/tools/tool-page-shell.tsx` — shared header/back-link for tool pages.
- `src/components/tools/tool-card.tsx` — card used by showcase + tools grid.

## Things to watch out for

- This is a **newer Next.js** — read `node_modules/next/dist/docs/` before
  relying on remembered APIs (per `@AGENTS.md`).
- shadcn Button has no `asChild`; use `render` (see above).
- The YouTube CDN (`i.ytimg.com`) sends `Access-Control-Allow-Origin: *`, so
  client-side blob downloads work. `maxresdefault` may 404 / return a 120×90
  placeholder — the tool hides resolutions that fail to load.
