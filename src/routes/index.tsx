import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ContactSection />
    </>
  );
}
