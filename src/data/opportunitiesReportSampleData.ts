/** Sample data for Opportunities Report (`/funnel/opps/`). */

export { formatUsd } from "@/data/opportunitiesFunnelSampleData";

export type OppReportSegment = "hot" | "at_risk" | "stalled" | "high_value" | "new";

export type InsightTrend = "positive" | "warning" | "risk";

export type StageTone = "purple" | "orange" | "emerald" | "sky" | "rose";

export type ConfidenceVisual = "high" | "medium" | "low";

export type ReportOppRow = {
  id: string;
  companyName: string;
  opportunityId: string;
  stageLabel: string;
  stagePct: number;
  stageTone: StageTone;
  saleType: string;
  value: number;
  segment: OppReportSegment;
  confidencePct: number;
  confidenceVisual: ConfidenceVisual;
  aiInsight: string;
  insightTrend: InsightTrend;
  /** SVG polyline points viewBox 0 0 72 24 */
  sparkPts: string;
  emails7d: number;
  calls7d: number;
};

const companies = [
  "App Innovation Technologies",
  "Northwind Traders",
  "Sterling Equipment Co.",
  "BlueRiver Analytics",
  "Summit Healthcare Partners",
  "Lakeside Manufacturing",
  "Vertex Cloud Services",
  "Harbor Freight Logistics",
  "Catalyst Education Group",
  "Ironwood Construction",
  "Meridian Retail Holdings",
  "BrightPath Solar",
];

const stagePool: Record<OppReportSegment, { label: string; pct: number; tone: StageTone; sale: string }[]> = {
  hot: [
    { label: "Negotiation", pct: 85, tone: "orange", sale: "Account Growth Sale" },
    { label: "Commitment To Buy", pct: 88, tone: "orange", sale: "New Sale" },
    { label: "Quote", pct: 72, tone: "purple", sale: "Upsell" },
  ],
  at_risk: [
    { label: "Nurturing Lead", pct: 25, tone: "purple", sale: "New Sale" },
    { label: "Discovery", pct: 40, tone: "sky", sale: "Pilot Program" },
  ],
  stalled: [
    { label: "Proposal", pct: 55, tone: "sky", sale: "Renewal" },
    { label: "Qualification", pct: 35, tone: "purple", sale: "Cross-sell" },
  ],
  high_value: [
    { label: "Negotiation", pct: 90, tone: "orange", sale: "Enterprise Expansion" },
    { label: "Quote", pct: 78, tone: "purple", sale: "Multi-year Agreement" },
  ],
  new: [
    { label: "New Lead", pct: 12, tone: "emerald", sale: "Inbound" },
    { label: "Discovery", pct: 22, tone: "sky", sale: "Partner referral" },
  ],
};

const insights: Record<InsightTrend, string[]> = {
  positive: [
    "Client opened proposal 3 times in last 2 days",
    "High intent detected from last call transcript",
    "Champion replied within 1 hour — momentum strong",
  ],
  warning: [
    "No activity in last 7 days",
    "Meeting rescheduled twice — confirm interest",
    "Pricing doc viewed but no reply yet",
  ],
  risk: [
    "Low engagement / risk of drop",
    "Competitor mentioned on last call",
    "Budget owner ghosting after demo",
  ],
};

const sparks = [
  "0,18 12,14 24,16 36,8 48,12 60,4 72,6",
  "0,8 12,12 24,6 36,14 48,10 60,16 72,12",
  "0,14 12,20 24,16 36,22 48,18 60,20 72,16",
];

function hash(n: number): number {
  return ((n * 7919) % 1000) / 1000;
}

function segmentList(): OppReportSegment[] {
  return [
    ...Array(12).fill("hot"),
    ...Array(5).fill("at_risk"),
    ...Array(8).fill("stalled"),
    ...Array(9).fill("high_value"),
    ...Array(7).fill("new"),
  ] as OppReportSegment[];
}

function buildRows(): ReportOppRow[] {
  const segs = segmentList();
  return segs.map((segment, i) => {
    const pool = stagePool[segment];
    const st = pool[i % pool.length];
    const h = hash(i + 1);
    const value = Math.round(18_000 + h * 380_000 + (segment === "high_value" ? 120_000 : 0));
    let confidenceVisual: ConfidenceVisual = "medium";
    let confidencePct = 55 + Math.round(h * 35);
    if (segment === "hot") {
      confidenceVisual = "high";
      confidencePct = 78 + (i % 15);
    } else if (segment === "at_risk" || segment === "stalled") {
      confidenceVisual = i % 2 === 0 ? "medium" : "low";
      confidencePct = segment === "at_risk" ? 38 + (i % 20) : 32 + (i % 18);
    } else if (segment === "new") {
      confidenceVisual = "medium";
      confidencePct = 48 + (i % 25);
    } else {
      confidenceVisual = "high";
      confidencePct = 72 + (i % 12);
    }

    let insightTrend: InsightTrend = "positive";
    if (segment === "at_risk" || segment === "stalled") insightTrend = i % 2 === 0 ? "warning" : "risk";
    if (segment === "hot" || segment === "high_value") insightTrend = i % 3 === 0 ? "warning" : "positive";

    const aiInsight = insights[insightTrend][i % insights[insightTrend].length];

    return {
      id: `opp-rpt-${String(i + 1).padStart(3, "0")}`,
      companyName: companies[i % companies.length] + (i >= companies.length ? ` (${Math.floor(i / companies.length) + 1})` : ""),
      opportunityId: `OP-${8600 + i}`,
      stageLabel: st.label,
      stagePct: st.pct,
      stageTone: st.tone,
      saleType: st.sale,
      value,
      segment,
      confidencePct: Math.min(99, confidencePct),
      confidenceVisual,
      aiInsight,
      insightTrend,
      sparkPts: sparks[i % sparks.length],
      emails7d: 1 + (i % 9),
      calls7d: i % 6,
    };
  });
}

export const opportunitiesReportRows: ReportOppRow[] = buildRows();

export function reportSegmentCounts(rows: ReportOppRow[]) {
  const c: Record<OppReportSegment | "all", number> = {
    all: rows.length,
    hot: 0,
    at_risk: 0,
    stalled: 0,
    high_value: 0,
    new: 0,
  };
  for (const r of rows) c[r.segment]++;
  return c;
}

/** Top strip metrics derived from rows (demo-quality). */
export function computeReportInsightStrip(rows: ReportOppRow[]) {
  const hot = rows.filter((r) => r.segment === "hot").sort((a, b) => b.confidencePct - a.confidencePct);
  const atRisk = rows.filter((r) => r.segment === "at_risk");
  const top3 = hot.slice(0, 3);
  const likelyCloseValue = top3.reduce((s, r) => s + r.value, 0);
  const atRiskValue = atRisk.reduce((s, r) => s + r.value, 0);
  return {
    likelyCloseCount: top3.length,
    likelyCloseValue,
    atRiskCount: atRisk.length,
    atRiskValue,
    upliftPct: 18,
    bestReachOut: "Today, 2:00 PM – 4:00 PM",
  };
}
