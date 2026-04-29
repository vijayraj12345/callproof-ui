import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  Check,
  Clock,
  List,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AiCopilotFloating } from "@/components/dashboard/AiCopilotFloating";
import {
  v7Appointments,
  v7Comms,
  v7Deals,
  v7FeedItems,
  v7Rep,
  v7Team,
  type V7Appointment,
  type V7Comm,
  type V7FeedItem,
} from "@/data/dashboardV7SampleData";

type ViewMode = "rep" | "mgr";

const pageWrap = "flex flex-col gap-4 px-5 pb-16 pt-6 sm:px-6";
const h1 = "text-[23px] font-extrabold tracking-[-0.04em] text-[#111827]";
const hsub = "mt-0.5 text-[13px] text-[#6b7280]";
const sec = "overflow-hidden rounded-xl border border-[#e5e7eb] bg-white";
const secHead = "flex items-center justify-between px-4 pb-2 pt-3.5";
const secTitle = "flex items-center gap-1.5 text-[13px] font-bold text-[#111827]";
const secTitleIcon = "size-[15px] shrink-0 text-[#7c3aed]";
const secLink =
  "cursor-pointer border-0 bg-transparent text-[12px] font-semibold text-[#7c3aed] hover:underline";

function aptTypeMeta(type: V7Appointment["type"]) {
  if (type === "meeting") return { Icon: Users, bg: "#f5f3ff", color: "#7c3aed" };
  if (type === "demo") return { Icon: Video, bg: "#fef2f2", color: "#ef4444" };
  return { Icon: Phone, bg: "#f0fdf4", color: "#16a34a" };
}

function commIcon(ch: V7Comm["channel"]) {
  const map = {
    email: { Icon: Mail, bg: "#eff6ff", color: "#2563eb" },
    sms: { Icon: MessageSquare, bg: "#f0fdf4", color: "#16a34a" },
    call: { Icon: Phone, bg: "#fef2f2", color: "#ef4444" },
    visit: { Icon: MapPin, bg: "#fff7ed", color: "#f97316" },
  };
  return map[ch];
}

function feedIcon(name: V7FeedItem["icon"]) {
  const p = "size-[13px]";
  switch (name) {
    case "phone":
      return <Phone className={p} />;
    case "cal":
      return <Calendar className={p} />;
    case "send":
      return <Send className={p} />;
    case "pin":
      return <MapPin className={p} />;
    case "list":
      return <List className={p} />;
    case "refresh":
      return <RefreshCw className={p} />;
    default:
      return null;
  }
}

function AppointmentCard({ a }: { a: V7Appointment }) {
  const t = aptTypeMeta(a.type);
  const TIcon = t.Icon;
  const historyBanner = a.history ? (
    <div className="ml-[43px] mt-1.5 flex items-start gap-1.5 rounded-md border border-[#fde68a] bg-[#fffbeb] px-2.5 py-2 text-[12px] text-[#92400e]">
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
      <div>
        <strong className="text-[#78350f]">Open loop:</strong> {a.history.openLoop}
      </div>
    </div>
  ) : null;

  return (
    <button
      type="button"
      className="w-full cursor-pointer border-0 border-t border-[#f3f4f6] bg-white p-0 text-left transition-colors hover:bg-[#fafafa]"
      onClick={() => toast.message(`Opening ${a.company}`)}
    >
      <div className="flex items-start gap-2.5 px-4 pb-2 pt-3">
        <span className="min-w-[44px] pt-0.5 font-mono text-[11px] font-medium text-[#6b7280]">{a.time}</span>
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: t.bg, color: t.color }}
        >
          <TIcon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-bold text-[#111827]">
            {a.contact} — {a.company}{" "}
            <span
              className="align-middle text-[9px] font-bold"
              style={{ color: a.badge.color, background: a.badge.bg, padding: "2px 7px", borderRadius: 20 }}
            >
              {a.badge.text}
            </span>
          </div>
          <div className="mt-0.5 text-[12px] text-[#6b7280]">
            {a.label} · {a.channel === "zoom" ? "Zoom" : a.channel === "onsite" ? "On-site" : "Phone"} · {a.duration}
            {a.history ? (
              <>
                {" "}
                · <span className="font-semibold text-[#7c3aed]">{a.history.visits} previous visits</span>
              </>
            ) : (
              <>
                {" "}
                · <span className="font-semibold text-amber-600">First meeting</span>
              </>
            )}
          </div>
        </div>
      </div>
      {historyBanner}
      <div className="mb-3 ml-[43px] mr-4 mt-2 rounded-lg border border-[rgba(124,58,237,0.1)] bg-gradient-to-r from-[rgba(124,58,237,0.05)] to-[rgba(249,115,22,0.02)] px-3 py-2.5">
        <div className="mb-1 flex items-center gap-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#7c3aed]">
          <Sparkles className="size-3 shrink-0" />
          AI Prep Brief
        </div>
        <p className="mb-1.5 text-[12.5px] font-semibold text-[#111827]">{a.brief.headline}</p>
        <div className="flex flex-col gap-1">
          {a.brief.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[12px] text-[#374151]">
              <span className="mt-1.5 size-1 shrink-0 rounded-full" style={{ background: tip.dot }} />
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ml-[43px] flex flex-wrap gap-1.5 pb-3">
        {a.history ? (
          <Button type="button" variant="outline" size="sm" className="h-[26px] gap-1 border-[1.5px] px-2.5 text-[11.5px]" onClick={(e) => { e.stopPropagation(); toast.message("Notes"); }}>
            View Notes
          </Button>
        ) : null}
        {a.type === "demo" ? (
          <Button type="button" variant="outline" size="sm" className="h-[26px] gap-1 border-[1.5px] px-2.5 text-[11.5px]" onClick={(e) => { e.stopPropagation(); toast.message("Demo deck"); }}>
            <BarChart3 className="size-3" />
            Demo Deck
          </Button>
        ) : null}
        <Button type="button" variant="outline" size="sm" className="h-[26px] gap-1 border-[1.5px] px-2.5 text-[11.5px]" onClick={(e) => { e.stopPropagation(); toast.message("Contact"); }}>
          <Users className="size-3" />
          Contact
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-[26px] gap-1 border-0 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] px-2.5 text-[11.5px] font-bold text-white shadow-md"
          onClick={(e) => { e.stopPropagation(); toast.success("AI Prep"); }}
        >
          <Sparkles className="size-3" />
          AI Prep
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-[26px] gap-1 border-[1.5px] px-2.5 text-[11.5px]" onClick={(e) => { e.stopPropagation(); toast.message(a.badge.text); }}>
          <Check className="size-3" />
          {a.badge.text === "Unconfirmed" ? "Confirm Now" : "Ready"}
        </Button>
      </div>
    </button>
  );
}

