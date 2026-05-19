import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { streams, subjectSlug } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText, NotebookPen, ClipboardList, ArrowRight, Lock } from "lucide-react";

export const Route = createFileRoute("/study/al/$stream/$subject")({
  head: ({ params }) => ({ meta: [{ title: `${params.subject} · U-Learn` }] }),
  component: SubjectPage,
  notFoundComponent: () => <div className="p-12">Subject not found</div>,
  errorComponent: ({ error }) => <div className="p-12 text-destructive">{error.message}</div>,
  loader: ({ params }) => {
    const stream = streams.find((x) => x.id === params.stream && x.status === "available");
    if (!stream) throw notFound();
    const subject = stream.subjects.find((s) => subjectSlug(s) === params.subject);
    if (!subject) throw notFound();
    return { stream, subject };
  },
});

function SubjectPage() {
  const { stream, subject } = Route.useLoaderData();
  const cards = [
    { title: "Past Papers", desc: "Practice real exam questions interactively.", icon: <FileText className="h-6 w-6" />, available: true, to: "/study/al/$stream/$subject/past-papers" as const },
    { title: "Notes", desc: "Curated topic notes — launching soon.", icon: <NotebookPen className="h-6 w-6" />, available: false },
    { title: "Model Papers", desc: "Original model papers — launching soon.", icon: <ClipboardList className="h-6 w-6" />, available: false },
  ];

  return (
    <div className="relative">
      <div className="eg-watermark" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <Link to="/study/al/$stream" params={{ stream: stream.id }} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> {stream.name}
        </Link>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">{subject}</h1>
        <p className="mt-3 text-muted-foreground">Choose how you want to learn.</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <div key={c.title}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all animate-fade-up ${c.available ? "hover:-translate-y-1 hover:shadow-soft" : ""}`}
              style={{ animationDelay: `${i * 70}ms` }}>
              <div className="flex items-start justify-between">
                <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  {c.available ? c.icon : <Lock className="h-5 w-5" />}
                </div>
                {!c.available && <Badge variant="secondary" className="rounded-full">Coming Soon</Badge>}
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground min-h-[3rem]">{c.desc}</p>
              <div className="mt-5">
                {c.available && c.to ? (
                  <Button asChild className="rounded-full">
                    <Link to={c.to} params={{ stream: stream.id, subject: subjectSlug(subject) }}>
                      Open <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="rounded-full">Coming Soon</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
