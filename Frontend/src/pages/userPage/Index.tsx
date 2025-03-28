import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/userComp/layout/Header";
import MenuMain from "@/components/userComp/menu/MenuMain";
import { getTableNumber, initTableEventManager } from "@/services/tableService";

// TableHeader component
const TableHeader: React.FC<{ tableNumber: string }> = ({ tableNumber }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [showSearch, setShowSearch] = useState(false); // Animation trigger
  const { toast } = useToast();
  const searchRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Animate search bar on page load
    setTimeout(() => {
      setShowSearch(true);
      // Focus on search bar after animation
      setTimeout(() => {
        searchRef.current?.focus();
      }, 500);
    }, 300);
  }, []);

  // Toggle Cart
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Notify staff
  const handleCallStaff = async () => {
    toast({
      title: "Staff Notified",
      description: "A staff member will be with you shortly.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1B1F3B]">
      {/* Header Section */}
      <Header tableNumber={tableNumber} onCartClick={handleCartToggle} />

      {/* Search Bar Section with Animation */}
      <div
  className={`w-full flex justify-center mt-8 transition-all duration-700 ease-out transform ${
    showSearch ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
  }`}
>
  <input
    ref={searchRef}
    type="text"
    placeholder="🤔 What's on your mind?"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full max-w-2xl p-4 text-lg border-2 border-orange-500 rounded-full focus:outline-none focus:border-orange-700 bg-white text-[#1B1F3B] shadow-lg transition duration-300 placeholder-gray-500 focus:shadow-[0_0_20px_#FFA500]"
  />
</div>

      <MenuMain />
    </div>
  );
};

// Main Index Component
const Index: React.FC = () => {
  const [tableNumber, setTableNumber] = useState<string>("");

  useEffect(() => {
    // Initialize global event manager
    initTableEventManager();

    // Get table number from URL or generate one for demo
    const table = getTableNumber();
    setTableNumber(table);

    // Set page title dynamically
    document.title = `Table ${table} - Dine-In Symphony`;
  }, []);

  // Loading state while fetching table number
  if (!tableNumber) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Render TableHeader when table number is ready
  return <TableHeader tableNumber={tableNumber} />;
};

export default Index;
