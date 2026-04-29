import { Clock, ArrowRight, LogIn, LogOut, Phone, FileText, UserPlus } from "lucide-react";

const activities = [
  { user: "AIT USER REP", action: "logged in", channel: "web", time: "21 seconds ago", icon: LogIn, color: "gradient-success" },
  { user: "Jane Doe", action: "logged a call with Mesa Loca", channel: "mobile", time: "12 minutes ago", icon: Phone, color: "gradient-info" },
  { user: "AIT USER REP", action: "logged in", channel: "web", time: "43 minutes ago", icon: LogIn, color: "gradient-success" },
  { user: "Mark R.", action: "added a new contact", channel: "web", time: "2 hours ago", icon: UserPlus, color: "gradient-primary" },
  { user: "AIT USER REP", action: "logged in", channel: "web", time: "3 hours ago", icon: LogIn, color: "gradient-success" },
  { user: "Sara K.", action: "created note for 462 Pontotoc", channel: "mobile", time: "5 hours ago", icon: FileText, color: "gradient-accent" },
  { user: "AIT USER REP", action: "logged out", channel: "web", time: "3 days ago", icon: LogOut, color: "gradient-warm" },
];

export const RecentActivity = () => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-soft animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-info flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold">Recent Activity</h2>
        </div>
        <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4">
          {activities.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="relative flex items-start gap-4">
                <div className={`relative z-10 w-9 h-9 rounded-xl ${a.color} flex items-center justify-center text-white shrink-0 shadow-soft`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">{a.user}</span>{" "}
                    <span className="text-foreground/80">{a.action}</span>{" "}
                    <span className="px-1.5 py-0.5 rounded-md bg-secondary text-[10px] font-semibold uppercase text-muted-foreground">{a.channel}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
