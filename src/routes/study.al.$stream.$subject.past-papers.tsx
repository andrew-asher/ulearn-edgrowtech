import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/study/al/$stream/$subject/past-papers")({
  component: () => <Outlet />,
});
