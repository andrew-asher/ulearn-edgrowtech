import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { streams as seedStreams, subjectSlug } from "@/lib/mock-data";
import { generateSampleQuestions } from "@/lib/sample-questions";

export type OptionKey = "A" | "B" | "C" | "D" | "E";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Medium = "English" | "Tamil" | "Sinhala";
export type QuestionType = "MCQ" | "Structured" | "Essay";

export type AdminQuestion = {
  id: string;
  number: number;
  type: QuestionType;
  text: string;
  imageDataUrl?: string;
  options?: { key: OptionKey; text: string }[];
  correct?: OptionKey;
  modelAnswer?: string;
  explanation: string;
  marks?: number;
  topic: string;
  difficulty: Difficulty;
};

export type PaperSection = {
  id: string;
  title: string;
  defaultType: QuestionType;
  expectedCount?: number;
  questions: AdminQuestion[];
};

export type AdminPaper = {
  id: string;
  title: string;
  year?: number;
  medium?: Medium;
  paperType?: "MCQ" | "Structured" | "Essay" | "Mixed";
  fileName?: string;
  description?: string;
  sections: PaperSection[];
};

export type AdminNote = {
  id: string;
  title: string;
  description?: string;
  fileName?: string;
};

export type SubjectSection<T> = {
  heading: string;
  description: string;
  items: T[];
};

export type SubjectContent = {
  pastPapers: SubjectSection<AdminPaper>;
  notes: SubjectSection<AdminNote>;
  modelPapers: SubjectSection<AdminPaper>;
};

export type AdminSubject = {
  id: string;
  streamId: string;
  name: string;
  description?: string;
  content: SubjectContent;
};

export type AdminStream = {
  id: string;
  name: string;
  description: string;
  status: "available" | "coming-soon";
};

type Snapshot = {
  streams: AdminStream[];
  subjects: AdminSubject[];
};

const STORAGE_KEY = "edgrow-admin-content-v7";
const uid = () => Math.random().toString(36).slice(2, 10);
const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function blueprintForSubject(name: string): PaperSection[] {
  const lower = name.toLowerCase();
  if (lower.includes("combined") && lower.includes("math")) {
    return [
      { id: uid(), title: "Pure Mathematics — Part A", defaultType: "Structured", expectedCount: 10, questions: [] },
      { id: uid(), title: "Pure Mathematics — Part B", defaultType: "Essay", expectedCount: 6, questions: [] },
      { id: uid(), title: "Applied Mathematics — Part A", defaultType: "Structured", expectedCount: 10, questions: [] },
      { id: uid(), title: "Applied Mathematics — Part B", defaultType: "Essay", expectedCount: 6, questions: [] },
    ];
  }
  return [
    { id: uid(), title: "MCQ", defaultType: "MCQ", expectedCount: 50, questions: [] },
    { id: uid(), title: "Structured", defaultType: "Structured", expectedCount: 5, questions: [] },
    { id: uid(), title: "Essay", defaultType: "Essay", expectedCount: 6, questions: [] },
  ];
}

function fillSection(sec: PaperSection, subject: string, year: number): PaperSection {
  if (sec.questions.length > 0) return sec;
  const target = sec.expectedCount ?? 5;
  sec.questions = generateSampleQuestions(subject, sec.title, sec.defaultType, target, year);
  return sec;
}

function emptyContent(name: string): SubjectContent {
  return {
    pastPapers: {
      heading: `${name} · Past Papers`,
      description: "Real A/L exam papers with full questions and marking schemes.",
      items: [],
    },
    notes: {
      heading: `${name} · Study Notes`,
      description: "Topic-wise notes curated by EdGrow Tech.",
      items: [],
    },
    modelPapers: {
      heading: `${name} · Model Papers`,
      description: "Practice model papers to prepare for the real exam.",
      items: [],
    },
  };
}

