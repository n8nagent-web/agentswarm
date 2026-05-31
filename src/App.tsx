import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/ui/Sidebar";
import Introduction from "./pages/Introduction";
import FrontDeskAssistant from "./pages/FrontDeskAssistant";
import SpeedToLeadAssistant from "./pages/SpeedToLeadAssistant";
import LeadGenerationAssistant from "./pages/LeadGenerationAssistant";
import OutboundChatbot from "./pages/OutboundChatbot";
import DocMagic from "./pages/DocMagic";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <main className="flex-1 ml-60 overflow-auto">
      <Outlet />
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Introduction />} />
            <Route path="/front-desk-assistant" element={<FrontDeskAssistant />} />
            <Route path="/speed-to-lead-assistant" element={<SpeedToLeadAssistant />} />
            <Route path="/lead-generation-assistant" element={<LeadGenerationAssistant />} />
            <Route path="/outbound-chatbot" element={<OutboundChatbot />} />
            <Route path="/doc-magic" element={<DocMagic />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
