import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Bookmark, MessageSquare, ArrowRight } from "lucide-react";
import { mockStudents } from "@/lib/admin-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/students")({ component: StudentsAdmin });

function StudentsAdmin() {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Students</div>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Student Profiles</h1>
      <p className="mt-2 text-muted-foreground">Open a student to view their bookmarks and AI chat history.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {mockStudents.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold truncate">{s.name}</div>
                <div className="text-xs text-muted-foreground truncate">{s.email} · {s.stream}</div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 text-xs">
              <Badge variant="secondary" className="rounded-full"><Bookmark className="h-3 w-3 mr-1" /> {s.bookmarks.length}</Badge>
              <Badge variant="secondary" className="rounded-full"><MessageSquare className="h-3 w-3 mr-1" /> {s.aiHistory.length}</Badge>
            </div>
            <Button asChild size="sm" variant="outline" className="mt-4 rounded-full">
              <Link to="/admin/students/$studentId" params={{ studentId: s.id }}>
                Open profile <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
