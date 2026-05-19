import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const WA_LINK = "https://wa.me/447553977830?text=Hi%20EdGrow%20Tech,%20I%20would%20like%20to%20know%20more%20about%20U-Learn%20by%20EdGrow";

export function ContactSection() {
  return (
    <section id="contact" className="relative py-24">
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-mint/15 p-10 sm:p-14 shadow-soft">
          <div className="eg-watermark opacity-80" aria-hidden />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Contact</div>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl">
              Need help or want to <span className="text-gradient">collaborate?</span>
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground text-base sm:text-lg">
              Connect with EdGrow Tech for education partnerships, support, or platform inquiries.
            </p>
            <div className="mt-7">
              <Button asChild size="lg" className="rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white shadow-soft">
                <a href={WA_LINK} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
