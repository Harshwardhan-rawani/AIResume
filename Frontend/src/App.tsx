import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TemplateProvider } from "@/context/TemplateContext";

import Home from "./pages/Home";
import BuildResume from "./pages/BuildResume";
import Preview from "./pages/Preview";
import Analyze from "./pages/Analyze";
import Templates from "./pages/Templates";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

import Create from "./pages/Create";

// Improved function to check for token in localStorage
function hasAuthToken() {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  try {
    // Basic JWT validation - check if token is not expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    // If token is malformed, remove it and return false
    localStorage.removeItem('authToken');
    return false;
  }
}

// PrivateRoute component
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return hasAuthToken() ? children : <Navigate to="/login" replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TemplateProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create/build/:name" element={
                <PrivateRoute>
                  <BuildResume />
                </PrivateRoute>
              } />
              <Route path="/preview/:name" element={
                <PrivateRoute>
                  <Preview />
                </PrivateRoute>
              } />
              <Route path="/analyze" element={
                <PrivateRoute>
                  <Analyze />
                </PrivateRoute>
              } />
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/:name" element={<Templates />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } />
              <Route path="/create" element={<Create />} />
            
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TemplateProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;