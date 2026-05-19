import { createFileRoute } from "@tanstack/react-router";
import { papers, questions, streams } from "@/lib/mock-data";
import { FileText, ListChecks, BookOpen, Bookmark, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const activeSubjects = new Set(streams.filter((s) => s.status === "available").flatMap((s) => s.subjects)).size;
  const cards = [
    { label: "Total Papers", value: papers.length, icon: <FileText className="h-5 w-5" />, tone: "from-primary/15 to-primary/5" },
    { label: "Total Questions", value: questions.length, icon: <ListChecks className="h-5 w-5" />, tone: "from-mint/30 to-mint/5" },
    { label: "Active Subjects", value: activeSubjects, icon: <BookOpen className="h-5 w-5" />, tone: "from-primary/15 to-mint/15" },
    { label: "Saved Questions", value: 124, icon: <Bookmark className="h-5 w-5" />, tone: "from-mint/25 to-primary/10" },
    { label: "AI Questions Asked", value: 412, icon: <Sparkles className="h-5 w-5" />, tone: "from-primary/20 to-mint/20" },
  ];
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Overview</div>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Snapshot of the U-Learn platform.</p>

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
              <div className="mt-1 inline-flex items-center text-xs text-mint-foreground bg-mint/30 rounded-full px-2 py-0.5">
                <TrendingUp className="h-3 w-3 mr-1" /> Live mock data
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="font-display text-xl font-semibold">Recent papers</h2>
        <table className="mt-4 w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="py-2">Subject</th><th>Year</th><th>Type</th><th>Difficulty</th></tr>
          </thead>
          <tbody>
            {papers.slice(0, 5).map((p) => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="py-2.5">{p.subject}</td>
                <td>{p.year}</td>
                <td>{p.paperType}</td>
                <td>{p.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
