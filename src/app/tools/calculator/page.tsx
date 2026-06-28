import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { Calculator } from "@/components/tools/calculator";
import { getTool } from "@/lib/tools";

const tool = getTool("calculator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.longDescription,
  keywords: tool?.keywords,
};

export default function CalculatorPage() {
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool}>
      <Calculator />
    </ToolPageShell>
  );
}
