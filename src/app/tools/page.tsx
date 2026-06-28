import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ToolCard } from "@/components/tools/tool-card";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse every free tool on ToolHub — calculator, investment & ROI calculator, YouTube thumbnail downloader, invoice generator and more.",
};

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Every tool, in one place"
        description="A growing collection of free, browser-based utilities. Pick one and start right away — no sign-up required."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </>
  );
}
