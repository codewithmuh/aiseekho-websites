import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_55%)]"
        />
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to get things done?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          Browse the full collection of free tools — no account, no cost, no
          catch.
        </p>
        <div className="mt-7">
          <Button size="lg" variant="secondary" render={<Link href="/tools" />}>
            Explore all tools
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
