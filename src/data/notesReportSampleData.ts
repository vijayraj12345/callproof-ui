/** Sample rows for Notes Report (`/contacts/notes/report`). */

export type NotesReportTab = "all" | "ai_summarized" | "action_items" | "mentions" | "follow_up";

export type NoteSource = "Appointment" | "Event Form" | "Call";

export type InsightTone = "success" | "warning" | "risk";

export type NoteReportRow = {
  id: string;
  repName: string;
  repRole: string;
  accountName: string;
  aiSummary: string;
  isAiSummarized: boolean;
  hasActionItem: boolean;
  hasMention: boolean;
  needsFollowUp: boolean;
  dateLabel: string;
  source: NoteSource;
  aiInsight: string;
  insightImpact: "High impact" | "Medium impact" | "Lower impact";
  insightTone: InsightTone;
};

const reps = [
  { name: "AITECH AIT", role: "Sales Rep" },
  { name: "Jordan Lee", role: "Account Executive" },
  { name: "Sam Rivera", role: "Regional Manager" },
];

const accounts = [
  "Shivalaya Costumes",
  "ChaChicandy LLC",
  "AACC INC",
  "Northwind Traders",
  "BlueRiver Analytics",
  "Sterling Equipment Co.",
];

const summaries = [
  "Customer reported intermittent call drops after last update. Asked for callback once engineering confirms patch timeline.",
  "Discussed Q2 expansion seats and pricing guardrails. Champion wants ROI one-pager before legal review.",
  "Follow-up required: remove duplicate contacts from parent account and confirm billing address for PO.",
  "Positive sentiment on pilot; scheduling onsite walkthrough next week. Flag pricing approval before quote send.",
  "Mentioned competitor pricing; recommended value story and reference call with similar vertical.",
];

const insights: { text: string; impact: NoteReportRow["insightImpact"]; tone: InsightTone }[] = [
  { text: "Issue reported / Requires follow-up", impact: "High impact", tone: "success" },
  { text: "Action required / Remove contacts", impact: "Medium impact", tone: "warning" },
  { text: "High signal on pricing keywords", impact: "High impact", tone: "risk" },
  { text: "Follow-up window closing soon", impact: "Medium impact", tone: "warning" },
];

const sources: NoteSource[] = ["Appointment", "Event Form", "Call"];

function buildRows(count: number): NoteReportRow[] {
  const rows: NoteReportRow[] = [];
  for (let i = 0; i < count; i++) {
    const h = ((i * 17) % 97) / 97;
    const ins = insights[i % insights.length];
    rows.push({
      id: `note-${String(i + 1).padStart(4, "0")}`,
      repName: reps[i % reps.length].name,
      repRole: reps[i % reps.length].role,
      accountName: accounts[i % accounts.length],
      aiSummary: summaries[i % summaries.length],
      isAiSummarized: h > 0.22,
      hasActionItem: h > 0.55,
      hasMention: h > 0.35,
      needsFollowUp: h > 0.45,
      dateLabel: `Apr ${20 + (i % 10)}, 2026, ${9 + (i % 4)}:${(i % 2) * 30}0 ${i % 2 === 0 ? "a.m." : "p.m."}`,
      source: sources[i % sources.length],
      aiInsight: ins.text,
      insightImpact: ins.impact,
      insightTone: ins.tone,
    });
  }
  return rows;
}

export const notesReportSampleRows: NoteReportRow[] = buildRows(52);

export function noteMatchesTab(row: NoteReportRow, tab: NotesReportTab): boolean {
  switch (tab) {
    case "all":
      return true;
    case "ai_summarized":
      return row.isAiSummarized;
    case "action_items":
      return row.hasActionItem;
    case "mentions":
      return row.hasMention;
    case "follow_up":
      return row.needsFollowUp;
    default:
      return true;
  }
}

export function tabCounts(rows: NoteReportRow[]): Record<NotesReportTab, number> {
  return {
    all: rows.length,
    ai_summarized: rows.filter((r) => r.isAiSummarized).length,
    action_items: rows.filter((r) => r.hasActionItem).length,
    mentions: rows.filter((r) => r.hasMention).length,
    follow_up: rows.filter((r) => r.needsFollowUp).length,
  };
}

export type NotesReportKpiStrip = {
  totalNotes: number;
  totalTrendPct: number;
  aiSummaries: number;
  aiTrendPct: number;
  actionItems: number;
  actionTrendPct: number;
  mentions: number;
  topKeywords: string;
  followUpNotes: number;
  followUpTrendPct: number;
};

export function computeNotesReportKpis(rows: NoteReportRow[]): NotesReportKpiStrip {
  const c = tabCounts(rows);
  return {
    totalNotes: c.all,
    totalTrendPct: 18.6,
    aiSummaries: c.ai_summarized,
    aiTrendPct: 24.3,
    actionItems: c.action_items,
    actionTrendPct: 16.8,
    mentions: c.mentions,
    topKeywords: "Issue, Follow-up, Pricing",
    followUpNotes: c.follow_up,
    followUpTrendPct: 20.4,
  };
}
