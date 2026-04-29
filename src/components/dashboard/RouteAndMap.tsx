import { MapPin, Navigation, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Today's Route — same outer pattern as Team Performance / Today's Schedule for equal card heights. */
export const TodaysRouteCard = () => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 animate-slide-up">
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-success">
            <MapPin className="h-3.5 w-3.5 text-white" />
          </div>
          <h3 className="font-bold">Today's Route</h3>
        </div>
        <button type="button" className="text-xs font-medium text-primary hover:underline">
          Open Map →
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="shrink-0 rounded-xl border border-primary/10 bg-gradient-soft p-4">
          <p className="mb-1 text-sm font-semibold">Plan your field route</p>
          <p className="mb-4 text-xs text-muted-foreground">Optimise stops based on today's contacts</p>
          <Button size="sm" className="w-full gap-2 rounded-full border-0 gradient-primary text-primary-foreground hover:opacity-90">
            <Navigation className="h-3.5 w-3.5" /> Plan Route
          </Button>
        </div>
        <div className="min-h-2 flex-1" aria-hidden />
        <div className="mt-auto grid shrink-0 grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-secondary p-2">
            <p className="text-lg font-bold">8</p>
            <p className="text-[10px] font-medium uppercase text-muted-foreground">Stops</p>
          </div>
          <div className="rounded-lg bg-secondary p-2">
            <p className="text-lg font-bold">42mi</p>
            <p className="text-[10px] font-medium uppercase text-muted-foreground">Distance</p>
          </div>
          <div className="rounded-lg bg-secondary p-2">
            <p className="text-lg font-bold">3.5h</p>
            <p className="text-[10px] font-medium uppercase text-muted-foreground">Drive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Field Map panel — full-width when used alone; spans 2 cols when nested in `RouteAndMap`. */
export const FieldMapCard = () => {
  return (
    <div className="min-w-0 bg-card border border-border rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-info flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold">Field Map</h3>
        </div>
        <span className="text-xs text-muted-foreground">Team locations · Live</span>
      </div>

      <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-br from-[hsl(210_50%_92%)] via-[hsl(160_40%_92%)] to-[hsl(262_50%_94%)] border border-border">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Roads */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 256">
          <path d="M 0 100 Q 100 60 200 120 T 400 110" stroke="hsl(var(--muted-foreground))" strokeWidth="3" fill="none" opacity="0.4" />
          <path d="M 50 0 Q 80 100 150 200 T 280 256" stroke="hsl(var(--muted-foreground))" strokeWidth="3" fill="none" opacity="0.4" />
        </svg>
        {/* Pins */}
        {[
          { top: "20%", left: "18%", grad: "gradient-primary", label: "AT" },
          { top: "55%", left: "45%", grad: "gradient-accent", label: "JD" },
          { top: "35%", left: "72%", grad: "gradient-success", label: "MR" },
          { top: "70%", left: "82%", grad: "gradient-info", label: "SK" },
        ].map((p, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.top, left: p.left }}>
            <div className={`w-9 h-9 rounded-full ${p.grad} text-white text-xs font-bold flex items-center justify-center shadow-elevated animate-pulse-glow border-2 border-white`}>
              {p.label}
            </div>
          </div>
        ))}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur text-xs font-medium border border-border">
          4 reps active
        </div>
      </div>
    </div>
  );
};

/** Original combined layout: Today's Route (1 col) + Field Map (2 cols). */
export const RouteAndMap = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-slide-up">
      <TodaysRouteCard />
      <div className="lg:col-span-2 min-w-0">
        <FieldMapCard />
      </div>
    </div>
  );
};
