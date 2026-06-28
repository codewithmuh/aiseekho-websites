import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { YoutubeThumbnail } from "@/components/tools/youtube-thumbnail";
import { getTool } from "@/lib/tools";

const tool = getTool("youtube-thumbnail");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.longDescription,
  keywords: tool?.keywords,
};

export default function YoutubeThumbnailPage() {
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool}>
      <YoutubeThumbnail />
    </ToolPageShell>
  );
}
