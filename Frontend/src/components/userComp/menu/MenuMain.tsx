import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Cart from "../cart/Cart";

// Define the FoodItem interface that matches CartItem but with numeric id
interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

// Define the data structure for categories
interface FoodCategories {
  [category: string]: FoodItem[];
}

// Sample data for food items (you should replace this with your actual data source)
const foodItems: FoodCategories = {
  Starters: [
    { id: "1", name: "Spring Rolls", price: 5.99, image: "/api/placeholder/300/200", description: "Crispy vegetable spring rolls served with sweet chili sauce" },
    { id: "2", name: "Garlic Bread", price: 4.99, image: "/api/placeholder/300/200", description: "Toasted ciabatta with garlic butter and herbs" },
    { id: "3", name: "Bruschetta", price: 6.99, image: "/api/placeholder/300/200", description: "Grilled bread topped with tomatoes, garlic, and fresh basil" },
  ],
  "Main Course": [
    { id: "4", name: "Grilled Chicken", price: 12.99, image: "/api/placeholder/300/200", description: "Tender chicken breast marinated in herbs and grilled to perfection" },
    { id: "5", name: "Pasta Alfredo", price: 10.99, image: "/api/placeholder/300/200", description: "Fettuccine pasta in a creamy parmesan sauce" },
    { id: "6", name: "Steak", price: 18.99, image: "/api/placeholder/300/200", description: "Prime beef steak cooked to your preference with house seasoning" },
  ],
  Desserts: [
    { id: "7", name: "Chocolate Cake", price: 7.99, image: "/api/placeholder/300/200", description: "Rich chocolate cake with a molten center" },
    { id: "8", name: "Ice Cream", price: 5.99, image: "/api/placeholder/300/200", description: "Selection of premium ice cream flavors" },
    { id: "9", name: "Cheesecake", price: 8.99, image: "/api/placeholder/300/200", description: "New York style cheesecake with berry compote" },
  ],
};

interface MenuMainProps {
  searchTerm?: string;
}

const MenuMain: React.FC<MenuMainProps> = ({ searchTerm = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(foodItems)[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { addItem, cartItems } = useCart();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Initialize quantities with default values of 1
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    Object.values(foodItems).flat().forEach(item => {
      initialQuantities[item.id] = 1;
    });
    setQuantities(initialQuantities);
  }, []);

  // Check window size for responsive design
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, newQuantity), // Ensure minimum quantity is 1
    }));
  };

  const handleAddToCart = (item: FoodItem) => {
    const quantity = quantities[item.id] || 1;
    
    // Create a proper cart item with all required properties
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      quantity: quantity
    };
    
    // Add the item to cart
    addItem(cartItem);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // If we have a search term, search across all categories
  const allItems = searchTerm 
    ? Object.values(foodItems).flat().filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : foodItems[selectedCategory];

  return (
    <div className="w-full mx-auto py-4 md:py-8 px-2 md:px-4 relative">
      {/* Cart Toggle Button - Only visible on larger screens */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <Button 
          onClick={toggleCart} 
          className="h-14 w-14 md:h-16 md:w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <div className="relative">
            <ShoppingCart size={isMobile ? 20 : 24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
        </Button>
      </div>

      {/* Cart Component */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        tableNumber="1" 
      />

      {/* Only show category navigation when not searching */}
      {!searchTerm && (
        <>
          {/* Category Navigation - Scrollable on mobile */}
          <div className="mb-6 md:mb-8 overflow-x-auto no-scrollbar">
            <div className="bg-card rounded-full shadow-lg p-1 flex space-x-1 md:space-x-2 min-w-max mx-auto max-w-max">
              {Object.keys(foodItems).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3 py-2 md:px-6 md:py-3 rounded-full transition-all duration-300 text-sm md:text-base whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Category Title */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{selectedCategory}</h2>
            <div className="w-16 md:w-24 h-1 bg-primary mx-auto mt-2 rounded-full"></div>
          </div>
        </>
      )}

      {/* Search Results Title (only shown when searching) */}
      {searchTerm && (
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Search Results</h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Showing results for "{searchTerm}"
          </p>
          <div className="w-16 md:w-24 h-1 bg-primary mx-auto mt-2 rounded-full"></div>
        </div>
      )}

      {/* Food Items Grid - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {allItems.map((item) => (
          <div
            key={item.id}
            className="transition-all duration-300"
          >
            <Card
              className="overflow-hidden transition-all duration-300 hover:shadow-xl border border-border hover:border-primary/20 h-full flex flex-col"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex flex-col h-full">
                <CardHeader className="p-0">
                  <div className="h-36 md:h-48 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        hoveredItem === item.id ? "scale-110" : ""
                      }`}
                    />
                    <div className="absolute top-3 right-3 bg-background bg-opacity-90 px-2 py-1 rounded-full font-bold text-primary text-sm">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 md:pt-6 flex-grow">
                  <CardTitle className="text-lg md:text-xl mb-1 md:mb-2">{item.name}</CardTitle>
                  <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">
                    {item.description}
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 md:space-y-4 pt-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-foreground text-sm md:text-base font-medium">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-primary hover:text-primary/80 transition-colors"
                        onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)}
                      >
                        <MinusCircle size={isMobile ? 18 : 20} />
                      </button>
                      <span className="w-6 md:w-8 text-center font-semibold text-sm md:text-base">
                        {quantities[item.id] || 1}
                      </span>
                      <button
                        className="text-primary hover:text-primary/80 transition-colors"
                        onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}
                      >
                        <PlusCircle size={isMobile ? 18 : 20} />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 h-9 md:h-10 text-xs md:text-sm"
                  >
                    <ShoppingCart className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Add to Cart (${((quantities[item.id] || 1) * item.price).toFixed(2)})
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {allItems.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <p className="text-muted-foreground text-base md:text-lg">
            {searchTerm ? `No items matching "${searchTerm}" found.` : "No items found in this category."}
          </p>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MenuMain;