// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { PlusCircle, MinusCircle, ShoppingCart } from "lucide-react";
// import { useCart } from "@/hooks/useCart";
// import Cart from "../cart/Cart";

// interface FoodItem {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
//   description: string;
// }

// interface FoodCategories {
//   [category: string]: FoodItem[];
// }

// interface MenuMainProps {
//   searchTerm?: string;
// }

// const MenuMain: React.FC<MenuMainProps> = ({ searchTerm = "" }) => {
//   const [foodItems, setFoodItems] = useState<FoodCategories>({});
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [quantities, setQuantities] = useState<Record<string, number>>({});
//   const [hoveredItem, setHoveredItem] = useState<string | null>(null);
//   const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
//   const [isMobile, setIsMobile] = useState<boolean>(false);
//   const { addItem, cartItems } = useCart();

//   // Fetch food items from API and categorize them
//   useEffect(() => {
//     async function fetchFoodItems() {
//       try {
//         const res = await fetch(
//           "http://localhost:3001/menu/681f3a4888df8faae5bbd380"
//         );
//         const rawItems = await res.json();

//         const categorized: FoodCategories = {};

//         rawItems.forEach((item: any) => {
//           const category = item.category || "Uncategorized";
//           if (!categorized[category]) categorized[category] = [];

//           categorized[category].push({
//             id: item._id,
//             name: item.name,
//             price: item.price,
//             image: "/api/placeholder/300/200", // Replace with actual image field if available
//             description: "Delicious item", // Replace with item.description if available
//           });
//         });

//         setFoodItems(categorized);

//         const firstCategory = Object.keys(categorized)[0];
//         if (firstCategory) setSelectedCategory(firstCategory);

//         const initialQuantities: Record<string, number> = {};
//         Object.values(categorized)
//           .flat()
//           .forEach((item) => {
//             initialQuantities[item.id] = 0;
//           });
//         setQuantities(initialQuantities);
//       } catch (error) {
//         console.error("Failed to fetch food items:", error);
//       }
//     }

//     fetchFoodItems();
//   }, []);

//   useEffect(() => {
//     const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
//     checkIfMobile();
//     window.addEventListener("resize", checkIfMobile);
//     return () => window.removeEventListener("resize", checkIfMobile);
//   }, []);

//   const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

//   const handleCategoryClick = (category: string) => {
//     setSelectedCategory(category);
//   };

//   const handleQuantityChange = (itemId: string, newQuantity: number) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [itemId]: Math.max(0, newQuantity),
//     }));
//   };

//   const handleAddToCart = (item: FoodItem) => {
//     const quantity = quantities[item.id] || 0;
//     if (quantity > 0) {
//       addItem({ ...item, quantity });
//     }
//   };

//   const toggleCart = () => {
//     setIsCartOpen(!isCartOpen);
//   };

//   const allItems = searchTerm
//     ? Object.values(foodItems)
//         .flat()
//         .filter(
//           (item) =>
//             item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             item.description.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//     : foodItems[selectedCategory] || [];

//   return (
//     <div className="w-full mx-auto py-4 md:py-6 px-2 md:px-4 relative">
//       {/* Cart Toggle Button */}
//       <div className="fixed bottom-4 right-4 z-40">
//         <Button
//           onClick={toggleCart}
//           className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 p-0"
//         >
//           <div className="relative">
//             <ShoppingCart size={isMobile ? 16 : 18} />
//             {itemCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center text-xs">
//                 {itemCount}
//               </span>
//             )}
//           </div>
//         </Button>
//       </div>

//       {/* Cart Component */}
//       <Cart
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         tableNumber="1"
//       />

//       {!searchTerm && (
//         <>
//           {/* Category Navigation */}
//           <div className="mb-4 md:mb-6 overflow-x-auto no-scrollbar">
//             <div className="bg-card rounded-full shadow-sm p-1 flex space-x-1 min-w-max mx-auto max-w-max">
//               {Object.keys(foodItems).map((category) => (
//                 <button
//                   key={category}
//                   onClick={() => handleCategoryClick(category)}
//                   className={`px-2 py-1 md:px-4 md:py-1 rounded-full transition-all duration-200 text-xs md:text-sm whitespace-nowrap ${
//                     selectedCategory === category
//                       ? "bg-primary text-primary-foreground font-medium"
//                       : "hover:bg-muted"
//                   }`}
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Category Title */}
//           <div className="text-center mb-4 md:mb-6">
//             <h2 className="text-xl md:text-2xl font-bold text-foreground">
//               {selectedCategory}
//             </h2>
//             <div className="w-12 md:w-16 h-1 bg-primary mx-auto mt-1 rounded-full"></div>
//           </div>
//         </>
//       )}

