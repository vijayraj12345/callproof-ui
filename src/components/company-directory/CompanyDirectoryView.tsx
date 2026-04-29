import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronDown,
  Filter,
  Map,
  Pencil,
  PlusCircle,
  RefreshCw,
  Search,
  FileSpreadsheet,
} from "lucide-react";
import {
  companyDirectorySampleData,
  repDisplayName,
  type CompanyRep,
} from "@/data/companyDirectorySampleData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const BRAND_BLUE = "#094E9B";

const directoryHeaderRowClass = cn(
  "border-b border-white/20 bg-gradient-to-r from-[#094E9B] via-[#0d62c9] to-[#052d57]",
  "hover:!bg-gradient-to-r hover:!from-[#094E9B] hover:!via-[#0d62c9] hover:!to-[#052d57]",
  "data-[state=selected]:!bg-gradient-to-r data-[state=selected]:!from-[#094E9B] data-[state=selected]:!via-[#0d62c9] data-[state=selected]:!to-[#052d57]",
);

const directoryThClass = cn(
  "relative h-12 bg-transparent px-4 text-left align-middle text-sm font-semibold tracking-wide text-white",
);

const ROWS_OPTIONS = [20, 50, 100] as const;

type SortKey = "name" | "activity" | "accounts";
type StatusFilter = "all" | "active" | "inactive";

