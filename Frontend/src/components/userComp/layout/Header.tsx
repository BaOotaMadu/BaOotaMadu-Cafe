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

// Define the props interface
interface HeaderProps {
  tableNumber: string;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ tableNumber, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
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
        {/* Logo and Table Number */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative"
            >
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">BM</span>
              </div>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-2 -right-2 bg-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
              >
                T{tableNumber}
              </motion.div>
            </motion.div>
            <div className="hidden md:block">
              <h1 className="font-bold text-primary text-xl">BaOotaMadu</h1>
              <p className="text-xs text-muted-foreground">Digital Menu · Table {tableNumber}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                className="text-sm h-9 px-3 hover:bg-primary/10 hover:text-primary"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                <span>Corporate</span>
              </Button>
              <Button
                variant="ghost"
                className="text-sm h-9 px-3 hover:bg-primary/10 hover:text-primary"
              >
                <Percent className="h-4 w-4 mr-2" />
                <span>Offers</span>
                <Badge variant="outline" className="ml-1 bg-orange/10 text-orange border-orange/20 text-xs px-1">
                  NEW
                </Badge>
              </Button>
              <Button
                variant="ghost"
                className="text-sm h-9 px-3 hover:bg-primary/10 hover:text-primary"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                <span>Help</span>
              </Button>
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
                  <div className="px-3 py-2 text-sm font-medium">My Account</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
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

          {/* Mobile Menu Toggle and Cart */}
          <div className="flex md:hidden items-center gap-2">
            {/* Cart Button for Mobile */}
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

            {/* Mobile Menu Toggle */}
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

        {/* Mobile Navigation Menu */}
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
                  <span>My Account</span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-sm h-10 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Briefcase className="h-4 w-4 mr-3" />
                  <span>Corporate</span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-sm h-10 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Percent className="h-4 w-4 mr-3" />
                  <span>Offers</span>
                  <Badge variant="outline" className="ml-1 bg-orange/10 text-orange border-orange/20 text-xs">
                    NEW
                  </Badge>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-sm h-10 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HelpCircle className="h-4 w-4 mr-3" />
                  <span>Help</span>
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