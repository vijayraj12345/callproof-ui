/** Sample data for CallProof v7 dashboard (from design HTML). */

export type V7Appointment = {
  id: string;
  time: string;
  type: "meeting" | "demo" | "call";
  label: string;
  contact: string;
  company: string;
  channel: "zoom" | "onsite" | "phone";
  duration: string;
  isFirst: boolean;
  badge: { text: string; color: string; bg: string };
  history: null | {
    visits: number;
    lastVisit: string;
    lastNote: string;
    openLoop: string;
    dealValue: number;
  };
  brief: {
    headline: string;
    tips: { dot: string; text: string }[];
  };
};

export type V7Comm = {
  id: string;
  contact: string;
  company: string;
  channel: "email" | "sms" | "call" | "visit";
  direction: "in" | "out";
  text: string;
  time: string;
  signal: string;
  signalColor: string;
  signalBg: string;
};

export type V7Deal = {
  id: string;
  name: string;
  value: number;
  stage: string;
  risk: "high" | "med" | "low";
  contact: string;
  silent: number;
  signals: string[];
};

export type V7TeamMember = {
  name: string;
  av: string;
  color: string;
  score: number;
  trend: "up" | "down";
  calls: number;
  visits: number;
  lastCall: string;
  insight: string;
  insightType: "good" | "warn" | "bad";
  tags: { text: string; bg: string; c: string }[];
};

export const v7Rep = {
  name: "Robert",
  calls: 2,
  touches: 12,
  goal: 20,
  score: 91,
  rank: 2,
  streak: 3,
};

export const v7Appointments: V7Appointment[] = [
  {
    id: "a1",
    time: "11:00 AM",
    type: "meeting",
    label: "Discovery Call",
    contact: "Sarah Mitchell",
    company: "TN Supply Group",
    channel: "zoom",
    duration: "30 min",
    isFirst: false,
    badge: { text: "In 45 min", color: "#7c3aed", bg: "#f5f3ff" },
    history: {
      visits: 2,
      lastVisit: "14 days ago",
      lastNote: "Very interested in route optimisation.",
      openLoop: "You promised to send a pricing comparison — never sent it.",
      dealValue: 11000,
    },
    brief: {
      headline: "Fix the open loop before anything else.",
      tips: [
        {
          dot: "#ef4444",
          text: "You promised a pricing comparison 14 days ago and never sent it. Address this immediately.",
        },
        { dot: "#d97706", text: "Their Q3 budget is locked. Focus on a Q4 start." },
        { dot: "#7c3aed", text: "Pain point is route scheduling. Lead with the 42-minute daily saving." },
        { dot: "#16a34a", text: "Decision maker is Pete Owens, not Sarah." },
      ],
    },
  },
  {
    id: "a2",
    time: "2:00 PM",
    type: "demo",
    label: "Product Demo",
    contact: "Sarah Chen",
    company: "Davidson Build Co",
    channel: "onsite",
    duration: "1 hr",
    isFirst: true,
    badge: { text: "Unconfirmed", color: "#ef4444", bg: "#fef2f2" },
    history: null,
    brief: {
      headline: "First time meeting. Do your homework.",
      tips: [
        {
          dot: "#ef4444",
          text: "CONFIRM this demo right now. Unconfirmed on-site demos cancel 40% of the time.",
        },
        {
          dot: "#7c3aed",
          text: "Davidson Build did $3.2M revenue last year. Sarah is Project Lead — Tom Davidson is the owner.",
        },
        { dot: "#d97706", text: "They use a manual spreadsheet for route planning. Show the live route optimiser first." },
        { dot: "#16a34a", text: "$38k deal. Bring a printed one-pager with ROI numbers." },
      ],
    },
  },
  {
    id: "a3",
    time: "4:30 PM",
    type: "call",
    label: "Follow-up Call",
    contact: "Dana Ross",
    company: "Pinnacle Roofing",
    channel: "phone",
    duration: "15 min",
    isFirst: false,
    badge: { text: "Confirmed", color: "#16a34a", bg: "#f0fdf4" },
    history: {
      visits: 1,
      lastVisit: "1 day ago",
      lastNote: "Left a product sample.",
      openLoop: "Owner reaction to sample unknown. Need to find out.",
      dealValue: 8000,
    },
    brief: {
      headline: "Find out what the owner said about the sample.",
      tips: [
        {
          dot: "#7c3aed",
          text: 'Lead with: "Did you get a chance to show the sample to the owner?"',
        },
        { dot: "#16a34a", text: "If positive: book a joint call with the owner this week." },
        { dot: "#d97706", text: "If hesitant: offer a free 2-week pilot." },
      ],
    },
  },
];

