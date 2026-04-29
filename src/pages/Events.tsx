import { Sidebar } from "@/components/dashboard/Sidebar";
import { EventsView } from "@/components/events/EventsView";

const Events = () => {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col px-3 py-4 md:py-5">
        <EventsView />
      </main>
    </div>
  );
};

export default Events;
