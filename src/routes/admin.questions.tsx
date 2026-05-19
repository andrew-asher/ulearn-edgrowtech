import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { questions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/questions")({ component: QAdmin });

function QAdmin() {
  const [correct, setCorrect] = useState("A");
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Questions</div>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Manage Questions</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-2xl border border-border/60 bg-card">
          <div className="p-5 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">All questions</h2>
            <Badge variant="secondary">{questions.length} total</Badge>
          </div>
          <ul className="divide-y divide-border/60">
            {questions.map((q) => (
              <li key={q.id} className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Q{q.number} · {q.topic}</div>
                  <Badge variant="outline">{q.difficulty}</Badge>
                </div>
                <p className="mt-1 text-sm line-clamp-2">{q.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); toast.success("Question added (mock)"); }}
          className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 self-start">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><Plus className="h-4 w-4" /></div>
            <h2 className="font-display text-lg font-semibold">Add Question</h2>
          </div>
          <Field label="Question text"><Textarea rows={3} placeholder="Enter the question…" /></Field>
          {(["A","B","C","D","E"] as const).map((k) => (
            <Field key={k} label={`Option ${k}`}><Input placeholder={`Option ${k} text`} /></Field>
          ))}
          <Field label="Correct answer">
            <Select value={correct} onValueChange={setCorrect}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["A","B","C","D","E"] as const).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Explanation"><Textarea rows={3} placeholder="Step by step explanation…" /></Field>
          <Button type="submit" className="w-full rounded-full">Save Question</Button>
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
