import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/subjects/$subjectId")({
  component: () => <Outlet />,
});