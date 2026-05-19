import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import {
  useAdminStore, type AdminQuestion, type OptionKey, type Difficulty,
} from "@/lib/admin-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/subjects/$subjectId/papers/$paperId")({
  component: PaperQuestionsAdmin,
  notFoundComponent: () => (
    <div className="text-center">
      <h1 className="font-display text-2xl font-bold">Paper not found</h1>
      <Link to="/admin/subjects" className="text-primary hover:underline mt-2 inline-block">Back to subjects</Link>
    </div>
  ),
});

const KEYS: OptionKey[] = ["A", "B", "C", "D", "E"];

function PaperQuestionsAdmin() {
  const { subjectId, paperId } = Route.useParams();
  const { getSubject, getPaper, addQuestion, updateQuestion, deleteQuestion } = useAdminStore();
  const sub = getSubject(subjectId);
  const found = getPaper(subjectId, paperId);
  if (!sub || !found) throw notFound();
  const { paper } = found;
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminQuestion | null>(null);

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
        <Link to="/admin/subjects/$subjectId" params={{ subjectId }}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to {sub.name}
        </Link>
      </Button>
      <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">{sub.name} · Paper</div>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">{paper.title}</h1>
      <p className="mt-2 text-muted-foreground">Add, edit, upload and remove questions for this paper.</p>

      <div className="mt-6 flex justify-between items-center">
        <Badge variant="secondary" className="rounded-full">{paper.questions.length} questions</Badge>
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full"><Plus className="h-4 w-4 mr-1.5" /> Add question</Button>
          </DialogTrigger>
          <QuestionFormDialog
            title="Add question"
            onSubmit={(d) => { addQuestion(subjectId, paperId, d); toast.success("Question added"); setCreating(false); }}
          />
        </Dialog>
      </div>

      {paper.questions.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No questions yet. Click "Add question" to upload the first one.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {paper.questions.map((q) => (
            <li key={q.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Q{q.number}</span>
                    <span>· {q.topic}</span>
                    <Badge variant="outline" className="text-[10px]">{q.difficulty}</Badge>
                    <Badge variant="default" className="text-[10px]">Answer: {q.correct}</Badge>
                  </div>
                  <p className="mt-2 text-sm">{q.text}</p>
                  <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    {q.options.map((o) => (
                      <div key={o.key} className={`text-xs rounded-md px-2 py-1.5 border ${o.key === q.correct ? "border-mint bg-mint/10" : "border-border"}`}>
                        <span className="font-semibold mr-1.5">{o.key}.</span>{o.text}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(q)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmDelete
                    label={`Delete question Q${q.number}?`}
                    onConfirm={() => { deleteQuestion(subjectId, paperId, q.id); toast.success("Question deleted"); }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <QuestionFormDialog
            title={`Edit Q${editing.number}`}
            initial={editing}
            onSubmit={(d) => { updateQuestion(subjectId, paperId, editing.id, d); toast.success("Question updated"); setEditing(null); }}
          />
        )}
      </Dialog>
    </div>
  );
}

function QuestionFormDialog({
  title, initial, onSubmit,
}: {
  title: string;
  initial?: Partial<AdminQuestion>;
  onSubmit: (d: Omit<AdminQuestion, "id" | "number">) => void;
}) {
  const [text, setText] = useState(initial?.text ?? "");
  const [topic, setTopic] = useState(initial?.topic ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? "Medium");
  const [correct, setCorrect] = useState<OptionKey>(initial?.correct ?? "A");
  const [explanation, setExplanation] = useState(initial?.explanation ?? "");
  const [options, setOptions] = useState<Record<OptionKey, string>>(() => {
    const base: Record<OptionKey, string> = { A: "", B: "", C: "", D: "", E: "" };
    initial?.options?.forEach((o) => { base[o.key] = o.text; });
    return base;
  });

  return (
    <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <Field label="Question text"><Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter the question…" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Topic"><Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Mechanics" /></Field>
          <Field label="Difficulty">
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        {KEYS.map((k) => (
          <Field key={k} label={`Option ${k}`}>
            <Input value={options[k]} onChange={(e) => setOptions((o) => ({ ...o, [k]: e.target.value }))} placeholder={`Option ${k} text`} />
          </Field>
        ))}
        <Field label="Correct answer">
          <Select value={correct} onValueChange={(v) => setCorrect(v as OptionKey)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Explanation"><Textarea rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Step by step explanation…" /></Field>
      </div>
      <DialogFooter>
        <Button
          disabled={!text.trim()}
          onClick={() => onSubmit({
            text: text.trim(),
            topic: topic.trim() || "General",
            difficulty,
            correct,
            explanation: explanation.trim(),
            options: KEYS.map((k) => ({ key: k, text: options[k] })),
          })}
        >Save question</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
