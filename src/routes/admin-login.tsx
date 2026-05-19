import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import { EdGrowLogo } from "@/components/brand/Logo";
import { isAdminAuthed, signInAdmin, ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/admin-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin sign in · U-Learn" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAdminAuthed()) navigate({ to: "/admin" });
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signInAdmin(email, password)) {
      toast.success("Welcome back, admin");
      navigate({ to: "/admin" });
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-primary/5 via-background to-mint/10 px-4">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-8 shadow-soft animate-fade-up">
        <Link to="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to U-Learn
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <EdGrowLogo size={44} />
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Admin Console</div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Sign in
            </h1>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          This is a separate gate for administrators of EdGrow Tech. Student accounts cannot sign in here.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@edgrow.lk" autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full rounded-full" size="lg">
            <Lock className="h-4 w-4 mr-1.5" /> Sign in to Admin
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Demo credentials:</span> {ADMIN_EMAIL} / {ADMIN_PASSWORD}
        </div>
      </div>
    </div>
  );
}