//       {searchTerm && (
//         <div className="text-center mb-4 md:mb-6">
//           <h2 className="text-xl md:text-2xl font-bold text-foreground">
//             Search Results
//           </h2>
//           <p className="text-muted-foreground mt-1 text-xs md:text-sm">
//             Showing results for "{searchTerm}"
//           </p>
//           <div className="w-12 md:w-16 h-1 bg-primary mx-auto mt-1 rounded-full"></div>
//         </div>
//       )}

//       {/* Food Items Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
//         {allItems.map((item) => (
//           <div key={item.id} className="transition-all duration-300">
//             <Card
//               className="overflow-hidden transition-all duration-300 hover:shadow-md border border-border hover:border-primary/20 h-full flex flex-col"
//               onMouseEnter={() => setHoveredItem(item.id)}
//               onMouseLeave={() => setHoveredItem(null)}
//             >
//               <div className="flex flex-col h-full">
//                 <CardHeader className="p-0">
//                   <div className="h-24 md:h-32 overflow-hidden relative">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className={`w-full h-full object-cover transition-transform duration-700 ${
//                         hoveredItem === item.id ? "scale-110" : ""
//                       }`}
//                     />
//                     <div className="absolute top-2 right-2 bg-background bg-opacity-90 px-1 py-0.5 rounded-full font-bold text-primary text-xs">
//                       ${item.price.toFixed(2)}
//                     </div>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-2 md:pt-3 flex-grow px-2 md:px-3">
//                   <CardTitle className="text-sm md:text-base mb-1">
//                     {item.name}
//                   </CardTitle>
//                   <p className="text-muted-foreground text-xs line-clamp-2">
//                     {item.description}
//                   </p>
//                 </CardContent>

//                 <CardFooter className="flex flex-col space-y-2 pt-1 px-2 md:px-3 pb-2">
//                   <div className="flex items-center justify-between w-full">
//                     <div className="flex items-center h-6 border rounded-md overflow-hidden">
//                       <button
//                         className="text-primary hover:bg-primary/10 h-full px-1 flex items-center justify-center"
//                         onClick={() =>
//                           handleQuantityChange(
//                             item.id,
//                             (quantities[item.id] || 0) - 1
//                           )
//                         }
//                       >
//                         <MinusCircle size={14} />
//                       </button>
//                       <span className="w-6 text-center text-xs font-medium border-x">
//                         {quantities[item.id] || 0}
//                       </span>
//                       <button
//                         className="text-primary hover:bg-primary/10 h-full px-1 flex items-center justify-center"
//                         onClick={() =>
//                           handleQuantityChange(
//                             item.id,
//                             (quantities[item.id] || 0) + 1
//                           )
//                         }
//                       >
//                         <PlusCircle size={14} />
//                       </button>
//                     </div>

//                     <Button
//                       onClick={() => handleAddToCart(item)}
//                       className="h-6 bg-primary hover:bg-primary/90 text-xs px-2 rounded-md"
//                       size="sm"
//                     >
//                       <ShoppingCart className="mr-1 h-3 w-3" />
//                       Add
//                     </Button>
//                   </div>
//                 </CardFooter>
//               </div>
//             </Card>
//           </div>
//         ))}
//       </div>

//       {allItems.length === 0 && (
//         <div className="text-center py-6 md:py-8">
//           <p className="text-muted-foreground text-sm md:text-base">
//             {searchTerm
//               ? `No items matching "${searchTerm}" found.`
//               : "No items found in this category."}
//           </p>
//         </div>
//       )}

//       <style jsx>{`
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .no-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MenuMain;

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Star, Clock, Leaf, Search, Menu, X } from "lucide-react";
import Cart from "../cart/Cart"; // ✅ Use the real Cart component
import { useCart } from "@/hooks/useCart"; // ✅ Use real cart hook

// Types
interface FoodItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  isVegetarian: boolean;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  cookTime?: string;
  category: string;
}

interface FoodCategories {
  [category: string]: FoodItem[];
}

interface MenuMainProps {
  searchTerm?: string;
}

