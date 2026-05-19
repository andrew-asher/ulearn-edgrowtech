import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/bookmarks")({ component: () => (
  <div>
    <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Bookmarks</div>
    <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Student Bookmarks</h1>
    <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
      Mock view — student bookmark analytics will appear here.
    </div>
  </div>
)});
