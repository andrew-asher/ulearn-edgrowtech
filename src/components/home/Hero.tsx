import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, BookOpen, Bot, Bookmark, Lightbulb, GraduationCap, Rocket } from "lucide-react";

type Slide = {
  badge: string;
  title: React.ReactNode;
  description: string;
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
  highlights: { icon: React.ReactNode; title: string; sub: string }[];
};

const slides: Slide[] = [
  {
    badge: "Phase 1 · Live for A/L students",
    title: (
      <>
        Interactive past paper learning <span className="text-gradient">for Sri Lankan students.</span>
      </>
    ),
    description:
      "A digital education platform built for the new AI era — helping students study smarter through interactive past papers, explanations, bookmarks and AI-powered learning support.",
    primary: { label: "Start Studying", to: "/study" },
    secondary: { label: "Explore Platform", to: "/about" },
    highlights: [
      { icon: <BookOpen className="h-5 w-5" />, title: "Interactive Past Papers", sub: "Practice, don't just read" },
      { icon: <Bot className="h-5 w-5" />, title: "AI Tutor Help", sub: "Ask any question, anytime" },
      { icon: <Lightbulb className="h-5 w-5" />, title: "Explanations", sub: "Understand every answer" },
      { icon: <Bookmark className="h-5 w-5" />, title: "Bookmarks & Saved", sub: "Build your revision set" },
    ],
  },
  {
    badge: "Vision · Built for the future of learning",
    title: (
      <>
        A digital education platform for the <span className="text-gradient">new AI era.</span>
      </>
    ),
    description:
      "EdGrow is building a future-ready learning ecosystem — focused on explainability, personalised growth and AI-native tools that help every Sri Lankan student understand, not just memorise.",
    primary: { label: "See the Vision", to: "/about" },
    secondary: { label: "Try the Platform", to: "/study" },
    highlights: [
      { icon: <Sparkles className="h-5 w-5" />, title: "AI-Native Learning", sub: "Personal explanations" },
      { icon: <GraduationCap className="h-5 w-5" />, title: "Growth Focused", sub: "Track your progress" },
      { icon: <Rocket className="h-5 w-5" />, title: "Future Generation", sub: "Built for tomorrow" },
      { icon: <Lightbulb className="h-5 w-5" />, title: "Explainability First", sub: "Understand the why" },
    ],
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];

  return (
    <section className="relative overflow-hidden">
      <div className="eg-watermark" aria-hidden />
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div key={i} className="animate-fade-up">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 border border-border/60 bg-background/70 backdrop-blur">
            <span className="mr-2 h-2 w-2 rounded-full bg-mint animate-pulse-ring inline-block" />
            {s.badge}
          </Badge>

          <h1 className="mt-6 font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.05]">
            U-Learn by EdGrow
          </h1>
          <p className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold max-w-4xl leading-tight">
            {s.title}
          </p>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl">
            {s.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full shadow-soft group">
              <Link to={s.primary.to}>
                {s.primary.label}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to={s.secondary.to}>{s.secondary.label}</Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.highlights.map((h, idx) => (
              <div
                key={h.title}
                className="group relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-soft animate-fade-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-mint/25 text-primary">
                  {h.icon}
                </div>
                <div className="mt-3 font-display font-semibold">{h.title}</div>
                <div className="text-xs text-muted-foreground">{h.sub}</div>
                <div className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Show slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-10 bg-primary" : "w-4 bg-border hover:bg-muted-foreground/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
