import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useBookmarks } from "@/lib/bookmarks";
import { useAdminStore, type AdminQuestion, type PaperSection } from "@/lib/admin-store";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  ChevronLeft, Bookmark, BookmarkCheck, Sparkles, Lightbulb, Save, Check, Send, Bot,
  CheckCircle2, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { z } from "zod";

const searchSchema = z.object({
  section: z.string().optional(),
});

export const Route = createFileRoute("/interactive/$paperId")({
  head: ({ params }) => ({ meta: [{ title: `Practice · ${params.paperId} · U-Learn` }] }),
  component: InteractivePaper,
  notFoundComponent: () => <div className="p-12">Paper not found</div>,
  errorComponent: ({ error }) => <div className="p-12 text-destructive">{error.message}</div>,
  validateSearch: (s) => searchSchema.parse(s),
});

function InteractivePaper() {
  const { paperId } = Route.useParams();
  const { section: initialSectionId } = Route.useSearch();
  const { findPaper } = useAdminStore();
  const found = findPaper(paperId);
  if (!found) throw notFound();
  const { paper, subject } = found;

  const sections = paper.sections.filter((s) => s.questions.length > 0);
  const [sectionId, setSectionId] = useState<string>(
    initialSectionId && sections.find((s) => s.id === initialSectionId)?.id
      ? initialSectionId
      : sections[0]?.id ?? "",
  );
  const section = sections.find((s) => s.id === sectionId) ?? sections[0];

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <Link to="/study" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to study
        </Link>

        <header className="mt-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">{subject.name}</div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight">{paper.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {paper.year && <Badge variant="secondary">{paper.year}</Badge>}
            {paper.medium && <Badge variant="secondary">{paper.medium}</Badge>}
            <Badge variant="secondary">{paper.sections.length} sections</Badge>
          </div>
        </header>

        {!section ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No questions uploaded for this paper yet.
          </div>
        ) : (
          <Tabs value={section.id} onValueChange={setSectionId} className="mt-6">
            <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-muted/60">
              {sections.map((sec) => (
                <TabsTrigger key={sec.id} value={sec.id} className="rounded-full data-[state=active]:bg-background">
                  {sec.title}
                  <Badge variant="secondary" className="ml-2 text-[10px]">{sec.questions.length}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            {sections.map((sec) => (
              <TabsContent key={sec.id} value={sec.id} className="mt-6">
                <SectionRunner paperId={paper.id} section={sec} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

type Status = { selected?: string; submitted?: boolean; correct?: boolean };

function SectionRunner({ paperId, section }: { paperId: string; section: PaperSection }) {
  const list = section.questions;
  const isMCQ = section.defaultType === "MCQ";
  const [active, setActive] = useState(0);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [showExplain, setShowExplain] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const { isBookmarked, toggle } = useBookmarks();

  const q = list[active];
  const status = statuses[q.id] ?? {};

  const submitted = Object.values(statuses).filter((s) => s.submitted).length;
  const correct = Object.values(statuses).filter((s) => s.correct).length;
  const progress = (submitted / list.length) * 100;

  const select = (key: string) => {
    if (status.submitted) return;
    setStatuses((s) => ({ ...s, [q.id]: { ...s[q.id], selected: key } }));
  };
  const submitMCQ = () => {
    if (!status.selected) { toast.error("Please select an option first."); return; }
    const isCorrect = status.selected === q.correct;
    setStatuses((s) => ({ ...s, [q.id]: { ...s[q.id], submitted: true, correct: isCorrect } }));
    toast[isCorrect ? "success" : "error"](isCorrect ? "Correct!" : "Not quite — check the explanation.");
  };
  const markAttempted = () => {
    setStatuses((s) => ({ ...s, [q.id]: { ...s[q.id], submitted: true, correct: true } }));
    toast.success("Marked as attempted — view the model answer below.");
  };

  const bookmarkId = `${paperId}:${q.id}`;
  const bookmarked = isBookmarked(bookmarkId);
  const toggleBookmark = () => {
    toggle({
      id: bookmarkId, paperId, questionId: q.id,
      subject: section.title, year: undefined,
      paperType: section.defaultType, questionText: q.text,
    });
    toast.success(bookmarked ? "Removed from bookmarks" : "Bookmarked!");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-20 self-start rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{section.title}</div>
        <div className="mt-3 grid grid-cols-5 lg:grid-cols-5 gap-2 max-h-[420px] overflow-y-auto pr-1">
          {list.map((qq, i) => {
            const s = statuses[qq.id];
            const isActive = i === active;
            return (
              <button
                key={qq.id}
                onClick={() => { setActive(i); setShowExplain(false); setShowAI(false); }}
                className={cn(
                  "h-9 rounded-lg text-xs font-semibold border transition-all",
                  isActive ? "bg-primary text-primary-foreground border-primary shadow-soft" :
                  s?.submitted ? "bg-mint/20 border-mint/40" :
                  "bg-background hover:bg-muted border-border",
                )}
              >
                {qq.number}
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
          <Stat label="Done" value={`${submitted}/${list.length}`} />
          {isMCQ && <Stat label="Correct" value={String(correct)} tone="mint" />}
        </div>
        <Progress value={progress} className="mt-3 h-2" />
      </aside>

      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold">
              {section.title} · Q{q.number}
            </div>
            <div className="mt-1 flex flex-wrap gap-2 text-xs">
              <Badge variant="outline" className="rounded-full">{q.type}</Badge>
              {q.topic && <Badge variant="outline" className="rounded-full">{q.topic}</Badge>}
              {q.marks != null && <Badge variant="outline" className="rounded-full">{q.marks} marks</Badge>}
            </div>
          </div>
          <Button variant={bookmarked ? "default" : "outline"} size="sm" className="rounded-full" onClick={toggleBookmark}>
            {bookmarked ? <BookmarkCheck className="h-4 w-4 mr-1.5" /> : <Bookmark className="h-4 w-4 mr-1.5" />}
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
        </div>

        <p className="mt-4 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">{q.text}</p>

        {q.imageDataUrl && (
          <img src={q.imageDataUrl} alt={`Q${q.number} diagram`} className="mt-4 max-h-72 rounded-xl border border-border" />
        )}

        {isMCQ && q.options ? (
          <MCQOptions q={q} status={status} onSelect={select} />
        ) : (
          <EssayWorkspace />
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {isMCQ ? (
            <Button onClick={submitMCQ} disabled={status.submitted} className="rounded-full">
              <Check className="h-4 w-4 mr-1.5" /> Submit Answer
            </Button>
          ) : (
            <Button onClick={markAttempted} disabled={status.submitted} className="rounded-full">
              <Check className="h-4 w-4 mr-1.5" /> Mark as attempted
            </Button>
          )}
          <Button onClick={() => setShowExplain((v) => !v)} variant="outline" className="rounded-full">
            <Lightbulb className="h-4 w-4 mr-1.5" /> {isMCQ ? "View Explanation" : "View Model Answer"}
          </Button>
          <Button onClick={() => setShowAI((v) => !v)} variant="outline" className="rounded-full">
            <Sparkles className="h-4 w-4 mr-1.5" /> Ask AI
          </Button>
          <Button onClick={() => toast.success("Saved for later")} variant="ghost" className="rounded-full">
            <Save className="h-4 w-4 mr-1.5" /> Save for Later
          </Button>
        </div>

        {showExplain && (
          <div className="mt-5 rounded-xl border border-mint/40 bg-mint/10 p-5 animate-fade-up space-y-3">
            {!isMCQ && q.modelAnswer && (
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Model answer
                </div>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{q.modelAnswer}</p>
              </div>
            )}
            {q.explanation && (
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb className="h-4 w-4 text-primary" /> Explanation
                </div>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
              </div>
            )}
            {isMCQ && q.correct && (
              <div className="text-xs text-muted-foreground">
                Correct answer: <span className="font-semibold text-foreground">{q.correct}</span>
              </div>
            )}
          </div>
        )}

        {showAI && <AIChat />}

        <div className="mt-6 flex justify-between">
          <Button variant="ghost" disabled={active === 0} onClick={() => { setActive((a) => Math.max(0, a - 1)); setShowExplain(false); setShowAI(false); }}>
            ← Previous
          </Button>
          <Button variant="ghost" disabled={active === list.length - 1} onClick={() => { setActive((a) => Math.min(list.length - 1, a + 1)); setShowExplain(false); setShowAI(false); }}>
            Next →
          </Button>
        </div>
      </section>
    </div>
  );
}

function MCQOptions({ q, status, onSelect }: { q: AdminQuestion; status: Status; onSelect: (k: string) => void }) {
  return (
    <div className="mt-6 grid gap-2.5">
      {(q.options ?? []).filter((o) => o.text).map((o) => {
        const isSel = status.selected === o.key;
        const isCorrect = status.submitted && o.key === q.correct;
        const isWrong = status.submitted && isSel && o.key !== q.correct;
        return (
          <button
            key={o.key}
            onClick={() => onSelect(o.key)}
            disabled={status.submitted}
            className={cn(
              "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
              !status.submitted && "hover:border-primary/60 hover:bg-primary/5",
              isSel && !status.submitted && "border-primary bg-primary/10",
              isCorrect && "border-mint bg-mint/15 text-foreground",
              isWrong && "border-destructive bg-destructive/10",
              !isSel && !isCorrect && !isWrong && "border-border bg-background",
            )}
          >
            <span className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-lg font-bold text-sm border",
              isCorrect ? "bg-mint text-mint-foreground border-mint" :
              isWrong ? "bg-destructive text-destructive-foreground border-destructive" :
              isSel ? "bg-primary text-primary-foreground border-primary" :
              "bg-muted border-border",
            )}>{o.key}</span>
            <span className="flex-1 text-sm sm:text-base pt-0.5">{o.text}</span>
            {isCorrect && <CheckCircle2 className="h-5 w-5 text-mint shrink-0" />}
            {isWrong && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

function EssayWorkspace() {
  const [draft, setDraft] = useState("");
  return (
    <div className="mt-6">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Your answer (draft, not graded)</div>
      <Textarea
        rows={8}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Write your structured / essay answer here. Use the model answer to compare after."
      />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "mint" }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 font-display font-bold text-lg", tone === "mint" && "text-gradient")}>{value}</div>
    </div>
  );
}

function AIChat() {
  type ChatMsg = { role: "ai" | "user"; text: string };
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "ai", text: "Hi! I'm your U-Learn AI tutor. Ask anything about this question." },
  ]);
  const [input, setInput] = useState("");
  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user" as const, text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, {
        role: "ai" as const,
        text: "Let's break this question step by step…\n\n1. Identify the given values.\n2. Pick the right approach.\n3. Work through carefully.\n4. Check your answer.\n\nTry it now and tell me where you get stuck!",
      }]);
    }, 600);
  };
  return (
    <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4 animate-fade-up">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Bot className="h-4 w-4 text-primary" /> AI Tutor
      </div>
      <div className="mt-3 max-h-72 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-line",
              m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border border-border",
            )}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask anything about this question…"
          className="resize-none min-h-10"
        />
        <Button onClick={send} className="rounded-full"><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
