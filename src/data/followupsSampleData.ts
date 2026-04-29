/** Sample tasks / follow-ups for `/followups/`. */

export { formatUsd } from "@/data/opportunitiesFunnelSampleData";

export type TaskBucket = "overdue" | "due_today" | "upcoming" | "completed";

export type TaskPriority = "high" | "medium";

export type AiTone = "success" | "warning" | "risk";

export type TaskTypeIcon = "visit" | "call" | "email";

export type FollowupTaskRow = {
  id: string;
  repName: string;
  repRole: string;
  taskTitle: string;
  scheduledDisplay: string;
  hasNotes: boolean;
  taskType: string;
  taskTypeIcon: TaskTypeIcon;
  accountName: string;
  accountAddress: string;
  priority: TaskPriority;
  bucket: TaskBucket;
  dueBadge: string;
  aiInsight: string;
  aiSubtext: string;
  aiTone: AiTone;
  dealValue: number;
  winProbabilityPct: number;
  lastContact: string;
  nextFollowUp: string;
  panelAiSummary: string;
  panelCallSummary: string;
  panelObjections: string;
  panelPitch: string;
  healthScore: number;
};

const reps = [
  { name: "Jordan Lee", role: "Account Executive" },
  { name: "Sam Rivera", role: "Sales Rep" },
  { name: "Alex Morgan", role: "Regional Manager" },
  { name: "Taylor Brooks", role: "SDR" },
];

const accounts = [
  { name: "App Innovation Technologies", addr: "1200 Market St, San Francisco CA 94103" },
  { name: "Northwind Traders", addr: "400 Commerce Rd, Austin TX 78701" },
  { name: "Sterling Equipment Co.", addr: "88 Industrial Pkwy, Cleveland OH 44114" },
  { name: "BlueRiver Analytics", addr: "9 Harbor View, Boston MA 02110" },
];

const titles = [
  "Follow up on proposal",
  "Confirm demo attendance",
  "Send contract revision",
  "Check-in after pilot week",
  "Renewal pricing discussion",
  "Stakeholder intro call",
];

function buildTasks(): FollowupTaskRow[] {
  const buckets: TaskBucket[] = [
    ...Array(5).fill("overdue"),
    ...Array(3).fill("due_today"),
    ...Array(4).fill("upcoming"),
    ...Array(12).fill("completed"),
  ] as TaskBucket[];

  return buckets.map((bucket, i) => {
    const rep = reps[i % reps.length];
    const acct = accounts[i % accounts.length];
    const priority: TaskPriority = bucket === "overdue" || (bucket === "due_today" && i % 2 === 0) ? "high" : i % 3 === 0 ? "high" : "medium";
    const dueBadges: Record<TaskBucket, string> = {
      overdue: "Overdue",
      due_today: i % 2 === 0 ? "Due in 2h 15m" : "Due today 4:30 PM",
      upcoming: "Due in 3 days",
      completed: "Completed",
    };

    const insights: { insight: string; sub: string; tone: AiTone }[] = [
      { insight: "Client opened proposal 3 times in last 2 days", sub: "Strong buying signal", tone: "success" },
      { insight: "Follow-up overdue by 2 days", sub: "Action suggested", tone: "warning" },
      { insight: "Competitor mentioned in last conversation", sub: "Objection handling needed", tone: "warning" },
      { insight: "Engagement trending up on email thread", sub: "Momentum building", tone: "success" },
      { insight: "No logged activity in 5 days", sub: "Re-engage recommended", tone: "risk" },
    ];
    const pick = insights[i % insights.length];

    const healthScore = bucket === "completed" ? 70 + (i % 25) : 55 + (i % 35);

    return {
      id: `task-${String(i + 1).padStart(3, "0")}`,
      repName: rep.name,
      repRole: rep.role,
      taskTitle: titles[i % titles.length],
      scheduledDisplay: bucket === "completed" ? `Completed Apr ${20 + (i % 8)}, 2026` : `Apr 29, 2026 · ${9 + (i % 8)}:${(i % 2) * 30}0 AM`,
      hasNotes: i % 2 === 0,
      taskType: i % 3 === 0 ? "Regular Visit" : i % 3 === 1 ? "Phone Follow-up" : "Email Touch",
      taskTypeIcon: (["visit", "call", "email"] as const)[i % 3],
      accountName: acct.name,
      accountAddress: acct.addr,
      priority,
      bucket,
      dueBadge: dueBadges[bucket],
      aiInsight: pick.insight,
      aiSubtext: pick.sub,
      aiTone: pick.tone,
      dealValue: 4200 + (i % 8) * 3400,
      winProbabilityPct: 55 + (i % 35),
      lastContact: `Apr ${25 + (i % 4)}, 2026`,
      nextFollowUp: bucket === "completed" ? "—" : `Apr ${30 + (i % 3)}, 2026`,
      panelAiSummary:
        "This opportunity shows strong buying signals from recent proposal views and positive reply latency. Recommend scheduling the next call within 24 hours while intent is elevated.",
      panelCallSummary:
        "Last call covered budget timeline and technical requirements. Champion aligned on pilot scope; finance still needs ROI worksheet.",
      panelObjections:
        "Price sensitivity vs. incumbent, security review timeline, and secondary stakeholder not yet engaged.",
      panelPitch:
        "Lead with ROI snapshot tied to their Q3 goals, offer a 15-min security FAQ with your specialist, and propose a concrete pilot start date.",
      healthScore,
    };
  });
}

