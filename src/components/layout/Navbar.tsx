import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Globe, User, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { EdGrowLogo } from "@/components/brand/Logo";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/study", label: "Study" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <EdGrowLogo size={36} />
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-tight">U-Learn</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">by EdGrow Tech</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {n.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-primary to-mint" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-full">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex rounded-full text-muted-foreground">
            <Link to="/admin-login">
              <Shield className="h-4 w-4 mr-1.5" /> Admin
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex rounded-full">
            <Link to="/profile">
              <User className="h-4 w-4 mr-1.5" /> Student
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/50 bg-background animate-fade-in">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {navItems.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted">
                {n.label}
              </Link>
            ))}
            <Link to="/profile" onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted">Student</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageSelector() {
  const [lang, setLang] = useState<"en" | "ta" | "si">("en");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full gap-1.5">
          <Globe className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase">
            {lang === "en" ? "EN" : lang === "ta" ? "TA" : "SI"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => setLang("en")}>
          English {lang === "en" && <span className="ml-auto text-mint">●</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.preventDefault(); setLang("ta"); }}>
          Tamil <Badge variant="secondary" className="ml-auto text-[10px]">Coming Soon</Badge>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.preventDefault(); setLang("si"); }}>
          Sinhala <Badge variant="secondary" className="ml-auto text-[10px]">Coming Soon</Badge>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
