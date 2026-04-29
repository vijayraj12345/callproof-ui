import { MapPin, PhoneCall, CalendarCheck, CheckSquare, TrendingUp, TrendingDown } from "lucide-react";

const metrics = [
  { label: "Touches", value: "245", sub: "This period", icon: MapPin, gradient: "gradient-info", trend: "+12%", up: true },
  { label: "Outbound Calls", value: "0", sub: "Voice not connected", icon: PhoneCall, gradient: "gradient-primary", trend: "—", up: true },
  { label: "Meetings Set", value: "0", sub: "This period", icon: CalendarCheck, gradient: "gradient-success", trend: "—", up: false },
  { label: "Tasks", value: "1", sub: "This period", icon: CheckSquare, gradient: "gradient-accent", trend: "+1", up: true },
];

export const MetricsGrid = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-6 rounded-full gradient-primary" />
        <h2 className="text-lg font-bold">Daily Performance Metrics</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          const TrendIcon = m.up ? TrendingUp : TrendingDown;
          return (
            <div
              key={m.label}
              className={`relative overflow-hidden rounded-2xl ${m.gradient} p-5 text-white shadow-soft hover:shadow-elevated transition-smooth hover:-translate-y-1 animate-slide-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold">
                  <TrendIcon className="w-3 h-3" />
                  {m.trend}
                </div>
              </div>
              <div className="relative">
                <p className="text-sm opacity-90 mb-1">{m.label}</p>
                <p className="text-4xl font-bold tracking-tight mb-1">{m.value}</p>
                <p className="text-xs opacity-80">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
