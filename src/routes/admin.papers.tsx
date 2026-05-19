import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { papers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/papers")({
  component: PapersAdmin,
});

function PapersAdmin() {
  const [published, setPublished] = useState(true);
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Papers</div>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Manage Past Papers</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border/60 bg-card">
          <div className="p-5 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">All papers</h2>
            <Badge variant="secondary">{papers.length} total</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left px-5 py-3">Subject</th><th>Year</th><th>Type</th><th>Medium</th><th>Difficulty</th><th></th></tr>
              </thead>
              <tbody>
                {papers.map((p) => (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="px-5 py-3 font-medium">{p.subject}</td>
                    <td>{p.year}</td>
                    <td>{p.paperType}</td>
                    <td>{p.medium}</td>
                    <td><Badge variant="outline">{p.difficulty}</Badge></td>
                    <td className="pr-5 text-right"><Button size="sm" variant="ghost">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); toast.success("Paper added (mock)"); }}
          className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 self-start">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><Plus className="h-4 w-4" /></div>
            <h2 className="font-display text-lg font-semibold">Add Paper</h2>
          </div>
          <Field label="Subject"><Input placeholder="Physics" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Year"><Input type="number" placeholder="2024" /></Field>
            <Field label="Medium">
              <Select defaultValue="English">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Sinhala">Sinhala</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Paper Type">
            <Select defaultValue="MCQ">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MCQ">MCQ</SelectItem>
                <SelectItem value="Structured">Structured</SelectItem>
                <SelectItem value="Essay">Essay</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Upload Full Past Paper PDF">
            <Button type="button" variant="outline" className="w-full justify-start rounded-lg"><Upload className="h-4 w-4 mr-2" /> Choose PDF…</Button>
          </Field>
          <Field label="Upload Marking Scheme">
            <Button type="button" variant="outline" className="w-full justify-start rounded-lg"><FileText className="h-4 w-4 mr-2" /> Choose PDF…</Button>
          </Field>
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2">
            <Label className="text-sm">Publish paper</Label>
            <Switch checked={published} onCheckedChange={setPublished} />
          </div>
          <Button type="submit" className="w-full rounded-full">Save Paper</Button>
        </form>
      </div>
    </div>
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
