import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { streams, subjectSlug } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/study/al/$stream")({
  head: ({ params }) => ({ meta: [{ title: `${params.stream} · A/L · U-Learn` }] }),
  component: StreamPage,
  notFoundComponent: () => <div className="p-12">Stream not found</div>,
  errorComponent: ({ error }) => <div className="p-12 text-destructive">{error.message}</div>,
  loader: ({ params }) => {
    const s = streams.find((x) => x.id === params.stream && x.status === "available");
    if (!s) throw notFound();
    return { stream: s };
  },
});

function StreamPage() {
  const { stream } = Route.useLoaderData();
  return (
    <div className="relative">
      <div className="eg-watermark" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <Link to="/study/al" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> All A/L streams
        </Link>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">{stream.name}</h1>
        <p className="mt-3 text-muted-foreground">{stream.description}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stream.subjects.map((sub: string, i: number) => (
            <div key={sub}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-soft animate-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}>
              <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-mint/30 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{sub}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Past papers, notes (soon) and model papers (soon).</p>
              <div className="mt-5">
                <Button asChild className="rounded-full">
                  <Link to="/study/al/$stream/$subject"
                    params={{ stream: stream.id, subject: subjectSlug(sub) }}>
                    Open Subject <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
