import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  Filter,
  MapPin,
  Phone,
  Plus,
  Route,
  Sparkles,
  Trash2,
  AlertTriangle,
  Bot,
  Search,
} from "lucide-react";
import {
  appointmentsSampleData,
  formatAppointmentDuration,
  type AppointmentRow,
} from "@/data/appointmentsSampleData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
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
import { Card, CardContent } from "@/components/ui/card";

const BRAND_BLUE = "#094E9B";

const appointmentsHeaderRowClass = cn(
  "border-b border-white/20 bg-gradient-to-r from-[#094E9B] via-[#0d62c9] to-[#052d57]",
  "hover:!bg-gradient-to-r hover:!from-[#094E9B] hover:!via-[#0d62c9] hover:!to-[#052d57]",
  "data-[state=selected]:!bg-gradient-to-r data-[state=selected]:!from-[#094E9B] data-[state=selected]:!via-[#0d62c9] data-[state=selected]:!to-[#052d57]",
);

const appointmentsThClass = cn(
  "relative h-12 bg-transparent px-3 text-left align-middle text-sm font-semibold tracking-wide text-white sm:px-4",
);

const ROWS_OPTIONS = [20, 50, 100] as const;

function initialsCell(initials: string) {
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ring-2 ring-white/25"
      style={{ backgroundColor: BRAND_BLUE }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function typeBadge(t: AppointmentRow["type"]) {
  const map: Record<AppointmentRow["type"], string> = {
    "In person": "border-sky-200 bg-sky-50 text-sky-900",
    Remote: "border-violet-200 bg-violet-50 text-violet-900",
    Phone: "border-emerald-200 bg-emerald-50 text-emerald-900",
  };
  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", map[t])}>
      {t === "In person" && <MapPin className="size-3" />}
      {t === "Remote" && <Calendar className="size-3" />}
      {t === "Phone" && <Phone className="size-3" />}
      {t}
    </Badge>
  );
}

export function AppointmentsView() {
  const [rows, setRows] = useState<AppointmentRow[]>(appointmentsSampleData);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        `${r.repName} ${r.contactName} ${r.accountName} ${r.accountAddress} ${r.dateTime}`
          .toLowerCase()
          .includes(q),
    );
  }, [rows, search]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);
  const summaryFrom = total === 0 ? 0 : start + 1;
  const summaryTo = Math.min(start + rowsPerPage, total);

  const todayCount = rows.length;
  const withAiTips = rows.filter((r) => r.aiTip).length;

  const toggleFollowUp = (id: number, v: boolean) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, followUpNeeded: v } : r)));
  };

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
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">Appointments &amp; visits</h1>
              <p className="mt-0.5 text-sm font-medium text-foreground/80">
                Visits, check-ins, and route-ready scheduling — with AI-assisted review.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" className="gap-2 bg-card" onClick={() => toast.success("Route saved (demo)")}>
                <Route className="size-4" />
                Save route
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gradient-primary text-primary-foreground shadow-glow gap-2">
                    Task actions
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => toast.message("Bulk reschedule")}>Bulk reschedule</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.message("Assign to rep")}>Assign to rep</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.message("Export selection")}>Export selection</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn("shrink-0 border-border bg-card", filterSheetOpen && "border-primary/50 bg-primary/5")}
                    aria-label="Open filters"
                    onClick={() => setFilterSheetOpen(true)}
                  >
                    <Filter className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open filters</TooltipContent>
              </Tooltip>
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
              placeholder="Search by rep, contact, account, or date…"
              className="bg-card pl-9"
            />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
              <TableScrollViewport label="Appointments">
                <Table>
                  <TableHeader>
                    <TableRow
                      className={cn(
                        "hover:bg-transparent data-[state=selected]:bg-transparent",
                        appointmentsHeaderRowClass,
                      )}
                    >
                    <TableHead className={cn(appointmentsThClass, "w-12 pl-3")}>
                      <span className="sr-only">Select</span>
                    </TableHead>
                    <TableHead className={cn(appointmentsThClass, "min-w-[140px]")}>Rep</TableHead>
                    <TableHead className={cn(appointmentsThClass, "min-w-[220px]")}>Schedule</TableHead>
                    <TableHead className={cn(appointmentsThClass, "min-w-[120px]")}>Event form</TableHead>
                    <TableHead className={cn(appointmentsThClass, "w-[100px]")}>Follow up</TableHead>
                    <TableHead className={cn(appointmentsThClass, "min-w-[120px]")}>Type</TableHead>
                    <TableHead className={cn(appointmentsThClass, "w-[72px] text-center")}>Notes</TableHead>
                    <TableHead className={cn(appointmentsThClass, "min-w-[180px]")}>Account</TableHead>
                    <TableHead className={cn(appointmentsThClass, "w-[140px] text-center")}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                        No appointments match your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((r) => {
                      const expanded = expandedId === r.id;
                      return (
                        <Fragment key={r.id}>
                          <TableRow className="group align-top">
                            <TableCell className="align-top">
                              <div className="flex justify-center pt-1">
                                <Checkbox
                                  checked={!!selected[r.id]}
                                  onCheckedChange={(v) => setSelected((s) => ({ ...s, [r.id]: v === true }))}
                                  aria-label={`Select ${r.repName}`}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="flex items-start gap-2 py-0.5">
                                {initialsCell(r.repInitials)}
                                <span className="pt-1.5 text-sm font-semibold text-foreground">{r.repName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="align-top text-sm">
                              <p className="font-medium text-foreground/90">{r.dateTime}</p>
                              <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                                {formatAppointmentDuration(r.durationSec)} · {r.contactName}
                              </p>
                              <button
                                type="button"
                                onClick={() => setExpandedId(expanded ? null : r.id)}
                                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                              >
                                <ChevronDown className={cn("size-3 transition-transform", expanded && "rotate-180")} />
                                {expanded ? "Hide location" : "Location details"}
                              </button>
                            </TableCell>
                            <TableCell className="align-top text-sm text-muted-foreground">{r.eventForm ?? "—"}</TableCell>
                            <TableCell className="align-top">
                              <div className="flex items-center gap-2 pt-1">
                                <Switch
                                  checked={r.followUpNeeded}
                                  onCheckedChange={(v) => toggleFollowUp(r.id, v)}
                                  aria-label="Follow up needed"
                                />
                                <span className="text-xs font-medium text-muted-foreground">{r.followUpNeeded ? "Yes" : "No"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="align-top">{typeBadge(r.type)}</TableCell>
                            <TableCell className="text-center align-top">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={cn("size-9", r.hasNotes ? "text-emerald-600" : "text-muted-foreground/40")}
                                    aria-label="View notes"
                                    onClick={() => toast.message(r.hasNotes ? "Opening notes" : "No notes")}
                                  >
                                    <Eye className="size-[18px]" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{r.hasNotes ? "View notes" : "No notes"}</TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell className="align-top">
                              <a href="#" className="text-sm font-semibold text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                                {r.accountName}
                              </a>
                              <p className="mt-0.5 text-xs text-muted-foreground">{r.accountAddress}</p>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="flex flex-wrap items-center justify-center gap-0.5 pt-0.5">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button type="button" variant="ghost" size="icon" className="size-9 text-primary" aria-label="Add">
                                      <Plus className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Add</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button type="button" variant="ghost" size="icon" className="size-9 text-sky-600" aria-label="Schedule">
                                      <CalendarPlus className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Schedule</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button type="button" variant="ghost" size="icon" className="size-9 text-rose-600" aria-label="Delete">
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button type="button" variant="ghost" size="icon" className="size-9 text-amber-600" aria-label="Map">
                                      <MapPin className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Map</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expanded && (
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                              <TableCell colSpan={9} className="px-4 py-3 sm:px-6">
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div className="rounded-lg border border-border/80 bg-card/80 p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Start</p>
                                    <div className="mt-2 flex items-center gap-2">
                                      {r.startVerified ? (
                                        <Check className="size-4 text-emerald-600" aria-hidden />
                                      ) : (
                                        <AlertTriangle className="size-4 text-amber-500" aria-hidden />
                                      )}
                                      <span className="font-mono text-xs tabular-nums text-foreground">
                                        {r.startLat}, {r.startLng}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="rounded-lg border border-border/80 bg-card/80 p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">End</p>
                                    <div className="mt-2 flex items-center gap-2">
                                      {r.endVerified ? (
                                        r.endHasWarning ? (
                                          <AlertTriangle className="size-4 text-amber-500" aria-hidden />
                                        ) : (
                                          <Check className="size-4 text-emerald-600" aria-hidden />
                                        )
                                      ) : (
                                        <span className="text-xs text-muted-foreground">Not recorded</span>
                                      )}
                                      <span className="font-mono text-xs tabular-nums text-foreground">
                                        {r.endLat}, {r.endLng}
                                      </span>
                                    </div>
                                  </div>
                                  {r.aiTip && (
                                    <div className="sm:col-span-2 flex gap-2 rounded-lg border border-violet-200/60 bg-violet-50/50 p-3 dark:border-violet-900/40 dark:bg-violet-950/20">
                                      <Sparkles className="mt-0.5 size-4 shrink-0 text-violet-600" />
                                      <div>
                                        <p className="text-xs font-semibold text-foreground">AI note</p>
                                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.aiTip}</p>
                                      </div>
                                    </div>
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
                  aria-label="Appointments table pagination"
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={setRowsPerPage}
                  rowOptions={ROWS_OPTIONS}
                  summaryFrom={summaryFrom}
                  summaryTo={summaryTo}
                  total={total}
                  page={safePage}
                  pageCount={pageCount}
                  onPageChange={setPage}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      onClick={() => toast.success("Exporting appointments report…")}
                    >
                      <FileSpreadsheet className="size-4" />
                      Export appointments report
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      onClick={() => toast.message("Schedule appointment exports")}
                    >
                      <Calendar className="size-4" />
                      Schedule exports
                    </Button>
                  </div>
                </PagedTableFooter>
              </div>
            </div>
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-4 xl:sticky xl:top-4 xl:w-[300px]">
            <Card className="rounded-2xl border-border/80 shadow-soft">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{todayCount}</p>
                <p className="text-xs text-muted-foreground">Sample visits in dataset</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border/80 shadow-soft">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI insights ready</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{withAiTips}</p>
                <p className="text-xs text-muted-foreground">Rows with contextual tips</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-primary/20 bg-gradient-to-b from-primary/[0.06] to-card shadow-soft">
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Bot className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">CallProof AI assistant</p>
                    <p className="text-[11px] text-muted-foreground">Route &amp; visit quality</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Prioritize visits with follow-up toggled on and review any rows with GPS warnings before end of day.
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto justify-start p-0 text-xs font-bold text-primary"
                  onClick={() => toast.message("Opening AI recommendations")}
                >
                  View AI recommendations <ChevronRight className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-1 w-full gap-2"
                  onClick={() => toast.success("AI summary generated for today's route (demo)")}
                >
                  <Sparkles className="size-4" />
                  Summarize today&apos;s route
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b px-6 py-5 text-left">
            <SheetTitle>Appointment filters</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="in">In person</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Follow up</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Needs follow up</SelectItem>
                  <SelectItem value="no">No follow up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="mt-auto border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => setFilterSheetOpen(false)}>
              Close
            </Button>
            <Button type="button" className="bg-[#094E9B] text-primary-foreground hover:bg-[#094E9B]/90" onClick={() => setFilterSheetOpen(false)}>
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
