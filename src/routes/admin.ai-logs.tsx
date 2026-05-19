import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";

const mockLogs = [
  { q: "How do I solve projectile motion?", a: "Step 1: split into x and y…", student: "Student #128", time: "2m ago" },
  { q: "Explain ionic vs covalent bonds", a: "Ionic bonds form by electron transfer…", student: "Student #93", time: "12m ago" },
  { q: "What's the formula for kinetic energy?", a: "KE = ½mv²…", student: "Student #41", time: "1h ago" },
];

export const Route = createFileRoute("/admin/ai-logs")({ component: () => (
  <div>
    <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">AI Tutor</div>
    <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">AI Chat Logs</h1>
    <div className="mt-8 space-y-3">
      {mockLogs.map((m, i) => (
        <div key={i} className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{m.student}</span><span>{m.time}</span>
          </div>
          <div className="mt-2 font-medium">{m.q}</div>
          <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
            <Bot className="h-4 w-4 text-primary mt-0.5" /> {m.a}
          </div>
        </div>
      ))}
    </div>
  </div>
)});
