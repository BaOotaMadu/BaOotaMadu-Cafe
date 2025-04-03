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
import { motion, AnimatePresence } from "framer-motion";
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

  // Initialize quantities with default values of 1
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    Object.values(foodItems).flat().forEach(item => {
      initialQuantities[item.id] = 1;
    });
    setQuantities(initialQuantities);
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
    
    // Optionally show some visual feedback
    // You could add a toast notification here
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
    <div className="container mx-auto py-8 relative">
      {/* Cart Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          onClick={toggleCart} 
          className="h-16 w-16 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700"
        >
          <div className="relative">
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
          {/* Category Navigation */}
          <div className="flex justify-center mb-8 overflow-x-auto px-4 py-2">
            <div className="bg-white rounded-full shadow-lg p-1 flex space-x-2">
              {Object.keys(foodItems).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Category Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{selectedCategory}</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mt-2 rounded-full"></div>
          </div>
        </>
      )}

      {/* Search Results Title (only shown when searching) */}
      {searchTerm && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Search Results</h2>
          <p className="text-gray-500 mt-2">
            Showing results for "{searchTerm}"
          </p>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mt-2 rounded-full"></div>
        </div>
      )}

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        <AnimatePresence>
          {allItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="overflow-hidden transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-indigo-200"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative">
                  <CardHeader className="p-0">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          hoveredItem === item.id ? "scale-110" : ""
                        }`}
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full font-bold text-indigo-700">
                      ${item.price.toFixed(2)}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
                    <p className="text-gray-600 text-sm h-12 overflow-hidden">
                      {item.description}
                    </p>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4">
                    {/* Quantity Controls - Now with default value of 1 */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-gray-700 font-medium">Quantity:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)}
                        >
                          <MinusCircle size={20} />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {quantities[item.id] || 1}
                        </span>
                        <button
                          className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}
                        >
                          <PlusCircle size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart Button - Always active */}
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart (${((quantities[item.id] || 1) * item.price).toFixed(2)})
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {allItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? `No items matching "${searchTerm}" found.` : "No items found in this category."}
          </p>
        </div>
      )}

      <style jsx>{`
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default MenuMain;