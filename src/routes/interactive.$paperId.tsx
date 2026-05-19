import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { papers, questions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useBookmarks, type FavLabel } from "@/lib/bookmarks";
import {
  ChevronLeft, Bookmark, BookmarkCheck, Sparkles, Lightbulb, Save, Check, Send, Bot,
  CheckCircle2, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/interactive/$paperId")({
  head: ({ params }) => ({ meta: [{ title: `Practice · ${params.paperId} · U-Learn` }] }),
  component: InteractivePaper,
  notFoundComponent: () => <div className="p-12">Paper not found</div>,
  errorComponent: ({ error }) => <div className="p-12 text-destructive">{error.message}</div>,
  loader: ({ params }) => {
    const paper = papers.find((p) => p.id === params.paperId);
    if (!paper) throw notFound();
    const paperQuestions = questions.filter((q) => q.paperId === paper.id);
    return { paper, paperQuestions };
  },
});

type Status = { selected?: string; submitted?: boolean; correct?: boolean };

function InteractivePaper() {
  const { paper, paperQuestions } = Route.useLoaderData();
  const list = paperQuestions.length > 0 ? paperQuestions : questions; // fallback so other papers still work
  const [active, setActive] = useState(0);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [showExplain, setShowExplain] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const { isBookmarked, toggle } = useBookmarks();

  const q = list[active];
  const status = statuses[q.id] ?? {};

  const submitted = Object.values(statuses).filter((s) => s.submitted).length;
  const correct = Object.values(statuses).filter((s) => s.correct).length;
  const remaining = list.length - submitted;
  const progress = (submitted / list.length) * 100;

  const select = (key: string) => {
    if (status.submitted) return;
    setStatuses((s) => ({ ...s, [q.id]: { ...s[q.id], selected: key } }));
  };
  const submit = () => {
    if (!status.selected) {
      toast.error("Please select an option first.");
      return;
    }
    const isCorrect = status.selected === q.correct;
    setStatuses((s) => ({ ...s, [q.id]: { ...s[q.id], submitted: true, correct: isCorrect } }));
    toast[isCorrect ? "success" : "error"](isCorrect ? "Correct!" : "Not quite — check the explanation.");
  };
  const checkAnswer = () => {
    setStatuses((s) => ({ ...s, [q.id]: { ...s[q.id], submitted: true, correct: s[q.id]?.selected === q.correct } }));
    setShowExplain(true);
  };

  const bookmarkId = `${paper.id}:${q.id}`;
  const bookmarked = isBookmarked(bookmarkId);
  const toggleBookmark = () => {
    toggle({
      id: bookmarkId,
      paperId: paper.id,
      questionId: q.id,
      subject: paper.subject,
      year: paper.year,
      paperType: paper.paperType,
      questionText: q.text,
    });
    toast.success(bookmarked ? "Removed from bookmarks" : "Bookmarked!");
  };

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <Link to="/study" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to study
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 self-start rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Questions</div>
            <div className="mt-3 grid grid-cols-5 lg:grid-cols-3 gap-2">
              {list.map((qq, i) => {
                const s = statuses[qq.id];
                const isActive = i === active;
                const isBM = isBookmarked(`${paper.id}:${qq.id}`);
                return (
                  <button key={qq.id} onClick={() => { setActive(i); setShowExplain(false); setShowAI(false); }}
                    className={cn(
                      "relative h-10 rounded-xl text-xs font-semibold border transition-all",
                      isActive ? "bg-primary text-primary-foreground border-primary shadow-soft" :
                      s?.submitted ? "bg-mint/20 text-foreground border-mint/40" :
                      "bg-background hover:bg-muted border-border",
                    )}>
                    Q{qq.number}
                    {isBM && <Bookmark className="absolute -top-1 -right-1 h-3.5 w-3.5 fill-mint text-mint" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 space-y-2 text-xs text-muted-foreground">
              <Legend swatch="bg-primary" label="Active" />
              <Legend swatch="bg-mint/40" label="Completed" />
              <Legend swatch="bg-background border" label="Pending" />
            </div>
          </aside>

          {/* Main */}
          <div>
            <header className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                {paper.subject} · {paper.year}
              </h1>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{paper.medium}</Badge>
                <Badge variant="secondary">{paper.paperType}</Badge>
                <Badge variant="secondary">{list.length} questions</Badge>
              </div>
              <div className="mt-4 grid sm:grid-cols-4 gap-3 text-sm">
                <Stat label="Attempted" value={`${submitted}/${list.length}`} />
                <Stat label="Correct" value={String(correct)} tone="mint" />
                <Stat label="Remaining" value={String(remaining)} />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Progress</div>
                  <Progress value={progress} className="mt-2 h-2" />
                </div>
              </div>
            </header>

            {/* Question card */}
            <section className="mt-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-widest text-primary font-semibold">Question {q.number}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline" className="rounded-full">{q.topic}</Badge>
                    <Badge variant="outline" className="rounded-full">{q.difficulty}</Badge>
                  </div>
                </div>
                <Button variant={bookmarked ? "default" : "outline"} size="sm" className="rounded-full" onClick={toggleBookmark}>
                  {bookmarked ? <BookmarkCheck className="h-4 w-4 mr-1.5" /> : <Bookmark className="h-4 w-4 mr-1.5" />}
                  {bookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
              </div>

              <p className="mt-4 text-base sm:text-lg leading-relaxed">{q.text}</p>

              {q.diagram && (
                <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-center text-xs text-muted-foreground">
                  [ Diagram placeholder ]
                </div>
              )}

              <div className="mt-6 grid gap-2.5">
                {q.options.map((o) => {
                  const isSel = status.selected === o.key;
                  const isCorrect = status.submitted && o.key === q.correct;
                  const isWrong = status.submitted && isSel && o.key !== q.correct;
                  return (
                    <button
                      key={o.key}
                      onClick={() => select(o.key)}
                      disabled={status.submitted}
                      className={cn(
                        "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                        !status.submitted && "hover:border-primary/60 hover:bg-primary/5",
                        isSel && !status.submitted && "border-primary bg-primary/10",
                        isCorrect && "border-mint bg-mint/15 text-foreground",
                        isWrong && "border-destructive bg-destructive/10",
                        !isSel && !isCorrect && !isWrong && "border-border bg-background",
                      )}>
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

              <div className="mt-6 flex flex-wrap gap-2">
                <Button onClick={submit} disabled={status.submitted} className="rounded-full">
                  <Check className="h-4 w-4 mr-1.5" /> Submit Answer
                </Button>
                <Button onClick={checkAnswer} variant="outline" className="rounded-full">
                  Check Answer
                </Button>
                <Button onClick={() => setShowExplain((v) => !v)} variant="outline" className="rounded-full">
                  <Lightbulb className="h-4 w-4 mr-1.5" /> View Explanation
                </Button>
                <Button onClick={() => setShowAI((v) => !v)} variant="outline" className="rounded-full">
                  <Sparkles className="h-4 w-4 mr-1.5" /> Ask AI
                </Button>
                <Button onClick={() => toast.success("Saved for later")} variant="ghost" className="rounded-full">
                  <Save className="h-4 w-4 mr-1.5" /> Save for Later
                </Button>
              </div>

              {showExplain && (
                <div className="mt-5 rounded-xl border border-mint/40 bg-mint/10 p-5 animate-fade-up">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Lightbulb className="h-4 w-4 text-primary" /> Explanation
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">{q.explanation}</p>
                  <div className="mt-3 text-xs text-muted-foreground">Correct answer: <span className="font-semibold text-foreground">{q.correct}</span></div>
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
        </div>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("inline-block h-3 w-3 rounded-md", swatch)} />
      {label}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "mint" }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-2xl font-display font-bold", tone === "mint" && "text-gradient")}>{value}</div>
    </div>
  );
}

function AIChat() {
  const [messages, setMessages] = useState([
    { role: "ai" as const, text: "Hi! I'm your U-Learn AI tutor. Ask anything about this question." },
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
        text: "Let's break this question step by step…\n\n1. Identify the given values.\n2. Pick the right formula.\n3. Substitute carefully.\n4. Check units.\n\nTry it now and tell me where you get stuck!",
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