function FeedRow({ item, done, onAction }: { item: V7FeedItem; done: boolean; onAction: () => void }) {
  const borderLeft =
    item.urg === "urg"
      ? "before:bg-[#ef4444]"
      : item.urg === "wrn"
        ? "before:bg-[#d97706]"
        : item.urg === "gd"
          ? "before:bg-[#16a34a]"
          : "before:bg-[#7c3aed]";
  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-start gap-2.5 border-t border-[#f3f4f6] px-4 py-3 transition-colors hover:bg-[#fafafa] before:absolute before:inset-y-0 before:left-0 before:w-[3px]",
        borderLeft,
        done && "pointer-events-none opacity-35",
      )}
      onClick={() => toast.message(item.name)}
    >
      <div className="mt-0.5 flex size-[34px] shrink-0 items-center justify-center rounded-lg" style={{ background: item.icobg, color: item.ico }}>
        {feedIcon(item.icon)}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("mb-0.5 text-[13.5px] font-semibold text-[#111827]", done && "line-through")}>{item.name}</p>
        <p className="text-[12px] leading-snug text-[#6b7280]">{item.why}</p>
        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-[rgba(124,58,237,0.12)] bg-[rgba(124,58,237,0.06)] px-2 py-0.5 text-[11.5px] font-medium text-[#7c3aed]">
          <Sparkles className="size-3 shrink-0" />
          {item.ai}
        </span>
      </div>
      <div className="mt-0.5 flex shrink-0 flex-col items-end gap-2">
        <span className="flex items-center gap-0.5 font-mono text-[11px]" style={{ color: item.timecol }}>
          <Clock className="size-3" />
          {item.time}
        </span>
        {done ? (
          <span className="flex h-[27px] items-center gap-1 rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-3 text-[11.5px] font-bold text-[#16a34a]">
            <Check className="size-3" />
            Done
          </span>
        ) : (
          <Button
            type="button"
            size="sm"
            className="h-[27px] gap-1 border-0 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] px-3 text-[11.5px] font-bold text-white shadow-sm hover:opacity-90"
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
          >
            {feedIcon(item.icon)}
            {item.btn}
          </Button>
        )}
        <button type="button" className="p-1 text-[#d1d5db] hover:text-[#9ca3af]" aria-label="More" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="size-4" />
        </button>
      </div>
    </div>
  );
}

