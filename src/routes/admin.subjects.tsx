import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useAdminStore, type AdminSubject } from "@/lib/admin-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/subjects")({ component: SubjectsAdmin });

function SubjectsAdmin() {
  const { streams, subjects, addSubject, updateSubject, deleteSubject, regenerateSampleQuestions } = useAdminStore();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminSubject | null>(null);

  const available = streams.filter((s) => s.status === "available");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Subjects</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Manage Subjects</h1>
          <p className="mt-2 text-muted-foreground">Add subjects under a stream. Open a subject to manage its papers, notes and questions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              if (!confirm("Regenerate sample questions for every paper across all subjects? Existing questions will be replaced.")) return;
              const r = regenerateSampleQuestions(undefined, { overwrite: true });
              toast.success(`Regenerated ${r.questions} questions across ${r.papers} papers`);
            }}
          >
            <Sparkles className="h-4 w-4 mr-1.5" /> Generate sample questions
          </Button>
          <Dialog open={creating} onOpenChange={setCreating}>
            <DialogTrigger asChild>
              <Button className="rounded-full" disabled={!available.length}><Plus className="h-4 w-4 mr-1.5" /> Add Subject</Button>
            </DialogTrigger>
            <SubjectFormDialog
              title="Add new subject"
              streams={available}
              onSubmit={(d) => {
                addSubject(d.streamId, d.name, d.description);
                toast.success("Subject added");
                setCreating(false);
              }}
            />
          </Dialog>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {available.map((stream) => {
          const list = subjects.filter((x) => x.streamId === stream.id);
          return (
            <div key={stream.id}>
              <h2 className="font-display text-lg font-semibold mb-3">{stream.name}</h2>
              {list.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No subjects yet. Add one above.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {list.map((sub) => (
                    <div key={sub.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-display font-semibold">{sub.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {sub.content.pastPapers.items.length} papers · {sub.content.notes.items.length} notes
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setEditing(sub)}><Pencil className="h-4 w-4" /></Button>
                          <ConfirmDelete
                            label={`Delete subject "${sub.name}" and all its papers/notes?`}
                            onConfirm={() => { deleteSubject(sub.id); toast.success("Subject deleted"); }}
                          />
                        </div>
                      </div>
                      {sub.description && <p className="mt-3 text-sm text-muted-foreground">{sub.description}</p>}
                      <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                        <Link to="/admin/subjects/$subjectId" params={{ subjectId: sub.id }}>
                          Manage content <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <SubjectFormDialog
            title={`Edit ${editing.name}`}
            streams={available}
            initial={editing}
            lockStream
            onSubmit={(d) => {
              updateSubject(editing.id, { name: d.name, description: d.description });
              toast.success("Subject updated");
              setEditing(null);
            }}
          />
        )}
      </Dialog>
    </div>
  );
}

function SubjectFormDialog({
  title, streams, initial, lockStream, onSubmit,
}: {
  title: string;
  streams: { id: string; name: string }[];
  initial?: Partial<AdminSubject>;
  lockStream?: boolean;
  onSubmit: (d: { name: string; description: string; streamId: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [streamId, setStreamId] = useState(initial?.streamId ?? streams[0]?.id ?? "");
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Stream</Label>
          <Select value={streamId} onValueChange={setStreamId} disabled={lockStream}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {streams.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Subject name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Physics" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short subject summary" />
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={!name.trim() || !streamId}
          onClick={() => onSubmit({ name: name.trim(), description: description.trim(), streamId })}
        >Save</Button>
      </DialogFooter>
    </DialogContent>
  );
}
