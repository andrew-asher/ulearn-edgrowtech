import { GraduationCap, BookOpenCheck, Sparkles } from "lucide-react";

export function AboutSection() {
  const cards = [
    { icon: <GraduationCap className="h-6 w-6" />, title: "Learn interactively", text: "Solve questions on screen instead of staring at static PDFs. Get instant feedback as you practice." },
    { icon: <BookOpenCheck className="h-6 w-6" />, title: "Practice with past papers", text: "Real exam questions, organised by year, medium and paper type — exactly how you'll see them." },
    { icon: <Sparkles className="h-6 w-6" />, title: "Grow with AI support", text: "Stuck on a question? Ask the AI tutor for a clear, step-by-step explanation built for your level." },
  ];
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="eg-watermark opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">About EdGrow</div>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Digital education for the <span className="text-gradient">new AI era.</span>
          </h2>
          <p className="mt-5 text-muted-foreground text-base sm:text-lg">
            EdGrow is building a future-ready education ecosystem for Sri Lankan students. U-Learn is our initial learning product, starting with A/L science streams and designed to expand into more tools, resources, and AI-powered learning products in the future.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => (
            <div key={c.title}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-soft animate-fade-up"
              style={{ animationDelay: `${i * 90}ms` }}>
              <div className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                {c.icon}
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
