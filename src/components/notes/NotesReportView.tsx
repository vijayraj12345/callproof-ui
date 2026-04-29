import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Sparkles,
  StickyNote,
} from "lucide-react";
import {
  computeNotesReportKpis,
  noteMatchesTab,
  notesReportSampleRows,
  tabCounts,
  type NoteReportRow,
  type NotesReportTab,
} from "@/data/notesReportSampleData";
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ROWS_OPTIONS = [20, 50, 100] as const;

const headerRowClass = cn(
  "border-b border-white/20 bg-gradient-to-r from-[#094E9B] via-[#0d62c9] to-[#052d57]",
);

const thClass = cn("px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white sm:px-4");

const TABS: { id: NotesReportTab; label: string }[] = [
  { id: "all", label: "All Notes" },
  { id: "ai_summarized", label: "AI Summarized" },
  { id: "action_items", label: "Action Items" },
  { id: "mentions", label: "Mentions" },
  { id: "follow_up", label: "Follow-up" },
];

function initials(name: string): string {
  const p = name.split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[1][0]).toUpperCase();
}

function KpiSpark({ stroke }: { stroke: string }) {
  const pts = "0,12 6,8 12,10 18,5 24,7 30,3 36,5";
  return (
    <svg viewBox="0 0 36 14" className="mt-2 h-5 w-full max-w-[72px]" aria-hidden>
      <polyline fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" points={pts} className={cn("fill-none", stroke)} />
    </svg>
  );
}

function SourceIcon({ source }: { source: NoteReportRow["source"] }) {
  const cls = "size-4 shrink-0 text-primary";
  if (source === "Appointment") return <Phone className={cls} />;
  if (source === "Event Form") return <FileText className={cls} />;
  return <StickyNote className={cls} />;
}

function InsightRowIcon({ tone }: { tone: NoteReportRow["insightTone"] }) {
  if (tone === "success") return <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />;
  if (tone === "warning") return <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />;
  return <ArrowDownRight className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden />;
}

