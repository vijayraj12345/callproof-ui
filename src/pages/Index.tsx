import { AppShell } from "@/components/layout/AppShell";
import { DashboardV7View } from "@/components/dashboard/DashboardV7View";

/** Home — CallProof v7 AI dashboard (design from `callproof-v7` HTML). */
const Index = () => {
  return (
    <AppShell variant="dashboard">
      <DashboardV7View />
    </AppShell>
  );
};

export default Index;
