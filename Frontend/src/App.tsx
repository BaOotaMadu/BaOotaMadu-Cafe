import { Toaster as ShadcnToaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from "./store";

// Owner Pages
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tables";
import Menu from "./pages/Menu";
import Reports from "./pages/Reports";
import Customer from "@/components/Customer";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import CustomerView from './components/CustomerView'

// import TableManagement from "./pages/TableManagement"; // New Redux-powered page

// User Interface Pages
import Index from "./pages/userPage/Index";

// Context
// Note: We're keeping TableContext for backward compatibility
// but can gradually migrate all components to Redux
import { TableProvider } from "./contexts/TableContext";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Notifications */}
        <ShadcnToaster />
        <Sonner position="top-right" closeButton />
        <BrowserRouter>
          <TableProvider>
            <Routes>
              {/* Owner Interface Routes */}
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/tables" element={<Layout><Tables /></Layout>} />
              <Route path="/menu" element={<Layout><Menu /></Layout>} />
              <Route path="/reports" element={<Layout><Reports /></Layout>} />
              <Route path="/customer" element={<Layout><Customer /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              <Route path="/customer1" element={<CustomerView />} />

              
              {/* New Redux-powered Table Management Page */}
              {/* <Route path="/table-management" element={<Layout><TableManagement /></Layout>} /> */}

              {/* User Interface Routes */}
              <Route path="/user" element={<Index />} />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TableProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  //  </Provider>
);

export default App;