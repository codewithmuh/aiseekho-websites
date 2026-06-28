import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Decorative gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/15%),transparent_60%)]"
      />
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          {tools.length} free tools and counting
        </div>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          Simple, free tools that just{" "}
          <span className="text-primary">work</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          {siteConfig.name} is a growing collection of fast, privacy-friendly
          online tools. No accounts, no installs, no fees — everything runs
          right in your browser.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/tools" />}>
            Explore all tools
            <ArrowRight className="size-4" />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/about" />}>
            Learn more
          </Button>
        </div>
      </div>
    </section>
  );
}
