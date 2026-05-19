import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { streams, subjectSlug } from "@/lib/mock-data";
import { useAdminStore, type PaperSection, type AdminPaper } from "@/lib/admin-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, ListChecks, PenLine, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/study/al/$stream/$subject/past-papers/$year")({
  head: ({ params }) => ({ meta: [{ title: `${params.subject} ${params.year} · U-Learn` }] }),
  component: YearDetail,
  notFoundComponent: () => <div className="p-12">Not found</div>,
  errorComponent: ({ error }) => <div className="p-12 text-destructive">{error.message}</div>,
  loader: ({ params }) => {
    const stream = streams.find((x) => x.id === params.stream && x.status === "available");
    if (!stream) throw notFound();
    const subject = stream.subjects.find((s) => subjectSlug(s) === params.subject);
    if (!subject) throw notFound();
    return { stream, subject, year: Number(params.year) };
  },
});

function iconFor(type: string) {
  if (type === "MCQ") return <ListChecks className="h-6 w-6" />;
  if (type === "Essay") return <PenLine className="h-6 w-6" />;
  return <FileText className="h-6 w-6" />;
}

function YearDetail() {
  const { stream, subject, year } = Route.useLoaderData();
  const { getSubjectBySlug } = useAdminStore();
  const sub = getSubjectBySlug(stream.id, subjectSlug(subject));
  const papers: AdminPaper[] = (sub?.content.pastPapers.items ?? []).filter((p) => p.year === year);
  const isCombinedMaths = subject.toLowerCase().includes("combined") && subject.toLowerCase().includes("math");

  // Flatten to (paper, section) pairs
  const tiles = papers
    .flatMap((p) => p.sections.map((sec: PaperSection) => ({ paper: p, sec })))
    .sort((a, b) => {
      const order = isCombinedMaths
        ? [
            "pure-maths-part-a",
            "pure-mathematics-part-a",
            "pure-maths-part-b",
            "pure-mathematics-part-b",
            "applied-maths-part-a",
            "applied-mathematics-part-a",
            "applied-maths-part-b",
            "applied-mathematics-part-b",
          ]
        : ["mcq", "structure", "structured", "essay"];
      const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const aIndex = order.indexOf(normalize(a.sec.title));
      const bIndex = order.indexOf(normalize(b.sec.title));
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

  return (
    <div className="relative">
      <div className="eg-watermark" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <Link
          to="/study/al/$stream/$subject/past-papers"
          params={{ stream: stream.id, subject: subjectSlug(subject) }}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> All years
        </Link>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">
          {subject} · {year}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isCombinedMaths
            ? "Choose Pure Mathematics or Applied Mathematics, then open Part A or Part B."
            : "Pick MCQ, Structured, or Essay to start practicing."}
        </p>

        {tiles.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No sections in this paper yet.
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map(({ paper, sec }, i) => (
              <article
                key={sec.id}
                className="group relative flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-soft animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    {iconFor(sec.defaultType)}
                  </div>
                  <Badge variant="secondary" className="rounded-full">{sec.defaultType}</Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{sec.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sec.questions.length}
                  {sec.expectedCount ? ` / ${sec.expectedCount}` : ""} questions
                </p>
                <div className="mt-5">
                  <Button asChild size="sm" className="rounded-full">
                    <Link
                      to="/interactive/$paperId"
                      params={{ paperId: paper.id }}
                      search={{ section: sec.id }}
                    >
                      Start section <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
