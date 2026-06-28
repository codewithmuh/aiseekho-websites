import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";
import {
  YoutubeIcon,
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
} from "@/components/icons/brand-icons";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team — feedback, tool requests and questions are always welcome.`,
};

const channels = [
  {
    href: siteConfig.social.youtube,
    label: "YouTube",
    handle: "@codewithmuh",
    icon: YoutubeIcon,
  },
  {
    href: siteConfig.social.github,
    label: "GitHub",
    handle: "View our projects",
    icon: GithubIcon,
  },
  {
    href: siteConfig.social.twitter,
    label: "Twitter / X",
    handle: "Follow for updates",
    icon: TwitterIcon,
  },
  {
    href: siteConfig.social.linkedin,
    label: "LinkedIn",
    handle: "Connect with us",
    icon: LinkedinIcon,
  },
].filter((c) => c.href);

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk"
        description="Questions, feedback or a tool you'd love to see? We read everything. The fastest way to reach us is by email."
      />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {/* Email card */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center sm:p-10">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquare className="size-7" />
          </span>
          <h2 className="text-xl font-semibold">Email us directly</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Drop us a line and we&apos;ll get back to you as soon as we can.
            Whether it&apos;s a bug, a question or a tool request, we want to
            hear it.
          </p>
          <Button
            size="lg"
            className="mt-1"
            render={<a href={`mailto:${siteConfig.email}`} />}
          >
            <Mail className="size-4" />
            {siteConfig.email}
          </Button>
        </div>

        {/* Social channels */}
        <div className="mt-8">
          <h3 className="text-center text-sm font-medium text-muted-foreground">
            Or find us on
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <channel.icon className="size-5" />
                </span>
                <div>
                  <p className="font-medium">{channel.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {channel.handle}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