export const v7Comms: V7Comm[] = [
  {
    id: "c1",
    contact: "Mike Farris",
    company: "101 Construction",
    channel: "email",
    direction: "in",
    text: "Opened your proposal email 4 times in the last 2 hours",
    time: "2h ago",
    signal: "Hot — call now",
    signalColor: "#ef4444",
    signalBg: "#fef2f2",
  },
  {
    id: "c2",
    contact: "James Hillman",
    company: "Hillman Inc",
    channel: "email",
    direction: "out",
    text: "Proposal sent 6 days ago — no reply, no open",
    time: "6d ago",
    signal: "No engagement",
    signalColor: "#d97706",
    signalBg: "#fffbeb",
  },
  {
    id: "c3",
    contact: "Sarah Chen",
    company: "Davidson Build Co",
    channel: "sms",
    direction: "out",
    text: "Demo confirmation sent — awaiting reply",
    time: "3h ago",
    signal: "No reply",
    signalColor: "#d97706",
    signalBg: "#fffbeb",
  },
  {
    id: "c4",
    contact: "Pete Owens",
    company: "TN Supply Group",
    channel: "call",
    direction: "out",
    text: 'Voicemail left — "Following up on the proposal"',
    time: "21d ago",
    signal: "Re-engage",
    signalColor: "#9ca3af",
    signalBg: "#f4f6f9",
  },
  {
    id: "c5",
    contact: "Dana Ross",
    company: "Pinnacle Roofing",
    channel: "visit",
    direction: "out",
    text: "In-person visit · Left sample · Meeting lasted 22 min",
    time: "1d ago",
    signal: "Good momentum",
    signalColor: "#16a34a",
    signalBg: "#f0fdf4",
  },
];

export const v7Deals: V7Deal[] = [
  {
    id: "d1",
    name: "101 Construction",
    value: 24000,
    stage: "Proposal",
    risk: "high",
    contact: "Mike Farris",
    silent: 2,
    signals: ["Email opened 4×", "On pricing page now"],
  },
  {
    id: "d2",
    name: "Davidson Build Co",
    value: 38000,
    stage: "Demo",
    risk: "med",
    contact: "Sarah Chen",
    silent: 0,
    signals: ["Demo unconfirmed 4hrs away"],
  },
  {
    id: "d3",
    name: "Hillman Inc",
    value: 14000,
    stage: "Proposal",
    risk: "high",
    contact: "James Hillman",
    silent: 6,
    signals: ["6 days silent after proposal"],
  },
  {
    id: "d4",
    name: "Pinnacle Roofing",
    value: 8000,
    stage: "Qualifying",
    risk: "low",
    contact: "Dana Ross",
    silent: 1,
    signals: ["New warm lead"],
  },
  {
    id: "d5",
    name: "TN Supply Group",
    value: 11000,
    stage: "Cold",
    risk: "high",
    contact: "Pete Owens",
    silent: 21,
    signals: ["21 days cold"],
  },
];

