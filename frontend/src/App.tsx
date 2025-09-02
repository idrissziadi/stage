import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RTLProvider } from "@/components/ui/rtl-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthApiProvider, useAuthApi } from "./hooks/useAuthApi";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StagiaireDashboard from "./pages/StagiaireDashboard";
import EnseignantDashboard from "./pages/EnseignantDashboard";
import EtablissementFormationDashboard from "./pages/EtablissementFormationDashboard";
import EtablissementRegionaleDashboard from "./pages/EtablissementRegionaleDashboard";
import EtablissementNationaleDashboard from "./pages/EtablissementNationaleDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Protected Route component - defined inside App to have access to context
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuthApi();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse-custom text-lg">جارٍ التحميل...</div>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    
    return <>{children}</>;
  };

  // Role-based Dashboard Router - defined inside App to have access to context
  const DashboardRouter = () => {
    const { user, userProfile, loading } = useAuthApi();
    
    // Show loading while user profile is being fetched
    if (loading || !userProfile) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse-custom text-lg">جارٍ التحميل...</div>
        </div>
      );
    }
    
    // Debug log to help troubleshoot
    console.log('User role:', userProfile?.role);
    
    switch (userProfile?.role) {
      case 'Stagiaire':
        return <StagiaireDashboard />;
      case 'Enseignant':
        return <EnseignantDashboard />;
      case 'EtablissementFormation':
        return <EtablissementFormationDashboard />;
      case 'EtablissementRegionale':
        return <EtablissementRegionaleDashboard />;
      case 'EtablissementNationale':
        return <EtablissementNationaleDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RTLProvider defaultDirection="rtl">
          <AuthApiProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardRouter />
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthApiProvider>
        </RTLProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
