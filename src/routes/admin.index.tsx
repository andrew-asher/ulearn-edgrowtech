import { createFileRoute } from "@tanstack/react-router";
import { useAdminStore, mockStudents } from "@/lib/admin-store";
import { FileText, ListChecks, BookOpen, GitBranch, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { streams, subjects } = useAdminStore();
  const activeStreams = streams.filter((s) => s.status === "available").length;
  const totalPapers = subjects.reduce(
    (n, s) => n + s.content.pastPapers.items.length + s.content.modelPapers.items.length,
    0,
  );
  const qCount = (p: { sections: { questions: unknown[] }[] }) =>
    p.sections.reduce((n, sec) => n + sec.questions.length, 0);
  const totalQuestions = subjects.reduce(
    (n, s) =>
      n +
      s.content.pastPapers.items.reduce((m, p) => m + qCount(p), 0) +
      s.content.modelPapers.items.reduce((m, p) => m + qCount(p), 0),
    0,
  );
  const totalNotes = subjects.reduce((n, s) => n + s.content.notes.items.length, 0);

  const cards = [
    { label: "Active Streams", value: activeStreams, icon: <GitBranch className="h-5 w-5" />, tone: "from-primary/15 to-primary/5" },
    { label: "Subjects", value: subjects.length, icon: <BookOpen className="h-5 w-5" />, tone: "from-mint/25 to-mint/5" },
    { label: "Papers", value: totalPapers, icon: <FileText className="h-5 w-5" />, tone: "from-primary/15 to-mint/15" },
    { label: "Questions", value: totalQuestions, icon: <ListChecks className="h-5 w-5" />, tone: "from-mint/30 to-primary/10" },
    { label: "Study Notes", value: totalNotes, icon: <Sparkles className="h-5 w-5" />, tone: "from-primary/20 to-mint/20" },
    { label: "Students", value: mockStudents.length, icon: <Users className="h-5 w-5" />, tone: "from-mint/25 to-primary/15" },
  ];

  return (
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Overview</div>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Manage streams, subjects, papers and student activity for U-Learn.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <div key={c.label}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${c.tone} opacity-50`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="inline-grid h-9 w-9 place-items-center rounded-xl bg-background/80 backdrop-blur text-primary border border-border">
                  {c.icon}
                </div>
              </div>
              <div className="mt-3 font-display text-4xl font-bold">{c.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
