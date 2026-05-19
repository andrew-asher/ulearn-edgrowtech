import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Plus, Pencil, Trash2, Image as ImageIcon, X, Layers, Edit3,
} from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import {
  useAdminStore, type AdminQuestion, type OptionKey, type Difficulty,
  type PaperSection, type QuestionType,
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
  const {
    getSubject, getPaper,
    addPaperSection, updatePaperSection, deletePaperSection,
  } = useAdminStore();
  const sub = getSubject(subjectId);
  const found = getPaper(subjectId, paperId);
  if (!sub || !found) throw notFound();
  const { paper } = found;

  const total = paper.sections.reduce((n, s) => n + s.questions.length, 0);
  const initialTab = paper.sections[0]?.id ?? "";
  const [tab, setTab] = useState(initialTab);
  const [creatingSection, setCreatingSection] = useState(false);
  const [editingSection, setEditingSection] = useState<PaperSection | null>(null);

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
        <Link to="/admin/subjects/$subjectId" params={{ subjectId }}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to {sub.name}
        </Link>
      </Button>
      <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">{sub.name} · Paper</div>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">{paper.title}</h1>
      <p className="mt-2 text-muted-foreground">
        Manage paper sections, then add, edit, upload images, and remove questions inside each section.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="rounded-full">{paper.sections.length} sections</Badge>
        <Badge variant="secondary" className="rounded-full">{total} questions total</Badge>
        <div className="flex-1" />
        <Dialog open={creatingSection} onOpenChange={setCreatingSection}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="rounded-full">
              <Layers className="h-4 w-4 mr-1.5" /> Add section
            </Button>
          </DialogTrigger>
          <SectionFormDialog
            title="Add new section"
            onSubmit={(d) => { addPaperSection(subjectId, paperId, d); toast.success("Section added"); setCreatingSection(false); }}
          />
        </Dialog>
      </div>

      {paper.sections.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No sections. Add a section to start uploading questions.
        </div>
      ) : (
        <Tabs value={tab || paper.sections[0].id} onValueChange={setTab} className="mt-6">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-muted/60">
            {paper.sections.map((sec) => (
              <TabsTrigger key={sec.id} value={sec.id} className="rounded-full data-[state=active]:bg-background">
                {sec.title}
                <Badge variant="secondary" className="ml-2 text-[10px]">
                  {sec.questions.length}{sec.expectedCount ? `/${sec.expectedCount}` : ""}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {paper.sections.map((sec) => (
            <TabsContent key={sec.id} value={sec.id} className="mt-4">
              <SectionPanel
                subjectId={subjectId}
                paperId={paperId}
                section={sec}
                onEditSection={() => setEditingSection(sec)}
                onDeleteSection={() => {
                  deletePaperSection(subjectId, paperId, sec.id);
                  toast.success("Section deleted");
                  setTab(paper.sections.filter((x) => x.id !== sec.id)[0]?.id ?? "");
                }}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Dialog open={!!editingSection} onOpenChange={(o) => !o && setEditingSection(null)}>
        {editingSection && (
          <SectionFormDialog
            title={`Edit section "${editingSection.title}"`}
            initial={editingSection}
            onSubmit={(d) => {
              updatePaperSection(subjectId, paperId, editingSection.id, d);
              toast.success("Section updated");
              setEditingSection(null);
            }}
          />
        )}
      </Dialog>
    </div>
  );
}

function SectionPanel({
  subjectId, paperId, section, onEditSection, onDeleteSection,
}: {
  subjectId: string;
  paperId: string;
  section: PaperSection;
  onEditSection: () => void;
  onDeleteSection: () => void;
}) {
  const { addQuestion, updateQuestion, deleteQuestion, deleteAllQuestions } = useAdminStore();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminQuestion | null>(null);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/60 bg-card p-4">
        <div>
          <div className="font-display text-lg font-semibold">{section.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Default question type: <Badge variant="outline" className="text-[10px] ml-1">{section.defaultType}</Badge>
            {section.expectedCount && <span className="ml-2">Target: {section.expectedCount}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost" onClick={onEditSection}>
            <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Rename
          </Button>
          <ConfirmDelete
            triggerLabel="Clear all"
            label={`Delete all ${section.questions.length} questions in "${section.title}"?`}
            onConfirm={() => { deleteAllQuestions(subjectId, paperId, section.id); toast.success("Cleared section"); }}
          />
          <ConfirmDelete
            triggerLabel="Delete section"
            label={`Delete section "${section.title}" and all its questions?`}
            onConfirm={onDeleteSection}
          />
          <Dialog open={creating} onOpenChange={setCreating}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full">
                <Plus className="h-4 w-4 mr-1.5" /> Add question
              </Button>
            </DialogTrigger>
            <QuestionFormDialog
              title={`Add question to ${section.title}`}
              defaultType={section.defaultType}
              onSubmit={(d) => {
                addQuestion(subjectId, paperId, section.id, d);
                toast.success("Question added");
                setCreating(false);
              }}
            />
          </Dialog>
        </div>
      </div>

      {section.questions.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No questions in this section yet.
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {section.questions.map((q) => (
            <li key={q.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Q{q.number}</span>
                    <Badge variant="outline" className="text-[10px]">{q.type}</Badge>
                    {q.topic && <span>· {q.topic}</span>}
                    <Badge variant="outline" className="text-[10px]">{q.difficulty}</Badge>
                    {q.type === "MCQ" && q.correct && (
                      <Badge variant="default" className="text-[10px]">Answer: {q.correct}</Badge>
                    )}
                    {q.marks != null && <Badge variant="secondary" className="text-[10px]">{q.marks} marks</Badge>}
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{q.text}</p>
                  {q.imageDataUrl && (
                    <img
                      src={q.imageDataUrl}
                      alt={`Q${q.number} diagram`}
                      className="mt-3 max-h-48 rounded-xl border border-border"
                    />
                  )}
                  {q.type === "MCQ" && q.options && (
                    <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {q.options.filter((o) => o.text).map((o) => (
                        <div key={o.key} className={`text-xs rounded-md px-2 py-1.5 border ${o.key === q.correct ? "border-mint bg-mint/10" : "border-border"}`}>
                          <span className="font-semibold mr-1.5">{o.key}.</span>{o.text}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type !== "MCQ" && q.modelAnswer && (
                    <details className="mt-3 text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Model answer</summary>
                      <p className="mt-2 whitespace-pre-wrap">{q.modelAnswer}</p>
                    </details>
                  )}
                  {q.explanation && (
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Explanation</summary>
                      <p className="mt-2 whitespace-pre-wrap">{q.explanation}</p>
                    </details>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(q)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmDelete
                    label={`Delete question Q${q.number}?`}
                    onConfirm={() => { deleteQuestion(subjectId, paperId, section.id, q.id); toast.success("Question deleted"); }}
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
            defaultType={section.defaultType}
            initial={editing}
            onSubmit={(d) => {
              updateQuestion(subjectId, paperId, section.id, editing.id, d);
              toast.success("Question updated");
              setEditing(null);
            }}
          />
        )}
      </Dialog>
    </div>
  );
}

function SectionFormDialog({
  title, initial, onSubmit,
}: {
  title: string;
  initial?: Partial<PaperSection>;
  onSubmit: (d: { title: string; defaultType: QuestionType; expectedCount?: number }) => void;
}) {
  const [name, setName] = useState(initial?.title ?? "");
  const [type, setType] = useState<QuestionType>(initial?.defaultType ?? "MCQ");
  const [expected, setExpected] = useState<string>(
    initial?.expectedCount != null ? String(initial.expectedCount) : "",
  );
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <Field label="Section title">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. MCQ, Essay, Pure Maths — Part A" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Default question type">
            <Select value={type} onValueChange={(v) => setType(v as QuestionType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MCQ">MCQ</SelectItem>
                <SelectItem value="Structured">Structured</SelectItem>
                <SelectItem value="Essay">Essay</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Target question count">
            <Input type="number" value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="e.g. 50" />
          </Field>
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={!name.trim()}
          onClick={() => onSubmit({
            title: name.trim(),
            defaultType: type,
            expectedCount: expected ? Number(expected) : undefined,
          })}
        >Save</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function QuestionFormDialog({
  title, defaultType, initial, onSubmit,
}: {
  title: string;
  defaultType: QuestionType;
  initial?: Partial<AdminQuestion>;
  onSubmit: (d: Omit<AdminQuestion, "id" | "number">) => void;
}) {
  const [type, setType] = useState<QuestionType>(initial?.type ?? defaultType);
  const [text, setText] = useState(initial?.text ?? "");
  const [topic, setTopic] = useState(initial?.topic ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? "Medium");
  const [marks, setMarks] = useState<string>(initial?.marks != null ? String(initial.marks) : "");
  const [correct, setCorrect] = useState<OptionKey>(initial?.correct ?? "A");
  const [explanation, setExplanation] = useState(initial?.explanation ?? "");
  const [modelAnswer, setModelAnswer] = useState(initial?.modelAnswer ?? "");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(initial?.imageDataUrl);
  const [options, setOptions] = useState<Record<OptionKey, string>>(() => {
    const base: Record<OptionKey, string> = { A: "", B: "", C: "", D: "", E: "" };
    initial?.options?.forEach((o) => { base[o.key] = o.text; });
    return base;
  });

  const onPickImage = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large (max 2 MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Type">
            <Select value={type} onValueChange={(v) => setType(v as QuestionType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MCQ">MCQ</SelectItem>
                <SelectItem value="Structured">Structured</SelectItem>
                <SelectItem value="Essay">Essay</SelectItem>
              </SelectContent>
            </Select>
          </Field>
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

        <Field label="Question text">
          <Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter the question…" />
        </Field>

        <Field label="Question image (optional)">
          <div className="flex items-center gap-3">
            <label className="flex-1 flex items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 cursor-pointer hover:bg-muted/40">
              <span className="text-sm text-muted-foreground truncate">
                {imageDataUrl ? "Replace image…" : "Upload image (PNG/JPG, max 2MB)"}
              </span>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickImage(f); }}
              />
            </label>
            {imageDataUrl && (
              <Button type="button" size="icon" variant="outline" onClick={() => setImageDataUrl(undefined)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {imageDataUrl && (
            <img src={imageDataUrl} alt="preview" className="mt-2 max-h-40 rounded-lg border border-border" />
          )}
        </Field>

        {type === "MCQ" ? (
          <>
            {KEYS.map((k) => (
              <Field key={k} label={`Option ${k}`}>
                <Input
                  value={options[k]}
                  onChange={(e) => setOptions((o) => ({ ...o, [k]: e.target.value }))}
                  placeholder={`Option ${k} text`}
                />
              </Field>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Correct answer">
                <Select value={correct} onValueChange={(v) => setCorrect(v as OptionKey)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Marks"><Input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} placeholder="1" /></Field>
            </div>
          </>
        ) : (
          <>
            <Field label="Model answer / marking scheme">
              <Textarea rows={5} value={modelAnswer} onChange={(e) => setModelAnswer(e.target.value)} placeholder="Step-by-step model answer…" />
            </Field>
            <Field label="Marks"><Input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} placeholder="e.g. 15" /></Field>
          </>
        )}

        <Field label="Explanation (shown to students after submission)">
          <Textarea rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Step by step explanation…" />
        </Field>
      </div>
      <DialogFooter>
        <Button
          disabled={!text.trim()}
          onClick={() => onSubmit({
            type,
            text: text.trim(),
            topic: topic.trim() || "General",
            difficulty,
            marks: marks ? Number(marks) : undefined,
            imageDataUrl,
            explanation: explanation.trim(),
            ...(type === "MCQ"
              ? { correct, options: KEYS.map((k) => ({ key: k, text: options[k] })) }
              : { modelAnswer: modelAnswer.trim() }),
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
