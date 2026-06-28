import Link from "next/link";
import { Wrench, Mail } from "lucide-react";
import {
  YoutubeIcon,
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
} from "@/components/icons/brand-icons";
import { siteConfig } from "@/lib/site";
import { tools, toolHref } from "@/lib/tools";

const socialLinks = [
  { href: siteConfig.social.youtube, label: "YouTube", icon: YoutubeIcon },
  { href: siteConfig.social.github, label: "GitHub", icon: GithubIcon },
  { href: siteConfig.social.twitter, label: "Twitter", icon: TwitterIcon },
  { href: siteConfig.social.linkedin, label: "LinkedIn", icon: LinkedinIcon },
].filter((s) => s.href);

export function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wrench className="size-4" />
            </span>
            <span className="text-lg tracking-tight">{siteConfig.name}</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-4 flex items-center gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Tools</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={toolHref(tool.slug)}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/about"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-3.5" />
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built with Next.js · Free forever, no sign-up.</p>
        </div>
      </div>
    </footer>
  );
}
