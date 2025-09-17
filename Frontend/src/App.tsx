

import { Toaster as ShadcnToaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// --- 👇 RE-ADDED Redux Imports 👇 ---
import { Provider } from "react-redux";
import { store } from "./store"; // Make sure this path is correct

import { AuthProvider } from "./contexts/AuthContext";

// Import your pages and components
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tokens";
import Menu from "./pages/Menu";
import Reports from "./pages/Reports";
import Customer from "@/components/Customer";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Feedback from "./pages/Feedback";
import CustomerView from "./components/CustomerView";
import ChefPanel from "./pages/ChefPanel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import Index from "./pages/userPage/Index";
import { TableProvider } from "./contexts/TableContext";
import ARPreview from "./pages/ARPreview"

const queryClient = new QueryClient();

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Layout>
      <Outlet />
    </Layout>
  </ProtectedRoute>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <TableProvider>
            <ShadcnToaster />
            <Sonner position="top-right" closeButton />

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/user" element={<Index />} />
              <Route path="/ar-preview" element={<ARPreview />} />

              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Dashboard />} />
                
                {/* --- 👇 Provider now wraps ONLY the Tables route element 👇 --- */}
                <Route
                  path="/tokens"
                  element={
                    <Provider store={store}>
                      <Tables />
                    </Provider>
                  }
                />

                <Route path="/menu" element={<Menu />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/feedback" element={<Feedback />} />
              </Route>

              <Route path="/customer1" element={<ProtectedRoute><CustomerView /></ProtectedRoute>} />
              <Route path="/chief" element={<ProtectedRoute><ChefPanel /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TableProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;