function initialsFromRep(r: CompanyRep): string {
  const a = r.firstName?.[0] ?? "";
  const b = r.lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

export function CompanyDirectoryView() {
  const navigate = useNavigate();
  const [reps] = useState<CompanyRep[]>(companyDirectorySampleData);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [draftSearch, setDraftSearch] = useState("");
  const [draftStatus, setDraftStatus] = useState<StatusFilter>("active");
  const [addOpen, setAddOpen] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = reps.filter((r) => {
      if (statusFilter === "active" && !r.accountEnabled) return false;
      if (statusFilter === "inactive" && r.accountEnabled) return false;
      if (search) {
        const q = search.toLowerCase();
        const blob = `${repDisplayName(r)} ${r.email} ${r.address} ${r.markets.join(" ")}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "name") return repDisplayName(a).localeCompare(repDisplayName(b));
      if (sortBy === "accounts") return b.accounts - a.accounts;
      return b.lastActivity.localeCompare(a.lastActivity);
    });
    return list;
  }, [reps, search, sortBy, statusFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);
  const summaryFrom = total === 0 ? 0 : start + 1;
  const summaryTo = Math.min(start + rowsPerPage, total);

  const openFilterSheet = () => {
    setDraftSearch(search);
    setDraftStatus(statusFilter);
    setFilterSheetOpen(true);
  };
  const applyFilters = () => {
    setSearch(draftSearch);
    setStatusFilter(draftStatus);
    setFilterSheetOpen(false);
    setPage(1);
  };
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("active");
    setSortBy("name");
    setDraftSearch("");
    setDraftStatus("active");
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
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent dark:via-white/[0.05]"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">
                Company Directory
              </h1>
              <p className="mt-0.5 text-sm font-medium text-foreground/80">
                Manage reps, access, and territories — open a rep to edit full profile.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button className="gradient-primary text-primary-foreground shadow-glow gap-2" onClick={() => setAddOpen(true)}>
                <PlusCircle className="size-4" />
                Add Rep
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-primary/25">
                    Quick Links
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => toast.message("Opening territories")}>Markets &amp; Territories</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.message("Opening titles")}>Titles &amp; Assignments</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.message("Opening exports")}>My Exports</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="relative mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="relative min-w-0 flex-1 sm:min-w-[200px]">
              <Label htmlFor="dir-search" className="sr-only">
                Search reps
              </Label>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="dir-search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search reps…"
                className="bg-card pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v as SortKey); setPage(1); }}>
              <SelectTrigger className="w-full bg-card sm:w-[160px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort: Name</SelectItem>
                <SelectItem value="activity">Sort: Last activity</SelectItem>
                <SelectItem value="accounts">Sort: Accounts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as StatusFilter); setPage(1); }}>
              <SelectTrigger className="w-full bg-card sm:w-[160px]">
                <SelectValue placeholder="User status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="default" className="gap-2 bg-[#094E9B] hover:bg-[#094E9B]/90" onClick={openFilterSheet}>
                <Filter className="size-4" />
                Filter
              </Button>
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </header>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow
                className={cn(
                  "hover:bg-transparent data-[state=selected]:bg-transparent",
                  directoryHeaderRowClass,
                )}
              >
                <TableHead className={cn(directoryThClass, "min-w-[220px]")}>Name</TableHead>
                <TableHead className={cn(directoryThClass, "min-w-[200px]")}>Address</TableHead>
                <TableHead className={cn(directoryThClass, "min-w-[140px]")}>Markets</TableHead>
                <TableHead className={cn(directoryThClass, "min-w-[180px]")}>Phone number</TableHead>
                <TableHead className={cn(directoryThClass, "w-[100px]")}>Accounts</TableHead>
                <TableHead className={cn(directoryThClass, "min-w-[140px]")}>GPS</TableHead>
                <TableHead className={cn(directoryThClass, "w-[140px] text-center")}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No reps match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((r) => (
                  <TableRow key={r.id} className="group">
                    <TableCell className="align-top">
                      <div className="flex items-start gap-3 py-0.5">
                        <div
                          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ring-2 ring-primary/20"
                          style={{ backgroundColor: BRAND_BLUE }}
                          aria-hidden
                        >
                          {initialsFromRep(r)}
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/users/${r.id}`}
                            className="font-semibold text-primary underline-offset-2 hover:underline"
                          >
                            {repDisplayName(r)}
                          </Link>
                          <div className="mt-1 text-xs">
                            {r.accountEnabled ? (
                              <span className="font-medium text-emerald-600">Account enabled</span>
                            ) : (
                              <span className="font-medium text-muted-foreground">Account disabled</span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-muted-foreground">Last activity: {r.lastActivity}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[260px] align-top text-sm">
                      <p className="text-foreground">{r.address}</p>
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground tabular-nums">
                        {r.lat.toFixed(4)}, {r.lng.toFixed(4)}
                      </p>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap gap-1">
                        {r.markets.map((m) => (
                          <Badge key={m} variant="secondary" className="text-[10px] font-medium">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="align-top text-sm">
                      <ul className="space-y-0.5">
                        {r.phones.map((p) => (
                          <li key={p} className="font-mono text-xs tabular-nums">
                            {p}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="align-top font-mono text-sm tabular-nums">{r.accounts}</TableCell>
                    <TableCell className="align-top">
                      <Button type="button" variant="link" className="h-auto p-0 text-xs font-mono" asChild>
                        <a
                          href={`https://www.google.com/maps?q=${r.lat},${r.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View map
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex items-center justify-center gap-0.5 pt-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9"
                              aria-label="Edit rep"
                              onClick={() => navigate(`/users/${r.id}`)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit rep</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="size-9" aria-label="Add related">
                              <PlusCircle className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="size-9" aria-label="View on map">
                              <Map className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Map</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="size-9" aria-label="Refresh row">
                              <RefreshCw className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Refresh</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PagedTableFooter
        aria-label="Company directory pagination"
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
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          onClick={() => toast.success("Exporting rep search results…")}
        >
          <FileSpreadsheet className="size-4" />
          Export rep search results
        </Button>
      </PagedTableFooter>

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b px-6 py-5 text-left">
            <SheetTitle>Directory filters</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
            <div className="space-y-2">
              <Label htmlFor="sheet-search">Search</Label>
              <Input id="sheet-search" value={draftSearch} onChange={(e) => setDraftSearch(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>User status</Label>
              <Select value={draftStatus} onValueChange={(v) => setDraftStatus(v as StatusFilter)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="mt-auto flex-row justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => setFilterSheetOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-[#094E9B] text-primary-foreground hover:bg-[#094E9B]/90" onClick={applyFilters}>
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-md">
          <SheetHeader className="border-b px-6 py-5 text-left">
            <SheetTitle>Add rep</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 px-6 py-5">
            <div className="grid gap-2">
              <Label htmlFor="add-fn">First name</Label>
              <Input id="add-fn" placeholder="First name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-ln">Last name</Label>
              <Input id="add-ln" placeholder="Last name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-em">Email</Label>
              <Input id="add-em" type="email" placeholder="Email" />
            </div>
            <div className="grid gap-2">
              <Label>Title</Label>
              <Select defaultValue="rep">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rep">Sales rep</SelectItem>
                  <SelectItem value="mgr">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-pw">Password</Label>
              <Input id="add-pw" type="password" placeholder="Password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-pw2">Confirm password</Label>
              <Input id="add-pw2" type="password" placeholder="Confirm password" />
            </div>
          </div>
          <SheetFooter className="mt-auto flex-col gap-2 border-t px-6 py-4 sm:flex-row sm:justify-stretch">
            <Button type="button" className="w-full bg-[#094E9B] text-primary-foreground hover:bg-[#094E9B]/90 sm:flex-1" onClick={() => { toast.success("User created (demo)"); setAddOpen(false); }}>
              Create user
            </Button>
            <Button type="button" variant="secondary" className="w-full sm:flex-1" onClick={() => toast.message("Copy existing user")}>
              Copy existing user
            </Button>
            <Button type="button" variant="outline" className="w-full border-primary/40 sm:flex-1" onClick={() => toast.message("Replace existing user")}>
              Replace existing user
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
