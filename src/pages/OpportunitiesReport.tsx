import { AppShell } from "@/components/layout/AppShell";
import { OpportunitiesReportView } from "@/components/opportunities/OpportunitiesReportView";

const OpportunitiesReport = () => {
  return (
    <AppShell mainClassName="w-full max-w-full">
      <OpportunitiesReportView />
    </AppShell>
  );
};

export default OpportunitiesReport;
