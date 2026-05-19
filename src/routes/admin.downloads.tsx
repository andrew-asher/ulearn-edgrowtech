import { createFileRoute } from "@tanstack/react-router";
import { papers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/admin/downloads")({ component: DownloadsAdmin });

function DownloadsAdmin() {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Downloads</div>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Paper Downloads</h1>
      <div className="mt-8 rounded-2xl border border-border/60 bg-card divide-y divide-border/60">
        {papers.map((p) => (
          <div key={p.id} className="p-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-display font-semibold">{p.subject} · {p.year} · {p.paperType}</div>
              <div className="text-xs text-muted-foreground">{p.downloadUrl}</div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <a href={p.downloadUrl} download><Download className="h-4 w-4 mr-1.5" /> Download</a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