export function NotesReportView() {
  const [rows] = useState<NoteReportRow[]>(notesReportSampleRows);
  const [tab, setTab] = useState<NotesReportTab>("all");
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const kpis = useMemo(() => computeNotesReportKpis(rows), [rows]);
  const counts = useMemo(() => tabCounts(rows), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (!noteMatchesTab(r, tab)) return false;
      if (!q) return true;
      return `${r.repName} ${r.accountName} ${r.aiSummary} ${r.aiInsight}`.toLowerCase().includes(q);
    });
  }, [rows, tab, search]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);
  const summaryFrom = total === 0 ? 0 : start + 1;
  const summaryTo = Math.min(start + rowsPerPage, total);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:items-start">
      <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto">
        <header className="relative overflow-hidden rounded-2xl border border-primary/15 p-4 shadow-soft sm:p-5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-violet-500/[0.07] to-accent/[0.12]" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent dark:via-white/[0.05]" aria-hidden />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-1 size-6 shrink-0 text-primary" aria-hidden />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">Notes Report</h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Smart insights from your conversations and activities.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" className="gap-1 border-border/80 bg-card">
                    Quick Links
                    <ChevronDown className="size-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => toast.message("Accounts")}>Accounts &amp; contacts</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.message("Calls")}>Call history</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.message("Settings")}>Report settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button type="button" variant="outline" className="gap-2 border-border/80 bg-card" onClick={() => setFilterOpen(true)}>
                <Filter className="size-4" />
                Filters
              </Button>
              <Button type="button" className="gap-2 gradient-primary text-primary-foreground shadow-glow" onClick={() => toast.success("Add note (demo)")}>
                <Plus className="size-4" />
                Add Note
              </Button>
            </div>
          </div>
        </header>

        {/* KPI strip */}
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Notes KPIs">
          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Total notes</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{kpis.totalNotes.toLocaleString()}</p>
              <p className="text-xs font-semibold text-emerald-600">+{kpis.totalTrendPct}% vs last 30 days</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">AI summaries generated</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{kpis.aiSummaries.toLocaleString()}</p>
              <p className="text-xs font-semibold text-emerald-600">+{kpis.aiTrendPct}% vs last 30 days</p>
              <KpiSpark stroke="stroke-violet-500" />
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Action items identified</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{kpis.actionItems.toLocaleString()}</p>
              <p className="text-xs font-semibold text-emerald-600">+{kpis.actionTrendPct}% vs last 30 days</p>
              <KpiSpark stroke="stroke-amber-500" />
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Mentions / keywords</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{kpis.mentions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Top: {kpis.topKeywords}</p>
              <KpiSpark stroke="stroke-emerald-500" />
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm sm:col-span-2 xl:col-span-1">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Notes with follow-up</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{kpis.followUpNotes.toLocaleString()}</p>
              <p className="text-xs font-semibold text-emerald-600">+{kpis.followUpTrendPct}% vs last 30 days</p>
              <KpiSpark stroke="stroke-rose-500" />
            </CardContent>
          </Card>
        </section>

        {/* Tabs + search */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {TABS.map((t) => {
              const active = tab === t.id;
              const n = counts[t.id];
              return (
                <Button
                  key={t.id}
                  type="button"
                  size="sm"
                  variant={active ? "default" : "outline"}
                  className={cn("h-9 shrink-0 rounded-full border-border/80 px-3.5", active && "gradient-primary text-primary-foreground shadow-glow")}
                  onClick={() => {
                    setTab(t.id);
                    setPage(1);
                  }}
                >
                  {t.label} ({n})
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
                placeholder="Search notes…"
                className="border-border/80 bg-card pl-9"
              />
            </div>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn("border-border/80 bg-card", viewMode === "list" && "border-primary/40 bg-primary/5")}
                    aria-label="List view"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>List</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn("border-border/80 bg-card", viewMode === "grid" && "border-primary/40 bg-primary/5")}
                    aria-label="Grid view"
                    onClick={() => {
                      setViewMode("grid");
                      toast.message("Grid view (demo layout)");
                    }}
                  >
                    <LayoutGrid className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Table header */}
        <div className="hidden overflow-hidden rounded-t-2xl border border-b-0 border-border/60 xl:block">
          <div
            className={cn(
              "grid gap-1 px-1",
              headerRowClass,
              "grid-cols-[minmax(140px,1fr)_minmax(120px,0.9fr)_minmax(220px,1.6fr)_minmax(160px,1fr)_minmax(120px,0.85fr)_minmax(180px,1.1fr)_minmax(100px,0.7fr)]",
            )}
          >
            <div className={thClass}>Rep</div>
            <div className={thClass}>Account</div>
            <div className={thClass}>Notes (AI summary)</div>
            <div className={thClass}>Date &amp; time</div>
            <div className={thClass}>Source</div>
            <div className={thClass}>AI insights</div>
            <div className={cn(thClass, "text-center")}>Actions</div>
          </div>
        </div>

        <div className="space-y-3 xl:-mt-3 xl:space-y-2 xl:rounded-b-2xl xl:border xl:border-t-0 xl:border-border/60 xl:bg-card xl:p-2">
          {pageRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">No notes in this view.</div>
          ) : (
            pageRows.map((r) => (
              <article
                key={r.id}
                className={cn(
                  "rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md xl:border-0 xl:shadow-none xl:hover:bg-muted/25",
                  viewMode === "grid" && "sm:inline-block sm:w-full sm:max-w-[420px] sm:align-top",
                )}
              >
                <div
                  className={cn(
                    "grid gap-4 xl:grid-cols-[minmax(140px,1fr)_minmax(120px,0.9fr)_minmax(220px,1.6fr)_minmax(160px,1fr)_minmax(120px,0.85fr)_minmax(180px,1.1fr)_minmax(100px,0.7fr)] xl:items-start xl:gap-2 xl:px-2 xl:py-4",
                  )}
                >
                  <div className="flex gap-3 border-b border-border/50 pb-3 xl:border-b-0 xl:pb-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">{initials(r.repName)}</div>
                    <div className="min-w-0">
                      <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Rep</p>
                      <p className="font-semibold text-foreground">{r.repName}</p>
                      <p className="text-xs text-muted-foreground">{r.repRole}</p>
                    </div>
                  </div>

                  <div className="border-b border-border/50 pb-3 xl:border-b-0 xl:pb-0">
                    <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Account</p>
                    <button type="button" className="text-left text-sm font-semibold text-primary hover:underline">
                      {r.accountName}
                    </button>
                  </div>

                  <div className="border-b border-border/50 pb-3 xl:border-b-0 xl:pb-0">
                    <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Notes</p>
                    <div className="flex gap-2">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-violet-500" aria-hidden />
                      <p className="text-sm leading-relaxed text-foreground">{r.aiSummary}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {r.isAiSummarized ? (
                        <Badge variant="secondary" className="border-violet-200 bg-violet-50 text-xs font-semibold text-violet-900">
                          AI Summarized
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="border-border bg-muted/80 text-xs font-semibold text-muted-foreground">
                          Manual Note
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="border-b border-border/50 pb-3 xl:border-b-0 xl:pb-0">
                    <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Date &amp; time</p>
                    <div className="flex items-start gap-2 text-sm text-foreground">
                      <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <div>
                        <p className="flex items-center gap-1.5 font-medium">
                          <Clock className="size-3.5 text-muted-foreground" aria-hidden />
                          {r.dateLabel}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-border/50 pb-3 xl:border-b-0 xl:pb-0">
                    <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">Source</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <SourceIcon source={r.source} />
                      {r.source}
                    </div>
                  </div>

                  <div className="border-b border-border/50 pb-3 xl:border-b-0 xl:pb-0">
                    <p className="xl:hidden text-[10px] font-bold uppercase text-muted-foreground">AI insights</p>
                    <div className="flex gap-2">
                      <InsightRowIcon tone={r.insightTone} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug text-foreground">{r.aiInsight}</p>
                        <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{r.insightImpact}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start gap-1 border-b border-border/50 pb-3 xl:justify-center xl:border-b-0 xl:pb-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="button" size="icon" variant="ghost" className="size-9 text-primary" aria-label="View" onClick={() => toast.message("View note")}>
                          <Eye className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="button" size="icon" variant="ghost" className="size-9 text-primary" aria-label="Edit" onClick={() => toast.message("Edit note")}>
                          <Pencil className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" size="icon" variant="ghost" className="size-9 text-muted-foreground" aria-label="More">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.message("Share")}>Share</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.message("Archive")}>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

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
          aria-label="Notes report pagination"
        >
          <Button type="button" variant="outline" size="sm" className="gap-2 border-border/80 bg-card" onClick={() => toast.success("Export started (demo)")}>
            <Download className="size-4" />
            Export
          </Button>
        </PagedTableFooter>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-3 xl:sticky xl:top-4 xl:w-[320px]">
        <Card className="overflow-hidden rounded-2xl border-border/80 shadow-soft">
          <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-3 font-bold">
            <Sparkles className="size-5 text-primary" />
            AI Assistant
          </div>
          <CardContent className="space-y-4 p-4">
            <p className="text-sm text-foreground">
              Hi James <span aria-hidden>👋</span> How can I help you today?
            </p>
            {[
              { t: "Summarize recent notes", i: Sparkles },
              { t: "Show notes with action items", i: FileText },
              { t: "What are the top issues reported?", i: AlertTriangle },
              { t: "Find follow-ups due this week", i: Calendar },
            ].map(({ t, i: Icon }) => (
              <button
                key={t}
                type="button"
                className="flex w-full items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2.5 text-left text-xs font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
                onClick={() => toast.message(t)}
              >
                <Icon className="size-4 shrink-0 text-primary" />
                {t}
              </button>
            ))}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs leading-relaxed text-foreground">
              <p className="font-bold text-primary">AI summary (this month)</p>
              <p className="mt-2 text-muted-foreground">
                You have <span className="font-semibold text-foreground">{kpis.followUpNotes}</span> notes with follow-ups. Top issue:{" "}
                <span className="font-semibold text-foreground">Call tracking</span> (24 mentions). Most active account:{" "}
                <span className="font-semibold text-foreground">AACC INC</span>.
              </p>
              <button type="button" className="mt-2 text-xs font-bold text-primary hover:underline" onClick={() => toast.message("Full summary")}>
                View full summary
              </button>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3">
              <p className="text-xs font-bold text-primary">Smart recommendation</p>
              <p className="mt-1 text-xs text-muted-foreground">You have 5 notes that need follow-up based on priority and last activity.</p>
              <Button type="button" size="sm" className="mt-3 w-full gradient-primary text-primary-foreground" onClick={() => setTab("follow_up")}>
                View recommendations
              </Button>
            </div>
            <div className="relative">
              <Textarea value={assistantInput} onChange={(e) => setAssistantInput(e.target.value)} placeholder="Ask anything…" className="min-h-[88px] resize-none pr-12" />
              <Button type="button" size="icon" className="absolute bottom-2 right-2 size-9 gradient-primary text-primary-foreground" aria-label="Send" onClick={() => toast.success("AI response (demo)")}>
                <CheckCircle2 className="size-4" />
              </Button>
            </div>
            <p className="text-[10px] leading-snug text-muted-foreground">AI may make mistakes. Please verify important info.</p>
          </CardContent>
        </Card>
      </aside>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4 px-1">
            <div className="space-y-2">
              <Label>Source</Label>
              <Input disabled className="bg-muted/50" placeholder="All sources" />
            </div>
            <div className="space-y-2">
              <Label>Rep</Label>
              <Input disabled className="bg-muted/50" placeholder="All reps" />
            </div>
          </div>
          <SheetFooter className="mt-auto">
            <Button className="w-full gradient-primary text-primary-foreground" onClick={() => setFilterOpen(false)}>
              Apply (demo)
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
