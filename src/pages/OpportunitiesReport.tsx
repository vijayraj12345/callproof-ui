import { Sidebar } from "@/components/dashboard/Sidebar";
import { OpportunitiesReportView } from "@/components/opportunities/OpportunitiesReportView";

const OpportunitiesReport = () => {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col px-3 py-4 md:py-5">
        <OpportunitiesReportView />
      </main>
    </div>
  );
};

export default OpportunitiesReport;
