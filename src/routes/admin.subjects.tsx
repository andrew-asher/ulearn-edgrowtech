import { createFileRoute } from "@tanstack/react-router";
import { streams } from "@/lib/mock-data";
import { SimpleList } from "./admin.streams";

export const Route = createFileRoute("/admin/subjects")({ component: () => {
  const rows = streams.filter((s) => s.status === "available").flatMap((s) =>
    s.subjects.map((sub) => ({ name: sub, meta: s.name }))
  );
  return <SimpleList title="Subjects" rows={rows} />;
}});
