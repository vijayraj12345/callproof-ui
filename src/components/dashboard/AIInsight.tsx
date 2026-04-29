import { Sparkles, ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AIInsight = () => {
  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-accent-foreground" />
        </div>
        <h3 className="font-bold">AI Insight</h3>
      </div>

      <div className="relative overflow-hidden rounded-2xl p-5 bg-card border border-border shadow-soft">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full gradient-primary opacity-10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">AI Coach Tip</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed mb-4">
            <span className="font-semibold">callproof new</span> is at risk — reach out now. Don't let this opportunity go cold.
          </p>
          <Button size="sm" variant="outline" className="rounded-full gap-1.5 w-full">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
