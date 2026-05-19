import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EdGrowLogo } from "@/components/brand/Logo";
import {
  LayoutDashboard, GitBranch, BookOpen, Users, Download, Settings, ArrowLeft, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminStoreProvider } from "@/lib/admin-store";
import { isAdminAuthed, signOutAdmin } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · U-Learn by EdGrow Tech" }] }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/streams", label: "Streams", icon: GitBranch },
  { to: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/downloads", label: "Downloads", icon: Download },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminAuthed()) {
      navigate({ to: "/admin-login", replace: true });
    } else {
      setReady(true);
    }
  }, [navigate, path]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Checking admin session…
      </div>
    );
  }

  const logout = () => {
    signOutAdmin();
    navigate({ to: "/admin-login", replace: true });
  };

  return (
    <AdminStoreProvider>
      <div className="min-h-screen flex bg-muted/30">
        <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
          <div className="p-5 flex items-center gap-3 border-b border-sidebar-border">
            <EdGrowLogo size={36} />
            <div className="leading-tight">
              <div className="font-display font-bold text-sm">U-Learn Admin</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">EdGrow Tech</div>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {links.map((l) => {
              const active = ("exact" in l && l.exact) ? path === l.to : path.startsWith(l.to);
              return (
                <Link key={l.to} to={l.to}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground shadow-soft" : "hover:bg-sidebar-accent",
                  )}>
                  <l.icon className="h-4 w-4" /> {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-sidebar-border space-y-1">
            <Button onClick={logout} variant="ghost" className="w-full justify-start rounded-xl">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
            <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent">
              <ArrowLeft className="h-4 w-4" /> Back to U-Learn
            </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-x-auto">
          <header className="md:hidden sticky top-0 z-10 bg-background border-b border-border p-3 flex items-center gap-3">
            <EdGrowLogo size={32} />
            <div className="font-display font-bold flex-1">U-Learn Admin</div>
            <Button onClick={logout} size="sm" variant="ghost"><LogOut className="h-4 w-4" /></Button>
          </header>
          <div className="p-6 lg:p-10 max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </AdminStoreProvider>
  );
}
