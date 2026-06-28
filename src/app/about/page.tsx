import type { Metadata } from "next";
import Link from "next/link";
import { Gift, ShieldCheck, Zap, Rocket } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${siteConfig.name} — a free, privacy-friendly collection of online tools that run entirely in your browser.`,
};

const values = [
  {
    icon: Gift,
    title: "Free, always",
    description:
      "We believe useful tools shouldn't be locked behind paywalls or sign-up walls. Every tool here is free to use.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy first",
    description:
      "Our tools run in your browser. We don't upload your numbers, files or invoices to a server.",
  },
  {
    icon: Zap,
    title: "Fast and simple",
    description:
      "No clutter, no distractions. Open a tool and get your answer in seconds.",
  },
  {
    icon: Rocket,
    title: "Always growing",
    description:
      "We add new tools regularly based on what people actually need. Got a request? Tell us.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={`Why we built ${siteConfig.name}`}
        description={`${siteConfig.name} is a home for small, dependable utilities that make everyday tasks easier — without the friction of accounts, ads or fees.`}
      />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="space-y-5 text-pretty leading-relaxed text-muted-foreground">
          <p>
            The internet is full of simple tools wrapped in pop-ups, trackers
            and forced registrations. We wanted the opposite: a clean place
            where you can do a quick calculation, plan an investment, grab a
            thumbnail or generate an invoice — and get on with your day.
          </p>
          <p>
            We started with {tools.length} essential tools and we&apos;re
            building more all the time. Each one is designed to be fast,
            accessible and to respect your privacy by running entirely on your
            device whenever possible.
          </p>
          <p>
            {siteConfig.name} is built with modern web technology (Next.js,
            React and Tailwind CSS) and is completely free to use. If a tool
            saves you time, that&apos;s the whole point.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <value.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{value.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-border bg-muted/40 p-8 text-center">
          <h2 className="text-xl font-semibold">Have an idea for a tool?</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            We love suggestions. Tell us what would make your work easier and we
            might build it next.
          </p>
          <Button className="mt-2" render={<Link href="/contact" />}>
            Get in touch
          </Button>
        </div>
      </section>
    </>
  );
}
