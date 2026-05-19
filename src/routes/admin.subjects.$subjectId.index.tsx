import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Pencil, Plus, FileText, Sparkles, Upload, ArrowRight, Check, X,
  BookOpen,
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
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import {
  useAdminStore, type AdminPaper, type AdminNote, type SubjectContent, type Medium,
} from "@/lib/admin-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/subjects/$subjectId/")({
  component: SubjectDetail,
  notFoundComponent: () => (
    <div className="text-center">
      <h1 className="font-display text-2xl font-bold">Subject not found</h1>
      <Link to="/admin/subjects" className="text-primary hover:underline mt-2 inline-block">Back to subjects</Link>
    </div>
  ),
});

function SubjectDetail() {
  const { subjectId } = Route.useParams();
  const { getSubject, streams, regenerateSampleQuestions } = useAdminStore();
  const subject = getSubject(subjectId);
  if (!subject) throw notFound();
  const stream = streams.find((s) => s.id === subject.streamId);

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
        <Link to="/admin/subjects"><ArrowLeft className="h-4 w-4 mr-1.5" /> All subjects</Link>
      </Button>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
            {stream?.name ?? "Stream"} · Subject
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" /> {subject.name}
          </h1>
          {subject.description && <p className="mt-2 text-muted-foreground max-w-3xl">{subject.description}</p>}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => {
            if (!confirm(`Regenerate sample questions for every paper in ${subject.name}? Existing questions will be replaced.`)) return;
            const r = regenerateSampleQuestions(subject.id, { overwrite: true });
            toast.success(`Regenerated ${r.questions} questions across ${r.papers} papers`);
          }}
        >
          <Sparkles className="h-4 w-4 mr-1.5" /> Generate sample questions
        </Button>
      </div>

      <div className="mt-10 space-y-10">
        <PapersSection subjectId={subject.id} section="pastPapers" icon={<FileText className="h-5 w-5" />} />
        <NotesSection subjectId={subject.id} />
        <PapersSection subjectId={subject.id} section="modelPapers" icon={<Sparkles className="h-5 w-5" />} />
      </div>
    </div>
  );
}

function SectionHeader({
  subjectId, section,
}: {
  subjectId: string;
  section: keyof SubjectContent;
}) {
  const { getSubject, updateSection } = useAdminStore();
  const sub = getSubject(subjectId)!;
  const s = sub.content[section];
  const [editing, setEditing] = useState(false);
  const [heading, setHeading] = useState(s.heading);
  const [desc, setDesc] = useState(s.description);

  if (editing) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-card p-4 space-y-3">
        <Input value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Section heading" />
        <Textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Section description" />
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => { setHeading(s.heading); setDesc(s.description); setEditing(false); }}>
            <X className="h-4 w-4 mr-1.5" /> Cancel
          </Button>
          <Button size="sm" onClick={() => { updateSection(subjectId, section, { heading, description: desc }); setEditing(false); toast.success("Section updated"); }}>
            <Check className="h-4 w-4 mr-1.5" /> Save
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-bold">{s.heading}</h2>
        <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
      </div>
      <Button size="sm" variant="outline" className="rounded-full" onClick={() => setEditing(true)}>
        <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit heading
      </Button>
    </div>
  );
}

