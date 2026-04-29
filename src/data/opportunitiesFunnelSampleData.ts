/** Sample funnel / opportunities data for `/funnel/new/`. */

export type FunnelStageAccent = "blue" | "purple" | "orange" | "green" | "sky";

export type OpportunityCard = {
  id: string;
  title: string;
  category: string;
  created: string;
  value: number;
  score?: number;
  starred?: boolean;
};

export type FunnelColumn = {
  id: string;
  title: string;
  accent: FunnelStageAccent;
  count: number;
  columnTotal: number;
  cards: OpportunityCard[];
  moreCount: number;
};

export const funnelKpis = {
  pipelineValue: 1_797_049.0,
  pipelineTrend: 24.5,
  derivedValue: 642_180.0,
  derivedTrend: 12.1,
  conversionRate: 32.6,
  aiDealScoreAvg: 78,
};

export const funnelColumns: FunnelColumn[] = [
  {
    id: "commitment",
    title: "Commitment To Buy - 85%",
    accent: "blue",
    count: 4,
    columnTotal: 412_000,
    moreCount: 2,
    cards: [
      { id: "c1", title: "Acme Fleet Renewal", category: "New Sale", created: "Apr 2, 2026", value: 128_000, score: 85, starred: true },
      { id: "c2", title: "Metro HVAC Upgrade", category: "New Sale", created: "Mar 28, 2026", value: 94_000, score: 88 },
      { id: "c3", title: "Regional Parts Co.", category: "Upsell", created: "Mar 22, 2026", value: 190_000, score: 82 },
    ],
  },
  {
    id: "quote",
    title: "Quote - 70%",
    accent: "purple",
    count: 6,
    columnTotal: 298_400,
    moreCount: 3,
    cards: [
      { id: "q1", title: "GreenLeaf Foods RFP", category: "New Sale", created: "Apr 8, 2026", value: 76_400, score: 72 },
      { id: "q2", title: "Lopez Auto — 10 units", category: "New Sale", created: "Apr 5, 2026", value: 112_000, score: 70, starred: true },
      { id: "q3", title: "Shelterland Q2", category: "Renewal", created: "Apr 1, 2026", value: 110_000 },
    ],
  },
  {
    id: "discovery",
    title: "Discovery - 40%",
    accent: "orange",
    count: 8,
    columnTotal: 186_200,
    moreCount: 4,
    cards: [
      { id: "d1", title: "Keller Industries pilot", category: "New Sale", created: "Apr 10, 2026", value: 42_200 },
      { id: "d2", title: "Bay Area onboarding", category: "New Sale", created: "Apr 9, 2026", value: 54_000, score: 45 },
    ],
  },
  {
    id: "won",
    title: "Closed Won",
    accent: "green",
    count: 5,
    columnTotal: 521_900,
    moreCount: 1,
    cards: [
      { id: "w1", title: "Downtown HQ expansion", category: "New Sale", created: "Apr 12, 2026", value: 210_000, score: 92 },
      { id: "w2", title: "Westside Branch add-on", category: "Upsell", created: "Apr 6, 2026", value: 311_900, starred: true },
    ],
  },
  {
    id: "nurture",
    title: "Nurture / Long cycle",
    accent: "sky",
    count: 7,
    columnTotal: 98_550,
    moreCount: 5,
    cards: [
      { id: "n1", title: "Enterprise eval — Q3", category: "New Sale", created: "Mar 15, 2026", value: 48_550 },
      { id: "n2", title: "Partner co-marketing", category: "Partner", created: "Feb 20, 2026", value: 50_000 },
    ],
  },
];

export type ActivityItem = {
  id: string;
  tone: "success" | "info" | "muted";
  title: string;
  time: string;
};

export const funnelRecentActivity: ActivityItem[] = [
  { id: "a1", tone: "success", title: "Deal won — Westside Branch add-on", time: "2h ago" },
  { id: "a2", tone: "info", title: "New opportunity created — Keller Industries", time: "5h ago" },
  { id: "a3", tone: "info", title: "Stage updated — GreenLeaf Foods → Quote", time: "Yesterday" },
  { id: "a4", tone: "muted", title: "AI score recalculated — 12 deals", time: "Yesterday" },
];

export function formatUsd(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