function buildSeed(): Snapshot {
  const subjects: AdminSubject[] = [];
  for (const s of seedStreams) {
    if (s.status !== "available") continue;
    for (const subName of s.subjects) {
      const id = `${s.id}__${subjectSlug(subName)}`;
      const content = emptyContent(subName);
      // Seed a 2023 paper with full blueprint, pre-filled with placeholder questions
      const seedYears = [2023, 2022, 2021];
      content.pastPapers.items = seedYears.map((year) => {
        const sections = blueprintForSubject(subName).map((sec) => fillSection(sec, subName, year));
        return {
          id: `${id}__${year}`,
          title: `${subName} ${year}`,
          year,
          medium: "English" as Medium,
          paperType: "Mixed" as const,
          description: `${subName} ${year} full paper — auto-seeded with the standard section blueprint. Edit each question to replace placeholders with the real exam text.`,
          sections,
        };
      });
      subjects.push({
        id,
        streamId: s.id,
        name: subName,
        description: `${subName} for ${s.name} stream.`,
        content,
      });
    }
  }
  return {
    streams: seedStreams.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      status: s.status,
    })),
    subjects,
  };
}

function load(): Snapshot {
  if (typeof window === "undefined") return buildSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeed();
    const parsed = JSON.parse(raw) as Snapshot;
    if (!parsed.streams || !parsed.subjects) return buildSeed();
    return parsed;
  } catch {
    return buildSeed();
  }
}

type Ctx = {
  streams: AdminStream[];
  subjects: AdminSubject[];
  reset: () => void;
  // Streams
  addStream: (data: Omit<AdminStream, "id">) => void;
  updateStream: (id: string, patch: Partial<AdminStream>) => void;
  deleteStream: (id: string) => void;
  // Subjects
  subjectsByStream: (streamId: string) => AdminSubject[];
  getSubject: (id: string) => AdminSubject | undefined;
  getSubjectBySlug: (streamId: string, slug: string) => AdminSubject | undefined;
  addSubject: (streamId: string, name: string, description?: string) => void;
  updateSubject: (id: string, patch: Partial<Pick<AdminSubject, "name" | "description">>) => void;
  deleteSubject: (id: string) => void;
  // Subject section heading
  updateSection: (
    subjectId: string,
    section: keyof SubjectContent,
    patch: { heading?: string; description?: string },
  ) => void;
  // Papers
  addPaper: (subjectId: string, section: "pastPapers" | "modelPapers", data: Omit<AdminPaper, "id" | "sections"> & { subjectName: string }) => void;
  updatePaper: (subjectId: string, section: "pastPapers" | "modelPapers", paperId: string, patch: Partial<AdminPaper>) => void;
  deletePaper: (subjectId: string, section: "pastPapers" | "modelPapers", paperId: string) => void;
  getPaper: (subjectId: string, paperId: string) => { paper: AdminPaper; section: "pastPapers" | "modelPapers"; subject: AdminSubject } | undefined;
  findPaper: (paperId: string) => { paper: AdminPaper; subject: AdminSubject } | undefined;
  // Paper sections
  addPaperSection: (subjectId: string, paperId: string, data: Omit<PaperSection, "id" | "questions">) => void;
  updatePaperSection: (subjectId: string, paperId: string, sectionId: string, patch: Partial<Omit<PaperSection, "id" | "questions">>) => void;
  deletePaperSection: (subjectId: string, paperId: string, sectionId: string) => void;
  // Notes
  addNote: (subjectId: string, data: Omit<AdminNote, "id">) => void;
  updateNote: (subjectId: string, noteId: string, patch: Partial<AdminNote>) => void;
  deleteNote: (subjectId: string, noteId: string) => void;
  // Questions (per section)
  addQuestion: (subjectId: string, paperId: string, sectionId: string, data: Omit<AdminQuestion, "id" | "number">) => void;
  updateQuestion: (subjectId: string, paperId: string, sectionId: string, qid: string, patch: Partial<AdminQuestion>) => void;
  deleteQuestion: (subjectId: string, paperId: string, sectionId: string, qid: string) => void;
  deleteAllQuestions: (subjectId: string, paperId: string, sectionId: string) => void;
};

