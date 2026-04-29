import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  Filter,
  MapPinned,
  MoreHorizontal,
  Pencil,
  Plus,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import {
  buildRoutesSampleRows,
  computeRoutesKpis,
  type RouteRow,
  type RouteStatus,
} from "@/data/routesSampleData";
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

const ROWS_OPTIONS = [20, 50, 100] as const;

const routesHeaderRowClass = cn(
  "border-b border-white/20 bg-gradient-to-r from-[#094E9B] via-[#0d62c9] to-[#052d57]",
  "hover:!bg-gradient-to-r hover:!from-[#094E9B] hover:!via-[#0d62c9] hover:!to-[#052d57]",
);

const routesThClass = cn(
  "relative h-12 bg-transparent px-3 text-left align-middle text-xs font-semibold uppercase tracking-wide text-white sm:px-4",
);

function initials(name: string): string {
  const p = name.split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[1][0]).toUpperCase();
}

function avatarHue(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h += seed.charCodeAt(i);
  return 200 + (h % 120);
}

function KpiSpark({ stroke }: { stroke: string }) {
  const pts = "0,12 6,8 12,10 18,5 24,7 30,3 36,5";
  return (
    <svg viewBox="0 0 36 14" className="mt-2 h-5 w-full max-w-[80px]" aria-hidden>
      <polyline
        fill="none"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        className={cn("fill-none", stroke)}
      />
    </svg>
  );
}

function statusBadge(status: RouteStatus) {
  if (status === "Active") {
    return (
      <Badge className="rounded-full bg-emerald-600 px-2.5 font-semibold text-white hover:bg-emerald-600/90">Active</Badge>
    );
  }
  return (
    <Badge variant="secondary" className="rounded-full border-border/80 px-2.5 font-semibold text-muted-foreground">
      Inactive
    </Badge>
  );
}