export const v7Team: V7TeamMember[] = [
  {
    name: "Gibson Thomas",
    av: "GT",
    color: "linear-gradient(135deg,#22d3a5,#0d9461)",
    score: 88,
    trend: "up",
    calls: 34,
    visits: 12,
    lastCall: "2h ago",
    insight: "On fire. Closing Davidson Pipeline lead today. No action needed.",
    insightType: "good",
    tags: [
      { text: "14 calls today", bg: "#f0fdf4", c: "#16a34a" },
      { text: "On target", bg: "#f0fdf4", c: "#16a34a" },
    ],
  },
  {
    name: "Marissa Turner",
    av: "MT",
    color: "linear-gradient(135deg,#f9a8d4,#ec4899)",
    score: 72,
    trend: "down",
    calls: 8,
    visits: 3,
    lastCall: "2d ago",
    insight: "Missed 2 follow-ups. TN Supply has been silent 21 days on her watch.",
    insightType: "warn",
    tags: [
      { text: "2 follow-ups missed", bg: "#fffbeb", c: "#d97706" },
      { text: "Pipeline stalled", bg: "#fef2f2", c: "#ef4444" },
    ],
  },
  {
    name: "Eddie Huber",
    av: "EH",
    color: "linear-gradient(135deg,#fbbf24,#f97316)",
    score: 79,
    trend: "up",
    calls: 24,
    visits: 8,
    lastCall: "1h ago",
    insight: "Steady. 3 demos this week. Demo-to-close rate is 28%, team avg is 41%.",
    insightType: "warn",
    tags: [
      { text: "3 demos this week", bg: "#fffbeb", c: "#d97706" },
      { text: "Closing needs work", bg: "#fef2f2", c: "#ef4444" },
    ],
  },
  {
    name: "Brandon White",
    av: "BW",
    color: "linear-gradient(135deg,#fca5a5,#ef4444)",
    score: 54,
    trend: "down",
    calls: 6,
    visits: 2,
    lastCall: "3d ago",
    insight: "Zero calls in 3 days. Pipeline completely stalled. Urgent check-in required today.",
    insightType: "bad",
    tags: [
      { text: "3d no activity", bg: "#fef2f2", c: "#ef4444" },
      { text: "Pipeline at risk", bg: "#fef2f2", c: "#ef4444" },
    ],
  },
];

export type V7FeedUrgency = "urg" | "wrn" | "inf" | "gd";

export type V7FeedItem = {
  id: string;
  urg: V7FeedUrgency;
  ico: string;
  icobg: string;
  icon: "phone" | "cal" | "send" | "pin" | "list" | "refresh";
  name: string;
  why: string;
  ai: string;
  time: string;
  timecol: string;
  btn: string;
};

export const v7FeedItems: V7FeedItem[] = [
  {
    id: "fi-call",
    urg: "urg",
    ico: "#ef4444",
    icobg: "#fef2f2",
    icon: "phone",
    name: "Call Mike Farris — 101 Construction",
    why: "2 days overdue · On your pricing page right now",
    ai: "Opened email 4× · $24k deal · highest probability close today",
    time: "2 min ago",
    timecol: "#ef4444",
    btn: "Call Now",
  },
  {
    id: "fi-confirm",
    urg: "wrn",
    ico: "#d97706",
    icobg: "#fffbeb",
    icon: "cal",
    name: "Confirm Davidson Build demo — Sarah Chen",
    why: "On-site demo in 4 hours · No reply to your confirmation SMS",
    ai: "Unconfirmed demos cancel 40% of the time · $38k deal",
    time: "Urgent",
    timecol: "#d97706",
    btn: "Call Now",
  },
  {
    id: "fi-proposal",
    urg: "wrn",
    ico: "#f97316",
    icobg: "#fff7ed",
    icon: "send",
    name: "Send proposal — Hillman Inc",
    why: "Requested pricing 6 days ago · No follow-up sent",
    ai: "AI draft ready · 90 sec to review and send · deal going cold",
    time: "6d late",
    timecol: "#d97706",
    btn: "Send Now",
  },
  {
    id: "fi-route",
    urg: "inf",
    ico: "#7c3aed",
    icobg: "#f5f3ff",
    icon: "pin",
    name: "Visit 3 nearby hot leads",
    why: "Pinnacle · 101 Construction · TN Supply — all within 1.2 mi",
    ai: "Best time window right now · saves 42 min · $15k pipeline",
    time: "Today",
    timecol: "#9ca3af",
    btn: "Start Route",
  },
  {
    id: "fi-batch",
    urg: "inf",
    ico: "#7c3aed",
    icobg: "#f5f3ff",
    icon: "list",
    name: "Batch 8 quick follow-ups",
    why: "AI pre-wrote all replies · clear before 2pm meeting",
    ai: "6 ready to send · 3 need light edit · ~12 min total",
    time: "12 min",
    timecol: "#16a34a",
    btn: "Batch Mode",
  },
  {
    id: "fi-reengage",
    urg: "inf",
    ico: "#0891b2",
    icobg: "#ecfeff",
    icon: "refresh",
    name: "Re-engage Pete Owens — TN Supply Group",
    why: "21 days silent after quote · Marissa's deal stalled",
    ai: "AI personalised re-engagement draft ready",
    time: "21d",
    timecol: "#9ca3af",
    btn: "Re-engage",
  },
];