const AdminCtx = createContext<Ctx | null>(null);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [snap, setSnap] = useState<Snapshot>(() => buildSeed());

  useEffect(() => {
    setSnap(load());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
    } catch {}
  }, [snap]);

  const value = useMemo<Ctx>(() => {
    const update = (fn: (s: Snapshot) => Snapshot) => setSnap((s) => fn(structuredClone(s)));

    const mutSubject = (subjectId: string, fn: (sub: AdminSubject) => void) =>
      update((s) => {
        const sub = s.subjects.find((x) => x.id === subjectId);
        if (sub) fn(sub);
        return s;
      });

    const mutPaper = (
      subjectId: string,
      paperId: string,
      fn: (paper: AdminPaper) => void,
    ) =>
      mutSubject(subjectId, (sub) => {
        for (const section of ["pastPapers", "modelPapers"] as const) {
          const p = sub.content[section].items.find((x) => x.id === paperId);
          if (p) {
            fn(p);
            return;
          }
        }
      });

    const mutSection = (
      subjectId: string,
      paperId: string,
      sectionId: string,
      fn: (sec: PaperSection) => void,
    ) =>
      mutPaper(subjectId, paperId, (p) => {
        const sec = p.sections.find((x) => x.id === sectionId);
        if (sec) fn(sec);
      });

    return {
      streams: snap.streams,
      subjects: snap.subjects,
      reset: () => setSnap(buildSeed()),

      addStream: (d) =>
        update((s) => {
          s.streams.push({ id: slugify(d.name) || uid(), ...d });
          return s;
        }),
      updateStream: (id, patch) =>
        update((s) => {
          const st = s.streams.find((x) => x.id === id);
          if (st) Object.assign(st, patch);
          return s;
        }),
      deleteStream: (id) =>
        update((s) => {
          s.streams = s.streams.filter((x) => x.id !== id);
          s.subjects = s.subjects.filter((x) => x.streamId !== id);
          return s;
        }),

      subjectsByStream: (streamId) => snap.subjects.filter((x) => x.streamId === streamId),
      getSubject: (id) => snap.subjects.find((x) => x.id === id),
      getSubjectBySlug: (streamId, slug) =>
        snap.subjects.find((x) => x.streamId === streamId && subjectSlug(x.name) === slug),
      addSubject: (streamId, name, description) =>
        update((s) => {
          const id = `${streamId}__${slugify(name)}__${uid()}`;
          s.subjects.push({
            id,
            streamId,
            name,
            description,
            content: emptyContent(name),
          });
          return s;
        }),
      updateSubject: (id, patch) =>
        update((s) => {
          const sub = s.subjects.find((x) => x.id === id);
          if (sub) Object.assign(sub, patch);
          return s;
        }),
      deleteSubject: (id) =>
        update((s) => {
          s.subjects = s.subjects.filter((x) => x.id !== id);
          return s;
        }),

      updateSection: (subjectId, section, patch) =>
        mutSubject(subjectId, (sub) => {
          Object.assign(sub.content[section], patch);
        }),

      addPaper: (subjectId, section, data) =>
        mutSubject(subjectId, (sub) => {
          const { subjectName, ...rest } = data;
          sub.content[section].items.push({
            id: uid(),
            sections: blueprintForSubject(subjectName || sub.name),
            ...rest,
          });
        }),
      updatePaper: (subjectId, section, paperId, patch) =>
        mutSubject(subjectId, (sub) => {
          const p = sub.content[section].items.find((x) => x.id === paperId);
          if (p) Object.assign(p, patch);
        }),
      deletePaper: (subjectId, section, paperId) =>
        mutSubject(subjectId, (sub) => {
          sub.content[section].items = sub.content[section].items.filter((x) => x.id !== paperId);
        }),
      getPaper: (subjectId, paperId) => {
        const sub = snap.subjects.find((x) => x.id === subjectId);
        if (!sub) return undefined;
        for (const section of ["pastPapers", "modelPapers"] as const) {
          const p = sub.content[section].items.find((x) => x.id === paperId);
          if (p) return { paper: p, section, subject: sub };
        }
        return undefined;
      },
      findPaper: (paperId) => {
        for (const sub of snap.subjects) {
          for (const section of ["pastPapers", "modelPapers"] as const) {
            const p = sub.content[section].items.find((x) => x.id === paperId);
            if (p) return { paper: p, subject: sub };
          }
        }
        return undefined;
      },

      addPaperSection: (subjectId, paperId, data) =>
        mutPaper(subjectId, paperId, (p) => {
          p.sections.push({ id: uid(), questions: [], ...data });
        }),
      updatePaperSection: (subjectId, paperId, sectionId, patch) =>
        mutPaper(subjectId, paperId, (p) => {
          const sec = p.sections.find((x) => x.id === sectionId);
          if (sec) Object.assign(sec, patch);
        }),
      deletePaperSection: (subjectId, paperId, sectionId) =>
        mutPaper(subjectId, paperId, (p) => {
          p.sections = p.sections.filter((x) => x.id !== sectionId);
        }),

      addNote: (subjectId, data) =>
        mutSubject(subjectId, (sub) => {
          sub.content.notes.items.push({ id: uid(), ...data });
        }),
      updateNote: (subjectId, noteId, patch) =>
        mutSubject(subjectId, (sub) => {
          const n = sub.content.notes.items.find((x) => x.id === noteId);
          if (n) Object.assign(n, patch);
        }),
      deleteNote: (subjectId, noteId) =>
        mutSubject(subjectId, (sub) => {
          sub.content.notes.items = sub.content.notes.items.filter((x) => x.id !== noteId);
        }),

      addQuestion: (subjectId, paperId, sectionId, data) =>
        mutSection(subjectId, paperId, sectionId, (sec) => {
          const number = sec.questions.length
            ? Math.max(...sec.questions.map((q) => q.number)) + 1
            : 1;
          sec.questions.push({ id: uid(), number, ...data });
        }),
      updateQuestion: (subjectId, paperId, sectionId, qid, patch) =>
        mutSection(subjectId, paperId, sectionId, (sec) => {
          const q = sec.questions.find((x) => x.id === qid);
          if (q) Object.assign(q, patch);
        }),
      deleteQuestion: (subjectId, paperId, sectionId, qid) =>
        mutSection(subjectId, paperId, sectionId, (sec) => {
          sec.questions = sec.questions.filter((x) => x.id !== qid);
        }),
      deleteAllQuestions: (subjectId, paperId, sectionId) =>
        mutSection(subjectId, paperId, sectionId, (sec) => {
          sec.questions = [];
        }),
    };
  }, [snap]);

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}

