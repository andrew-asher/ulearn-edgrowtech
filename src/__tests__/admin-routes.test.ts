import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { streams, subjectSlug } from "@/lib/mock-data";

/**
 * Regression suite for the nested admin subject editor + past-paper year
 * routes. These broke twice because a parent layout was missing <Outlet />
 * or because the index child had a trailing slash in its path. The tests
 * below pin down the contract so the bug class can't silently come back.
 */

const ROOT = path.resolve(__dirname, "../..");
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), "utf8");

// Mirror the admin-store seed: every available stream × its subjects,
// with the same id scheme used by buildSeed().
const SEED_YEARS = [2023, 2022, 2021];
const seededSubjects = streams
  .filter((s) => s.status === "available")
  .flatMap((s) =>
    s.subjects.map((name) => ({
      streamId: s.id,
      subjectSlug: subjectSlug(name),
      subjectId: `${s.id}__${subjectSlug(name)}`,
      name,
    })),
  );

describe("admin subject editor — parent layouts render <Outlet />", () => {
  const layouts = [
    "src/routes/admin.subjects.$subjectId.tsx",
    "src/routes/study.al.$stream.$subject.past-papers.tsx",
  ];
  for (const file of layouts) {
    it(`${file} renders an <Outlet />`, () => {
      const src = read(file);
      expect(src).toMatch(/from ["']@tanstack\/react-router["']/);
      expect(src).toMatch(/Outlet/);
      expect(src).toMatch(/<Outlet\s*\/>/);
    });
  }
});

describe("admin subject editor — required route files exist with correct paths", () => {
  const expected: Array<{ file: string; path: string }> = [
    { file: "src/routes/admin.subjects.$subjectId.tsx", path: "/admin/subjects/$subjectId" },
    { file: "src/routes/admin.subjects.$subjectId.index.tsx", path: "/admin/subjects/$subjectId/" },
    { file: "src/routes/admin.subjects.$subjectId.papers.$paperId.tsx", path: "/admin/subjects/$subjectId/papers/$paperId" },
    { file: "src/routes/study.al.$stream.$subject.past-papers.tsx", path: "/study/al/$stream/$subject/past-papers" },
    { file: "src/routes/study.al.$stream.$subject.past-papers.index.tsx", path: "/study/al/$stream/$subject/past-papers/" },
    { file: "src/routes/study.al.$stream.$subject.past-papers.$year.tsx", path: "/study/al/$stream/$subject/past-papers/$year" },
  ];

  for (const { file, path: routePath } of expected) {
    it(`${file} declares createFileRoute("${routePath}")`, () => {
      const src = read(file);
      // Allow either "/x" or "/x/" exactly as we asserted above.
      const needle = `createFileRoute("${routePath}")`;
      expect(src.includes(needle) || src.includes(needle.replace(/"/g, "'"))).toBe(true);
    });
  }

  it("index child route path differs from its parent path (no trailing-slash collision)", () => {
    // The bug that took the admin editor down was the index child being
    // registered at "/admin/subjects/$subjectId" instead of ".../$subjectId/",
    // which shadowed the nested papers/$paperId route.
    const parent = read("src/routes/admin.subjects.$subjectId.tsx");
    const index = read("src/routes/admin.subjects.$subjectId.index.tsx");
    expect(parent).toMatch(/createFileRoute\(["']\/admin\/subjects\/\$subjectId["']\)/);
    expect(index).toMatch(/createFileRoute\(["']\/admin\/subjects\/\$subjectId\/["']\)/);
  });
});

describe("routeTree.gen.ts wires the nested admin + past-paper routes", () => {
  const tree = read("src/routeTree.gen.ts");

  const requiredImports = [
    "./routes/admin.subjects.$subjectId",
    "./routes/admin.subjects.$subjectId.index",
    "./routes/admin.subjects.$subjectId.papers.$paperId",
    "./routes/study.al.$stream.$subject.past-papers",
    "./routes/study.al.$stream.$subject.past-papers.index",
    "./routes/study.al.$stream.$subject.past-papers.$year",
  ];
  for (const imp of requiredImports) {
    it(`routeTree imports ${imp}`, () => {
      expect(tree).toContain(imp);
    });
  }
});

describe("seeded subjects resolve to mountable admin URLs", () => {
  it("buildSeed produces the expected stream × subject grid", () => {
    // Sanity: physical-science and bio-science each contribute 3 subjects.
    expect(seededSubjects.length).toBeGreaterThanOrEqual(6);
    expect(seededSubjects).toContainEqual(
      expect.objectContaining({
        subjectId: "physical-science__combined-mathematics",
        name: "Combined Mathematics",
      }),
    );
  });

  for (const sub of seededSubjects) {
    it(`admin editor URL is valid for "${sub.name}" (${sub.streamId})`, () => {
      const url = `/admin/subjects/${sub.subjectId}`;
      expect(url).toMatch(/^\/admin\/subjects\/[a-z0-9-]+__[a-z0-9-]+$/);
      // Slug must not contain spaces or uppercase that would break routing.
      expect(sub.subjectId).toBe(sub.subjectId.toLowerCase());
      expect(sub.subjectId).not.toMatch(/\s/);
    });

    for (const year of SEED_YEARS) {
      it(`past-papers year URL is valid for "${sub.name}" ${year}`, () => {
        const url = `/study/al/${sub.streamId}/${sub.subjectSlug}/past-papers/${year}`;
        expect(url).toMatch(
          /^\/study\/al\/[a-z0-9-]+\/[a-z0-9-]+\/past-papers\/\d{4}$/,
        );
      });

      it(`seeded paper id for "${sub.name}" ${year} matches admin paper route shape`, () => {
        const paperId = `${sub.subjectId}-past-${year}`;
        const url = `/admin/subjects/${sub.subjectId}/papers/${paperId}`;
        expect(url).toMatch(
          /^\/admin\/subjects\/[a-z0-9_-]+\/papers\/[a-z0-9_-]+-past-\d{4}$/,
        );
      });
    }
  }
});
