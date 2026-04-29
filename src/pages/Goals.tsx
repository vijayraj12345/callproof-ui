import { Sidebar } from "@/components/dashboard/Sidebar";
import { GoalsView } from "@/components/goals/GoalsView";

const Goals = () => {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col px-3 py-4 md:py-5">
        <GoalsView />
      </main>
    </div>
  );
};

export default Goals;
