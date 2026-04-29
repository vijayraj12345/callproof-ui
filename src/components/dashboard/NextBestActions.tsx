import { AlertTriangle, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { name: "callproof new", overdue: "108d", impact: "High Impact" },
  { name: "16 LOTS BREWING COMPANY", overdue: "91d", impact: "High Impact" },
  { name: "2645 ERIE LLC DBA MESA LOCA ALT", overdue: "90d", impact: "High Impact" },
  { name: "462 Pontotoc", overdue: "90d", impact: "High Impact" },
  { name: "4 BRIGHT MANAGEMENT LLC DBA MCDONALDS", overdue: "90d", impact: "High Impact" },
];

export const NextBestActions = () => {
  return (
    <div className="kpi-card rounded-2xl p-5 shadow-soft md:p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Activity className="w-4 h-4 text-accent-foreground" />
          </div>
          <h2 className="text-lg font-bold">Next Best Actions</h2>
        </div>
        <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {actions.map((a, i) => (
          <div
            key={i}
            className="group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-smooth"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold text-sm truncate">At risk: {a.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success">{a.impact}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Follow-up <span className="font-semibold text-destructive">{a.overdue} overdue</span> — act before this goes cold.
              </p>
            </div>
            <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90 rounded-full border-0 shadow-glow gap-1.5 shrink-0">
              Take Action <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