const MenuMain: React.FC<MenuMainProps> = ({ searchTerm: externalSearchTerm = "" }) => {
  const [foodItems, setFoodItems] = useState<FoodCategories>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(externalSearchTerm);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState<boolean>(false);

  // ✅ Use the real global cart hook
  const { addItem, cartItems } = useCart();

  // ✅ Calculate item count from real cart
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch food items
  useEffect(() => {
    async function fetchFoodItems() {
      try {
        const res = await fetch("http://localhost:3001/menu/681f3a4888df8faae5bbd380");
        const rawItems = await res.json();
        const categorized: FoodCategories = {};

        rawItems.forEach((item: any) => {
          const category = item.category || "Uncategorized";
          if (!categorized[category]) categorized[category] = [];
          categorized[category].push({
            id: item._id,
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice,
            image: item.image || "/api/placeholder/300/200",
            description: item.description || "Delicious item",
            rating: item.rating || 4.5,
            reviewCount: item.reviewCount || Math.floor(Math.random() * 300),
            isVegetarian: item.isVegetarian !== undefined ? item.isVegetarian : Math.random() > 0.5,
            calories: item.calories || 320 + Math.floor(Math.random() * 100),
            protein: item.protein || "4g",
            carbs: item.carbs || "42g",
            fat: item.fat || "16g",
            cookTime: item.cookTime || "20-30 mins",
            category,
          });
        });

        setFoodItems(categorized);

        const firstCategory = Object.keys(categorized)[0];
        if (firstCategory) setSelectedCategory(firstCategory);

        const initialQuantities: Record<string, number> = {};
        Object.values(categorized)
          .flat()
          .forEach((item) => {
            initialQuantities[item.id] = 0;
          });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Failed to fetch food items:", error);
        setFoodItems({});
      }
    }
    fetchFoodItems();
  }, []);

  // Filtered items
  const allItems = searchTerm
    ? Object.values(foodItems)
        .flat()
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : foodItems[selectedCategory] || [];

  const filteredItems = () => {
    let items = allItems;
    if (activeFilter === "Vegetarian") items = items.filter((item) => item.isVegetarian);
    if (activeFilter === "Non-Vegetarian") items = items.filter((item) => !item.isVegetarian);
    if (activeFilter === "Top Rated") items = items.filter((item) => item.rating >= 4.5);
    if (activeFilter === "Price: Low to High")
      items = [...items].sort((a, b) => a.price - b.price);
    return items;
  };

  // Handlers
  const handleItemClick = (item: FoodItem) => {
    setSelectedItem(item);
    setQuantities((prev) => ({ ...prev, [item.id]: prev[item.id] || 1 }));
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    const qty = quantities[selectedItem.id] || 1;
    addItem({ ...selectedItem, quantity: qty }); // ✅ Uses real `useCart`
    setQuantities((prev) => ({ ...prev, [selectedItem.id]: 0 }));
    setIsModalOpen(false);
  };

  const handleQuickAdd = (item: FoodItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ ...item, quantity: 1 }); // ✅ Add directly to real cart
  };

  const handleQuantityChange = (delta: number) => {
    if (!selectedItem) return;
    setQuantities((prev) => {
      const current = prev[selectedItem.id] || 1;
      return { ...prev, [selectedItem.id]: Math.max(1, current + delta) };
    });
  };

  // Stars UI
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  // Veg/Non-Veg Icon
  const VegIcon = ({ isVeg }: { isVeg: boolean }) => (
    <div className={`w-4 h-4 border-2 ${isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
      <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
              <p className="text-gray-600">Choose from our delicious selection</p>
            </div>
            {!isMobile && (
              <div className="relative w-96">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          {!isMobile && (
            <div className="lg:w-64 bg-white shadow-sm h-fit sticky top-4 rounded-lg m-4">
              <h3 className="font-semibold text-gray-900 p-4 border-b">Categories</h3>
              <div className="p-2">
                {Object.keys(foodItems).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors mb-1 ${
                      selectedCategory === category
                        ? "bg-red-50 text-red-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={`flex-1 ${isMobile ? 'pb-20' : 'p-4'}`}>
            {/* Mobile Filters */}
            {isMobile && (
              <div className="bg-white shadow-sm mb-4 p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {["All", "Veg", "Non-Veg", "Top Rated"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        if (filter === "Veg") setActiveFilter("Vegetarian");
                        else if (filter === "Non-Veg") setActiveFilter("Non-Vegetarian");
                        else setActiveFilter(filter);
                      }}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        (activeFilter === filter) || 
                        (filter === "Veg" && activeFilter === "Vegetarian") ||
                        (filter === "Non-Veg" && activeFilter === "Non-Vegetarian")
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop Filters */}
            {!isMobile && (
              <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
                <div className="flex flex-wrap gap-2">
                  {["All", "Vegetarian", "Non-Vegetarian", "Top Rated", "Price: Low to High"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === filter
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Header */}
            {searchTerm && (
              <div className="mb-6 px-4">
                <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                <p className="text-gray-600">Results for "{searchTerm}"</p>
              </div>
            )}

            {/* Food Grid */}
            <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
              {filteredItems().map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    isMobile ? 'mx-4' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  {isMobile ? (
                    <div className="flex h-32">
                      <div className="relative w-32 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <VegIcon isVeg={item.isVegetarian} />
                        </div>
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">{item.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star size={12} className="fill-green-500 text-green-500" />
                              <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                              <span className="text-xs text-gray-500">({item.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              {item.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{item.originalPrice.toFixed(0)}
                                </span>
                              )}
                              <span className="text-lg font-bold text-gray-900">₹{item.price.toFixed(0)}</span>
                            </div>
                            {item.originalPrice && (
                              <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-1 rounded">
                                ₹{(item.originalPrice - item.price).toFixed(0)} OFF
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleQuickAdd(item, e)}
                            className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors px-4 py-1.5 rounded-md text-sm font-semibold"
                          >
                            ADD
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <VegIcon isVeg={item.isVegetarian} />
                        </div>
                        {item.originalPrice && (
                          <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                          <button
                            onClick={(e) => handleQuickAdd(item, e)}
                            className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors p-2 rounded-lg"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">{renderStars(item.rating)}</div>
                          <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                          <span className="text-sm text-gray-500">({item.reviewCount})</span>
                          {item.cookTime && (
                            <>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock size={12} />
                                <span>{item.cookTime}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">₹{item.price.toFixed(0)}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.originalPrice.toFixed(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Leaf size={12} />
                            <span>{item.calories} cal</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {filteredItems().length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `No items matching "${searchTerm}" found.`
                    : "No items found in this category."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search 'curries'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => setIsMenuModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {itemCount > 0 && (
        <div className={`fixed ${isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'} z-40`}>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all"
          >
            <ShoppingCart size={20} />
            <span className="font-semibold">{itemCount}</span>
            <span className="hidden sm:inline">
              • ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(0)}
            </span>
          </button>
        </div>
      )}

      {/* Mobile Menu Modal */}
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        categories={Object.keys(foodItems)}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Item Detail Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-64 object-cover" />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-white text-gray-600 hover:text-gray-800 rounded-full p-2 shadow-lg"
              >
                <X size={20} />
              </button>
              <div className="absolute top-4 left-4">
                <VegIcon isVeg={selectedItem.isVegetarian} />
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.name}</h2>
              <p className="text-gray-600 mb-4">{selectedItem.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">{renderStars(selectedItem.rating)}</div>
                <span className="font-medium text-gray-900">{selectedItem.rating}</span>
                <span className="text-gray-500">({selectedItem.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">₹{selectedItem.price.toFixed(0)}</span>
                  {selectedItem.originalPrice && (
                    <span className="text-gray-500 line-through">₹{selectedItem.originalPrice.toFixed(0)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Leaf size={16} />
                  <span>{selectedItem.calories} cal</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Nutrition Information</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-semibold text-gray-900">{selectedItem.protein}</div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedItem.carbs}</div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedItem.fat}</div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold text-gray-900">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold text-lg min-w-[2rem] text-center">
                    {quantities[selectedItem.id] || 1}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <Button
                onClick={handleAddToCart}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold rounded-xl"
              >
                Add to Cart • ₹{((selectedItem.price * (quantities[selectedItem.id] || 1))).toFixed(0)}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Use the real external Cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableNumber="1"
      />

      {/* Line Clamp Styles */}
      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

// MenuModal Component (kept inline)
const MenuModal = ({ isOpen, onClose, categories, selectedCategory, onCategorySelect }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu Categories</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onCategorySelect(category);
                onClose();
              }}
              className={`w-full text-left p-4 rounded-lg mb-2 transition-colors ${
                selectedCategory === category
                  ? "bg-red-50 text-red-600 font-medium border border-red-200"
                  : "text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuMain;