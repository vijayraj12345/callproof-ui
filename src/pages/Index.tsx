import { Sidebar } from "@/components/dashboard/Sidebar";
import { HeroHeader } from "@/components/dashboard/HeroHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { NextBestActions } from "@/components/dashboard/NextBestActions";
import { TeamPerformance } from "@/components/dashboard/TeamPerformance";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { FieldMapCard, TodaysRouteCard } from "@/components/dashboard/RouteAndMap";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col px-3 py-4 sm:px-3 md:py-5">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <HeroHeader />
          <FilterBar />

          <MetricsGrid />

          {/* Next Best Actions (left) · Recent Activity (right) */}
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-5">
            <NextBestActions />
            <RecentActivity />
          </div>

          {/* Today's Route · Team Performance · Today's Schedule — equal-height columns (md+) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            <div className="flex min-h-0 h-full flex-col">
              <TodaysRouteCard />
            </div>
            <div className="flex min-h-0 h-full flex-col">
              <TeamPerformance />
            </div>
            <div className="flex min-h-0 h-full flex-col">
              <TodaySchedule />
            </div>
          </div>

          <FieldMapCard />

          <footer className="border-t border-border/60 pt-3 text-center text-xs text-muted-foreground">
            CallProof · AI-Powered Field Sales CRM
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
