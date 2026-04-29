import { Sidebar } from "@/components/dashboard/Sidebar";
import { CallsView } from "@/components/calls/CallsView";

const Calls = () => {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col px-3 py-4 md:py-5">
        <CallsView />
      </main>
    </div>
  );
};

export default Calls;
