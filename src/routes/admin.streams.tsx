import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, GitBranch } from "lucide-react";
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
import { useAdminStore, type AdminStream } from "@/lib/admin-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/streams")({ component: StreamsAdmin });

function StreamsAdmin() {
  const { streams, addStream, updateStream, deleteStream } = useAdminStore();
  const [editing, setEditing] = useState<AdminStream | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Streams</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Manage Streams</h1>
          <p className="mt-2 text-muted-foreground">Add new streams, edit details or mark them as coming soon.</p>
        </div>
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button className="rounded-full"><Plus className="h-4 w-4 mr-1.5" /> Add Stream</Button>
          </DialogTrigger>
          <StreamFormDialog
            title="Add new stream"
            onSubmit={(d) => { addStream(d); toast.success("Stream added"); setCreating(false); }}
          />
        </Dialog>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {streams.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <GitBranch className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-semibold">{s.name}</div>
                  <Badge variant={s.status === "available" ? "default" : "secondary"} className="rounded-full mt-1 text-[10px]">
                    {s.status === "available" ? "Available" : "Coming Soon"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setEditing(s)}><Pencil className="h-4 w-4" /></Button>
                <ConfirmDelete
                  label={`Delete stream "${s.name}"? This also removes its subjects.`}
                  onConfirm={() => { deleteStream(s.id); toast.success("Stream deleted"); }}
                />
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <StreamFormDialog
            title={`Edit ${editing.name}`}
            initial={editing}
            onSubmit={(d) => { updateStream(editing.id, d); toast.success("Stream updated"); setEditing(null); }}
          />
        )}
      </Dialog>
    </div>
  );
}

function StreamFormDialog({
  title, initial, onSubmit,
}: {
  title: string;
  initial?: Partial<AdminStream>;
  onSubmit: (d: { name: string; description: string; status: "available" | "coming-soon" }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<"available" | "coming-soon">(initial?.status ?? "available");
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Commerce" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short summary of the stream" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="coming-soon">Coming Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={!name.trim()}
          onClick={() => onSubmit({ name: name.trim(), description: description.trim(), status })}
        >Save</Button>
      </DialogFooter>
    </DialogContent>
  );
}
