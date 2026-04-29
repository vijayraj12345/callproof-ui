import { BarChart3 } from "lucide-react";

export const TeamPerformance = () => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 animate-slide-up">
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-success">
          <BarChart3 className="h-3.5 w-3.5 text-white" />
        </div>
        <h3 className="font-bold">Team Performance</h3>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="mb-4 flex shrink-0 items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full gradient-info flex items-center justify-center text-white font-bold text-sm">A1</div>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-card" />
          </div>
          <div>
            <p className="font-semibold text-sm">A1sales test</p>
            <p className="text-xs text-muted-foreground">Top performer</p>
          </div>
        </div>

        <div className="min-h-0 shrink-0 space-y-3">
          <div>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-muted-foreground">Sales</span>
              <span className="font-bold">4.00</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full gradient-primary" style={{ width: "80%" }} />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-muted-foreground">Leads</span>
              <span className="font-bold">1</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full gradient-accent" style={{ width: "20%" }} />
            </div>
          </div>
        </div>

        <div className="min-h-2 flex-1" aria-hidden />

        <div className="mt-auto shrink-0 border-t border-border pt-4">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Overall Business Results</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Sales</span>
              <span className="font-bold text-gradient-primary">$4.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Leads</span>
              <span className="font-bold">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