export function useAdminStore() {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error("useAdminStore must be used inside AdminStoreProvider");
  return ctx;
}

// Mock student data for the Students section
export type MockStudent = {
  id: string;
  name: string;
  stream: string;
  email: string;
  bookmarks: { paper: string; question: string; topic: string; savedAt: string }[];
  aiHistory: { question: string; answer: string; time: string }[];
};

export const mockStudents: MockStudent[] = [
  {
    id: "stu-128",
    name: "Tharindu Perera",
    stream: "Physical Science",
    email: "tharindu@example.lk",
    bookmarks: [
      { paper: "Physics 2023 MCQ", question: "Q1 · Projectile motion", topic: "Mechanics", savedAt: "2 days ago" },
      { paper: "Chemistry 2022 MCQ", question: "Q3 · Ionic bonds", topic: "Bonding", savedAt: "5 days ago" },
    ],
    aiHistory: [
      { question: "How do I solve projectile motion?", answer: "Split into x and y components, then apply kinematic equations…", time: "2m ago" },
      { question: "What's the formula for kinetic energy?", answer: "KE = ½mv² where m is mass and v is velocity.", time: "1h ago" },
    ],
  },
  {
    id: "stu-93",
    name: "Nimesha Fernando",
    stream: "Bio Science",
    email: "nimesha@example.lk",
    bookmarks: [
      { paper: "Biology 2021 MCQ", question: "Q2 · Photosynthesis", topic: "Plant biology", savedAt: "1 day ago" },
    ],
    aiHistory: [
      { question: "Explain ionic vs covalent bonds", answer: "Ionic bonds form by electron transfer, covalent by sharing…", time: "12m ago" },
    ],
  },
  {
    id: "stu-41",
    name: "Asela Jayasinghe",
    stream: "Physical Science",
    email: "asela@example.lk",
    bookmarks: [],
    aiHistory: [
      { question: "Difference between scalar and vector?", answer: "Scalars have magnitude only; vectors have magnitude and direction.", time: "3h ago" },
    ],
  },
];
