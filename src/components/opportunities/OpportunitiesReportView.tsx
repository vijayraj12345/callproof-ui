import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  ChevronDown,
  Clock,
  FileSpreadsheet,
  Filter,
  Flame,
  Link2,
  Mail,
  Phone,
  Rocket,
  Search,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
  AlertTriangle,
  Upload,
  Users,
} from "lucide-react";
import {
  computeReportInsightStrip,
  formatUsd,
  opportunitiesReportRows,
  type ConfidenceVisual,
  type OppReportSegment,
  type ReportOppRow,
  type StageTone,
  reportSegmentCounts,
} from "@/data/opportunitiesReportSampleData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PagedTableFooter } from "@/components/ui/paged-table-footer";
import { TableScrollViewport } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const ROWS_OPTIONS = [20, 50, 100] as const;

const reportHeaderRowClass = cn(
  "border-b border-white/20 bg-gradient-to-r from-[#094E9B] via-[#0d62c9] to-[#052d57]",
);

const reportThClass = cn(
  "min-w-0 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white sm:px-4",
);

/**
 * `w-full` + trailing `1fr` so the gradient header row spans the full card; `min-w-0` on tracks
 * avoids overflow. Parent uses `min-w-full w-max` so we still get horizontal scroll when the
 * grid is wider than the viewport.
 */
/** `lg:min-w-*` keeps horizontal scroll on narrow widths; `w-full` + `fr` fills the main column so no dead strip before the AI sidebar. */
const reportGridClass =
  "grid min-w-0 w-full grid-cols-[minmax(180px,1.15fr)_minmax(140px,1fr)_100px_130px_minmax(200px,1.3fr)_96px_minmax(220px,1fr)] gap-2 lg:min-w-[1096px]";

const SEGMENTS: { id: OppReportSegment | "all"; label: string; short: string; icon: typeof Flame; iconClass: string }[] = [
  { id: "hot", label: "Hot Deals (AI Predicted)", short: "Hot", icon: Flame, iconClass: "text-orange-500" },
  { id: "at_risk", label: "At Risk (Needs Attention)", short: "At risk", icon: AlertTriangle, iconClass: "text-amber-500" },
  { id: "stalled", label: "Stalled (No Activity)", short: "Stalled", icon: Clock, iconClass: "text-sky-600" },
  { id: "high_value", label: "High Value Focus (High Impact)", short: "High value", icon: Target, iconClass: "text-rose-600" },
  { id: "new", label: "New Opportunities (Recently Added)", short: "New", icon: Sprout, iconClass: "text-emerald-600" },
];

function initialsFromCompany(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function stageBadgeClasses(tone: StageTone): string {
  const map: Record<StageTone, string> = {
    purple: "border-violet-200 bg-violet-50 text-violet-900",
    orange: "border-orange-200 bg-orange-50 text-orange-950",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    sky: "border-sky-200 bg-sky-50 text-sky-900",
    rose: "border-rose-200 bg-rose-50 text-rose-900",
  };
  return map[tone];
}

function ringColor(v: ConfidenceVisual): string {
  if (v === "high") return "stroke-emerald-500";
  if (v === "medium") return "stroke-amber-500";
  return "stroke-rose-500";
}

function confidenceLabel(v: ConfidenceVisual): string {
  if (v === "high") return "High confidence";
  if (v === "medium") return "Medium";
  return "Low confidence";
}

function ConfidenceRing({ pct, visual }: { pct: number; visual: ConfidenceVisual }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <div className="flex items-center gap-2.5">
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90 shrink-0" aria-hidden>
        <circle cx="24" cy="24" r={r} fill="none" className="stroke-muted/50" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          className={ringColor(visual)}
          strokeWidth="4"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="min-w-0">
        <p className="text-sm font-bold tabular-nums text-foreground">{pct}%</p>
        <p className="text-[11px] font-medium text-muted-foreground">{confidenceLabel(visual)}</p>
      </div>
    </div>
  );
}

function InsightIcon({ trend }: { trend: ReportOppRow["insightTrend"] }) {
  if (trend === "positive") return <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />;
  if (trend === "warning") return <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />;
  return <ArrowDownRight className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden />;
}

