import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/home/ContactSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · U-Learn by EdGrow" },
      { name: "description", content: "Get in touch with EdGrow Tech via WhatsApp." },
    ],
  }),
  component: () => (
    <div className="pt-12">
      <ContactSection />
    </div>
  ),
});
