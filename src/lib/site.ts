/**
 * Global site configuration.
 *
 * This is the single place to change brand name, tagline, contact details and
 * social links. Update these values once and they propagate across the navbar,
 * footer, metadata and contact page.
 */
export const siteConfig = {
  name: "ToolHub",
  // Short tagline used in hero / metadata
  tagline: "Free online tools, no sign-up required",
  description:
    "ToolHub is a growing collection of free, fast and privacy-friendly online tools. Calculator, investment & ROI calculator, YouTube thumbnail downloader, invoice generator and more — all running right in your browser.",
  // Used for canonical URLs and Open Graph. Update after deploying to Vercel.
  url: "https://toolhub.example.com",
  email: "codewithmuh@gmail.com",
  // Set these to your real profiles (empty string hides the link).
  social: {
    youtube: "https://www.youtube.com/@codewithmuh",
    github: "https://github.com/",
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
