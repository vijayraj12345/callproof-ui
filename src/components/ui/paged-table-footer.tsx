import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DEFAULT_ROW_OPTIONS = [20, 50, 100] as const;

export type PagedTableFooterProps = {
  "aria-label"?: string;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
  rowOptions?: readonly number[];
  summaryFrom: number;
  summaryTo: number;
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
  children?: React.ReactNode;
  /** When false, hides the rows-per-page label and selector (e.g. SMS inbox sidebar). Default true. */
  showRowsPerPage?: boolean;
  /**
   * `stacked`: summary + controls in vertical blocks (avoids overlap in narrow sidebars).
   * `default`: responsive 3-column grid for full-width tables.
   */
  layout?: "default" | "stacked";
  /** When true, removes card chrome so the footer can sit inside a parent table card (border-t above). */
  embedded?: boolean;
};

/** Inline pagination bar matching the Accounts / Contacts screen card footer. */
function PageControls({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8 shrink-0"
        disabled={page <= 1}
        aria-label="Previous page"
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        <ChevronLeft className="size-4" />
      </Button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          type="button"
          variant={p === page ? "default" : "ghost"}
          size="sm"
          className={cn("size-8 shrink-0 p-0", p === page && "gradient-primary text-primary-foreground shadow-glow")}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8 shrink-0"
        disabled={page >= pageCount}
        aria-label="Next page"
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

export function PagedTableFooter({
  "aria-label": ariaLabel = "Table pagination",
  rowsPerPage,
  onRowsPerPageChange,
  rowOptions = DEFAULT_ROW_OPTIONS,
  summaryFrom,
  summaryTo,
  total,
  page,
  pageCount,
  onPageChange,
  className,
  children,
  showRowsPerPage = true,
  layout = "default",
  embedded = false,
}: PagedTableFooterProps) {
  const embeddedNav = embedded
    ? "rounded-none border-0 bg-transparent px-2 py-2 shadow-none sm:px-3"
    : "";

  const summary = (
    <span className="tabular-nums">
      {summaryFrom}–{summaryTo} of {total}
    </span>
  );

  if (layout === "stacked") {
    return (
      <nav
        aria-label={ariaLabel}
        className={cn(
          "flex w-full min-w-0 flex-col gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-sm shadow-soft",
          embeddedNav,
          className,
        )}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-muted-foreground">
          {showRowsPerPage ? (
            <>
              <span>Rows per page:</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={(v) => {
                  onRowsPerPageChange(Number(v));
                  onPageChange(1);
                }}
              >
                <SelectTrigger className="h-8 w-20 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rowOptions.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : null}
          {summary}
        </div>
        <PageControls page={page} pageCount={pageCount} onPageChange={onPageChange} />
        {children ? (
          <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
        ) : null}
      </nav>
    );
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "grid w-full min-w-0 grid-cols-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2 text-sm shadow-soft",
        "sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-x-3 sm:gap-y-2",
        embeddedNav,
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 text-muted-foreground sm:min-w-0 sm:justify-self-start sm:justify-start">
        {showRowsPerPage ? (
          <>
            <span>Rows per page:</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(v) => {
                onRowsPerPageChange(Number(v));
                onPageChange(1);
              }}
            >
              <SelectTrigger className="h-8 w-20 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rowOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : null}
        {summary}
      </div>

      <PageControls page={page} pageCount={pageCount} onPageChange={onPageChange} />

      {children ? (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:min-w-0 sm:justify-self-end sm:justify-end">
          {children}
        </div>
      ) : (
        <div className="hidden min-h-0 sm:block sm:min-w-0" aria-hidden />
      )}
    </nav>
  );
}
