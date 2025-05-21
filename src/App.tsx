
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VoterLogin from "./pages/VoterLogin";
import VotingBooth from "./pages/VotingBooth";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Elections from "./pages/admin/Elections";
import CreateElection from "./pages/admin/CreateElection";
import ElectionDetail from "./pages/admin/ElectionDetail";
import Voters from "./pages/admin/Voters";
import Logs from "./pages/admin/Logs";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

// Protected route component for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'super_admin')) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

// Protected route component for voter routes
const VoterRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated || user?.role !== 'voter') {
    return <Navigate to="/voter-login" replace />;
  }
  
  return <>{children}</>;
};

// App Routes Component
const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Redirect to appropriate dashboard if already logged in
  const handleRedirect = () => {
    if (!isAuthenticated) return <Index />;
    
    if (user?.role === 'voter' && user.electionId) {
      return <Navigate to={`/elections/${user.electionId}`} replace />;
    }
    
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return <Navigate to="/admin" replace />;
    }
    
    return <Index />;
  };
  
  return (
    <Routes>
      <Route path="/" element={handleRedirect()} />
      <Route path="/voter-login" element={<VoterLogin />} />
      
      {/* Voter Protected Routes */}
      <Route path="/elections/:electionId" element={
        <VoterRoute>
          <VotingBooth />
        </VoterRoute>
      } />
      
      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin Protected Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <Dashboard />
        </AdminRoute>
      } />
      <Route path="/admin/elections" element={
        <AdminRoute>
          <Elections />
        </AdminRoute>
      } />
      <Route path="/admin/elections/create" element={
        <AdminRoute>
          <CreateElection />
        </AdminRoute>
      } />
      <Route path="/admin/elections/:electionId" element={
        <AdminRoute>
          <ElectionDetail />
        </AdminRoute>
      } />
      <Route path="/admin/voters" element={
        <AdminRoute>
          <Voters />
        </AdminRoute>
      } />
      <Route path="/admin/logs" element={
        <AdminRoute>
          <Logs />
        </AdminRoute>
      } />
      <Route path="/admin/settings" element={
        <AdminRoute>
          <Settings />
        </AdminRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
