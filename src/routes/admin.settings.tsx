import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/settings")({ component: () => (
  <div>
    <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Settings</div>
    <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">Platform Settings</h1>
    <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 space-y-5 max-w-xl">
      <div className="space-y-1.5"><Label>Platform name</Label><Input defaultValue="U-Learn by EdGrow" /></div>
      <div className="space-y-1.5"><Label>Contact WhatsApp</Label><Input defaultValue="+44 7553 977830" /></div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2">
        <Label>Allow new sign-ups</Label><Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2">
        <Label>AI Tutor enabled</Label><Switch defaultChecked />
      </div>
      <Button className="rounded-full">Save settings</Button>
    </div>
  </div>
)});
