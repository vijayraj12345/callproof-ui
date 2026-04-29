import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  Bot,
  CalendarRange,
  Download,
  Filter,
  Globe,
  LogOut,
  MapPin,
  Monitor,
  MoreVertical,
  Network,
  Search,
  Shield,
  ShieldAlert,
  Smartphone,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  eventsKpis,
  eventsSampleData,
  type EventKind,
  type EventRow,
  type EventStatusLabel,
} from "@/data/eventsSampleData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableScrollViewport,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const eventsHeaderRowClass = cn(
  "border-b border-white/20 bg-gradient-to-r from-[#094E9B] via-[#0d62c9] to-[#052d57]",
  "hover:!bg-gradient-to-r hover:!from-[#094E9B] hover:!via-[#0d62c9] hover:!to-[#052d57]",
  "data-[state=selected]:!bg-gradient-to-r data-[state=selected]:!from-[#094E9B] data-[state=selected]:!via-[#0d62c9] data-[state=selected]:!to-[#052d57]",
);

const eventsThClass = cn(
  "relative h-12 bg-transparent px-4 text-left align-middle text-sm font-semibold tracking-wide text-white",
);

const ROWS_OPTIONS = [20, 50, 100] as const;

function MiniSparkline({ positive }: { positive: boolean }) {
  const pts = positive ? "0,24 24,14 48,20 72,6 96,12 120,2" : "0,8 24,18 48,10 72,22 96,16 120,26";
  return (
    <svg viewBox="0 0 120 32" className="h-9 w-full max-w-[120px] shrink-0" aria-hidden>
      <polyline
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        className={positive ? "stroke-emerald-500" : "stroke-rose-500"}
      />
    </svg>
  );
}

function kpiIcon(id: (typeof eventsKpis)[number]["icon"]) {
  const cls = "size-5 text-primary";
  switch (id) {
    case "pulse":
      return <Activity className={cls} />;
    case "shield":
      return <Shield className={cls} />;
    case "logout":
      return <LogOut className={cls} />;
    case "smartphone":
      return <Smartphone className={cls} />;
    case "monitor":
      return <Monitor className={cls} />;
    default:
      return <Activity className={cls} />;
  }
}

function statusBadge(label: EventStatusLabel) {
  const styles: Record<EventStatusLabel, string> = {
    Success: "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-50/90",
    Logout: "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50/90",
    Warning: "border-amber-300 bg-amber-100 text-amber-950 hover:bg-amber-100/90",
    Failed: "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-50/90",
  };
  return (
    <Badge variant="outline" className={cn("font-semibold", styles[label])}>
      {label}
    </Badge>
  );
}

function eventAvatar(kind: EventKind) {
  const isLogout = kind === "logout";
  const bg = isLogout ? "bg-amber-500" : kind === "security" ? "bg-rose-500" : "bg-primary";
  const Icon = kind === "logout" ? LogOut : kind === "security" ? ShieldAlert : kind === "action" ? Activity : Shield;
  return (
    <div
      className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm ring-2 ring-white/30", bg)}
      aria-hidden
    >
      <Icon className="size-5" />
    </div>
  );
}

type DraftFilters = {
  platform: "all" | "Web" | "Mobile";
  status: "all" | EventStatusLabel;
};

const defaultFilters: DraftFilters = { platform: "all", status: "all" };

function filtersActive(f: DraftFilters): boolean {
  return f.platform !== "all" || f.status !== "all";
}

