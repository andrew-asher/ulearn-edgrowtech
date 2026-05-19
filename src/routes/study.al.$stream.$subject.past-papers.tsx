import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { streams, subjectSlug, papers, years } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Download, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/study/al/$stream/$subject/past-papers")({
  head: ({ params }) => ({ meta: [{ title: `Past papers · ${params.subject} · U-Learn` }] }),
  component: PapersPage,
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

function PapersPage() {
  const { stream, subject } = Route.useLoaderData();
  const [year, setYear] = useState<string>("all");
  const [medium, setMedium] = useState<string>("English");
  const [paperType, setPaperType] = useState<string>("all");

  const filtered = useMemo(
    () =>
      papers.filter((p) => {
        if (p.subject !== subject) return false;
        if (year !== "all" && String(p.year) !== year) return false;
        if (paperType !== "all" && p.paperType !== paperType) return false;
        if (medium !== "English") return false;
        return true;
      }),
    [subject, year, medium, paperType],
  );

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
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">{subject} Past Papers</h1>
        <p className="mt-3 text-muted-foreground">Filter and open papers for interactive practice.</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <FilterField label="Subject">
            <Select value={subject} disabled>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value={subject}>{subject}</SelectItem></SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Year">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Medium">
            <Select value={medium} onValueChange={setMedium}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Tamil" disabled>Tamil — Coming Soon</SelectItem>
                <SelectItem value="Sinhala" disabled>Sinhala — Coming Soon</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Paper Type">
            <Select value={paperType} onValueChange={setPaperType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="MCQ">MCQ</SelectItem>
                <SelectItem value="Structured">Structured</SelectItem>
                <SelectItem value="Essay">Essay</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No papers match these filters yet.
            </div>
          )}
          {filtered.map((p, i) => (
            <article key={p.id}
              className="group relative flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-soft animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <Badge className={
                  p.difficulty === "Easy" ? "bg-mint text-mint-foreground" :
                  p.difficulty === "Medium" ? "bg-primary text-primary-foreground" :
                  "bg-destructive text-destructive-foreground"
                }>{p.difficulty}</Badge>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{p.subject} · {p.year}</h3>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-0.5">{p.medium}</span>
                <span className="rounded-full bg-muted px-2 py-0.5">{p.paperType}</span>
                <span className="rounded-full bg-muted px-2 py-0.5">{p.questionCount} Questions</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/interactive/$paperId" params={{ paperId: p.id }}>
                    Open Interactive Paper <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    toast.success(`Download started: ${p.subject} ${p.year} ${p.paperType}`, {
                      description: "In production this links to the admin-uploaded PDF.",
                    });
                    // Trigger anchor download (placeholder)
                    const a = document.createElement("a");
                    a.href = p.downloadUrl;
                    a.download = `${p.subject}-${p.year}-${p.paperType}.pdf`;
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-1.5" /> Download Past Paper
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
