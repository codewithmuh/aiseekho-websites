import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { InvestmentCalculator } from "@/components/tools/investment-calculator";
import { getTool } from "@/lib/tools";

const tool = getTool("investment-calculator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.longDescription,
  keywords: tool?.keywords,
};

export default function InvestmentCalculatorPage() {
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool}>
      <InvestmentCalculator />
    </ToolPageShell>
  );
}
