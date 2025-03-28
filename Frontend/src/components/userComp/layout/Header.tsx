"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, HelpCircle, User, Briefcase, Percent } from "lucide-react";

// Define the props interface
interface HeaderProps {
  tableNumber: string;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ tableNumber, onCartClick }) => {
  return (
    <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-10 w-10"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Swiggy Corporate Button */}
        <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
          <Briefcase className="h-5 w-5" />
          BaOotaMadu
        </Button>

        {/* Offers Button */}
        <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
          <Percent className="h-5 w-5" />
          Offers <span className="text-xs text-orange-500 font-semibold">NEW</span>
        </Button>

        {/* Help Button */}
        <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
          <HelpCircle className="h-5 w-5" />
          Help
        </Button>

        {/* Cart Button */}
        <Button
          variant="ghost"
          onClick={onCartClick}
          className="flex items-center gap-2 text-gray-700 hover:text-green-600"
        >
          <ShoppingCart className="h-5 w-5" />
          Cart <span className="text-xs text-gray-600">(0)</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