function PapersSection({
  subjectId, section, icon,
}: {
  subjectId: string;
  section: "pastPapers" | "modelPapers";
  icon: React.ReactNode;
}) {
  const { getSubject, addPaper, updatePaper, deletePaper } = useAdminStore();
  const sub = getSubject(subjectId)!;
  const items = sub.content[section].items;
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminPaper | null>(null);
  const qCount = (p: AdminPaper) => p.sections.reduce((n, s) => n + s.questions.length, 0);

  return (
    <section>
      <SectionHeader subjectId={subjectId} section={section} />

      <div className="mt-4 flex justify-end">
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full"><Plus className="h-4 w-4 mr-1.5" /> Add paper</Button>
          </DialogTrigger>
          <PaperFormDialog
            title="Add paper"
            onSubmit={(d) => { addPaper(subjectId, section, { ...d, subjectName: sub.name }); toast.success("Paper added with section blueprint"); setCreating(false); }}
          />
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No papers yet. Click "Add paper" to upload one.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {items.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
                  <div>
                    <div className="font-display font-semibold">{p.title}</div>
                    <div className="text-xs text-muted-foreground flex gap-2 mt-0.5">
                      {p.year && <span>{p.year}</span>}
                      {p.medium && <span>· {p.medium}</span>}
                      {p.paperType && <Badge variant="outline" className="text-[10px]">{p.paperType}</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmDelete
                    label={`Delete paper "${p.title}" and its ${qCount(p)} questions?`}
                    onConfirm={() => { deletePaper(subjectId, section, p.id); toast.success("Paper deleted"); }}
                  />
                </div>
              </div>
              {p.description && <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>}
              {p.fileName && (
                <div className="mt-3 text-xs flex items-center gap-1.5 text-muted-foreground">
                  <Upload className="h-3 w-3" /> {p.fileName}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.sections.map((s) => (
                  <Badge key={s.id} variant="outline" className="text-[10px] rounded-full">
                    {s.title}: {s.questions.length}{s.expectedCount ? `/${s.expectedCount}` : ""}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary" className="rounded-full">{qCount(p)} questions total</Badge>
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link
                    to="/admin/subjects/$subjectId/papers/$paperId"
                    params={{ subjectId, paperId: p.id }}
                  >
                    Manage sections <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <PaperFormDialog
            title={`Edit ${editing.title}`}
            initial={editing}
            onSubmit={(d) => { updatePaper(subjectId, section, editing.id, d); toast.success("Paper updated"); setEditing(null); }}
          />
        )}
      </Dialog>
    </section>
  );
}

function PaperFormDialog({
  title, initial, onSubmit,
}: {
  title: string;
  initial?: Partial<AdminPaper>;
  onSubmit: (d: Omit<AdminPaper, "id" | "sections">) => void;
}) {
  type PT = "MCQ" | "Structured" | "Essay" | "Mixed";
  const [t, setT] = useState(initial?.title ?? "");
  const [year, setYear] = useState<string>(initial?.year ? String(initial.year) : "");
  const [medium, setMedium] = useState<Medium>(initial?.medium ?? "English");
  const [paperType, setPaperType] = useState<PT>((initial?.paperType as PT) ?? "Mixed");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [fileName, setFileName] = useState(initial?.fileName ?? "");

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <Field label="Title"><Input value={t} onChange={(e) => setT(e.target.value)} placeholder="e.g. Physics 2024" /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Year"><Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" /></Field>
          <Field label="Medium">
            <Select value={medium} onValueChange={(v) => setMedium(v as Medium)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
                <SelectItem value="Sinhala">Sinhala</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Type">
            <Select value={paperType} onValueChange={(v) => setPaperType(v as PT)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Mixed">Mixed (full paper)</SelectItem>
                <SelectItem value="MCQ">MCQ only</SelectItem>
                <SelectItem value="Structured">Structured only</SelectItem>
                <SelectItem value="Essay">Essay only</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Description"><Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <Field label="Upload PDF (mock)">
          <label className="flex items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 cursor-pointer hover:bg-muted/40">
            <span className="text-sm text-muted-foreground truncate">{fileName || "Choose PDF…"}</span>
            <Upload className="h-4 w-4 text-muted-foreground" />
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setFileName(f.name); }}
            />
          </label>
        </Field>
        <p className="text-xs text-muted-foreground">
          New papers are pre-filled with the recommended section blueprint for this subject (e.g. MCQ + Essay, or Pure/Applied Maths Parts A & B). You can edit sections after creating.
        </p>
      </div>
      <DialogFooter>
        <Button
          disabled={!t.trim()}
          onClick={() => onSubmit({
            title: t.trim(),
            year: year ? Number(year) : undefined,
            medium,
            paperType,
            description: description.trim(),
            fileName: fileName || undefined,
          })}
        >Save paper</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function NotesSection({ subjectId }: { subjectId: string }) {
  const { getSubject, addNote, updateNote, deleteNote } = useAdminStore();
  const sub = getSubject(subjectId)!;
  const items = sub.content.notes.items;
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminNote | null>(null);

  return (
    <section>
      <SectionHeader subjectId={subjectId} section="notes" />

      <div className="mt-4 flex justify-end">
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full"><Plus className="h-4 w-4 mr-1.5" /> Add note</Button>
          </DialogTrigger>
          <NoteFormDialog
            title="Add note"
            onSubmit={(d) => { addNote(subjectId, d); toast.success("Note added"); setCreating(false); }}
          />
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No notes yet.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {items.map((n) => (
            <div key={n.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-mint/30 text-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="font-display font-semibold">{n.title}</div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(n)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmDelete
                    label={`Delete note "${n.title}"?`}
                    onConfirm={() => { deleteNote(subjectId, n.id); toast.success("Note deleted"); }}
                  />
                </div>
              </div>
              {n.description && <p className="mt-3 text-sm text-muted-foreground">{n.description}</p>}
              {n.fileName && (
                <div className="mt-3 text-xs flex items-center gap-1.5 text-muted-foreground">
                  <Upload className="h-3 w-3" /> {n.fileName}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <NoteFormDialog
            title={`Edit ${editing.title}`}
            initial={editing}
            onSubmit={(d) => { updateNote(subjectId, editing.id, d); toast.success("Note updated"); setEditing(null); }}
          />
        )}
      </Dialog>
    </section>
  );
}

function NoteFormDialog({
  title, initial, onSubmit,
}: {
  title: string;
  initial?: Partial<AdminNote>;
  onSubmit: (d: Omit<AdminNote, "id">) => void;
}) {
  const [t, setT] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [fileName, setFileName] = useState(initial?.fileName ?? "");
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <Field label="Title"><Input value={t} onChange={(e) => setT(e.target.value)} placeholder="e.g. Chapter 1 — Mechanics" /></Field>
        <Field label="Description"><Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <Field label="Upload PDF (mock)">
          <label className="flex items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 cursor-pointer hover:bg-muted/40">
            <span className="text-sm text-muted-foreground truncate">{fileName || "Choose PDF…"}</span>
            <Upload className="h-4 w-4 text-muted-foreground" />
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setFileName(f.name); }}
            />
          </label>
        </Field>
      </div>
      <DialogFooter>
        <Button
          disabled={!t.trim()}
          onClick={() => onSubmit({ title: t.trim(), description: description.trim(), fileName: fileName || undefined })}
        >Save note</Button>
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