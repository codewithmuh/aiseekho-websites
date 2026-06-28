import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Tool, toolHref } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link href={toolHref(tool.slug)} className="group block h-full">
      <Card className="h-full p-6 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-lg">
        <div className="flex items-start justify-between">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-6" />
          </span>
          <Badge variant="secondary">{tool.category}</Badge>
        </div>
        <h3 className="mt-5 text-lg font-semibold tracking-tight">
          {tool.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Open tool
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Card>
    </Link>
  );
}
