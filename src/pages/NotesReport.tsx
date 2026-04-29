import { Sidebar } from "@/components/dashboard/Sidebar";
import { NotesReportView } from "@/components/notes/NotesReportView";

const NotesReport = () => {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col px-3 py-4 md:py-5">
        <NotesReportView />
      </main>
    </div>
  );
};

export default NotesReport;