const repNudges: { body: ReactNode; chips: { label: string; variant: "violet" | "red" | "green"; action: string }[] }[] = [
  {
    body: (
      <>
        <strong>Davidson Build demo is unconfirmed and it&apos;s in 4 hours.</strong> Sarah Chen hasn&apos;t replied to your SMS. Unconfirmed on-site demos cancel 40% of the time.
      </>
    ),
    chips: [
      { label: "Call Sarah Chen now", variant: "red", action: "call-sarah" },
      { label: "Send reminder SMS", variant: "violet", action: "sms-sarah" },
    ],
  },
  {
    body: (
      <>
        <strong>{v7Rep.streak} days hitting target in a row.</strong> Gibson Thomas is 3 points behind you on the board.
      </>
    ),
    chips: [{ label: "View leaderboard", variant: "violet", action: "leaderboard" }],
  },
  {
    body: (
      <>
        <strong>Hillman Inc has been untouched for 6 days.</strong> James Hillman asked for your proposal after the demo. A $14k deal is going cold.
      </>
    ),
    chips: [
      { label: "Send proposal now", variant: "violet", action: "proposal" },
      { label: "Call James Hillman", variant: "red", action: "call-james" },
    ],
  },
];

const mgrNudges: { body: ReactNode; chips: { label: string; variant: "violet" | "red" | "green"; action: string }[] }[] = [
  {
    body: (
      <>
        <strong>Brandon White has logged zero calls in 3 days.</strong> His pipeline is stalled at $18k. This needs a conversation today.
      </>
    ),
    chips: [
      { label: "View Brandon's pipeline", variant: "violet", action: "brandon-pipe" },
      { label: "Schedule check-in", variant: "green", action: "checkin" },
    ],
  },
  {
    body: (
      <>
        <strong>Marissa Turner&apos;s demo-to-close rate dropped to 18% this month</strong> — team average is 41%.
      </>
    ),
    chips: [{ label: "Schedule coaching session", variant: "violet", action: "coach" }],
  },
];

