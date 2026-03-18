import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Appointment from "./pages/Appointment";
import Prescription from "./pages/Prescription";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
const App = () => (<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/services" element={<Services />}/>
        <Route path="/appointment" element={<Appointment />}/>
        <Route path="/prescription" element={<Prescription />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>);
export default App;
