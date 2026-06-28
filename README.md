# ToolHub — Free Online Tools

ToolHub is a growing collection of free, fast and privacy-friendly online tools.
Every tool runs entirely in your browser — no accounts, no installs, no fees.

> **Brand name is a placeholder.** Change `ToolHub` and all contact/social
> details in [`src/lib/site.ts`](src/lib/site.ts).

## Tools included

| Tool | Route | What it does |
| --- | --- | --- |
| **Calculator** | `/tools/calculator` | Keyboard-friendly arithmetic (+ − × ÷ %, decimals). |
| **Investment & ROI Calculator** | `/tools/investment-calculator` | Projects future value, total gain and ROI with a growth chart. |
| **YouTube Thumbnail Downloader** | `/tools/youtube-thumbnail` | Grabs thumbnails from any YouTube URL in every resolution. |
| **Invoice Generator** | `/tools/invoice-generator` | Builds a professional invoice and exports a PDF — fully client-side. |

More tools are added over time. See [Adding a new tool](#adding-a-new-tool).

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router) + **React 19** + **TypeScript**
- **[Tailwind CSS v4](https://tailwindcss.com)** for styling
- **[shadcn/ui](https://ui.shadcn.com)** components (built on Base UI) + **[lucide-react](https://lucide.dev)** icons
- **[recharts](https://recharts.org)** — investment growth chart
- **[jspdf](https://github.com/parallax/jsPDF)** + **jspdf-autotable** — client-side invoice PDF
- **No backend / no database.** Everything runs in the browser. Deployed on **Vercel**.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # run ESLint
```

Requires **Node.js 20+** (Node 22 recommended).

## Project structure

```
src/
  app/
    layout.tsx                 # root layout: Navbar + Footer + metadata
    page.tsx                   # landing page
    not-found.tsx              # 404 page
    about/page.tsx
    contact/page.tsx
    tools/
      page.tsx                 # all-tools grid
      calculator/page.tsx
      investment-calculator/page.tsx
      youtube-thumbnail/page.tsx
      invoice-generator/page.tsx
  components/
    layout/                    # navbar, footer, page-header
    home/                      # hero, features, tools-showcase, cta
    tools/                     # tool-card, tool-page-shell + the 4 tool UIs
    icons/                     # brand-icons (YouTube, GitHub, X, LinkedIn)
    ui/                        # shadcn/ui primitives
  lib/
    site.ts                    # brand name, contact + social links
    tools.ts                   # central tool registry (single source of truth)
    invoice-pdf.ts             # jspdf invoice generator
    utils.ts                   # cn() helper
```

## Adding a new tool

The site is driven by a central registry, so adding a tool is three small steps:

1. **Implement the UI** in `src/components/tools/<name>.tsx` (a `"use client"`
   component for anything interactive).
2. **Create the route** at `src/app/tools/<slug>/page.tsx`. Copy an existing
   tool page — it pulls its metadata from the registry and wraps the component
   in `<ToolPageShell>`.
3. **Register it** by appending an entry to the `tools` array in
   [`src/lib/tools.ts`](src/lib/tools.ts) (`slug`, `name`, `description`,
   `longDescription`, `icon`, `category`, `keywords`).

That's it — the new tool automatically appears on the home page showcase, the
`/tools` grid and the footer.

## Configuration

All brand and contact details live in [`src/lib/site.ts`](src/lib/site.ts):

- `name`, `tagline`, `description` — used across the UI and SEO metadata
- `url` — set this to your real domain after deploying (used for canonical /
  Open Graph URLs)
- `email` — shown on the Contact page and footer
- `social` — YouTube / GitHub / Twitter / LinkedIn links (empty string hides a link)

## Deploying to Vercel

This is a static-friendly Next.js app with no backend or environment variables.

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Import it at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects
   Next.js, no configuration needed.
3. After deploying, update `url` in `src/lib/site.ts` to your live domain.

You can also deploy from the CLI with `vercel` / `vercel --prod`.

## Notes

- The YouTube downloader works without an API key — it builds thumbnail URLs
  from the video ID and downloads them client-side. `maxresdefault` doesn't
  exist for every video; the UI hides resolutions that fail to load.
- The investment calculator is for illustration only and is **not financial
  advice**.
- All tools process data in the browser; nothing is uploaded to a server.

## License

Free to use. Add your preferred license here.