function NudgeBlock({ mode }: { mode: ViewMode }) {
  const [idx, setIdx] = useState(0);
  const pool = mode === "rep" ? repNudges : mgrNudges;
  const n = pool[idx % pool.length];
  const chipClass = (v: "violet" | "red" | "green") =>
    v === "violet"
      ? "border-[#ddd6fe] bg-[#f5f3ff] text-[#7c3aed] hover:border-[#7c3aed] hover:bg-[#7c3aed] hover:text-white"
      : v === "red"
        ? "border-[#fecaca] bg-[#fef2f2] text-[#ef4444] hover:border-[#ef4444] hover:bg-[#ef4444] hover:text-white"
        : "border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a] hover:border-[#16a34a] hover:bg-[#16a34a] hover:text-white";

  return (
    <div className="relative flex items-start gap-2.5 rounded-r-[9px] border border-[#e5e7eb] border-l-[3px] border-l-[#7c3aed] bg-white py-3 pl-4 pr-3 shadow-sm">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#7c3aed] to-[#ec4899] text-white">
        <Sparkles className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#7c3aed]">{mode === "rep" ? "AI Coach" : "AI Manager Brief"}</p>
        <div className="text-[13.5px] leading-snug text-[#111827]">{n.body}</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {n.chips.map((c) => (
            <button
              key={c.label}
              type="button"
              className={cn(
                "flex h-[26px] items-center gap-1 rounded-full border-[1.5px] px-2.5 text-[12px] font-semibold transition-colors",
                chipClass(c.variant),
              )}
              onClick={() => toast.success(c.action)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <button type="button" className="mt-0.5 shrink-0 whitespace-nowrap text-[11px] text-[#9ca3af] hover:text-[#6b7280]" onClick={() => setIdx((i) => i + 1)}>
        Next →
      </button>
    </div>
  );
}

function RepKpis() {
  const cards = [
    {
      bg: "linear-gradient(135deg,#7c3aed,#6d28d9)",
      shadow: "0 6px 18px rgba(124,58,237,.25)",
      badge: { icon: AlertTriangle, text: "4 behind", class: "bg-[rgba(239,68,68,.25)] text-[#fca5a5]" },
      num: String(v7Rep.touches),
      label: "/ 20 touches",
      ai: "At this pace you finish at 16. Push now.",
      icon: Phone,
    },
    {
      bg: "linear-gradient(135deg,#059669,#10b981)",
      shadow: "0 6px 18px rgba(5,150,105,.22)",
      badge: { icon: TrendingUp, text: "+2 vs yesterday", class: "bg-white/15 text-white/85" },
      num: "3",
      label: "meetings set",
      ai: "Best day this week. Team avg is 1.8.",
      icon: Calendar,
    },
    {
      bg: "linear-gradient(135deg,#ea580c,#f97316)",
      shadow: "0 6px 18px rgba(234,88,12,.22)",
      badge: { icon: BarChart3, text: "28% of goal", class: "bg-white/15 text-white/85" },
      num: "$12.5k",
      label: "pipeline",
      ai: "Davidson close today adds $38k instantly.",
      icon: BarChart3,
    },
    {
      bg: "linear-gradient(135deg,#0891b2,#06b6d4)",
      shadow: "0 6px 18px rgba(8,145,178,.22)",
      badge: { icon: BarChart3, text: "On track", class: "bg-white/15 text-white/85" },
      num: (
        <>
          68<span className="text-sm opacity-60">%</span>
        </>
      ),
      label: "win rate",
      ai: "27pts above team avg. Keep the pace.",
      icon: BarChart3,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c, i) => {
        const BadgeIcon = c.badge.icon ?? Sparkles;
        const MainIcon = c.icon;
        return (
          <div
            key={i}
            className="flex cursor-default flex-col gap-1.5 rounded-[14px] p-3.5 text-white transition-transform hover:-translate-y-0.5"
            style={{ background: c.bg, boxShadow: c.shadow }}
          >
            <div className="flex items-center justify-between">
              <div className="flex size-7 items-center justify-center rounded-lg bg-white/20">
                <MainIcon className="size-3.5" />
              </div>
              <span className={cn("flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold", c.badge.class)}>
                <BadgeIcon className="size-2.5" />
                {c.badge.text}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[22px] font-extrabold tracking-tight">{c.num}</span>
              <span className="text-[11.5px] font-semibold text-white/65">{c.label}</span>
            </div>
            <div className="mt-0.5 flex items-start gap-0.5 text-[11px] text-white/60">
              <Sparkles className="mt-0.5 size-3 shrink-0" />
              {c.ai}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RepBody() {
  const [doneFeed, setDoneFeed] = useState<Set<string>>(() => new Set());
  return (
    <div className="grid grid-cols-1 items-start gap-3.5 xl:grid-cols-[1fr_1fr_284px]">
      <div>
        <div className={sec}>
          <div className={secHead}>
            <div className={secTitle}>
              <Calendar className={secTitleIcon} />
              Today&apos;s Appointments
            </div>
            <button type="button" className={secLink} onClick={() => toast.message("Calendar")}>
              Calendar →
            </button>
          </div>
          {v7Appointments.map((a) => (
            <AppointmentCard key={a.id} a={a} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className={sec}>
          <div className={secHead}>
            <div className={secTitle}>
              <Sparkles className={secTitleIcon} />
              Next Best Actions
            </div>
            <button type="button" className={secLink} onClick={() => toast.message("All actions")}>
              View all
            </button>
          </div>
          {v7FeedItems.map((item) => (
            <FeedRow
              key={item.id}
              item={item}
              done={doneFeed.has(item.id)}
              onAction={() => setDoneFeed((s) => new Set(s).add(item.id))}
            />
          ))}
        </div>

        <div className={sec}>
          <div className={secHead}>
            <div className={secTitle}>
              <Mail className={secTitleIcon} />
              Communications &amp; Signals
            </div>
            <button type="button" className={secLink} onClick={() => toast.message("Inbox")}>
              All comms →
            </button>
          </div>
          {v7Comms.map((c) => {
            const { Icon, bg, color } = commIcon(c.channel);
            return (
              <button
                key={c.id}
                type="button"
                className="flex w-full cursor-pointer items-start gap-2.5 border-t border-[#f3f4f6] px-4 py-2.5 text-left transition-colors hover:bg-[#fafafa]"
                onClick={() => toast.message(c.company)}
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full" style={{ background: bg, color }}>
                  <Icon className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold text-[#111827]">
                    {c.contact} <span className="font-normal text-[#9ca3af]">· {c.company}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-[#6b7280]">{c.text}</p>
                  <span
                    className="mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11.5px] font-medium"
                    style={{ color: c.signalColor, background: c.signalBg, borderColor: `${c.signalColor}22` }}
                  >
                    <Sparkles className="size-3" />
                    {c.signal}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-mono text-[10px] text-[#9ca3af]">{c.time}</span>
                  <span className="text-[9px] font-bold uppercase" style={{ background: c.signalBg, color: c.signalColor, padding: "2px 7px", borderRadius: 20 }}>
                    {c.channel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <TeamPulseCard />
        <ScheduleCard />
      </div>
    </div>
  );
}

function TeamPulseCard() {
  return (
    <div className={sec}>
      <div className={secHead}>
        <div className={secTitle}>
          <Users className={secTitleIcon} />
          Team Pulse
        </div>
        <button type="button" className={secLink} onClick={() => toast.message("Team")}>
          View All
        </button>
      </div>
      <div className="flex items-start gap-2 border-t border-[#f3f4f6] px-4 py-2.5 hover:bg-[#fafafa]">
        <div className="mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full text-[9.5px] font-extrabold text-white" style={{ background: "linear-gradient(135deg,#22d3a5,#0d9461)" }}>
          GT
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center justify-between">
            <strong className="text-[12.5px] text-[#111827]">Gibson Thomas</strong>
            <span className="font-mono text-[11px] font-bold text-emerald-600">88 ↑</span>
          </div>
          <p className="mb-0.5 text-[11.5px] font-semibold text-emerald-600">On a 5-day streak · 34 calls this week</p>
          <p className="text-[11.5px] leading-snug text-[#6b7280]">Closing Pinnacle Roofing today at 3pm. Highest close rate on the team this month at 52%.</p>
        </div>
      </div>
      <div className="flex items-start gap-2 border-t border-[#f3f4f6] bg-[#f5f3ff] px-4 py-2.5">
        <div className="mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full text-[9.5px] font-extrabold text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
          RB
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center justify-between">
            <strong className="text-[12.5px] text-[#7c3aed]">You · Rank #2</strong>
            <span className="font-mono text-[11px] font-bold text-[#7c3aed]">91 ↑</span>
          </div>
          <p className="mb-0.5 text-[11.5px] font-semibold text-[#7c3aed]">3 calls away from taking #1 this week</p>
          <p className="text-[11.5px] leading-snug text-[#6b7280]">Your response speed is the best on the team. Davidson demo today is your biggest close opportunity.</p>
        </div>
      </div>
      {v7Team.slice(2).map((t) => (
        <div
          key={t.name}
          className={cn(
            "flex cursor-pointer items-start gap-2 border-t border-[#f3f4f6] px-4 py-2.5 hover:bg-[#fafafa]",
            t.name === "Brandon White" && "bg-[#fef2f2]",
          )}
          onClick={() => toast.message(t.name)}
        >
          <div
            className="mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full text-[9.5px] font-extrabold text-white"
            style={{ background: t.color }}
          >
            {t.av}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center justify-between">
              <strong className="text-[12.5px] text-[#111827]">{t.name}</strong>
              <span className={cn("font-mono text-[11px] font-bold", t.trend === "up" ? "text-amber-600" : "text-red-600")}>
                {t.score} {t.trend === "up" ? "↑" : "↓"}
              </span>
            </div>
            <p className={cn("mb-0.5 text-[11.5px] font-semibold", t.insightType === "bad" ? "text-red-600" : "text-amber-600")}>{t.insight.split(".")[0]}.</p>
            <p className="text-[11.5px] leading-snug text-[#6b7280]">{t.insight}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScheduleCard() {
  const rows = [
    { t: "9:00", title: "Team Standup", badge: "15 min", dot: "#3b82f6", sub: "AI suggests: Mention Davidson demo today. Flag Brandon's inactivity.", bg: "" },
    { t: "11:00", title: "TN Supply — Sarah Mitchell", badge: "In 45 min", dot: "#7c3aed", sub: "Open loop: You promised pricing comparison 14 days ago.", bg: "bg-[#f5f3ff]" },
    { t: "2:00", title: "Davidson Build — Sarah Chen", badge: "⚠ Unconfirmed", dot: "#ef4444", sub: "$38k at risk. No reply to your SMS.", bg: "bg-[#fef2f2]" },
    { t: "4:30", title: "Pinnacle Roofing — Dana Ross", badge: "Confirmed", dot: "#16a34a", sub: "Good momentum. Lead with: did the owner see the sample?", bg: "" },
  ];
  return (
    <div className={sec}>
      <div className={secHead}>
        <div className={secTitle}>
          <Calendar className={secTitleIcon} />
          Today&apos;s Schedule
        </div>
        <button type="button" className={secLink} onClick={() => toast.message("Calendar")}>
          Calendar
        </button>
      </div>
      {rows.map((r) => (
        <div key={r.t} className={cn("cursor-pointer border-t border-[#f3f4f6] px-4 py-2.5 transition-colors hover:bg-[#fafafa]", r.bg)} onClick={() => toast.message(r.title)}>
          <div className="mb-1 flex items-center gap-2">
            <span className="size-1.5 shrink-0 rounded-full" style={{ background: r.dot }} />
            <span className="min-w-[40px] font-mono text-[11px] text-[#374151]">{r.t}</span>
            <span className="flex-1 text-[12.5px] font-semibold text-[#111827]">{r.title}</span>
            <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ background: r.dot === "#ef4444" ? "#fef2f2" : "#eff6ff", color: r.dot === "#ef4444" ? "#ef4444" : "#3b82f6" }}>
              {r.badge}
            </span>
          </div>
          <p className="pl-[22px] text-[11.5px] leading-snug text-[#6b7280]">{r.sub}</p>
        </div>
      ))}
    </div>
  );
}

function ManagerBody() {
  return (
    <div className="grid grid-cols-1 items-start gap-3.5 xl:grid-cols-[1fr_1fr_284px]">
      <div>
        <div className={sec}>
          <div className={secHead}>
            <div className={secTitle}>
              <Users className={secTitleIcon} />
              Rep Intelligence
            </div>
            <button type="button" className={secLink} onClick={() => toast.message("Report")}>
              Full report →
            </button>
          </div>
          {v7Team.map((rep) => (
            <div key={rep.name} className="cursor-pointer border-t border-[#f3f4f6] px-4 py-2.5 hover:bg-[#fafafa]" onClick={() => toast.message(rep.name)}>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-full text-[10px] font-extrabold text-white" style={{ background: rep.color }}>
                  {rep.av}
                </div>
                <span className="flex-1 text-[13px] font-bold text-[#111827]">{rep.name}</span>
                <span className={cn("font-mono text-[11.5px] font-bold", rep.trend === "up" ? "text-emerald-600" : "text-red-600")}>
                  {rep.score}
                  {rep.trend === "up" ? "↑" : "↓"}
                </span>
                <span className="ml-1 font-mono text-[10px] text-[#9ca3af]">Last: {rep.lastCall}</span>
              </div>
              <p className={cn("pl-[37px] text-[12px] leading-snug", rep.insightType === "good" && "text-emerald-700", rep.insightType === "warn" && "text-amber-700", rep.insightType === "bad" && "text-red-700")}>{rep.insight}</p>
              <div className="mt-1.5 flex flex-wrap gap-1 pl-[37px]">
                {rep.tags.map((tag) => (
                  <span key={tag.text} className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: tag.bg, color: tag.c }}>
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className={sec}>
          <div className={secHead}>
            <div className={secTitle}>
              <Calendar className={secTitleIcon} />
              Team Appointments Today
            </div>
            <button type="button" className={secLink} onClick={() => toast.message("Calendar")}>
              All →
            </button>
          </div>
          {v7Appointments.map((a) => {
            const t = aptTypeMeta(a.type);
            const TIcon = t.Icon;
            return (
              <div key={a.id} className="cursor-pointer border-t border-[#f3f4f6] px-4 py-2.5 hover:bg-[#fafafa]" onClick={() => toast.message(a.company)}>
                <div className="flex items-start gap-2">
                  <span className="min-w-[44px] pt-0.5 font-mono text-[11px] text-[#6b7280]">{a.time}</span>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ background: t.bg, color: t.color }}>
                    <TIcon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-bold text-[#111827]">
                      {a.contact} — {a.company}{" "}
                      <span className="text-[9px] font-bold" style={{ color: a.badge.color, background: a.badge.bg, padding: "2px 7px", borderRadius: 20 }}>
                        {a.badge.text}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#6b7280]">
                      {a.label} · Robert · {a.channel === "zoom" ? "Zoom" : a.channel === "onsite" ? "On-site" : "Phone"}
                    </div>
                  </div>
                </div>
                <div className="ml-[43px] mt-2 rounded-lg border border-[rgba(124,58,237,0.1)] bg-gradient-to-r from-[rgba(124,58,237,0.05)] to-[rgba(249,115,22,0.02)] px-3 py-2">
                  <div className="mb-1 flex items-center gap-1 font-mono text-[9.5px] font-bold uppercase tracking-wide text-[#7c3aed]">
                    <Sparkles className="size-3" />
                    AI Risk Check
                  </div>
                  <p className="text-[12.5px] text-[#374151]">
                    {a.badge.text === "Unconfirmed" ? (
                      <>
                        <strong className="text-red-600">High risk.</strong> Demo is unconfirmed 4 hours out. Robert needs to act now.
                      </>
                    ) : a.isFirst ? (
                      "First meeting. Robert has been briefed."
                    ) : (
                      <>
                        Return visit. Open loop: <strong>{a.history?.openLoop ?? "None"}</strong>
                      </>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={sec}>
          <div className={secHead}>
            <div className={cn(secTitle, "text-red-600")}>
              <AlertTriangle className="size-[15px] shrink-0 text-red-600" />
              <span className="text-[#111827]">Deals Needing Attention</span>
            </div>
            <button type="button" className={secLink} onClick={() => toast.message("Board")}>
              Board →
            </button>
          </div>
          {v7Deals
            .filter((d) => d.risk !== "low")
            .map((d) => (
              <div key={d.id} className="cursor-pointer border-t border-[#f3f4f6] px-4 py-2.5 hover:bg-[#fafafa]" onClick={() => toast.message(d.name)}>
                <div className="mb-0.5 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#111827]">{d.name}</span>
                  <span className="font-mono text-[11.5px] font-semibold text-[#374151]">${(d.value / 1000).toFixed(0)}k</span>
                </div>
                <p className="mb-1 text-[12px] text-[#6b7280]">
                  {d.signals[0]} · {d.silent > 0 ? `${d.silent}d silent` : "Active"}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(124,58,237,0.12)] bg-[rgba(124,58,237,0.06)] px-2 py-0.5 text-[11px] text-[#7c3aed]">
                    <Sparkles className="size-3" />
                    {d.risk === "high" ? "Needs immediate attention" : "Watch closely"}
                  </span>
                  <span className="ml-auto text-[9.5px] font-bold" style={{ background: d.risk === "high" ? "#fef2f2" : "#fffbeb", color: d.risk === "high" ? "#ef4444" : "#d97706", padding: "2px 7px", borderRadius: 20 }}>
                    {d.stage}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className={sec}>
          <div className={secHead}>
            <div className={secTitle}>
              <Sparkles className={secTitleIcon} />
              AI Team Insights
            </div>
          </div>
          <div className="border-t border-[#f3f4f6] px-4 py-3">
            <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-wide text-[#7c3aed]">Pattern Detected</p>
            <p className="text-[12.5px] leading-snug text-[#374151]">
              Reps who do morning calls before 10am close <strong className="text-[#111827]">37% more deals</strong> this month.
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-2 h-6 gap-1 border-[1.5px] px-2.5 text-[11px]" onClick={() => toast.success("Nudge sent")}>
              <Send className="size-3" />
              Send team nudge
            </Button>
          </div>
        </div>

        <div className={sec}>
          <div className={secHead}>
            <div className={secTitle}>
              <Calendar className={secTitleIcon} />
              Team Schedule
            </div>
            <button type="button" className={secLink} onClick={() => toast.message("All")}>
              All →
            </button>
          </div>
          {[
            { dot: "#7c3aed", time: "11:00", ev: "Robert — TN Supply" },
            { dot: "#ef4444", time: "2:00", ev: "Robert — Davidson Demo", tag: "Unconfirmed" },
            { dot: "#16a34a", time: "3:00", ev: "Gibson — Pinnacle Close" },
            { dot: "#f97316", time: "3:30", ev: "Eddie — Metro Retail Demo" },
            { dot: "#9ca3af", time: "4:30", ev: "Team check-in" },
          ].map((r) => (
            <div key={r.time} className="flex items-center gap-2 border-t border-[#f3f4f6] px-4 py-2">
              <span className="size-1.5 shrink-0 rounded-full" style={{ background: r.dot }} />
              <span className="min-w-[44px] font-mono text-[11px] text-[#374151]">{r.time}</span>
              <span className="flex-1 text-[12.5px] font-medium text-[#111827]">{r.ev}</span>
              {"tag" in r && r.tag ? (
                <span className="rounded-full bg-[#fef2f2] px-1.5 py-0.5 text-[9px] font-bold text-red-600">{r.tag}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function ManagerKpis({ teamTotal, atRisk, pipeline }: { teamTotal: number; atRisk: number; pipeline: number }) {
  const pct = Math.min((teamTotal / 60) * 100, 100);
  const rows = [
    { title: "Team Calls Today", value: String(teamTotal), sub: "vs 60 goal", bar: pct, barBg: "linear-gradient(90deg,#7c3aed,#f97316)", suffix: undefined as string | undefined },
    { title: "Deals At Risk", value: String(atRisk), sub: "Need action today", bar: 60, barBg: "#ef4444", suffix: undefined as string | undefined },
    { title: "Open Pipeline", value: `$${(pipeline / 1000).toFixed(0)}k`, sub: "Across 5 deals", bar: 55, barBg: "linear-gradient(90deg,#7c3aed,#f97316)", suffix: undefined as string | undefined },
    { title: "Reps On Target", value: "2", sub: "2 behind pace", bar: 50, barBg: "#d97706", suffix: "/4" },
  ];
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
      {rows.map((k, i) => (
        <div key={k.title} className="flex flex-col gap-1 rounded-[14px] border border-[#e5e7eb] bg-white p-3.5 shadow-sm">
          <div className="flex items-center gap-1 text-[11.5px] font-semibold text-[#6b7280]">
            {i === 0 ? <Phone className="size-3.5 text-[#7c3aed]" /> : null}
            {i === 1 ? <AlertTriangle className="size-3.5 text-red-500" /> : null}
            {i === 2 ? <BarChart3 className="size-3.5 text-[#7c3aed]" /> : null}
            {i === 3 ? <Users className="size-3.5 text-[#7c3aed]" /> : null}
            {k.title}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={cn("text-[22px] font-extrabold tracking-tight", i === 1 && "text-red-600")}>{k.value}</span>
            {k.suffix ? <span className="text-sm font-normal text-[#9ca3af]">{k.suffix}</span> : null}
          </div>
          <p className="text-[11.5px] text-[#6b7280]">{k.sub}</p>
          <div className="mt-2 h-0.5 overflow-hidden rounded-sm bg-[#f3f4f6]">
            <div className="h-full rounded-sm" style={{ width: `${k.bar}%`, background: k.barBg }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardV7View() {
  const [mode, setMode] = useState<ViewMode>("rep");
  const teamTotal = useMemo(() => v7Team.reduce((s, t) => s + t.calls, 0), []);
  const atRisk = useMemo(() => v7Deals.filter((d) => d.risk === "high").length, []);
  const pipeline = useMemo(() => v7Deals.reduce((s, d) => s + d.value, 0), []);

  return (
    <>
    <div
      className="min-h-0 min-w-0 flex-1 text-[#111827] antialiased"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f4f6f9" }}
    >
      <div className={pageWrap}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {mode === "rep" ? (
              <>
                <h1 className={h1}>Good morning, {v7Rep.name} 👋</h1>
                <p className={hsub}>Ready to win the hour? Start here.</p>
              </>
            ) : (
              <>
                <h1 className={h1}>Team Overview 👥</h1>
                <p className={hsub}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })} · 4 reps active · Your team has ${(pipeline / 1000).toFixed(0)}k in open pipeline today.
                </p>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-lg bg-[#f4f6f9] p-0.5">
              <button
                type="button"
                className={cn(
                  "h-7 rounded-md px-3.5 text-[12px] font-semibold transition-all",
                  mode === "rep" ? "bg-white text-[#7c3aed] shadow-sm" : "bg-transparent text-[#6b7280]",
                )}
                onClick={() => setMode("rep")}
              >
                Rep View
              </button>
              <button
                type="button"
                className={cn(
                  "h-7 rounded-md px-3.5 text-[12px] font-semibold transition-all",
                  mode === "mgr" ? "bg-white text-[#7c3aed] shadow-sm" : "bg-transparent text-[#6b7280]",
                )}
                onClick={() => setMode("mgr")}
              >
                Manager View
              </button>
            </div>
            {mode === "rep" ? (
              <>
                <Button type="button" variant="outline" className="h-8 gap-1.5 rounded-md border-[#d1d5db] bg-white px-3 text-[12.5px] font-semibold text-[#374151] hover:border-[#7c3aed] hover:text-[#7c3aed]" onClick={() => toast.message("Log call")}>
                  <Phone className="size-3.5" />
                  Log Call
                </Button>
                <Button type="button" variant="outline" className="h-8 gap-1.5 rounded-md border-[#d1d5db] bg-white px-3 text-[12.5px] font-semibold text-[#374151] hover:border-[#7c3aed] hover:text-[#7c3aed]" onClick={() => toast.message("Log visit")}>
                  <MapPin className="size-3.5" />
                  Log Visit
                </Button>
                <Button className="h-8 gap-1.5 rounded-md border-0 bg-gradient-to-r from-[#7c3aed] to-[#f97316] px-3 text-[12.5px] font-semibold text-white shadow-md hover:opacity-90" onClick={() => toast.message("New action")}>
                  <Send className="size-3.5" />
                  New Action
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" className="h-8 gap-1.5 rounded-md border-[#d1d5db] bg-white px-3 text-[12.5px] font-semibold" onClick={() => toast.message("Pipeline")}>
                  <BarChart3 className="size-3.5" />
                  Pipeline Report
                </Button>
                <Button className="h-8 gap-1.5 rounded-md border-0 bg-gradient-to-r from-[#7c3aed] to-[#f97316] px-3 text-[12.5px] font-semibold text-white shadow-md" onClick={() => toast.message("Broadcast")}>
                  <Send className="size-3.5" />
                  Team Broadcast
                </Button>
              </>
            )}
          </div>
        </div>

        <NudgeBlock key={mode} mode={mode} />

        {mode === "rep" ? <RepKpis /> : <ManagerKpis teamTotal={teamTotal} atRisk={atRisk} pipeline={pipeline} />}

        {mode === "rep" ? <RepBody /> : <ManagerBody />}

        <footer className="border-t border-[#e5e7eb] pt-4 text-center text-[11px] text-[#9ca3af]">CallProof AI · Field sales dashboard</footer>
      </div>
    </div>
    <AiCopilotFloating />
    </>
  );
}
