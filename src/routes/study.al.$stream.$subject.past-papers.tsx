import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { streams, subjectSlug } from "@/lib/mock-data";
import { useAdminStore } from "@/lib/admin-store";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CalendarDays, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/study/al/$stream/$subject/past-papers")({
  head: ({ params }) => ({ meta: [{ title: `Past papers · ${params.subject} · U-Learn` }] }),
  component: PapersIndex,
  notFoundComponent: () => <div className="p-12">Not found</div>,
  errorComponent: ({ error }) => <div className="p-12 text-destructive">{error.message}</div>,
  loader: ({ params }) => {
    const stream = streams.find((x) => x.id === params.stream && x.status === "available");
    if (!stream) throw notFound();
    const subject = stream.subjects.find((s) => subjectSlug(s) === params.subject);
    if (!subject) throw notFound();
    return { stream, subject };
  },
});

function PapersIndex() {
  const { stream, subject } = Route.useLoaderData();
  const { getSubjectBySlug } = useAdminStore();
  const sub = getSubjectBySlug(stream.id, subjectSlug(subject));
  const papers = sub?.content.pastPapers.items ?? [];
  const isCombinedMaths = subject.toLowerCase().includes("combined") && subject.toLowerCase().includes("math");
  const years = Array.from(
    new Set(papers.filter((p) => p.year).map((p) => p.year as number)),
  ).sort((a, b) => b - a);

  return (
    <div className="relative">
      <div className="eg-watermark" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <Link
          to="/study/al/$stream/$subject"
          params={{ stream: stream.id, subject: subjectSlug(subject) }}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> {subject}
        </Link>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">
          {subject} · Past Papers
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isCombinedMaths
            ? "Choose a year to open Pure Mathematics and Applied Mathematics with Part A and Part B."
            : "Choose a year to see MCQ, Structured, and Essay sections."}
        </p>

        {years.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No past papers uploaded yet. Check back soon.
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {years.map((year, i) => {
              const yearPapers = papers.filter((p) => p.year === year);
              const totalQ = yearPapers.reduce(
                (n, p) => n + p.sections.reduce((m, s) => m + s.questions.length, 0),
                0,
              );
              return (
                <Link
                  key={year}
                  to="/study/al/$stream/$subject/past-papers/$year"
                  params={{ stream: stream.id, subject: subjectSlug(subject), year: String(year) }}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-soft animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="rounded-full">{totalQ} questions</Badge>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold">{year}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {yearPapers.length} paper{yearPapers.length === 1 ? "" : "s"} · {isCombinedMaths ? "Pure + Applied with Part A / Part B" : "MCQ, Structured & Essay sections"}
                  </p>
                  <div className="mt-5 inline-flex items-center text-sm font-semibold text-primary">
                    Open year <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
