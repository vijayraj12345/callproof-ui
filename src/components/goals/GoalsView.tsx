import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, Filter, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { goalsSampleData, type GoalStatus, type SalesGoal } from "@/data/goalsSampleData";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { PagedTableFooter } from "@/components/ui/paged-table-footer";
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
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const BRAND_HEADER = "text-[#094E9B]";
const BRAND_BLUE = "#094E9B";

/** Header row: horizontal gradient anchored on brand blue `#094E9B`. */
const goalsHeaderRowClass = cn(
  "border-b border-white/20 bg-gradient-to-r from-[#094E9B] via-[#0d62c9] to-[#052d57]",
  "hover:!bg-gradient-to-r hover:!from-[#094E9B] hover:!via-[#0d62c9] hover:!to-[#052d57]",
  "data-[state=selected]:!bg-gradient-to-r data-[state=selected]:!from-[#094E9B] data-[state=selected]:!via-[#0d62c9] data-[state=selected]:!to-[#052d57]",
);

/** Goals table header (`th`) — text over row gradient. */
const goalsThClass = cn(
  "relative h-12 bg-transparent px-4 text-left align-middle text-sm font-semibold tracking-wide text-white",
);

const ROWS_OPTIONS = [20, 50, 100] as const;

type GoalTypeFilter = "all" | "Dollar" | "Points";

type GoalsTableFilters = {
  goalType: GoalTypeFilter;
  user: string;
  status: GoalStatus | "all";
  marketsOn: boolean;
  market: string;
};

const defaultGoalsTableFilters: GoalsTableFilters = {
  goalType: "all",
  user: "all",
  status: "all",
  marketsOn: false,
  market: "all",
};

function filtersAreActive(f: GoalsTableFilters): boolean {
  return (
    f.goalType !== "all" ||
    f.user !== "all" ||
    f.status !== "all" ||
    (f.marketsOn && f.market !== "all")
  );
}

function initialsFromLabel(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function UserMarketCell({ name }: { name: string }) {
  const initials = initialsFromLabel(name);
  return (
    <div className="flex items-center gap-3 py-0.5">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ring-2 ring-white/25"
        style={{ backgroundColor: BRAND_BLUE }}
        aria-hidden
      >
        {initials}
      </div>
      <span className="min-w-0 font-medium leading-snug text-foreground">{name}</span>
    </div>
  );
}

function statusBadge(status: GoalStatus) {
  switch (status) {
    case "Ongoing":
      return (
        <Badge variant="secondary" className="bg-sky-100 text-sky-900 hover:bg-sky-100/90 border-sky-200/80">
          Ongoing
        </Badge>
      );
    case "Completed":
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100/90 border-emerald-200/80">
          Completed
        </Badge>
      );
    case "Cancelled":
      return (
        <Badge variant="outline" className="text-muted-foreground border-dashed">
          Cancelled
        </Badge>
      );
    default:
      return null;
  }
}

