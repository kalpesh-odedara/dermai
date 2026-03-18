import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Appointment from "./pages/Appointment";
import Prescription from "./pages/Prescription";
import Contact from "./pages/Contact";
import FaceRecognition from "./pages/FaceRecognition";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import Login from "./pages/Login";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminLogins from "./pages/admin/AdminLogins";
import AdminPrescriptions from "./pages/admin/AdminPrescriptions";
import AdminFeedback from "./pages/admin/AdminFeedback";

// Admin Protection
const ProtectedAdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;
  return children;
};

// User Protection (The site is locked until this "login")
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isUser = localStorage.getItem("userAuthenticated") === "true";

  useEffect(() => {
    if (!isUser) {
      navigate("/login");
    }
  }, [isUser, navigate]);

  if (!isUser) return null;
  return children;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected User Routes */}
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/appointment" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
        <Route path="/prescription" element={<ProtectedRoute><Prescription /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/face-recognition" element={<ProtectedRoute><FaceRecognition /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="prescriptions" element={<AdminPrescriptions />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="logins" element={<AdminLogins />} />
          <Route path="feedback" element={<AdminFeedback />} />
        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
