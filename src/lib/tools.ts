import {
  Calculator,
  TrendingUp,
  ImageDown,
  FileText,
  type LucideIcon,
} from "lucide-react";

/**
 * Central tool registry — the single source of truth for every tool on the site.
 *
 * The landing-page showcase, the /tools index grid and the footer all map over
 * this array. To add a new tool:
 *   1. Create the route at  src/app/tools/<slug>/page.tsx
 *   2. Implement the component in  src/components/tools/
 *   3. Append an entry below — it then appears everywhere automatically.
 */
export type Tool = {
  /** URL slug — must match the folder under app/tools/<slug> */
  slug: string;
  /** Display name */
  name: string;
  /** Short one-line description for cards */
  description: string;
  /** Longer description shown on the tool page header / metadata */
  longDescription: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Grouping label shown as a badge */
  category: "Finance" | "Media" | "Utility" | "Business";
  /** Keywords for SEO metadata */
  keywords: string[];
};

export const tools: Tool[] = [
  {
    slug: "calculator",
    name: "Calculator",
    description: "A fast, keyboard-friendly calculator for everyday math.",
    longDescription:
      "A clean online calculator for quick arithmetic — addition, subtraction, multiplication, division, percentages and decimals. Fully keyboard-accessible.",
    icon: Calculator,
    category: "Utility",
    keywords: ["calculator", "online calculator", "math", "percentage"],
  },
  {
    slug: "investment-calculator",
    name: "Investment & ROI Calculator",
    description:
      "Project future value, total gain and ROI for any investment plan.",
    longDescription:
      "Estimate how your money could grow. Enter an initial amount, monthly contribution, expected annual return and time horizon to see future value, total invested, total gain and return on investment — with a year-by-year growth chart.",
    icon: TrendingUp,
    category: "Finance",
    keywords: [
      "investment calculator",
      "roi calculator",
      "compound interest",
      "return on investment",
    ],
  },
  {
    slug: "youtube-thumbnail",
    name: "YouTube Thumbnail Downloader",
    description:
      "Grab thumbnails from any YouTube video in every resolution.",
    longDescription:
      "Paste any YouTube link and instantly preview and download its thumbnail images in all available resolutions, from HD (maxres) down to standard quality. Works with regular, short (youtu.be), Shorts and embed URLs.",
    icon: ImageDown,
    category: "Media",
    keywords: [
      "youtube thumbnail downloader",
      "download youtube thumbnail",
      "thumbnail grabber",
      "hd thumbnail",
    ],
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    description:
      "Create a professional invoice and download it as a PDF — free.",
    longDescription:
      "Build a clean, professional invoice in minutes. Add your business and client details, line items, tax and notes, watch the live preview update, then download a print-ready PDF. Everything stays in your browser.",
    icon: FileText,
    category: "Business",
    keywords: [
      "invoice generator",
      "free invoice",
      "invoice pdf",
      "create invoice",
    ],
  },
];

/** Look up a single tool by slug. */
export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

/** Convenience: the href for a tool's page. */
export function toolHref(slug: string): string {
  return `/tools/${slug}`;
}
