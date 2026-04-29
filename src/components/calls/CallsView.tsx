import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  Mail,
  Pencil,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  Star,
  ChevronDown,
} from "lucide-react";
import { callsSampleData, formatDuration, type CallDirection, type CallRecord, type CallSource } from "@/data/callsSampleData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const BRAND_HEADER = "text-[#094E9B]";
const BRAND_BLUE = "#094E9B";

const callsHeaderRowClass = cn(
  "border-b border-white/20 bg-gradient-to-r from-[#094E9B] via-[#0d62c9] to-[#052d57]",
  "hover:!bg-gradient-to-r hover:!from-[#094E9B] hover:!via-[#0d62c9] hover:!to-[#052d57]",
  "data-[state=selected]:!bg-gradient-to-r data-[state=selected]:!from-[#094E9B] data-[state=selected]:!via-[#0d62c9] data-[state=selected]:!to-[#052d57]",
);

const callsThClass = cn(
  "relative h-12 bg-transparent px-4 text-left align-middle text-sm font-semibold tracking-wide text-white",
);

const ROWS_OPTIONS = [20, 50, 100] as const;

type DirectionFilter = CallDirection | "all";
type SourceFilter = CallSource | "all";

type CallsTableFilters = {
  direction: DirectionFilter;
  source: SourceFilter;
  caller: string;
  hasNotes: "all" | "yes" | "no";
};

const defaultFilters: CallsTableFilters = {
  direction: "all",
  source: "all",
  caller: "all",
  hasNotes: "all",
};

function filtersAreActive(f: CallsTableFilters): boolean {
  return f.direction !== "all" || f.source !== "all" || f.caller !== "all" || f.hasNotes !== "all";
}

function initialsFromLabel(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function CallerCell({ call, expanded, onToggle }: { call: CallRecord; expanded: boolean; onToggle: () => void }) {
  const initials = initialsFromLabel(call.caller);
  return (
    <div className="flex items-start gap-3 py-0.5">
      <div
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ring-2 ring-white/25"
        style={{ backgroundColor: BRAND_BLUE }}
        aria-hidden
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <a href="#" className="block font-semibold leading-snug text-[#094E9B] hover:underline">
          {call.caller}
        </a>
        <p className="font-mono text-xs tabular-nums text-muted-foreground">{call.callerPhone}</p>
        {expanded && (
          <div className="mt-2 space-y-1 text-xs text-foreground/80">
            <p>
              <span className="font-semibold">Store:</span> {call.store || "—"}
            </p>
            <p>
              <span className="font-semibold">Phone/Campaign:</span>{" "}
              <span className="text-[#094E9B]">{call.campaign}</span>{" "}
              <span className="font-mono text-muted-foreground">{call.campaignNumber}</span>
            </p>
            <p>
              <span className="font-semibold">Caller Name:</span> {call.callerName}
            </p>
            <p>
              <span className="font-semibold">Carrier Name:</span> {call.carrierName}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#094E9B] hover:underline"
        >
          <ChevronDown className={cn("size-3 transition-transform", expanded && "rotate-180")} />
          {expanded ? "Hide details" : "Show details"}
        </button>
      </div>
    </div>
  );
}

function directionBadge(direction: CallDirection) {
  const map = {
    Incoming: {
      cls: "bg-emerald-100 text-emerald-900 hover:bg-emerald-100/90 border-emerald-200/80",
      Icon: PhoneIncoming,
    },
    Outgoing: {
      cls: "bg-sky-100 text-sky-900 hover:bg-sky-100/90 border-sky-200/80",
      Icon: PhoneOutgoing,
    },
    Missed: {
      cls: "bg-rose-100 text-rose-900 hover:bg-rose-100/90 border-rose-200/80",
      Icon: PhoneMissed,
    },
  } as const;
  const { cls, Icon } = map[direction];
  return (
    <Badge variant="secondary" className={cn("gap-1", cls)}>
      <Icon className="size-3" />
      {direction}
    </Badge>
  );
}

function sourceBadge(source: CallSource) {
  return (
    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 font-medium text-emerald-800">
      {source}
    </Badge>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            className="rounded p-0.5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#094E9B]/40"
          >
            <Star className={cn("size-4", filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")} />
          </button>
        );
      })}
    </div>
  );
}

function AudioPlayer({ call }: { call: CallRecord }) {
  if (!call.audioUrl) {
    return <p className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">Audio not available</p>;
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <audio controls preload="none" src={call.audioUrl} className="h-9 max-w-full">
        Your browser does not support the audio element.
      </audio>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-emerald-700 hover:bg-emerald-50"
              aria-label="Email recording"
              onClick={() => toast.success("Recording emailed")}
            >
              <Mail className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Email recording</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-foreground/70 hover:bg-muted"
              aria-label="Download recording"
              asChild
            >
              <a href={call.audioUrl} download>
                <Download className="size-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export function CallsView() {
  const [calls, setCalls] = useState<CallRecord[]>(callsSampleData);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<CallsTableFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<CallsTableFilters>(defaultFilters);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const [viewNotes, setViewNotes] = useState<{ id: number; title: string; body: string } | null>(null);
  const [editNotes, setEditNotes] = useState<{ id: number; text: string } | null>(null);

  const callerOptions = useMemo(
    () => [...new Set(calls.map((c) => c.caller))].sort((a, b) => a.localeCompare(b)),
    [calls],
  );

  const filtered = useMemo(() => {
    const f = appliedFilters;
    return calls.filter((c) => {
      if (f.direction !== "all" && c.direction !== f.direction) return false;
      if (f.source !== "all" && c.source !== f.source) return false;
      if (f.caller !== "all" && c.caller !== f.caller) return false;
      if (f.hasNotes === "yes" && !c.notes.trim()) return false;
      if (f.hasNotes === "no" && c.notes.trim()) return false;
      return true;
    });
  }, [calls, appliedFilters]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);
  const summaryFrom = total === 0 ? 0 : start + 1;
  const summaryTo = Math.min(start + rowsPerPage, total);

  const setRating = (id: number, rating: number) => {
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, rating } : c)));
    toast.success(`Rated ${rating} star${rating > 1 ? "s" : ""}`);
  };

  const saveNotes = () => {
    if (!editNotes) return;
    setCalls((prev) => prev.map((c) => (c.id === editNotes.id ? { ...c, notes: editNotes.text } : c)));
    toast.success("Note saved");
    setEditNotes(null);
  };

  const openFilterSheet = () => {
    setDraftFilters(appliedFilters);
    setFilterSheetOpen(true);
  };
  const applyDraftFilters = () => {
    setAppliedFilters(draftFilters);
    setFilterSheetOpen(false);
    setPage(1);
  };
  const clearDraftFilters = () => setDraftFilters({ ...defaultFilters });
  const clearAppliedFilters = () => {
    setAppliedFilters({ ...defaultFilters });
    setDraftFilters({ ...defaultFilters });
    setPage(1);
  };

  // Quick stats
  const stats = useMemo(() => {
    const totalCalls = calls.length;
    const incoming = calls.filter((c) => c.direction === "Incoming").length;
    const outgoing = calls.filter((c) => c.direction === "Outgoing").length;
    const missed = calls.filter((c) => c.direction === "Missed").length;
    return { totalCalls, incoming, outgoing, missed };
  }, [calls]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-[5.5rem]">
        <header className="relative overflow-hidden rounded-2xl border border-primary/15 p-4 shadow-soft sm:p-5">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-violet-500/[0.07] to-accent/[0.12]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent dark:via-white/[0.05]" aria-hidden />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">Call History</h1>
              <p className="mt-0.5 text-sm font-medium text-foreground/80">
                Review every inbound, outbound, and missed call across your team.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gradient-primary text-primary-foreground shadow-glow gap-2">
                    Quick Links
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => toast.message("Opening Mobile Calls")}>Mobile Calls</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.message("Opening Recorded Calls")}>Recorded Calls</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.message("Opening Voicemails")}>Voicemails</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.message("Opening Call Reports")}>Call Reports</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn("shrink-0 border-border", filterSheetOpen && "border-primary/50 bg-primary/5")}
                    aria-label="Open call filters"
                    aria-expanded={filterSheetOpen}
                    onClick={() => (filterSheetOpen ? setFilterSheetOpen(false) : openFilterSheet())}
                  >
                    <Filter className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open filters</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Quick stats */}
          <div className="relative mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatChip label="Total" value={stats.totalCalls} tone="brand" />
            <StatChip label="Incoming" value={stats.incoming} tone="emerald" Icon={ArrowDownLeft} />
            <StatChip label="Outgoing" value={stats.outgoing} tone="sky" Icon={ArrowUpRight} />
            <StatChip label="Missed" value={stats.missed} tone="rose" Icon={PhoneMissed} />
          </div>
        </header>

        {filtersAreActive(appliedFilters) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Active filters:</span>
            {appliedFilters.direction !== "all" && (
              <span>Direction <span className="text-foreground">{appliedFilters.direction}</span></span>
            )}
            {appliedFilters.source !== "all" && (
              <span>Source <span className="text-foreground">{appliedFilters.source}</span></span>
            )}
            {appliedFilters.caller !== "all" && (
              <span>Caller <span className="text-foreground">{appliedFilters.caller}</span></span>
            )}
            {appliedFilters.hasNotes !== "all" && (
              <span>Notes <span className="text-foreground">{appliedFilters.hasNotes === "yes" ? "with notes" : "without notes"}</span></span>
            )}
            <Button variant="link" className="h-auto p-0 text-xs" onClick={clearAppliedFilters}>
              Clear all
            </Button>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow className={cn("hover:bg-transparent data-[state=selected]:bg-transparent", callsHeaderRowClass)}>
                <TableHead className={cn(callsThClass, "min-w-[260px]")}>Caller</TableHead>
                <TableHead className={cn(callsThClass, "w-[140px]")}>Call Direction</TableHead>
                <TableHead className={cn(callsThClass, "min-w-[200px]")}>Contact / Number</TableHead>
                <TableHead className={cn(callsThClass, "min-w-[200px]")}>Date / Time</TableHead>
                <TableHead className={cn(callsThClass, "w-[110px]")}>Duration</TableHead>
                <TableHead className={cn(callsThClass, "min-w-[180px]")}>Related Record</TableHead>
                <TableHead className={cn(callsThClass, "w-[100px]")}>Source</TableHead>
                <TableHead className={cn(callsThClass, "w-[120px] text-center")}>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No calls match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((c) => {
                  const expanded = expandedRow === c.id;
                  return (
                    <>
                      <TableRow key={c.id} className="group align-top">
                        <TableCell className="align-top">
                          <CallerCell call={c} expanded={expanded} onToggle={() => setExpandedRow(expanded ? null : c.id)} />
                        </TableCell>
                        <TableCell className="align-top">{directionBadge(c.direction)}</TableCell>
                        <TableCell className="align-top">
                          {c.contactName ? (
                            <div className="space-y-0.5">
                              <a href="#" className="font-medium text-[#094E9B] hover:underline">
                                {c.contactName}
                              </a>
                              {c.contactNumber && (
                                <p className="font-mono text-xs tabular-nums text-muted-foreground">{c.contactNumber}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="align-top text-sm text-foreground/80">{c.dateTime}</TableCell>
                        <TableCell className="align-top font-mono text-sm tabular-nums">{formatDuration(c.durationSec)}</TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">{c.relatedRecord ?? <span className="text-muted-foreground">N/A</span>}</span>
                            <StarRating value={c.rating} onChange={(v) => setRating(c.id, v)} />
                          </div>
                        </TableCell>
                        <TableCell className="align-top">{sourceBadge(c.source)}</TableCell>
                        <TableCell className="text-center align-top">
                          <div className="flex items-center justify-center gap-1 pt-0.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className={cn("size-9", c.notes.trim() ? "text-emerald-600" : "text-muted-foreground/50")}
                                  aria-label="View note"
                                  onClick={() => setViewNotes({ id: c.id, title: "Call note", body: c.notes || "—" })}
                                >
                                  <Eye className="size-[18px]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{c.notes.trim() ? "View note" : "No note"}</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-9 text-[#094E9B]"
                                  aria-label="Add or edit note"
                                  onClick={() => setEditNotes({ id: c.id, text: c.notes })}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{c.notes.trim() ? "Edit note" : "Add a note"}</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expanded && (
                        <TableRow key={`${c.id}-audio`} className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={8} className="px-6 py-3">
                            <div className="flex flex-col gap-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Recording
                              </p>
                              <AudioPlayer call={c} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Bottom pagination bar with export actions */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 px-3 py-3 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-background/75 lg:left-[72px]"
        role="navigation"
        aria-label="Calls table pagination"
      >
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">Rows per page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="min-w-[4.5rem]">
                  {rowsPerPage}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {ROWS_OPTIONS.map((n) => (
                  <DropdownMenuItem key={n} onClick={() => { setRowsPerPage(n); setPage(1); }}>
                    {n}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="tabular-nums text-muted-foreground">
              {summaryFrom}–{summaryTo} of {total}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={safePage <= 1}
              aria-label="Previous page"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === safePage ? "default" : "ghost"}
                size="sm"
                className={cn("size-8 p-0", p === safePage && "gradient-primary text-primary-foreground shadow-glow")}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={safePage >= pageCount}
              aria-label="Next page"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              onClick={() => toast.success("Exporting mobile calls…")}
            >
              <FileSpreadsheet className="size-4" />
              Export Mobile Calls
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              onClick={() => toast.success("Exporting recorded calls…")}
            >
              <FileSpreadsheet className="size-4" />
              Export Recorded Calls
            </Button>
          </div>
        </div>
      </div>

      {/* Filter sheet */}
      <Sheet
        open={filterSheetOpen}
        onOpenChange={(open) => {
          setFilterSheetOpen(open);
          if (open) setDraftFilters(appliedFilters);
        }}
      >
        <SheetContent side="right" className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="space-y-1 border-b px-6 py-5 text-left">
            <SheetTitle>Calls Filter</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
            <div className="space-y-2">
              <Label htmlFor="filter-direction">Call Direction</Label>
              <Select
                value={draftFilters.direction}
                onValueChange={(v: DirectionFilter) => setDraftFilters((d) => ({ ...d, direction: v }))}
              >
                <SelectTrigger id="filter-direction"><SelectValue placeholder="all" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="Incoming">Incoming</SelectItem>
                  <SelectItem value="Outgoing">Outgoing</SelectItem>
                  <SelectItem value="Missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-source">Source</Label>
              <Select
                value={draftFilters.source}
                onValueChange={(v: SourceFilter) => setDraftFilters((d) => ({ ...d, source: v }))}
              >
                <SelectTrigger id="filter-source"><SelectValue placeholder="all" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Twilio">Twilio</SelectItem>
                  <SelectItem value="Desk">Desk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-caller">Caller</Label>
              <Select
                value={draftFilters.caller}
                onValueChange={(v) => setDraftFilters((d) => ({ ...d, caller: v }))}
              >
                <SelectTrigger id="filter-caller"><SelectValue placeholder="all" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  {callerOptions.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-notes">Notes</Label>
              <Select
                value={draftFilters.hasNotes}
                onValueChange={(v: "all" | "yes" | "no") => setDraftFilters((d) => ({ ...d, hasNotes: v }))}
              >
                <SelectTrigger id="filter-notes"><SelectValue placeholder="all" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="yes">With notes</SelectItem>
                  <SelectItem value="no">Without notes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="mt-auto flex-row justify-between gap-3 border-t px-6 py-4 sm:justify-between">
            <Button type="button" variant="destructive" onClick={clearDraftFilters}>
              Clear Filters
            </Button>
            <Button type="button" className="bg-[#094E9B] text-white hover:bg-[#094E9B]/90" onClick={applyDraftFilters}>
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View note */}
      <Dialog open={!!viewNotes} onOpenChange={(o) => !o && setViewNotes(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={BRAND_HEADER}>{viewNotes?.title}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap rounded-md border bg-muted/30 px-3 py-3 text-sm text-foreground">
            {viewNotes?.body}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setViewNotes(null)}>Close</Button>
            {viewNotes && (
              <Button
                className="gradient-primary text-primary-foreground"
                onClick={() => {
                  const row = calls.find((x) => x.id === viewNotes.id);
                  if (row) setEditNotes({ id: row.id, text: row.notes });
                  setViewNotes(null);
                }}
              >
                Edit note
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Add note */}
      <Dialog open={!!editNotes} onOpenChange={(o) => !o && setEditNotes(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className={BRAND_HEADER}>
              {editNotes?.text ? "Edit call note" : "Add a note"}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            rows={6}
            placeholder="Write a note for this call…"
            value={editNotes?.text ?? ""}
            onChange={(e) => setEditNotes((prev) => (prev ? { ...prev, text: e.target.value } : null))}
            className="min-h-[140px] resize-y"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditNotes(null)}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={saveNotes}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatChip({
  label,
  value,
  tone,
  Icon,
}: {
  label: string;
  value: number;
  tone: "brand" | "emerald" | "sky" | "rose";
  Icon?: typeof PhoneIncoming;
}) {
  const toneCls = {
    brand: "bg-[#094E9B]/10 text-[#094E9B] ring-[#094E9B]/20",
    emerald: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
    sky: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
    rose: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
  }[tone];
  return (
    <div className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 backdrop-blur-sm", toneCls)}>
      {Icon && (
        <div className="flex size-8 items-center justify-center rounded-lg bg-white/60 shadow-sm">
          <Icon className="size-4" />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{label}</span>
        <span className="text-lg font-bold leading-none tabular-nums">{value}</span>
      </div>
    </div>
  );
}
