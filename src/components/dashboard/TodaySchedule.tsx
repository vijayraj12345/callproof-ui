import { Calendar, Plus, Clock } from "lucide-react";

const events = [
  { time: "10:30 AM", title: "Call with Acme Corp", type: "call", color: "gradient-info" },
  { time: "1:00 PM", title: "Demo · Mesa Loca", type: "meeting", color: "gradient-primary" },
  { time: "3:30 PM", title: "Site visit · Pontotoc", type: "visit", color: "gradient-accent" },
];

export const TodaySchedule = () => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 animate-slide-up">
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
            <Calendar className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <h3 className="font-bold">Today's Schedule</h3>
        </div>
        <button type="button" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          <Plus className="h-3 w-3" /> Team
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex min-h-0 flex-1 flex-col space-y-3">
          {events.map((e, i) => (
            <div
              key={i}
              className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-smooth hover:bg-secondary"
            >
              <div className={`h-12 w-1 rounded-full ${e.color}`} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {e.time}
                </p>
                <p className="truncate text-sm font-semibold">{e.title}</p>
              </div>
            </div>
          ))}
          <div className="min-h-0 flex-1" aria-hidden />
        </div>
      </div>
    </div>
  );
};