export const followupsSampleTasks: FollowupTaskRow[] = buildTasks();

export type FollowupFilterTab = "all" | "high_priority" | "overdue" | "due_today" | "upcoming" | "completed";

export function isTaskDone(row: FollowupTaskRow, completedMap: Record<string, boolean>): boolean {
  if (Object.prototype.hasOwnProperty.call(completedMap, row.id)) return completedMap[row.id];
  return row.bucket === "completed";
}

export function taskMatchesTab(row: FollowupTaskRow, tab: FollowupFilterTab, completedMap: Record<string, boolean>): boolean {
  const done = isTaskDone(row, completedMap);

  switch (tab) {
    case "all":
      return true;
    case "high_priority":
      return row.priority === "high" && !done;
    case "overdue":
      return !done && row.bucket === "overdue";
    case "due_today":
      return !done && row.bucket === "due_today";
    case "upcoming":
      return !done && row.bucket === "upcoming";
    case "completed":
      return done;
    default:
      return true;
  }
}

export function computeFollowupStripMetrics(
  rows: FollowupTaskRow[],
  completedMap: Record<string, boolean>,
): {
  highPriority: number;
  dueToday: number;
  overdue: number;
  completed: number;
  revenueOpportunity: number;
  completedTrendPct: number;
} {
  const openRows = rows.filter((r) => !isTaskDone(r, completedMap));
  const highPriority = openRows.filter((r) => r.priority === "high").length;
  const dueToday = rows.filter((r) => !isTaskDone(r, completedMap) && r.bucket === "due_today").length;
  const overdue = rows.filter((r) => !isTaskDone(r, completedMap) && r.bucket === "overdue").length;
  const completed = rows.filter((r) => isTaskDone(r, completedMap)).length;
  const revenueOpportunity = openRows.reduce((s, r) => s + r.dealValue, 0);
  return {
    highPriority,
    dueToday,
    overdue,
    completed,
    revenueOpportunity,
    completedTrendPct: 25,
  };
}

export function tabCounts(rows: FollowupTaskRow[], completedMap: Record<string, boolean>): Record<FollowupFilterTab, number> {
  const tabs: FollowupFilterTab[] = ["all", "high_priority", "overdue", "due_today", "upcoming", "completed"];
  const out = {} as Record<FollowupFilterTab, number>;
  for (const t of tabs) {
    out[t] = rows.filter((r) => taskMatchesTab(r, t, completedMap)).length;
  }
  return out;
}
