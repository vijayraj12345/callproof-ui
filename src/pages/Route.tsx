import { AppShell } from "@/components/layout/AppShell";
import { RoutesView } from "@/components/routes/RoutesView";

/** Legacy menu URL `/route/` — People → Routes. */
const RoutePage = () => {
  return (
    <AppShell>
      <RoutesView />
    </AppShell>
  );
};

export default RoutePage;
