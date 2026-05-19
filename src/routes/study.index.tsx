import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/study/")({
  head: () => ({ meta: [{ title: "Study · U-Learn by EdGrow" }] }),
  component: StudyPage,
});

function StudyPage() {
  return (
    <div className="relative">
      <div className="eg-watermark" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Study</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight">Choose Your Learning Path</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">Phase 1 launches with A/L. O/L is on the way.</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <LevelCard
            title="A/L"
            subtitle="Advanced Level"
            description="Past papers, interactive practice and AI tutor for A/L Science streams."
            status="available"
            cta={{ label: "Start A/L Learning", to: "/study/al" }}
          />
          <LevelCard
            title="O/L"
            subtitle="Ordinary Level"
            description="Coming soon — interactive learning for O/L students will launch in the next phase."
            status="coming-soon"
          />
        </div>
      </div>
    </div>
  );
}

function LevelCard({
  title, subtitle, description, status, cta,
}: {
  title: string; subtitle: string; description: string;
  status: "available" | "coming-soon";
  cta?: { label: string; to: string };
}) {
  const available = status === "available";
  return (
    <div className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 shadow-sm transition-all ${available ? "hover:-translate-y-1 hover:shadow-soft" : "opacity-90"}`}>
      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-gradient-to-br from-primary/20 to-mint/30 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" aria-hidden />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            {available ? <GraduationCap className="h-7 w-7" /> : <Lock className="h-6 w-6" />}
          </div>
          {!available && <Badge variant="secondary" className="rounded-full">Coming Soon</Badge>}
        </div>
        <div className="mt-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{subtitle}</div>
          <h3 className="mt-1 font-display text-4xl font-bold">{title}</h3>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">{description}</p>
        </div>
        <div className="mt-8">
          {available && cta ? (
            <Button asChild className="rounded-full">
              <Link to={cta.to}>{cta.label}<ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          ) : (
            <Button disabled className="rounded-full">Coming Soon</Button>
          )}
        </div>
      </div>
    </div>
  );
}
