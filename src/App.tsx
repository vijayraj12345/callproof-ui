import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Calls from "./pages/Calls.tsx";
import Contacts from "./pages/Contacts.tsx";
import Goals from "./pages/Goals.tsx";
import Appointments from "./pages/Appointments.tsx";
import Events from "./pages/Events.tsx";
import Followups from "./pages/Followups.tsx";
import NotesReport from "./pages/NotesReport.tsx";
import OpportunitiesFunnel from "./pages/OpportunitiesFunnel.tsx";
import OpportunitiesReport from "./pages/OpportunitiesReport.tsx";
import Sms from "./pages/Sms.tsx";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import UsersLayout from "./pages/UsersLayout.tsx";
import RoutePage from "./pages/Route.tsx";
import { CompanyDirectoryView } from "./components/company-directory/CompanyDirectoryView.tsx";
import { CompanyDirectoryRepView } from "./components/company-directory/CompanyDirectoryRepView.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/funnel/goals" element={<Goals />} />
          <Route path="/funnel/goals/" element={<Goals />} />
          <Route path="/funnel/new" element={<OpportunitiesFunnel />} />
          <Route path="/funnel/new/" element={<OpportunitiesFunnel />} />
          <Route path="/funnel/opps" element={<OpportunitiesReport />} />
          <Route path="/funnel/opps/" element={<OpportunitiesReport />} />
          <Route path="/contacts/notes/report" element={<NotesReport />} />
          <Route path="/contacts/notes/report/" element={<NotesReport />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/" element={<Contacts />} />
          <Route path="/calls/all" element={<Calls />} />
          <Route path="/calls/all/" element={<Calls />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/" element={<Appointments />} />
          <Route path="/followups" element={<Followups />} />
          <Route path="/followups/" element={<Followups />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/" element={<Events />} />
          <Route path="/sms" element={<Sms />} />
          <Route path="/sms/" element={<Sms />} />
          <Route path="/route" element={<RoutePage />} />
          <Route path="/route/" element={<RoutePage />} />
          <Route path="/dash/events" element={<Navigate to="/events" replace />} />
          <Route path="/dash/events/" element={<Navigate to="/events" replace />} />
          <Route path="/users" element={<UsersLayout />}>
            <Route index element={<CompanyDirectoryView />} />
            <Route path=":repId" element={<CompanyDirectoryRepView />} />
          </Route>
          <Route path="/users/" element={<Navigate to="/users" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
