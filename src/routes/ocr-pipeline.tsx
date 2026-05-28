import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/ocr-pipeline")({
  component: () => <Outlet />,
});