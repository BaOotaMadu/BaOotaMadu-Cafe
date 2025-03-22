// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tables";
import Menu from "./pages/Menu";
import Reports from "./pages/Reports";
import Customer from "@/components/Customer"; // Import the Customer component
import NotFound from "./pages/NotFound";
import { TableProvider } from "./contexts/TableContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Wrap the entire app with TableProvider */}
        <TableProvider>
          <Routes>
            {/* Dashboard Route */}
            <Route 
              path="/" 
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              } 
            />

            {/* Tables Route */}
            <Route 
              path="/tables" 
              element={
                <Layout>
                  <Tables />
                </Layout>
              } 
            />

            {/* Menu Route */}
            <Route 
              path="/menu" 
              element={
                <Layout>
                  <Menu />
                </Layout>
              } 
            />

            {/* Reports Route */}
            <Route 
              path="/reports" 
              element={
                <Layout>
                  <Reports />
                </Layout>
              } 
            />

            {/* Customer Route */}
            <Route 
              path="/customer" 
              element={
                <Layout>
                  <Customer />
                </Layout>
              } 
            />

            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TableProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;