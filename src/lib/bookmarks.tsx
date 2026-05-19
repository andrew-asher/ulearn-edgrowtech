import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type FavLabel = "Difficult" | "Need Revision" | "Important" | "Ask Teacher" | "Formula Based";

export interface Bookmark {
  id: string; // `${paperId}:${questionId}`
  paperId: string;
  questionId: string;
  subject: string;
  year: number;
  paperType: string;
  questionText: string;
  label?: FavLabel;
  saved: boolean;
  createdAt: number;
}

type Ctx = {
  bookmarks: Bookmark[];
  toggle: (b: Omit<Bookmark, "saved" | "createdAt">) => void;
  setLabel: (id: string, label: FavLabel | undefined) => void;
  isBookmarked: (id: string) => boolean;
  remove: (id: string) => void;
};

const BookmarkCtx = createContext<Ctx | null>(null);
const KEY = "ulearn-bookmarks";

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setBookmarks(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(bookmarks)); } catch {}
  }, [bookmarks]);

  const toggle = useCallback((b: Omit<Bookmark, "saved" | "createdAt">) => {
    setBookmarks((prev) => {
      const exists = prev.find((x) => x.id === b.id);
      if (exists) return prev.filter((x) => x.id !== b.id);
      return [...prev, { ...b, saved: true, createdAt: Date.now() }];
    });
  }, []);

  const setLabel = useCallback((id: string, label: FavLabel | undefined) => {
    setBookmarks((prev) => prev.map((x) => (x.id === id ? { ...x, label } : x)));
  }, []);

  const isBookmarked = useCallback((id: string) => bookmarks.some((x) => x.id === id), [bookmarks]);
  const remove = useCallback((id: string) => setBookmarks((p) => p.filter((x) => x.id !== id)), []);

  return (
    <BookmarkCtx.Provider value={{ bookmarks, toggle, setLabel, isBookmarked, remove }}>
      {children}
    </BookmarkCtx.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkCtx);
  if (!ctx) throw new Error("useBookmarks must be inside BookmarkProvider");
  return ctx;
}