export function EventsView() {
  const [rows] = useState<EventRow[]>(eventsSampleData);
  const [search, setSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<DraftFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<DraftFilters>(defaultFilters);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (appliedFilters.platform !== "all" && r.platform !== appliedFilters.platform) return false;
      if (appliedFilters.status !== "all" && r.statusLabel !== appliedFilters.status) return false;
      if (!q) return true;
      const hay = `${r.title} ${r.browserOs} ${r.ip} ${r.location} ${r.statusLabel}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rows, search, appliedFilters]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);
  const summaryFrom = total === 0 ? 0 : start + 1;
  const summaryTo = Math.min(start + rowsPerPage, total);

  const withAi = rows.filter((r) => r.aiInsight).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        <header className="relative overflow-hidden rounded-2xl border border-primary/15 p-4 shadow-soft sm:p-5">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-violet-500/[0.07] to-accent/[0.12]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent dark:via-white/[0.05]"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">Events</h1>
              <p className="mt-0.5 text-sm font-medium text-foreground/80">
                Real-time activity and system events across your platform — with AI-assisted monitoring.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <Button type="button" variant="outline" className="gap-2 bg-card font-normal text-muted-foreground">
                <CalendarRange className="size-4 shrink-0 text-foreground" />
                Apr 23 – Apr 29, 2026
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn("shrink-0 border-border bg-card", filterSheetOpen && "border-primary/50 bg-primary/5")}
                    aria-label="Filters"
                    onClick={() => {
                      setDraftFilters(appliedFilters);
                      setFilterSheetOpen(true);
                    }}
                  >
                    <Filter className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filters</TooltipContent>
              </Tooltip>
              <Button
                type="button"
                className="gradient-primary gap-2 text-primary-foreground shadow-glow"
                onClick={() => toast.success("Export queued (demo)")}
              >
                <Download className="size-4" />
                Export report
              </Button>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search events, IP, location, device…"
              className="bg-card pl-9"
            />
          </div>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {eventsKpis.map((k) => (
            <Card key={k.id} className="overflow-hidden rounded-2xl border-border/80 shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15"
                    aria-hidden
                  >
                    {kpiIcon(k.icon)}
                  </div>
                  <MiniSparkline positive={k.trendUp} />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k.label}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-foreground">
                  {k.value.toLocaleString()}
                </p>
                <p
                  className={cn(
                    "mt-1 inline-flex items-center gap-1 text-xs font-semibold",
                    k.trendUp ? "text-emerald-600" : "text-rose-600",
                  )}
                >
                  {k.trendUp ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                  {k.trendUp ? "↑" : "↓"} {k.trendPct}% vs last 7 days
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
              <TableScrollViewport label="Events">
                <Table>
                  <TableHeader>
                    <TableRow
                      className={cn("hover:bg-transparent data-[state=selected]:bg-transparent", eventsHeaderRowClass)}
                    >
                    <TableHead className={cn(eventsThClass, "min-w-[220px]")}>Event</TableHead>
                    <TableHead className={cn(eventsThClass, "min-w-[280px]")}>Details</TableHead>
                    <TableHead className={cn(eventsThClass, "w-[160px]")}>Time</TableHead>
                    <TableHead className={cn(eventsThClass, "w-14 text-center pr-3")}>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        No events match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((r) => {
                      const expanded = expandedId === r.id;
                      return (
                        <Fragment key={r.id}>
                          <TableRow
                            className={cn(
                              "group cursor-pointer align-top transition-colors hover:bg-muted/40",
                              expanded && "bg-muted/30",
                            )}
                            onClick={() => setExpandedId((id) => (id === r.id ? null : r.id))}
                          >
                            <TableCell className="align-top">
                              <div className="flex gap-3 py-1">
                                {eventAvatar(r.kind)}
                                <div className="min-w-0">
                                  <p className="font-semibold leading-snug text-foreground">{r.title}</p>
                                  <div className="mt-1.5">{statusBadge(r.statusLabel)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="flex flex-wrap gap-2 py-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground">
                                  {r.platform === "Web" ? (
                                    <Monitor className="size-3.5 text-muted-foreground" />
                                  ) : (
                                    <Smartphone className="size-3.5 text-muted-foreground" />
                                  )}
                                  {r.platform}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground">
                                  <Globe className="size-3.5 text-muted-foreground" />
                                  {r.browserOs}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-foreground">
                                  <Network className="size-3.5 shrink-0 text-muted-foreground" />
                                  {r.ip}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground">
                                  <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                                  {r.location}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="py-1">
                                <p className="text-sm font-semibold text-foreground">{r.relativeTime}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">{r.absoluteTime}</p>
                              </div>
                            </TableCell>
                            <TableCell className="align-top text-right" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-foreground"
                                    aria-label="Row actions"
                                  >
                                    <MoreVertical className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => toast.message(`Event ${r.id}`)}>View details</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => void navigator.clipboard.writeText(r.id).then(() => toast.success("Copied ID"))}>
                                    Copy event ID
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.message("Flagged for security review (demo)")}>
                                    Flag for review
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                          {expanded && (
                            <TableRow className="bg-muted/25 hover:bg-muted/25">
                              <TableCell colSpan={4} className="p-0">
                                <div className="border-t border-border/60 px-4 py-3 sm:px-6">
                                  {r.aiInsight ? (
                                    <div className="flex gap-3 rounded-xl border border-violet-200/80 bg-gradient-to-r from-violet-50/90 to-background p-3 dark:border-violet-900/50 dark:from-violet-950/40">
                                      <Sparkles className="mt-0.5 size-5 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden />
                                      <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                                          CallProof AI
                                        </p>
                                        <p className="mt-1 text-sm leading-relaxed text-foreground">{r.aiInsight}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      No AI insight for this row. Expand events with a sparkle in the feed to see risk and context hints.
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      );
                    })
                  )}
                </TableBody>
                </Table>
              </TableScrollViewport>
              <div className="border-t border-border bg-muted/5">
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
                  aria-label="Events pagination"
                />
              </div>
            </div>
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-4 xl:sticky xl:top-4 xl:w-[300px]">
            <Card className="rounded-2xl border-border/80 shadow-soft">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
                <p className="mt-2 text-sm text-foreground">
                  <span className="font-bold tabular-nums text-primary">{withAi}</span> events include AI context hints.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-primary/20 bg-gradient-to-br from-primary/[0.06] to-card shadow-soft">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Bot className="size-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">CallProof AI assistant</p>
                    <p className="text-xs text-muted-foreground">Summaries &amp; anomaly hints</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Ask for a narrative of logins, exports, and security signals for the selected date range. Highlights cluster
                  around unusual locations and permission errors.
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full justify-start gap-2"
                    onClick={() => toast.message("Opening AI recommendations (demo)")}
                  >
                    <Sparkles className="size-4 text-violet-600" />
                    View AI recommendations
                  </Button>
                  <Button
                    type="button"
                    className="gradient-primary w-full gap-2 text-primary-foreground shadow-glow"
                    onClick={() => toast.success("24h activity summary generated (demo)")}
                  >
                    Summarize last 24 hours
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/80 shadow-soft">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggested follow-ups</p>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  <li className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    Review failed logins from new regions this week.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    Correlate export spikes with scheduled reports.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent className="flex flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filter events</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-5 px-1">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={draftFilters.platform}
                onValueChange={(v) => setDraftFilters((f) => ({ ...f, platform: v as DraftFilters["platform"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All platforms</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={draftFilters.status}
                onValueChange={(v) => setDraftFilters((f) => ({ ...f, status: v as DraftFilters["status"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                  <SelectItem value="Logout">Logout</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="mt-auto gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDraftFilters(defaultFilters);
                setAppliedFilters(defaultFilters);
                setPage(1);
                setFilterSheetOpen(false);
                toast.message("Filters cleared");
              }}
            >
              Clear
            </Button>
            <Button
              type="button"
              className="gradient-primary text-primary-foreground"
              onClick={() => {
                setAppliedFilters(draftFilters);
                setPage(1);
                setFilterSheetOpen(false);
                toast.success(filtersActive(draftFilters) ? "Filters applied" : "Showing all events");
              }}
            >
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
