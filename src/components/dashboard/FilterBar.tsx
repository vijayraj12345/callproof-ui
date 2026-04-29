import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const FilterBar = () => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-soft animate-slide-up">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Filter className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Dashboard Filter</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1">
          <Input type="date" defaultValue="2026-04-01" className="w-auto rounded-xl text-sm" />
          <span className="text-muted-foreground">→</span>
          <Input type="date" defaultValue="2026-04-28" className="w-auto rounded-xl text-sm" />
          <label className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-border cursor-pointer hover:bg-secondary transition-smooth">
            <input type="checkbox" className="accent-primary" />
            Inactive
          </label>
          <button className="flex items-center gap-2 text-sm px-3.5 py-2 rounded-xl border border-border hover:bg-secondary transition-smooth">
            Select Rep <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 text-sm px-3.5 py-2 rounded-xl border border-border hover:bg-secondary transition-smooth">
            Select Market <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <Button className="gradient-primary text-primary-foreground hover:opacity-90 rounded-xl border-0 shadow-glow">Update</Button>
          <Button variant="outline" className="rounded-xl">Clear</Button>
        </div>
      </div>
    </div>
  );
};
