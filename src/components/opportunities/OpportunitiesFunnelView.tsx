import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Bot,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Circle,
  Filter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import {
  formatUsd,
  funnelColumns,
  funnelKpis,
  funnelRecentActivity,
  type FunnelColumn,
  type FunnelStageAccent,
  type OpportunityCard,
} from "@/data/opportunitiesFunnelSampleData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function MiniSparkline({ strokeClassName }: { strokeClassName: string }) {
  const pts = "0,28 24,18 48,22 72,8 96,14 120,4";
  return (
    <svg viewBox="0 0 120 32" className="h-10 w-full max-w-[140px]" aria-hidden>
      <polyline
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        className={strokeClassName}
      />
    </svg>
  );
}

function stageAccentBar(accent: FunnelStageAccent): string {
  const map: Record<FunnelStageAccent, string> = {
    blue: "bg-primary",
    purple: "bg-[#7C3AED]",
    orange: "bg-[#EA580C]",
    green: "bg-[#16A34A]",
    sky: "bg-[#0EA5E9]",
  };
  return map[accent];
}

function DealCardUi({ card }: { card: OpportunityCard }) {
  return (
    <div className="group rounded-xl border border-border/80 bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{card.title}</h4>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="size-7 shrink-0 text-muted-foreground">
              <MoreHorizontal className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>More actions</TooltipContent>
        </Tooltip>
      </div>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{card.category}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">Created {card.created}</p>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {card.starred && <Star className="size-3.5 fill-amber-400 text-amber-500" aria-label="Starred" />}
          {card.score != null && (
            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
              {card.score}
            </span>
          )}
        </div>
        <span className="font-mono text-sm font-bold tabular-nums text-foreground">{formatUsd(card.value)}</span>
      </div>
    </div>
  );
}

function KanbanColumn({ col }: { col: FunnelColumn }) {
  return (
    <div className="flex w-[min(100vw-2rem,280px)] shrink-0 flex-col rounded-2xl border border-border/90 bg-card shadow-soft sm:w-[272px]">
      <div className={cn("h-1.5 w-full shrink-0 rounded-t-2xl", stageAccentBar(col.accent))} />
      <div className="border-b border-border/70 px-3 py-3">
        <h3 className="text-[13px] font-bold leading-tight text-foreground">{col.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80">{col.count}</span> deals ·{" "}
          <span className="font-mono font-semibold tabular-nums text-foreground">{formatUsd(col.columnTotal)}</span>
        </p>
      </div>
      <div className="flex max-h-[min(52vh,520px)] min-h-[200px] flex-1 flex-col gap-2 overflow-y-auto overscroll-y-contain p-2">
        {col.cards.map((c) => (
          <DealCardUi key={c.id} card={c} />
        ))}
      </div>
      <button
        type="button"
        className="border-t border-border/70 px-3 py-2.5 text-left text-xs font-semibold text-primary transition-colors hover:bg-muted/50"
        onClick={() => toast.message(`Showing ${col.moreCount} more in ${col.title}`)}
      >
        + {col.moreCount} more
      </button>
    </div>
  );
}

export function OpportunitiesFunnelView() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        {/* Match GoalsView: gradient hero header + toolbar row */}
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
              <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">Opportunities</h1>
              <p className="mt-0.5 text-sm font-medium text-foreground/80">
                Track, manage and close more deals with AI assistance.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button className="gradient-primary text-primary-foreground shadow-glow gap-2" onClick={() => toast.success("New opportunity (demo)")}>
                <PlusCircle className="size-4" />
                New Opportunity
              </Button>
              <Button type="button" variant="outline" className="gap-2 bg-card" onClick={() => toast.message("Import opportunities")}>
                <Upload className="size-4" />
                Import
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0 border-border bg-card"
                    aria-label="Open filters"
                    onClick={() => toast.message("Filters")}
                  >
                    <Filter className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open filters</TooltipContent>
              </Tooltip>
              <Button type="button" variant="outline" className="gap-2 bg-card font-normal text-muted-foreground">
                <CalendarRange className="size-4" />
                Apr 14 – May 14, 2026
              </Button>
            </div>
          </div>
          <div className="relative mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search opportunities, accounts, contacts…"
                className="bg-card pl-9"
              />
            </div>
          </div>
        </header>

      {/* Kanban + right rail */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1 overflow-x-auto rounded-2xl pb-1 xl:overflow-x-auto">
          <div className="flex w-max gap-4 pr-1">
            {funnelColumns.map((col) => (
              <KanbanColumn key={col.id} col={col} />
            ))}
          </div>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-4 xl:sticky xl:top-4 xl:w-[320px]">
          <Card className="overflow-hidden rounded-2xl border-border/80 shadow-soft">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total pipeline value</p>
              <p className="mt-1 font-mono text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                {formatUsd(funnelKpis.pipelineValue)}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="size-3.5" />+{funnelKpis.pipelineTrend}%
                </span>
                <MiniSparkline strokeClassName="stroke-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border-border/80 shadow-soft">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total derived value</p>
              <p className="mt-1 font-mono text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                {formatUsd(funnelKpis.derivedValue)}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="size-3.5" />+{funnelKpis.derivedTrend}%
                </span>
                <MiniSparkline strokeClassName="stroke-violet-500" />
              </div>
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
                  <p className="text-[11px] text-muted-foreground">Pipeline snapshot</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Weighted pipeline is healthy; prioritize renewals in Commitment and follow-ups in Discovery.
              </p>
              <Button
                type="button"
                variant="link"
                className="h-auto justify-start p-0 text-xs font-bold text-primary"
                onClick={() => toast.message("AI recommendations")}
              >
                View AI recommendations <ChevronRight className="size-3.5" />
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-soft">
            <CardContent className="space-y-3 p-4">
              <p className="text-sm font-bold text-foreground">Top recommendations</p>
              <ul className="space-y-2.5">
                <li className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                  <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <Zap className="size-3.5 text-amber-500" />
                    Follow up
                  </span>
                  <Badge variant="secondary" className="font-mono tabular-nums">
                    6
                  </Badge>
                </li>
                <li className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                  <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <AlertTriangle className="size-3.5 text-rose-500" />
                    Deals at risk
                  </span>
                  <Badge variant="secondary" className="font-mono tabular-nums">
                    3
                  </Badge>
                </li>
                <li className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                  <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <TrendingUp className="size-3.5 text-emerald-600" />
                    Upsell opportunity
                  </span>
                  <Badge variant="secondary" className="font-mono tabular-nums">
                    2
                  </Badge>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-soft">
            <CardContent className="p-4">
              <p className="text-sm font-bold text-foreground">Recent activity</p>
              <ul className="relative mt-4 space-y-4 pl-2">
                <div className="absolute bottom-2 left-[11px] top-2 w-px bg-border" aria-hidden />
                {funnelRecentActivity.map((a) => (
                  <li key={a.id} className="relative flex gap-3 pl-5">
                    <span
                      className={cn(
                        "absolute left-0 top-1 flex size-5 items-center justify-center rounded-full ring-4 ring-card",
                        a.tone === "success" && "bg-emerald-500 text-white",
                        a.tone === "info" && "bg-primary text-primary-foreground",
                        a.tone === "muted" && "bg-muted-foreground/40 text-white",
                      )}
                    >
                      {a.tone === "success" ? (
                        <CheckCircle2 className="size-3" />
                      ) : a.tone === "info" ? (
                        <Sparkles className="size-3" />
                      ) : (
                        <Circle className="size-2.5 fill-current" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium leading-snug text-foreground">{a.title}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
      </div>
    </div>
  );
}
