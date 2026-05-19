import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/home/AboutSection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · U-Learn by EdGrow" },
      { name: "description", content: "EdGrow Tech is building a future-ready education ecosystem for Sri Lankan students." },
    ],
  }),
  component: () => (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-16">
        <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">About</div>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl">
          We're building the <span className="text-gradient">future of learning</span> in Sri Lanka.
        </h1>
      </div>
      <AboutSection />
    </div>
  ),
});