function OpportunityReportRowCard({ r }: { r: ReportOppRow }) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:hover:bg-muted/20">
      <div className={cn("grid gap-4", reportGridClass, "lg:items-center lg:gap-2 lg:px-2 lg:py-4")}>
        <div className="flex min-w-0 gap-3 border-b border-border/40 pb-3 lg:border-b-0 lg:pb-0">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-bold text-foreground ring-1 ring-border/60"
            aria-hidden
          >
            {initialsFromCompany(r.companyName)}
          </div>
          <div className="min-w-0">
            <p className="lg:hidden text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Opportunity / Account</p>
            <h3 className="break-words font-bold leading-snug text-foreground">{r.companyName}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{r.opportunityId}</p>
          </div>
        </div>

        <div className="min-w-0 border-b border-border/40 pb-3 lg:border-b-0 lg:pb-0">
          <p className="lg:hidden text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Stage / Type</p>
          <Badge variant="outline" className={cn("font-semibold", stageBadgeClasses(r.stageTone))}>
            {r.stageLabel} — {r.stagePct}%
          </Badge>
          <p className="mt-1.5 break-words text-xs text-muted-foreground">{r.saleType}</p>
        </div>

        <div className="min-w-0 border-b border-border/40 pb-3 lg:border-b-0 lg:pb-0">
          <p className="lg:hidden text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Value</p>
          <p className="font-mono text-sm font-bold tabular-nums text-foreground">{formatUsd(r.value)}</p>
        </div>

        <div className="min-w-0 border-b border-border/40 pb-3 lg:border-b-0 lg:pb-0">
          <p className="lg:hidden text-[10px] font-bold uppercase tracking-wide text-muted-foreground">AI Confidence</p>
          <ConfidenceRing pct={r.confidencePct} visual={r.confidenceVisual} />
        </div>

        <div className="min-w-0 border-b border-border/40 pb-3 lg:border-b-0 lg:pb-0">
          <p className="lg:hidden text-[10px] font-bold uppercase tracking-wide text-muted-foreground">AI Insight</p>
          <div className="flex min-w-0 gap-2">
            <InsightIcon trend={r.insightTrend} />
            <p className="min-w-0 break-words text-sm leading-snug text-foreground">{r.aiInsight}</p>
          </div>
          <p className="mt-1 text-[11px] italic text-muted-foreground">AI suggests acting within 24h on priority signals.</p>
        </div>

        <div className="min-w-0 border-b border-border/40 pb-3 lg:border-b-0 lg:pb-0">
          <p className="lg:hidden text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Engagement</p>
          <svg viewBox="0 0 72 24" className="h-8 w-full max-w-[88px]" aria-hidden>
            <polyline
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={r.sparkPts}
              className={r.insightTrend === "risk" ? "stroke-rose-500" : "stroke-primary"}
            />
          </svg>
          <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Mail className="size-3.5 text-primary" />
              {r.emails7d} emails
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="size-3.5 text-primary" />
              {r.calls7d} calls
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2 lg:min-w-0">
          <p className="lg:hidden text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Next best action</p>
          <div className="inline-flex w-full max-w-[220px] rounded-md shadow-sm">
            <Button
              type="button"
              size="sm"
              className="h-9 flex-1 gap-1 rounded-r-none gradient-primary px-3 text-primary-foreground"
              onClick={() => toast.success("Call scheduled (demo)")}
            >
              <Phone className="size-3.5" />
              Schedule Call
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  className="h-9 rounded-l-none border-l border-primary-foreground/25 px-2 gradient-primary text-primary-foreground"
                  aria-label="More actions"
                >
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => toast.message("Follow-up email")}>Send follow-up</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.message("Log touch")}>Log touch</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.message("Snooze")}>Snooze 3 days</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <button
            type="button"
            className="text-left text-xs font-semibold text-primary hover:underline"
            onClick={() => toast.success("AI message draft (demo)")}
          >
            AI Message
          </button>
        </div>
      </div>
    </article>
  );
}

