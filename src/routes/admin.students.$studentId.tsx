import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, MessageSquare, Bot, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockStudents } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/students/$studentId")({
  component: StudentDetail,
  notFoundComponent: () => (
    <div className="text-center">
      <h1 className="font-display text-2xl font-bold">Student not found</h1>
      <Link to="/admin/students" className="text-primary hover:underline mt-2 inline-block">Back to students</Link>
    </div>
  ),
});

function StudentDetail() {
  const { studentId } = Route.useParams();
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) throw notFound();

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
        <Link to="/admin/students"><ArrowLeft className="h-4 w-4 mr-1.5" /> All students</Link>
      </Button>
      <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Student profile</div>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
        <Users className="h-7 w-7 text-primary" /> {student.name}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{student.email} · {student.stream}</p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" /> Bookmarks
          <Badge variant="secondary" className="rounded-full ml-1">{student.bookmarks.length}</Badge>
        </h2>
        {student.bookmarks.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No bookmarks yet.
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {student.bookmarks.map((b, i) => (
              <li key={i} className="rounded-2xl border border-border/60 bg-card p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{b.paper} · {b.topic}</div>
                  <div className="mt-1 font-medium text-sm">{b.question}</div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{b.savedAt}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" /> AI Chat History
          <Badge variant="secondary" className="rounded-full ml-1">{student.aiHistory.length}</Badge>
        </h2>
        {student.aiHistory.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No AI conversations yet.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {student.aiHistory.map((m, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Student asked</span><span>{m.time}</span>
                </div>
                <div className="mt-2 font-medium">{m.question}</div>
                <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                  <Bot className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{m.answer}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
