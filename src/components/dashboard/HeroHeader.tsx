import { Phone, MapPin, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroHeader = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <header className="relative overflow-hidden rounded-3xl border border-primary/15 p-6 shadow-soft animate-slide-up md:p-8">
      {/* Base wash + diagonal brand gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.14] via-violet-500/[0.08] to-accent/[0.16]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent dark:via-white/[0.06]"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary/35 to-transparent blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-28 -left-12 h-72 w-72 rounded-full bg-gradient-to-tr from-accent/30 to-transparent blur-3xl" aria-hidden />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-primary shadow-glow md:h-16 md:w-16">
            <Phone className="h-7 w-7 text-primary-foreground md:h-8 md:w-8" />
          </div>
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gradient-primary md:text-3xl">CallProof</h1>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary dark:bg-primary/30 dark:text-primary-foreground">
                Pro
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-foreground/85">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
              AI-Powered Field Sales CRM
            </p>
            <p className="mt-3 text-base text-foreground/90">
              Good evening, <span className="font-semibold text-primary">AIT</span> 👋
            </p>
            <p className="text-sm text-foreground/70">Finishing strong today?</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3.5 py-2 shadow-sm backdrop-blur-sm">
            <Calendar className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-sm font-medium text-foreground">{today}</span>
          </div>
          <Button className="gap-2 rounded-full border-0 bg-gradient-to-r from-accent to-[hsl(340_85%_55%)] text-accent-foreground shadow-accent-glow hover:opacity-95">
            <MapPin className="h-4 w-4" />
            Log Visit
          </Button>
        </div>
      </div>
    </header>
  );
};
