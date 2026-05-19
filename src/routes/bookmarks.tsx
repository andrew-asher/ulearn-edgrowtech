import { createFileRoute, Link } from "@tanstack/react-router";
import { useBookmarks, type FavLabel } from "@/lib/bookmarks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Bookmark, BookmarkX, ArrowRight } from "lucide-react";

const LABELS: FavLabel[] = ["Difficult", "Need Revision", "Important", "Ask Teacher", "Formula Based"];

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "Saved Questions · U-Learn" }] }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const { bookmarks, setLabel, remove } = useBookmarks();
  return (
    <div className="relative">
      <div className="eg-watermark" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">My Library</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight">Saved Questions & Bookmarks</h1>
        <p className="mt-3 text-muted-foreground">Tag questions with favourite labels and jump back into practice.</p>

        {bookmarks.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
            <Bookmark className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-3 font-display text-xl font-semibold">No bookmarks yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Open a paper and bookmark questions to revisit them here.</p>
            <Button asChild className="mt-5 rounded-full"><Link to="/study">Start Studying</Link></Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {bookmarks.map((b) => (
              <div key={b.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <Badge variant="secondary">{b.subject}</Badge>
                    <Badge variant="secondary">{b.year}</Badge>
                    <Badge variant="secondary">{b.paperType}</Badge>
                    {b.label && <Badge className="bg-mint text-mint-foreground">{b.label}</Badge>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(b.id)} aria-label="Remove">
                    <BookmarkX className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-3 text-sm line-clamp-3">{b.questionText}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Select value={b.label ?? "_none"} onValueChange={(v) => setLabel(b.id, v === "_none" ? undefined : (v as FavLabel))}>
                    <SelectTrigger className="h-9 w-44 rounded-full"><SelectValue placeholder="Add label" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">No label</SelectItem>
                      {LABELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button asChild size="sm" className="rounded-full ml-auto">
                    <Link to="/interactive/$paperId" params={{ paperId: b.paperId }}>
                      Open Question <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
