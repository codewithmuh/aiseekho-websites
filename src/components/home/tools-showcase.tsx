import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tools/tool-card";
import { tools } from "@/lib/tools";

export function ToolsShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Our tools</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Pick a tool and get started — no setup required. We add new ones
            regularly.
          </p>
        </div>
        <Button
          variant="ghost"
          className="shrink-0"
          render={<Link href="/tools" />}
        >
          View all
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
