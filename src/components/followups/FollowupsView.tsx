import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Building2,
  CalendarClock,
  CheckCircle2,
  FileSpreadsheet,
  Filter,
  LayoutGrid,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import {
  computeFollowupStripMetrics,
  followupsSampleTasks,
  formatUsd,
  isTaskDone,
  tabCounts,
  taskMatchesTab,
  type FollowupFilterTab,
  type FollowupTaskRow,
} from "@/data/followupsSampleData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PagedTableFooter } from "@/components/ui/paged-table-footer";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ROWS_OPTIONS = [20, 50, 100] as const;

const headerRowClass = cn(
  "border-b border-white/20 bg-gradient-to-r from-[#094E9B] via-[#0d62c9] to-[#052d57]",
);

const thClass = cn("px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white sm:px-4");

const FILTER_TABS: { id: FollowupFilterTab; label: string }[] = [
  { id: "all", label: "All Tasks" },
  { id: "high_priority", label: "High Priority" },
  { id: "overdue", label: "Overdue" },
  { id: "due_today", label: "Due Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
];

function initials(name: string): string {
  const p = name.split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[1][0]).toUpperCase();
}

function StripSpark({ stroke }: { stroke: string }) {
  const pts = "0,14 8,10 16,12 24,6 32,8 40,4 48,6";
  return (
    <svg viewBox="0 0 48 16" className="mt-2 h-6 w-full max-w-[100px]" aria-hidden>
      <polyline fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} className={cn("fill-none", stroke)} />
    </svg>
  );
}

function TypeIcon({ t }: { t: FollowupTaskRow["taskTypeIcon"] }) {
  const cls = "size-4 text-primary";
  if (t === "visit") return <MapPin className={cls} />;
  if (t === "call") return <Phone className={cls} />;
  return <Mail className={cls} />;
}

function aiSubClass(tone: FollowupTaskRow["aiTone"]): string {
  if (tone === "success") return "text-emerald-600";
  if (tone === "warning") return "text-amber-600";
  return "text-rose-600";
}

