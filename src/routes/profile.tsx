import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBookmarks } from "@/lib/bookmarks";
import { User2, Bookmark, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · U-Learn" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { bookmarks } = useBookmarks();
  const [name, setName] = useState(() => (typeof window !== "undefined" && localStorage.getItem("ulearn-name")) || "");
  const [email, setEmail] = useState(() => (typeof window !== "undefined" && localStorage.getItem("ulearn-email")) || "");
  const [signedIn, setSignedIn] = useState(() => Boolean(typeof window !== "undefined" && localStorage.getItem("ulearn-name")));

  const save = () => {
    localStorage.setItem("ulearn-name", name);
    localStorage.setItem("ulearn-email", email);
    setSignedIn(true);
  };

  return (
    <div className="relative">
      <div className="eg-watermark" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Student Profile</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight">Welcome to U-Learn</h1>

        <div className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          {signedIn ? (
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-mint text-primary-foreground">
                <User2 className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="font-display text-xl font-semibold">{name || "Student"}</div>
                <div className="text-sm text-muted-foreground">{email || "no email"}</div>
              </div>
              <Button variant="outline" className="rounded-full" onClick={() => { localStorage.removeItem("ulearn-name"); localStorage.removeItem("ulearn-email"); setSignedIn(false); }}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={save} className="rounded-full">Create profile</Button>
                <span className="ml-3 text-xs text-muted-foreground">Mock login — saved locally for now.</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Saved</div>
              <h2 className="font-display text-xl font-semibold mt-1">{bookmarks.length} bookmarks</h2>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/bookmarks"><Bookmark className="h-4 w-4 mr-1.5" /> Open library <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
