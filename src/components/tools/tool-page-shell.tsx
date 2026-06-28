import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Tool } from "@/lib/tools";

export function ToolPageShell({
  tool,
  children,
}: {
  tool: Tool;
  children: React.ReactNode;
}) {
  const Icon = tool.icon;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All tools
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {tool.name}
            </h1>
            <Badge variant="secondary">{tool.category}</Badge>
          </div>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {tool.longDescription}
          </p>
        </div>
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}
