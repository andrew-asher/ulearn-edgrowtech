import { Link } from "@tanstack/react-router";
import { EdGrowLogo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <EdGrowLogo size={32} />
            <div>
              <div className="font-display font-bold">U-Learn by EdGrow</div>
              <div className="text-xs text-muted-foreground">edgrow.lk · A digital education platform for the new AI era</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            Built by EdGrow Tech for Sri Lankan students. Phase 1 focuses on A/L students with interactive past paper practice.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/study" className="hover:text-foreground">Study</Link></li>
            <li><Link to="/bookmarks" className="hover:text-foreground">Bookmarks</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">Admin</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EdGrow Tech · All rights reserved
      </div>
    </footer>
  );
}
