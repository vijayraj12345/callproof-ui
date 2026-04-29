export type RouteStatus = "Active" | "Inactive";

export type RouteRow = {
  id: string;
  repName: string;
  routeName: string;
  isPrimary: boolean;
  assignTo: string;
  createDate: string;
  status: RouteStatus;
  /** Stable seed for avatar color / initials */
  seed: string;
};

const REPS = ["AITECH AIT", "Jordan Lee", "Maria Santos", "Chris Patel", "Alex Morgan", "Sam Rivera"];
const ROUTE_NAMES = [
  "Save route 6.5",
  "North loop",
  "Downtown sprint",
  "Warehouse cluster A",
  "Medical row Q2",
  "Suburban sweep",
  "Coastal highway",
  "Industrial park beta",
];

export function buildRoutesSampleRows(count = 40): RouteRow[] {
  const rows: RouteRow[] = [];
  for (let i = 0; i < count; i++) {
    const rep = REPS[i % REPS.length];
    const routeName = ROUTE_NAMES[i % ROUTE_NAMES.length];
    const active = i % 10 !== 7 && i % 11 !== 5;
    const month = ((i % 4) + 1) as 1 | 2 | 3 | 4;
    const day = 15 + (i % 14);
    const hour = 9 + (i % 8);
    const ampm = i % 2 === 0 ? "a.m." : "p.m.";
    rows.push({
      id: `route-${i + 1}`,
      repName: rep,
      routeName,
      isPrimary: i % 5 === 0,
      assignTo: REPS[(i + 2) % REPS.length],
      createDate: `April ${day}, 2026, ${hour}:${(i % 5) * 10 + 1} ${ampm}`,
      status: active ? "Active" : "Inactive",
      seed: `${rep}-${i}`,
    });
  }
  return rows;
}

export type RoutesKpis = {
  totalRoutes: number;
  activeRoutes: number;
  activePct: number;
  updatedThisMonth: number;
  mostUsedRouteName: string;
  mostUsedRouteUses: number;
};

export function computeRoutesKpis(rows: RouteRow[]): RoutesKpis {
  const total = rows.length;
  const active = rows.filter((r) => r.status === "Active").length;
  const nameCounts = new Map<string, number>();
  for (const r of rows) {
    const base = r.routeName.replace(/\s*\(\d+\)\s*$/, "");
    nameCounts.set(base, (nameCounts.get(base) ?? 0) + 1);
  }
  let topName = "";
  let topN = 0;
  for (const [name, n] of nameCounts) {
    if (n > topN) {
      topN = n;
      topName = name;
    }
  }
  return {
    totalRoutes: total,
    activeRoutes: active,
    activePct: total ? Math.round((active / total) * 100) : 0,
    updatedThisMonth: Math.min(12, Math.ceil(total * 0.28)),
    mostUsedRouteName: topName || "—",
    mostUsedRouteUses: topN,
  };
}
