import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  HelpCircle,
  User,
  Briefcase,
  Percent,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        isScrolled ? "bg-background shadow-md py-2" : "bg-background py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Top bar: Logo + Navigation */}
        <div className="flex items-center justify-between">
          {/* Logo + Restaurant Info */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative"
            >
              <div className="h-16 w-16 flex items-center justify-center">
                <img
                  src="/11.png"
                  alt="BoM logo"
                  className="max-h-full max-w-full"
                />
              </div>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                className="text-sm h-9 px-3 hover:bg-primary/10 hover:text-primary"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Corporate
              </Button>

              <Button
                variant="ghost"
                className="text-sm h-9 px-3 hover:bg-primary/10 hover:text-primary"
              >
                <Percent className="h-4 w-4 mr-2" />
                Offers
                <Badge
                  variant="outline"
                  className="ml-1 bg-orange/10 text-orange border-orange/20 text-xs px-1"
                >
                  NEW
                </Badge>
              </Button>

              <Button
                variant="ghost"
                className="text-sm h-9 px-3 hover:bg-primary/10 hover:text-primary"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>

              {/* Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary"
                  >
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 text-sm font-medium">
                    My Account
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart Button */}
              <Button
                variant="ghost"
                onClick={onCartClick}
                className="relative rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary ml-1"
              >
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </nav>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Cart */}
            <Button
              variant="ghost"
              onClick={onCartClick}
              className="relative rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary"
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 pb-2 overflow-hidden"
            >
              <nav className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className="justify-start text-sm h-10 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-3" />
                  My Account
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-sm h-10 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Briefcase className="h-4 w-4 mr-3" />
                  Corporate
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-sm h-10 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Percent className="h-4 w-4 mr-3" />
                  Offers
                  <Badge
                    variant="outline"
                    className="ml-1 bg-orange/10 text-orange border-orange/20 text-xs"
                  >
                    NEW
                  </Badge>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-sm h-10 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HelpCircle className="h-4 w-4 mr-3" />
                  Help
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
