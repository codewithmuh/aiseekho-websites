import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { InvoiceGenerator } from "@/components/tools/invoice-generator";
import { getTool } from "@/lib/tools";

const tool = getTool("invoice-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.longDescription,
  keywords: tool?.keywords,
};

export default function InvoiceGeneratorPage() {
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool}>
      <InvoiceGenerator />
    </ToolPageShell>
  );
}