export function RoutesView() {
  const [rows] = useState<RouteRow[]>(() => buildRoutesSampleRows(40));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RouteStatus>("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filterOpen, setFilterOpen] = useState(false);

  const kpis = useMemo(() => computeRoutesKpis(rows), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.repName.toLowerCase().includes(q) ||
        r.routeName.toLowerCase().includes(q) ||
        r.assignTo.toLowerCase().includes(q)
      );
    });
  }, [rows, search, statusFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);
  const summaryFrom = total === 0 ? 0 : start + 1;
  const summaryTo = Math.min(start + rowsPerPage, total);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto">
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
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">Routes</h1>
                <Badge variant="outline" className="gap-1 border-primary/30 bg-primary/5 text-xs font-semibold text-primary">
                  <Sparkles className="size-3.5" />
                  AI Enhanced
                </Badge>
              </div>
              <p className="mt-1 max-w-2xl text-sm font-medium text-foreground/80">
                Plan, assign, and optimize field routes with AI-assisted usage patterns and health signals.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button
                className="gradient-primary gap-2 text-primary-foreground shadow-glow"
                onClick={() => toast.message("Add route (demo)")}
              >
                <Plus className="size-4" />
                Add Route
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn("shrink-0 border-border bg-card", filterOpen && "border-primary/50 bg-primary/5")}
                    aria-label="Filters"
                    onClick={() => setFilterOpen(true)}
                  >
                    <Filter className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filters</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* KPI strip — kpi-card style for soft surfaces */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Route KPIs">
          <Card className="kpi-card animate-kpi-bubble border shadow-soft" style={{ animationDelay: "0s" }}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <MapPinned className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Total routes</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{kpis.totalRoutes}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card animate-kpi-bubble border shadow-soft" style={{ animationDelay: "0.6s" }}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                <CheckCircle2 className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Active routes</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{kpis.activeRoutes}</p>
                <p className="text-xs font-semibold text-emerald-600">{kpis.activePct}% of total</p>
                <KpiSpark stroke="stroke-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card animate-kpi-bubble border shadow-soft" style={{ animationDelay: "1.2s" }}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
                <Clock className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Updated this month</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{kpis.updatedThisMonth}</p>
                <KpiSpark stroke="stroke-violet-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card animate-kpi-bubble border shadow-soft" style={{ animationDelay: "1.8s" }}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                <Star className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Most used route</p>
                <p className="mt-1 truncate text-lg font-bold text-foreground" title={kpis.mostUsedRouteName}>
                  {kpis.mostUsedRouteName}
                </p>
                <p className="text-xs text-muted-foreground">{kpis.mostUsedRouteUses} assignments</p>
                <KpiSpark stroke="stroke-amber-500" />
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="kpi-card rounded-2xl border p-4 shadow-soft sm:p-5">
          <div className="flex flex-wrap items-start gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">AI route insight</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Active coverage is strong. Consider consolidating low-traffic variants of &quot;{kpis.mostUsedRouteName}&quot; to reduce
                rep confusion and shorten average stop distance this week.
              </p>
              <Button type="button" variant="link" className="mt-1 h-auto p-0 text-sm font-semibold text-primary" onClick={() => toast.message("Opening AI recommendations (demo)")}>
                View AI recommendations →
              </Button>
            </div>
          </div>
        </div>

        <div className="relative max-w-md">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search routes, reps, or assignees…"
            className="bg-card"
            aria-label="Search routes"
          />
        </div>

        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          <TableScrollViewport label="Routes list">
            <Table>
              <TableHeader>
                <TableRow className={cn("hover:bg-transparent data-[state=selected]:bg-transparent", routesHeaderRowClass)}>
                  <TableHead className={cn(routesThClass, "w-14 text-center")}>Profile</TableHead>
                  <TableHead className={cn(routesThClass, "min-w-[120px]")}>Rep</TableHead>
                  <TableHead className={cn(routesThClass, "min-w-[180px]")}>Route name</TableHead>
                  <TableHead className={cn(routesThClass, "min-w-[120px]")}>Assign to</TableHead>
                  <TableHead className={cn(routesThClass, "min-w-[200px]")}>Create date</TableHead>
                  <TableHead className={cn(routesThClass, "min-w-[100px]")}>Status</TableHead>
                  <TableHead className={cn(routesThClass, "w-[120px] text-center")}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No routes match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((r) => (
                    <TableRow key={r.id} className="group">
                      <TableCell className="text-center align-middle">
                        <div
                          className="mx-auto flex size-9 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ring-2 ring-primary/15"
                          style={{ backgroundColor: `hsl(${avatarHue(r.seed)} 55% 42%)` }}
                          aria-hidden
                        >
                          {initials(r.repName)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[160px] min-w-0 align-middle font-medium text-foreground">
                        <span className="line-clamp-2 break-words">{r.repName}</span>
                      </TableCell>
                      <TableCell className="max-w-[min(280px,40vw)] min-w-0 align-middle">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span className="min-w-0 truncate font-medium text-foreground" title={r.routeName}>
                            {r.routeName}
                          </span>
                          {r.isPrimary ? (
                            <Badge className="rounded-full bg-sky-600 px-2 text-[10px] font-semibold text-white hover:bg-sky-600/90">
                              Primary
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[160px] min-w-0 align-middle text-sm text-muted-foreground">
                        <span className="line-clamp-2 break-words">{r.assignTo}</span>
                      </TableCell>
                      <TableCell className="max-w-[min(240px,36vw)] min-w-0 align-middle text-sm tabular-nums text-muted-foreground">
                        <span className="block truncate" title={r.createDate}>
                          {r.createDate}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle">{statusBadge(r.status)}</TableCell>
                      <TableCell className="text-center align-middle">
                        <div className="flex items-center justify-center gap-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button type="button" variant="ghost" size="icon" className="size-9 text-primary" aria-label="Edit route" onClick={() => toast.message("Edit route (demo)")}>
                                <Pencil className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-9 text-destructive"
                                aria-label="Delete route"
                                onClick={() => toast.message("Delete route (demo)")}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button type="button" variant="ghost" size="icon" className="size-9 text-muted-foreground" aria-label="More actions">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast.message("Duplicate route")}>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.message("Export GPX")}>Export GPX</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableScrollViewport>
          <div className="border-t border-border bg-muted/5">
            <PagedTableFooter
              embedded
              aria-label="Routes table pagination"
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
              rowOptions={ROWS_OPTIONS}
              summaryFrom={summaryFrom}
              summaryTo={summaryTo}
              total={total}
              page={safePage}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b px-6 py-5 text-left">
            <SheetTitle>Route filters</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v as "all" | RouteStatus);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="border-t px-6 py-4">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setFilterOpen(false)}>
              Done
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