function HealthGauge({ score }: { score: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={r} fill="none" className="stroke-muted/40" strokeWidth="8" />
          <circle cx="50" cy="50" r={r} fill="none" className="stroke-primary" strokeWidth="8" strokeDasharray={`${dash} ${c}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black tabular-nums text-foreground">{score}</span>
          <span className="text-[10px] font-semibold text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className={cn("text-xs font-semibold", score >= 70 ? "text-emerald-600" : score >= 45 ? "text-amber-600" : "text-rose-600")}>
        {score >= 70 ? "Healthy" : score >= 45 ? "Watch" : "At risk"}
      </span>
    </div>
  );
}

export function FollowupsView() {
  const [rows] = useState<FollowupTaskRow[]>(followupsSampleTasks);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [filterTab, setFilterTab] = useState<FollowupFilterTab>("all");
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [layoutNote, setLayoutNote] = useState<"comfort" | "compact">("comfort");

  const strip = useMemo(() => computeFollowupStripMetrics(rows, completedMap), [rows, completedMap]);
  const counts = useMemo(() => tabCounts(rows, completedMap), [rows, completedMap]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (!taskMatchesTab(r, filterTab, completedMap)) return false;
      if (!q) return true;
      return `${r.repName} ${r.taskTitle} ${r.accountName} ${r.aiInsight}`.toLowerCase().includes(q);
    });
  }, [rows, filterTab, completedMap, search]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);
  const summaryFrom = total === 0 ? 0 : start + 1;
  const summaryTo = Math.min(start + rowsPerPage, total);

  const selected = selectedId ? rows.find((r) => r.id === selectedId) ?? null : null;

  const highPreview = useMemo(() => rows.filter((r) => r.priority === "high" && !isTaskDone(r, completedMap)).slice(0, 3), [rows, completedMap]);

  const setDone = (id: string, done: boolean) => {
    setCompletedMap((m) => ({ ...m, [id]: done }));
    if (done) toast.success("Task marked complete");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 pb-4 xl:flex-row xl:items-start">
      <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto">
        <header className="relative overflow-hidden rounded-2xl border border-primary/15 p-4 shadow-soft sm:p-5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-violet-500/[0.07] to-accent/[0.12]" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent dark:via-white/[0.05]" aria-hidden />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">Tasks &amp; follow-ups</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                AI-prioritized next steps — focus on revenue impact, not inbox noise.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="gap-2 border-border/80 bg-card" onClick={() => toast.message("Bulk assign (demo)")}>
                <Users className="size-4" />
                Team queue
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="outline" size="icon" className="border-border/80 bg-card" aria-label="Layout" onClick={() => setLayoutNote((v) => (v === "comfort" ? "compact" : "comfort"))}>
                    <LayoutGrid className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Layout: {layoutNote === "comfort" ? "Comfortable rows" : "Compact rows"}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* AI insight strip */}
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="AI task insights">
          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">AI priorities</p>
              <p className="mt-1 text-lg font-bold text-foreground">{strip.highPriority} High priority tasks</p>
              <StripSpark stroke="stroke-primary" />
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Due today</p>
              <p className="mt-1 text-lg font-bold text-foreground">{strip.dueToday} tasks · Need attention</p>
              <StripSpark stroke="stroke-amber-500" />
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Overdue</p>
              <p className="mt-1 text-lg font-bold text-foreground">{strip.overdue} tasks · Action needed</p>
              <StripSpark stroke="stroke-rose-500" />
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Completed</p>
              <p className="mt-1 text-lg font-bold text-foreground">{strip.completed} tasks</p>
              <p className="text-xs font-semibold text-emerald-600">+{strip.completedTrendPct}% vs last 7 days</p>
              <StripSpark stroke="stroke-emerald-500" />
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm sm:col-span-2 xl:col-span-1">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Potential impact</p>
              <p className="mt-1 text-lg font-bold text-foreground">{formatUsd(strip.revenueOpportunity)}</p>
              <p className="text-xs text-muted-foreground">Revenue opportunity in open tasks</p>
              <StripSpark stroke="stroke-amber-600" />
            </CardContent>
          </Card>
        </section>

        {/* Pills + search */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map((t) => {
              const active = filterTab === t.id;
              const n = counts[t.id];
              return (
                <Button
                  key={t.id}
                  type="button"
                  size="sm"
                  variant={active ? "default" : "outline"}
                  className={cn("h-9 rounded-full border-border/80 px-3.5", active && "gradient-primary text-primary-foreground shadow-glow")}
                  onClick={() => {
                    setFilterTab(t.id);
                    setPage(1);
                  }}
                >
                  {t.label} ({n})
                </Button>
              );
            })}
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:min-w-[300px]">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search tasks…"
                className="border-border/80 bg-card pl-9"
              />
            </div>
            <Button type="button" variant="outline" className="shrink-0 border-border/80 bg-card" onClick={() => setFilterSheetOpen(true)}>
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Column header */}
        <div className="hidden overflow-hidden rounded-t-2xl border border-b-0 border-border/60 xl:block">
          <div
            className={cn(
              "grid gap-1 px-1",
              headerRowClass,
              "grid-cols-[44px_minmax(140px,1fr)_minmax(200px,1.4fr)_minmax(120px,0.9fr)_minmax(160px,1.1fr)_minmax(140px,1fr)_minmax(200px,1.2fr)_minmax(140px,1fr)_minmax(120px,0.9fr)]",
            )}
          >
            <div className={cn(thClass, "w-11")} aria-hidden />
            <div className={thClass}>Sales rep</div>
            <div className={thClass}>Task &amp; details</div>
            <div className={thClass}>Type</div>
            <div className={thClass}>Account</div>
            <div className={thClass}>Time &amp; priority</div>
            <div className={thClass}>AI insight</div>
            <div className={thClass}>Next best action</div>
            <div className={thClass}>Status</div>
          </div>
        </div>

        <div className="space-y-3 xl:-mt-3 xl:space-y-2 xl:rounded-b-2xl xl:border xl:border-t-0 xl:border-border/60 xl:bg-card xl:p-2">
          {pageRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">No tasks in this view.</div>
          ) : (
            pageRows.map((r) => {
              const done = isTaskDone(r, completedMap);
              const active = selectedId === r.id;
              const pad = layoutNote === "comfort" ? "py-5 sm:py-6" : "py-3 sm:py-4";
              return (
                <article
                  key={r.id}
                  className={cn(
                    "rounded-2xl border border-border/60 bg-card shadow-sm transition-all",
                    active && "ring-2 ring-primary/25",
                    pad,
                    "px-3 sm:px-4",
                  )}
                >
                  <div
                    className={cn(
                      "grid cursor-pointer gap-4 xl:grid-cols-[44px_minmax(140px,1fr)_minmax(200px,1.4fr)_minmax(120px,0.9fr)_minmax(160px,1.1fr)_minmax(140px,1fr)_minmax(200px,1.2fr)_minmax(140px,1fr)_minmax(120px,0.9fr)] xl:items-center xl:gap-1 xl:px-1",
                    )}
                    onClick={() => setSelectedId((id) => (id === r.id ? null : r.id))}
                  >
                    <div className="flex items-start pt-1 xl:justify-center" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={!!checked[r.id]}
                        onCheckedChange={(v) => setChecked((c) => ({ ...c, [r.id]: v === true }))}
                        aria-label={`Select ${r.taskTitle}`}
                      />
                    </div>

                    <div className="flex gap-3 border-b border-border/40 pb-3 xl:border-b-0 xl:pb-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">{initials(r.repName)}</div>
                      <div className="min-w-0">
                        <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Sales rep</p>
                        <p className="font-semibold text-foreground">{r.repName}</p>
                        <p className="text-xs text-muted-foreground">{r.repRole}</p>
                      </div>
                    </div>

                    <div className="border-b border-border/40 pb-3 xl:border-b-0 xl:pb-0">
                      <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Task</p>
                      <p className="font-bold text-foreground">{r.taskTitle}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.scheduledDisplay}</p>
                      {r.hasNotes && (
                        <button type="button" className="mt-1 text-xs font-semibold text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                          Notes available
                        </button>
                      )}
                    </div>

                    <div className="border-b border-border/40 pb-3 xl:border-b-0 xl:pb-0">
                      <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Type</p>
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <TypeIcon t={r.taskTypeIcon} />
                        {r.taskType}
                      </div>
                    </div>

                    <div className="border-b border-border/40 pb-3 xl:border-b-0 xl:pb-0">
                      <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Account</p>
                      <button type="button" className="text-left text-sm font-semibold text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                        {r.accountName}
                      </button>
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{r.accountAddress}</p>
                    </div>

                    <div className="border-b border-border/40 pb-3 xl:border-b-0 xl:pb-0">
                      <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Time &amp; priority</p>
                      <p className="text-sm font-medium text-foreground">{r.scheduledDisplay.split("·")[0]?.trim() ?? r.scheduledDisplay}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Star className={cn("size-4", r.priority === "high" ? "fill-amber-400 text-amber-500" : "text-muted-foreground/60")} aria-hidden />
                        <span className="text-xs font-semibold capitalize text-foreground">{r.priority}</span>
                        <Badge variant="outline" className="border-border/80 text-xs font-semibold">
                          {r.dueBadge}
                        </Badge>
                      </div>
                    </div>

                    <div className="border-b border-border/40 pb-3 xl:border-b-0 xl:pb-0">
                      <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">AI insight</p>
                      <p className="text-sm font-medium leading-snug text-foreground">{r.aiInsight}</p>
                      <p className={cn("mt-1 text-xs font-semibold", aiSubClass(r.aiTone))}>{r.aiSubtext}</p>
                      <p className="mt-1 text-[11px] italic text-muted-foreground">AI suggests acting within 24h on high-signal tasks.</p>
                    </div>

                    <div className="flex flex-col gap-2 border-b border-border/40 pb-3 xl:border-b-0 xl:pb-0" onClick={(e) => e.stopPropagation()}>
                      <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Next action</p>
                      <Button type="button" size="sm" className="w-full max-w-[200px] gradient-primary text-primary-foreground" onClick={() => toast.success("Call scheduled (demo)")}>
                        <Phone className="mr-2 size-3.5" />
                        Schedule Call
                      </Button>
                      <Button type="button" size="sm" variant="outline" className="w-full max-w-[200px] gap-1 border-primary/30 text-primary" onClick={() => toast.success("AI message draft")}>
                        <Sparkles className="size-3.5" />
                        AI Message
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 xl:justify-end" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                        <Switch checked={done} onCheckedChange={(v) => setDone(r.id, v)} aria-label="Mark complete" />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button type="button" size="icon" variant="ghost" className="size-8" aria-label="More">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.message("Snooze")}>Snooze</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.message("Reassign")}>Reassign</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Contextual AI summary footer */}
        {selected && (
          <section className="rounded-2xl border border-primary/15 bg-gradient-to-br from-card to-primary/[0.03] p-4 shadow-soft sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-foreground">AI depth — {selected.taskTitle}</h2>
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setSelectedId(null)}>
                Clear selection
              </Button>
            </div>
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="mb-4 h-auto w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
                <TabsTrigger value="ai" className="text-xs sm:text-sm">
                  AI Summary
                </TabsTrigger>
                <TabsTrigger value="call" className="text-xs sm:text-sm">
                  Call Summary
                </TabsTrigger>
                <TabsTrigger value="obj" className="text-xs sm:text-sm">
                  Key Objections
                </TabsTrigger>
                <TabsTrigger value="pitch" className="text-xs sm:text-sm">
                  Suggested Pitch
                </TabsTrigger>
                <TabsTrigger value="health" className="text-xs sm:text-sm">
                  Deal Health
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ai" className="mt-0 border-0 p-0 outline-none">
                <p className="text-sm leading-relaxed text-foreground">{selected.panelAiSummary}</p>
              </TabsContent>
              <TabsContent value="call" className="mt-0 border-0 p-0 outline-none">
                <p className="text-sm leading-relaxed text-foreground">{selected.panelCallSummary}</p>
              </TabsContent>
              <TabsContent value="obj" className="mt-0 border-0 p-0 outline-none">
                <p className="text-sm leading-relaxed text-foreground">{selected.panelObjections}</p>
              </TabsContent>
              <TabsContent value="pitch" className="mt-0 border-0 p-0 outline-none">
                <p className="text-sm leading-relaxed text-foreground">{selected.panelPitch}</p>
              </TabsContent>
              <TabsContent value="health" className="mt-0 border-0 p-0 outline-none">
                <div className="flex flex-wrap items-start gap-6">
                  <HealthGauge score={selected.healthScore} />
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
                    Composite score from engagement velocity, stage fit, and AI sentiment on recent touches.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-5 grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border/60 bg-card/80 px-3 py-2">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Last contact</p>
                <p className="text-sm font-semibold text-foreground">{selected.lastContact}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/80 px-3 py-2">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Next follow-up</p>
                <p className="text-sm font-semibold text-foreground">{selected.nextFollowUp}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/80 px-3 py-2">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Deal value</p>
                <p className="text-sm font-semibold text-foreground">{formatUsd(selected.dealValue)}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/80 px-3 py-2">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Win probability</p>
                <p className="text-sm font-semibold text-foreground">
                  {selected.winProbabilityPct}%{" "}
                  <span
                    className={cn(
                      selected.winProbabilityPct >= 70 ? "text-emerald-600" : selected.winProbabilityPct >= 45 ? "text-amber-600" : "text-rose-600",
                    )}
                  >
                    {selected.winProbabilityPct >= 70 ? "High confidence" : selected.winProbabilityPct >= 45 ? "Medium" : "Low signal"}
                  </span>
                </p>
              </div>
            </div>
          </section>
        )}

        <PagedTableFooter
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
          aria-label="Tasks pagination"
        >
          <Button type="button" variant="outline" size="sm" className="gap-2 border-border/80 bg-card" onClick={() => toast.success("Export started (demo)")}>
            <FileSpreadsheet className="size-4" />
            Export Tasks Report
          </Button>
          <Button type="button" variant="outline" size="sm" className="gap-2 border-border/80 bg-card" onClick={() => toast.message("Schedule follow-up exports")}>
            <CalendarClock className="size-4" />
            Schedule Follow-up Exports
          </Button>
        </PagedTableFooter>
      </div>

      {/* AI Assistant */}
      <aside className="flex w-full shrink-0 flex-col gap-3 xl:sticky xl:top-4 xl:w-[320px]">
        <Card className="overflow-hidden rounded-2xl border-border/80 shadow-soft">
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="size-5 text-primary" />
              AI Assistant
            </div>
          </div>
          <CardContent className="space-y-4 p-4">
            <p className="text-sm text-foreground">
              Hi James <span aria-hidden>👋</span> What should we tackle first?
            </p>
            {["Which tasks should I focus on today?", "What is the potential revenue at risk?", "Summarize overdue owners", "Draft a follow-up for top accounts"].map((q) => (
              <button
                key={q}
                type="button"
                className="w-full rounded-xl border border-border/70 bg-card px-3 py-2.5 text-left text-xs font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
                onClick={() => toast.message(q)}
              >
                {q}
              </button>
            ))}
            <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3">
              <p className="text-xs font-bold text-primary">Focus on {Math.min(3, highPreview.length)} high priority tasks</p>
              <p className="mt-1 text-xs text-muted-foreground">Most likely to close soon based on engagement signals.</p>
              <div className="mt-2 flex gap-1">
                {highPreview.map((h) => (
                  <div key={h.id} className="flex size-8 items-center justify-center rounded-full border bg-muted text-[10px] font-bold" title={h.repName}>
                    {initials(h.repName)}
                  </div>
                ))}
              </div>
              <Button type="button" size="sm" className="mt-3 w-full gradient-primary text-primary-foreground" onClick={() => setFilterTab("high_priority")}>
                View recommended tasks
              </Button>
            </div>
            <div className="relative">
              <Textarea value={assistantInput} onChange={(e) => setAssistantInput(e.target.value)} placeholder="Ask anything…" className="min-h-[88px] resize-none pr-12" />
              <Button type="button" size="icon" className="absolute bottom-2 right-2 size-9 gradient-primary text-primary-foreground" aria-label="Send" onClick={() => toast.success("AI response (demo)")}>
                <CheckCircle2 className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="flex items-start gap-2 rounded-2xl border border-dashed border-border/80 bg-muted/10 p-4 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" />
          Engagement trending up on tasks with notes and repeat proposal views.
        </Card>
      </aside>

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Task filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4 px-1">
            <div className="space-y-2">
              <Label>Owner</Label>
              <Input disabled placeholder="All reps" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Account</Label>
              <Input disabled placeholder="Search accounts" className="bg-muted/50" />
            </div>
          </div>
          <SheetFooter className="mt-auto">
            <Button className="w-full gradient-primary text-primary-foreground" onClick={() => setFilterSheetOpen(false)}>
              Apply (demo)
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
