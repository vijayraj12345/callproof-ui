import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Calls from "./pages/Calls.tsx";
import Contacts from "./pages/Contacts.tsx";
import Goals from "./pages/Goals.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/funnel/goals" element={<Goals />} />
          <Route path="/funnel/goals/" element={<Goals />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/" element={<Contacts />} />
          <Route path="/calls/all" element={<Calls />} />
          <Route path="/calls/all/" element={<Calls />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
