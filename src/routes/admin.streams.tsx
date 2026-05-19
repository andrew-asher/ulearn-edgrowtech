import { createFileRoute } from "@tanstack/react-router";
import { streams } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/streams")({ component: () => (
  <SimpleList title="Streams" rows={streams.map((s) => ({ name: s.name, meta: s.status, sub: s.description }))} />
)});

export function SimpleList({ title, rows }: { title: string; rows: { name: string; meta: string; sub?: string }[] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">{title}</div>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Manage {title}</h1>
      <div className="mt-8 rounded-2xl border border-border/60 bg-card divide-y divide-border/60">
        {rows.map((r) => (
          <div key={r.name} className="p-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-display font-semibold">{r.name}</div>
              {r.sub && <div className="text-xs text-muted-foreground mt-0.5">{r.sub}</div>}
            </div>
            <Badge variant={r.meta === "available" ? "default" : "secondary"} className="rounded-full">{r.meta}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