export function GoalsView() {
  const [goals, setGoals] = useState<SalesGoal[]>(goalsSampleData);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<GoalsTableFilters>(defaultGoalsTableFilters);
  const [draftFilters, setDraftFilters] = useState<GoalsTableFilters>(defaultGoalsTableFilters);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const [viewNotes, setViewNotes] = useState<{ title: string; body: string } | null>(null);
  const [editNotes, setEditNotes] = useState<{ id: number; text: string } | null>(null);
  const [editGoal, setEditGoal] = useState<SalesGoal | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNotesField, setEditNotesField] = useState("");
  const [editRestart, setEditRestart] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<SalesGoal | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const userMarketOptions = useMemo(
    () => [...new Set(goals.map((g) => g.userMarket))].sort((a, b) => a.localeCompare(b)),
    [goals],
  );

  const filtered = useMemo(() => {
    const f = appliedFilters;
    return goals.filter((g) => {
      if (f.status !== "all" && g.status !== f.status) return false;
      if (f.goalType === "Dollar" && !g.goalSummary.includes("Dollar")) return false;
      if (f.goalType === "Points" && !g.goalSummary.includes("Points")) return false;
      if (f.user !== "all" && g.userMarket !== f.user) return false;
      if (f.marketsOn && f.market !== "all" && g.userMarket !== f.market) return false;
      return true;
    });
  }, [goals, appliedFilters]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);
  const summaryFrom = total === 0 ? 0 : start + 1;
  const summaryTo = Math.min(start + rowsPerPage, total);

  const canEdit = (g: SalesGoal) => g.status === "Ongoing";
  const canCancel = (g: SalesGoal) => g.status === "Ongoing";
  const showComplete = (g: SalesGoal) => g.status !== "Cancelled";
  const completeDisabled = (g: SalesGoal) => g.status === "Completed" || g.status === "Cancelled";

  const saveNotes = () => {
    if (!editNotes) return;
    setGoals((prev) => prev.map((g) => (g.id === editNotes.id ? { ...g, notes: editNotes.text } : g)));
    toast.success("Notes saved");
    setEditNotes(null);
  };

  const saveGoalEdit = () => {
    if (!editGoal) return;
    const n = Number(editAmount);
    if (!Number.isFinite(n) || n < 1) {
      toast.error("Enter a valid amount (minimum 1).");
      return;
    }
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== editGoal.id) return g;
        const isDollar = g.goalSummary.includes("Dollar");
        return {
          ...g,
          dollarTarget: isDollar ? n : g.dollarTarget,
          pointsTarget: isDollar ? g.pointsTarget : n,
          maximumTarget: n,
          goalSummary: isDollar ? `${n} (Dollar)` : `${n} (Points)`,
          notes: editNotesField,
          restartWhenComplete: editRestart,
        };
      }),
    );
    toast.success("Goal updated");
    setEditGoal(null);
  };

  const confirmCancel = () => {
    if (!cancelTarget) return;
    setGoals((prev) =>
      prev.map((g) => (g.id === cancelTarget.id ? { ...g, status: "Cancelled" as const, completed: false } : g)),
    );
    toast.success("Goal cancelled");
    setCancelTarget(null);
  };

  const toggleComplete = (g: SalesGoal, checked: boolean) => {
    if (completeDisabled(g)) return;
    setGoals((prev) =>
      prev.map((row) =>
        row.id === g.id
          ? {
              ...row,
              completed: checked,
              status: checked ? ("Completed" as const) : ("Ongoing" as const),
            }
          : row,
      ),
    );
    toast.message(checked ? "Marked complete" : "Marked ongoing");
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

  const clearDraftFilters = () => setDraftFilters({ ...defaultGoalsTableFilters });

  const clearAppliedFilters = () => {
    setAppliedFilters({ ...defaultGoalsTableFilters });
    setDraftFilters({ ...defaultGoalsTableFilters });
    setPage(1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        <header className="relative overflow-hidden rounded-2xl border border-primary/15 p-4 shadow-soft sm:p-5">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-violet-500/[0.07] to-accent/[0.12]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent dark:via-white/[0.05]" aria-hidden />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">Goals</h1>
          <p className="mt-0.5 text-sm font-medium text-foreground/80">Track dollar and point targets by rep or market.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="gradient-primary text-primary-foreground shadow-glow gap-2" onClick={() => setAddOpen(true)}>
            <PlusCircle className="size-4" />
            Add Goal
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn("shrink-0 border-border", filterSheetOpen && "border-primary/50 bg-primary/5")}
                aria-label="Open goals filters"
                aria-expanded={filterSheetOpen}
                onClick={() => {
                  if (filterSheetOpen) setFilterSheetOpen(false);
                  else openFilterSheet();
                }}
              >
                <Filter className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open filters</TooltipContent>
          </Tooltip>
        </div>
          </div>
        </header>

        {filtersAreActive(appliedFilters) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Active filters:</span>
            {appliedFilters.goalType !== "all" && (
              <span>
                Type <span className="text-foreground">{appliedFilters.goalType}</span>
              </span>
            )}
            {appliedFilters.user !== "all" && (
              <span>
                User <span className="text-foreground">{appliedFilters.user}</span>
              </span>
            )}
            {appliedFilters.marketsOn && appliedFilters.market !== "all" && (
              <span>
                Market <span className="text-foreground">{appliedFilters.market}</span>
              </span>
            )}
            {appliedFilters.status !== "all" && (
              <span>
                Status <span className="text-foreground">{appliedFilters.status}</span>
              </span>
            )}
            <Button variant="link" className="h-auto p-0 text-xs" onClick={clearAppliedFilters}>
              Clear all
            </Button>
          </div>
        )}

        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          <TableScrollViewport label="Goals">
            <Table>
              <TableHeader>
                <TableRow
                  className={cn(
                    "hover:bg-transparent data-[state=selected]:bg-transparent",
                    goalsHeaderRowClass,
                  )}
                >
              <TableHead className={cn(goalsThClass, "min-w-[200px]")}>User / Market</TableHead>
              <TableHead className={cn(goalsThClass, "min-w-[100px]")}>Goal</TableHead>
              <TableHead className={cn(goalsThClass, "min-w-[140px]")}>End date</TableHead>
              <TableHead className={cn(goalsThClass, "w-[110px]")}>Status</TableHead>
              <TableHead className={cn(goalsThClass, "min-w-[100px]")}>Result</TableHead>
              <TableHead className={cn(goalsThClass, "w-[72px] text-center")}>Notes</TableHead>
              <TableHead className={cn(goalsThClass, "w-[120px] text-center")}>Mark complete</TableHead>
              <TableHead className={cn(goalsThClass, "w-[100px] text-center")}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  No goals match this filter.
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((g) => (
                <TableRow key={g.id} className="group">
                  <TableCell className="align-top">
                    <UserMarketCell name={g.userMarket} />
                  </TableCell>
                  <TableCell className="align-top">{g.goalSummary}</TableCell>
                  <TableCell className="text-muted-foreground align-top text-sm">{g.endDate}</TableCell>
                  <TableCell className="align-top">{statusBadge(g.status)}</TableCell>
                  <TableCell className="font-mono text-sm tabular-nums align-top">{g.resultSummary}</TableCell>
                  <TableCell className="text-center align-top">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-9 text-muted-foreground hover:text-[#094E9B]"
                          aria-label="View notes"
                          onClick={() => setViewNotes({ title: "Notes", body: g.notes || "—" })}
                        >
                          <Eye className="size-[18px]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View notes</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center align-top">
                    {showComplete(g) ? (
                      <div className="flex justify-center pt-1">
                        <Switch
                          checked={g.completed || g.status === "Completed"}
                          disabled={g.status === "Completed" || g.status === "Cancelled"}
                          onCheckedChange={(v) => toggleComplete(g, v)}
                          aria-label={g.completed || g.status === "Completed" ? "Completed" : "Mark as completed"}
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center align-top">
                    <div className="flex items-center justify-center gap-1 pt-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9"
                              disabled={!canEdit(g)}
                              aria-label="Edit goal"
                              onClick={() => {
                                setEditGoal(g);
                                const amt = g.dollarTarget ?? g.pointsTarget ?? 1;
                                setEditAmount(String(amt));
                                setEditNotesField(g.notes);
                                setEditRestart(g.restartWhenComplete);
                              }}
                            >
                              <Pencil className="size-4" />
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{canEdit(g) ? "Edit goal" : "Only ongoing goals can be edited"}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 text-muted-foreground hover:text-destructive"
                              disabled={!canCancel(g)}
                              aria-label="Cancel goal"
                              onClick={() => setCancelTarget(g)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{canCancel(g) ? "Cancel goal" : "Cannot cancel this goal"}</TooltipContent>
                      </Tooltip>
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
              aria-label="Goals table pagination"
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

      <Sheet
        open={filterSheetOpen}
        onOpenChange={(open) => {
          setFilterSheetOpen(open);
          if (open) setDraftFilters(appliedFilters);
        }}
      >
        <SheetContent side="right" className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="space-y-1 border-b px-6 py-5 text-left">
            <SheetTitle>Goals Filter</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
            <div className="space-y-2">
              <Label htmlFor="filter-goal-type">Goal Type</Label>
              <Select
                value={draftFilters.goalType}
                onValueChange={(v: GoalTypeFilter) => setDraftFilters((d) => ({ ...d, goalType: v }))}
              >
                <SelectTrigger id="filter-goal-type" className="w-full">
                  <SelectValue placeholder="all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="Dollar">Dollar</SelectItem>
                  <SelectItem value="Points">Points</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-user">Select User</Label>
              <Select value={draftFilters.user} onValueChange={(v) => setDraftFilters((d) => ({ ...d, user: v }))}>
                <SelectTrigger id="filter-user" className="w-full">
                  <SelectValue placeholder="all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  {userMarketOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="filter-markets-on"
                checked={draftFilters.marketsOn}
                onCheckedChange={(c) =>
                  setDraftFilters((d) => ({
                    ...d,
                    marketsOn: c === true,
                    market: c === true ? d.market : "all",
                  }))
                }
              />
              <Label htmlFor="filter-markets-on" className="cursor-pointer text-sm font-normal leading-none">
                Select Markets
              </Label>
            </div>
            {draftFilters.marketsOn && (
              <div className="space-y-2">
                <Label htmlFor="filter-market">Market</Label>
                <Select value={draftFilters.market} onValueChange={(v) => setDraftFilters((d) => ({ ...d, market: v }))}>
                  <SelectTrigger id="filter-market" className="w-full">
                    <SelectValue placeholder="all" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all</SelectItem>
                    {userMarketOptions.map((name) => (
                      <SelectItem key={`m-${name}`} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="filter-status">Goal Status</Label>
              <Select
                value={draftFilters.status}
                onValueChange={(v: GoalStatus | "all") => setDraftFilters((d) => ({ ...d, status: v }))}
              >
                <SelectTrigger id="filter-status" className="w-full">
                  <SelectValue placeholder="all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
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

      {/* View notes (read-only) */}
      <Dialog open={!!viewNotes} onOpenChange={(o) => !o && setViewNotes(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={BRAND_HEADER}>{viewNotes?.title}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-y-auto rounded-md border bg-muted/30 px-3 py-3 text-sm text-foreground whitespace-pre-wrap">
            {viewNotes?.body}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setViewNotes(null)}>
              Close
            </Button>
            {viewNotes && (
              <Button
                className="gradient-primary text-primary-foreground"
                onClick={() => {
                  const row = goals.find((x) => (x.notes || "—") === viewNotes.body || x.notes === viewNotes.body);
                  if (row) setEditNotes({ id: row.id, text: row.notes });
                  setViewNotes(null);
                }}
              >
                Edit notes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit goal notes */}
      <Dialog open={!!editNotes} onOpenChange={(o) => !o && setEditNotes(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className={BRAND_HEADER}>Edit goal notes</DialogTitle>
          </DialogHeader>
          <Textarea
            rows={6}
            value={editNotes?.text ?? ""}
            onChange={(e) => setEditNotes((prev) => (prev ? { ...prev, text: e.target.value } : null))}
            className="resize-y min-h-[140px]"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditNotes(null)}>
              Cancel
            </Button>
            <Button className="gradient-primary text-primary-foreground" onClick={saveNotes}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit goal (amount + notes + restart) */}
      <Dialog open={!!editGoal} onOpenChange={(o) => !o && setEditGoal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className={BRAND_HEADER}>Edit goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="goal-amount">Amount</Label>
              <Input
                id="goal-amount"
                type="number"
                min={1}
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="Enter the amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-notes">Notes</Label>
              <Textarea
                id="goal-notes"
                rows={4}
                placeholder="Enter notes"
                value={editNotesField}
                onChange={(e) => setEditNotesField(e.target.value)}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 rounded border-input"
                checked={editRestart}
                onChange={(e) => setEditRestart(e.target.checked)}
              />
              Restart goal when completed?
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGoal(null)}>
              Cancel
            </Button>
            <Button className="gradient-primary text-primary-foreground" onClick={saveGoalEdit}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation */}
      <AlertDialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the goal as cancelled. You can filter cancelled goals from the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel goal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add goal placeholder */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={BRAND_HEADER}>Add goal</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Wire this form to your existing <code className="rounded bg-muted px-1 py-0.5 text-xs">addNewGoalSubmission</code> API.
            Fields from your legacy template (target type, market, dates) can render in this panel.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
