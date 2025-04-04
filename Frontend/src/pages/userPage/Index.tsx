import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CartProvider, useCart } from "@/hooks/useCart";
import { OrderProvider } from "@/hooks/useOrder";
import Header from "@/components/userComp/layout/Header";
import MenuMain from "@/components/userComp/menu/MenuMain";
import { getTableNumber, initTableEventManager } from "@/services/tableService";
import Cart from "@/components/userComp/cart/Cart";
import { X, ShoppingBag, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const TableHeader: React.FC<{ tableNumber: string }> = ({ tableNumber }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { toast } = useToast();
  const { cartItems } = useCart();
  const searchRef = React.useRef<HTMLInputElement>(null);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setTimeout(() => {
      setShowSearch(true);
      setTimeout(() => {
        searchRef.current?.focus();
      }, 500);
    }, 300);
  }, []);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCallStaff = async () => {
    toast({
      title: "Staff Notified",
      description: "A staff member will be with you shortly.",
    });
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    searchRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1B1F3B]">
      <Header tableNumber={tableNumber} onCartClick={handleCartToggle} />
      
      {/* Enhanced search bar with animation */}
      <div className="px-4 py-3 sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm">
        <AnimatePresence>
          {showSearch && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div 
                className={`flex items-center border rounded-full overflow-hidden transition-all ${
                  isSearchFocused ? "border-indigo-500 ring-2 ring-indigo-100" : "border-gray-200" 
                }`}
              >
                <div className="pl-4 text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full py-3 px-3 focus:outline-none text-sm"
                />
                {searchTerm && (
                  <button 
                    onClick={handleSearchClear}
                    className="pr-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {/* Optional: Search filters or categories */}
              {searchTerm && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 flex flex-wrap gap-2"
                >
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                    Searching: "{searchTerm}"
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Pass the searchTerm to MenuMain */}
      <MenuMain searchTerm={searchTerm} />
      
      {/* Cart component */}
      <Cart isOpen={isCartOpen} onClose={handleCartToggle} tableNumber={tableNumber} />
      
      {/* Optional: Floating cart button for mobile */}
      {!isCartOpen && itemCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-40 md:hidden"
        >
          <Button 
            onClick={handleCartToggle} 
            className="h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700"
          >
            <div className="relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            </div>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// Updated MenuMain component to use the search term
const MenuMainWithSearch = ({ searchTerm = "" }) => {
  // You would need to modify your actual MenuMain component to accept searchTerm prop
  return <MenuMain searchTerm={searchTerm} />;
};

const Index: React.FC = () => {
  const [tableNumber, setTableNumber] = useState<string>("");

  useEffect(() => {
    initTableEventManager();
    const table = getTableNumber();
    setTableNumber(table);
    document.title = `Table ${table} - Dine-In Symphony`;
  }, []);

  if (!tableNumber) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <CartProvider>
      <OrderProvider>
        <TableHeader tableNumber={tableNumber} />
      </OrderProvider>
    </CartProvider>
  );
};

export default Index;

