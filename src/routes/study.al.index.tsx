import { createFileRoute, Link } from "@tanstack/react-router";
import { streams } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FlaskConical, Microscope, Briefcase, Palette, Cpu, Lock, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/study/al/")({
  head: () => ({ meta: [{ title: "A/L Streams · U-Learn" }] }),
  component: ALPage,
});

const icons: Record<string, React.ReactNode> = {
  "physical-science": <FlaskConical className="h-6 w-6" />,
  "bio-science": <Microscope className="h-6 w-6" />,
  commerce: <Briefcase className="h-6 w-6" />,
  arts: <Palette className="h-6 w-6" />,
  technology: <Cpu className="h-6 w-6" />,
};

function ALPage() {
  return (
    <div className="relative">
      <div className="eg-watermark" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <Link to="/study" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to study
        </Link>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">Choose Your A/L Stream</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">Pick a stream to see subjects and past papers.</p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {streams.map((s, i) => {
            const available = s.status === "available";
            return (
              <div key={s.id}
                className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all animate-fade-up ${available ? "hover:-translate-y-1 hover:shadow-soft" : ""}`}
                style={{ animationDelay: `${i * 70}ms` }}>
                <div className="flex items-start justify-between">
                  <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    {available ? icons[s.id] : <Lock className="h-5 w-5" />}
                  </div>
                  {!available && <Badge variant="secondary" className="rounded-full">Coming Soon</Badge>}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground min-h-[3rem]">{s.description}</p>
                <div className="mt-5">
                  {available ? (
                    <Button asChild variant="outline" className="rounded-full">
                      <Link to="/study/al/$stream" params={{ stream: s.id }}>
                        Open Stream <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled variant="outline" className="rounded-full">Coming Soon</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