export function OpportunitiesReportView() {
  const [rows] = useState<ReportOppRow[]>(opportunitiesReportRows);
  const [segment, setSegment] = useState<OppReportSegment | "all">("hot");
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");

  const counts = useMemo(() => reportSegmentCounts(rows), [rows]);
  const strip = useMemo(() => computeReportInsightStrip(rows), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (segment !== "all" && r.segment !== segment) return false;
      if (!q) return true;
      return `${r.companyName} ${r.opportunityId} ${r.stageLabel} ${r.aiInsight}`.toLowerCase().includes(q);
    });
  }, [rows, segment, search]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);
  const summaryFrom = total === 0 ? 0 : start + 1;
  const summaryTo = Math.min(start + rowsPerPage, total);

  const hotPreview = useMemo(() => rows.filter((r) => r.segment === "hot").slice(0, 3), [rows]);

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 xl:flex-row xl:items-stretch">
      <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-y-auto overflow-x-hidden">
        <header className="relative overflow-hidden rounded-2xl border border-primary/15 p-4 shadow-soft sm:p-5">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-violet-500/[0.07] to-accent/[0.12]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent dark:via-white/[0.05]"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-1 size-6 shrink-0 text-primary" aria-hidden />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">Opportunities Report</h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  AI-powered insights to help you focus on the right opportunities and close more deals.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" className="gap-2 border-border/80 bg-card" onClick={() => toast.message("Import (demo)")}>
                <Upload className="size-4" />
                Import Opportunities
              </Button>
              <Button type="button" className="gap-2 gradient-primary text-primary-foreground shadow-glow" onClick={() => toast.success("Rep update sent (demo)")}>
                <Users className="size-4" />
                Rep Update
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" className="gap-1 border-border/80 bg-card">
                    Quick Links
                    <ChevronDown className="size-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => toast.message("Pipeline dashboard")}>Pipeline dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.message("Forecast sheet")}>Forecast sheet</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.message("Admin settings")}>Report settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="outline" size="icon" className="border-border/80 bg-card" aria-label="Filters" onClick={() => setFilterOpen(true)}>
                    <Filter className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filters</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* AI Insights strip */}
        <section className="rounded-2xl border border-border/80 bg-[#F9FAFB] p-4 shadow-sm dark:bg-muted/20 sm:p-5" aria-label="AI insights">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">AI Insights</h2>
            <Button type="button" variant="outline" size="sm" className="gap-2 border-primary/30 text-primary" onClick={() => toast.success("Opening AI summary (demo)")}>
              <Sparkles className="size-4" />
              View AI Summary
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border-border/60 bg-card shadow-sm">
              <CardContent className="flex gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-600">
                  <Rocket className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-foreground">{strip.likelyCloseCount} deals likely to close today</p>
                  <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{formatUsd(strip.likelyCloseValue)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card shadow-sm">
              <CardContent className="flex gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                  <AlertTriangle className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-foreground">{strip.atRiskCount} opportunities at risk</p>
                  <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{formatUsd(strip.atRiskValue)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card shadow-sm">
              <CardContent className="flex gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                  <TrendingUp className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-foreground">Potential revenue +{strip.upliftPct}%</p>
                  <p className="mt-1 text-xs text-muted-foreground">If you take suggested actions.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card shadow-sm">
              <CardContent className="flex gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-600">
                  <Sparkles className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-foreground">Best time to reach out</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{strip.bestReachOut}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Smart priority + search */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={segment === "all" ? "default" : "outline"}
              className={cn("h-9 rounded-full px-3.5", segment === "all" && "gradient-primary text-primary-foreground")}
              onClick={() => {
                setSegment("all");
                setPage(1);
              }}
            >
              All ({counts.all})
            </Button>
            {SEGMENTS.map((s) => {
              const Icon = s.icon;
              const active = segment === s.id;
              const n = counts[s.id];
              return (
                <Button
                  key={s.id}
                  type="button"
                  size="sm"
                  variant={active ? "default" : "outline"}
                  className={cn(
                    "h-9 gap-1.5 rounded-full border-border/80 px-3.5",
                    active && "gradient-primary border-transparent text-primary-foreground shadow-sm",
                  )}
                  onClick={() => {
                    setSegment(s.id);
                    setPage(1);
                  }}
                >
                  <Icon className={cn("size-4", active ? "text-primary-foreground" : s.iconClass)} />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.short}</span>
                  <span className={cn("tabular-nums opacity-90", active && "text-primary-foreground/90")}>({n})</span>
                </Button>
              );
            })}
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:min-w-[320px]">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search opportunities…"
                className="border-border/80 bg-card pl-9"
              />
            </div>
            <Button type="button" variant="outline" className="shrink-0 border-border/80 bg-card" onClick={() => setFilterOpen(true)}>
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Goals-style card: horizontal scroll only above footer; pb reserves space so the scrollbar does not sit on the last row */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="hidden min-w-0 lg:block">
            <TableScrollViewport label="Opportunities report" className="w-full min-w-0 pb-4">
              <div className="w-full min-w-0">
                <div className={cn("overflow-hidden", reportGridClass, reportHeaderRowClass)}>
                  <div className={reportThClass}>Opportunity / Account</div>
                  <div className={reportThClass}>Stage / Type</div>
                  <div className={reportThClass}>Value</div>
                  <div className={reportThClass}>AI Confidence</div>
                  <div className={reportThClass}>AI Insight</div>
                  <div className={reportThClass}>Engagement</div>
                  <div className={reportThClass}>Next best action</div>
                </div>
                {pageRows.length === 0 ? (
                  <div className="border-t border-border/60 px-4 py-16 text-center text-sm text-muted-foreground">
                    No opportunities in this segment.
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {pageRows.map((r) => (
                      <OpportunityReportRowCard key={r.id} r={r} />
                    ))}
                  </div>
                )}
              </div>
            </TableScrollViewport>
          </div>

          <div className="space-y-3 p-3 lg:hidden">
            {pageRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">
                No opportunities in this segment.
              </div>
            ) : (
              pageRows.map((r) => <OpportunityReportRowCard key={r.id} r={r} />)
            )}
          </div>

          <div className="shrink-0 border-t border-border bg-muted/5">
            <PagedTableFooter
              embedded
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(n) => {
                setRowsPerPage(n);
                setPage(1);
              }}
              rowOptions={ROWS_OPTIONS}
              summaryFrom={summaryFrom}
              summaryTo={summaryTo}
              total={total}
              page={safePage}
              pageCount={pageCount}
              onPageChange={setPage}
              aria-label="Opportunities report pagination"
            >
              <Button type="button" variant="outline" size="sm" className="gap-2 border-border/80 bg-card" onClick={() => toast.success("Export started (demo)")}>
                <FileSpreadsheet className="size-4" />
                Export Report
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-2 border-border/80 bg-card" onClick={() => toast.message("Schedule exports")}>
                <CalendarClock className="size-4" />
                Schedule Exports
              </Button>
            </PagedTableFooter>
          </div>
        </div>
      </div>

      {/* AI Assistant — right panel (desktop) */}
      <aside className="flex w-full shrink-0 flex-col gap-3 xl:sticky xl:top-4 xl:w-[340px] xl:min-w-[340px] xl:max-w-[340px]">
        <Card className="overflow-hidden rounded-2xl border-border/80 shadow-soft">
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <span className="font-bold">AI Assistant</span>
            </div>
            <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" aria-label="Minimize" onClick={() => toast.message("Panel pinned (demo)")}>
              <ChevronDown className="size-4 rotate-180" />
            </Button>
          </div>
          <CardContent className="space-y-4 p-4">
            <p className="text-sm text-foreground">
              Hi James <span aria-hidden>👋</span> How can I help you today?
            </p>
            <div className="space-y-2">
              {[
                "Which deals should I focus on today?",
                "Why is this deal at risk?",
                "Generate closing strategy for this deal.",
                "Show me revenue forecast for this month.",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  className="w-full rounded-xl border border-border/70 bg-card px-3 py-2.5 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => toast.message(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3">
              <p className="text-xs font-bold text-primary">Focus on {hotPreview.length} hot deals</p>
              <div className="mt-2 flex items-center gap-1">
                {hotPreview.map((h) => (
                  <div
                    key={h.id}
                    className="flex size-8 items-center justify-center rounded-full border border-border bg-muted text-[10px] font-bold text-foreground"
                    title={h.companyName}
                  >
                    {initialsFromCompany(h.companyName)}
                  </div>
                ))}
              </div>
              <Button type="button" size="sm" className="mt-3 w-full gap-2 gradient-primary text-primary-foreground" onClick={() => setSegment("hot")}>
                View Hot Deals
              </Button>
            </div>
            <div className="relative">
              <Textarea
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                placeholder="Ask anything…"
                className="min-h-[88px] resize-none border-border/80 pr-12 text-sm"
              />
              <Button
                type="button"
                size="icon"
                className="absolute bottom-2 right-2 size-9 gradient-primary text-primary-foreground shadow-sm"
                aria-label="Send"
                onClick={() => toast.success("AI is thinking… (demo)")}
              >
                <Sparkles className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-4 text-center text-xs text-muted-foreground">
          <Link2 className="mx-auto mb-2 size-5 opacity-50" />
          Quick links to Goals and pipeline are available from the Sales menu.
        </Card>
      </aside>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent className="flex flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Report filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4 px-1">
            <div className="space-y-2">
              <Label>Minimum value</Label>
              <Input type="text" placeholder="$0" disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Rep</Label>
              <Input type="text" placeholder="All reps" disabled className="bg-muted/50" />
            </div>
          </div>
          <SheetFooter className="mt-auto">
            <Button type="button" className="gradient-primary w-full text-primary-foreground" onClick={() => setFilterOpen(false)}>
              Apply (demo)
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
