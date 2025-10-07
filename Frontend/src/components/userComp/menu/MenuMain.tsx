import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Clock,
  Leaf,
  Search,
  Menu,
  X,
  CheckCircle,
} from "lucide-react";
import Cart from "../cart/Cart"; // ✅ Use the real Cart component
import { useCart } from "@/hooks/useCart"; // ✅ Must support addItem, removeItem

// ✅ UPDATED: Renamed "image" → "image_url" to match backend
interface FoodItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image_url: string; // ✅ Changed from "image"
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
  restaurantId?: string;
}

const MenuMain: React.FC<MenuMainProps> = ({
  searchTerm: externalSearchTerm = "",
  restaurantId: propRestaurantId = "",
}) => {
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

  // ✅ Order Status Panel State
  const [showOrderStatus, setShowOrderStatus] = useState<boolean>(false);
  const [orderProgress, setOrderProgress] = useState<number>(0);
  const [orderTime, setOrderTime] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<number>(1); // 25 minutes estimated

  const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:3001";
  const params = new URLSearchParams(window.location.search);
  const restaurantId = params.get("restaurant");
  console.log("Restaurant ID:", restaurantId);

  // ✅ Use real cart with addItem and removeItem
  const { addItem, removeItem, cartItems } = useCart();

  // ✅ Calculate total item count
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // ✅ Sync local quantities with cart on every cart update
  useEffect(() => {
    const cartQuantities: Record<string, number> = {};
    cartItems.forEach((item) => {
      cartQuantities[item.id] = item.quantity;
    });
    setQuantities(cartQuantities);
  }, [cartItems]);

  // ✅ Listen for order placed event
  useEffect(() => {
    const handleOrderPlaced = () => {
      setShowOrderStatus(true);
      setOrderProgress(0);
      const now = new Date();
      setOrderTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    window.addEventListener("orderPlaced", handleOrderPlaced);
    return () => window.removeEventListener("orderPlaced", handleOrderPlaced);
  }, []);

  // ✅ Progress animation
  useEffect(() => {
    if (showOrderStatus && orderProgress < 100) {
      const timer = setTimeout(() => {
        setOrderProgress((prev) => Math.min(prev + 1, 100));
      }, (estimatedTime * 60 * 1000) / 100);

      return () => clearTimeout(timer);
    }
  }, [showOrderStatus, orderProgress, estimatedTime]);

  // ✅ Auto hide after completion
  useEffect(() => {
    if (orderProgress >= 100) {
      const timer = setTimeout(() => {
        setShowOrderStatus(false);
        setOrderProgress(0);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [orderProgress]);

  // ✅ Get progress bar color
  const getProgressColor = (progress: number) => {
    if (progress < 25) return "bg-red-300";
    if (progress < 50) return "bg-red-500";
    if (progress < 75) return "bg-yellow-500";
    if (progress < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  // ✅ Get status text
  const getStatusText = (progress: number) => {
    if (progress < 25) return "Order Received";
    if (progress < 50) return "Preparing";
    if (progress < 75) return "Cooking";
    if (progress < 100) return "Almost Ready";
    return "Order Ready!";
  };

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
        const res = await fetch(`${API_URL}/menu/${restaurantId}`);
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
            // ✅ FIXED: "image" → "image_url"
            image_url:
              item.image_url || item.image || "/api/placeholder/300/200",
            description: item.description || "Delicious item",
            rating: item.rating || 4.5,
            reviewCount: item.reviewCount || Math.floor(Math.random() * 300),
            isVegetarian:
              item.isVegetarian !== undefined
                ? item.isVegetarian
                : Math.random() > 0.5,
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

        // Initialize quantities from cart
        const initialQuantities: Record<string, number> = {};
        Object.values(categorized)
          .flat()
          .forEach((item) => {
            const cartItem = cartItems.find((ci) => ci.id === item.id);
            initialQuantities[item.id] = cartItem?.quantity || 0;
          });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Failed to fetch food items:", error);
        setFoodItems({});
      }
    }
    fetchFoodItems();
  }, [cartItems]); // Re-fetch quantities if cart changes

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
    if (activeFilter === "Vegetarian")
      items = items.filter((item) => item.isVegetarian);
    if (activeFilter === "Non-Vegetarian")
      items = items.filter((item) => !item.isVegetarian);
    if (activeFilter === "Top Rated")
      items = items.filter((item) => item.rating >= 4.5);
    if (activeFilter === "Price: Low to High")
      items = [...items].sort((a, b) => a.price - b.price);
    return items;
  };

  // Handlers
  const handleItemClick = (item: FoodItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    const qty = quantities[selectedItem.id] || 1;
    if (qty === 0) return;

    // Ensure cart reflects final quantity
    const existing = cartItems.find((i) => i.id === selectedItem.id);
    if (existing) {
      // If already in cart, just ensure quantity is correct
    } else {
      addItem({ ...selectedItem, quantity: qty });
    }

    setIsModalOpen(false);
  };

  const handleQuantityChange = (
    item: FoodItem,
    delta: number,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();

    const currentQty = quantities[item.id] || 0;
    const newQty = Math.max(0, currentQty + delta);

    // Only update local UI immediately
    setQuantities((prev) => ({ ...prev, [item.id]: newQty }));

    // Update cart: add or remove one unit
    if (delta === 1) {
      addItem({ ...item, quantity: 1 }); // Add one to cart
    } else if (delta === -1 && currentQty > 0) {
      removeItem(item.id); // Remove one from cart
    }
  };

  // Stars UI
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
      />
    ));
  };

  // Veg/Non-Veg Icon
  const VegIcon = ({ isVeg }: { isVeg: boolean }) => (
    <div
      className={`w-4 h-4 border-2 ${
        isVeg ? "border-green-600" : "border-red-600"
      } flex items-center justify-center`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isVeg ? "bg-green-600" : "bg-red-600"
        }`}
      />
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
              <p className="text-gray-600">
                Choose from our delicious selection
              </p>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-4">
                <div className="relative w-96">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search for dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Order Status Panel */}
        {showOrderStatus && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    {orderProgress >= 100 ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <Clock size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getStatusText(orderProgress)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Table #1</span>
                      <span>•</span>
                      <span>Ordered at {orderTime}</span>
                      <span>•</span>
                      <span>
                        {orderProgress >= 100
                          ? "Ready for pickup!"
                          : `Est. ${Math.ceil(
                              (estimatedTime * (100 - orderProgress)) / 100
                            )} min remaining`}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowOrderStatus(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${getProgressColor(
                    orderProgress
                  )} relative`}
                  style={{ width: `${orderProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>0%</span>
                <span className="font-semibold text-gray-700">
                  {orderProgress}% Complete
                </span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          {!isMobile && (
            <div className="lg:w-64 bg-white shadow-sm h-fit sticky top-4 rounded-lg m-4">
              <h3 className="font-semibold text-gray-900 p-4 border-b">
                Categories
              </h3>
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
          <div className={`flex-1 ${isMobile ? "pb-20" : "p-4"}`}>
            {/* Mobile Search Bar - Always on top when visible */}
            {isMobile && (
              <div className="bg-white shadow-sm mb-4 p-4 sticky top-0 z-30">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search 'curries'"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}

            {/* Mobile Filters (only if not searching) */}
            {isMobile && !searchTerm && (
              <div className="bg-white shadow-sm mb-4 p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {["All", "Veg", "Non-Veg", "Top Rated"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        if (filter === "Veg") setActiveFilter("Vegetarian");
                        else if (filter === "Non-Veg")
                          setActiveFilter("Non-Vegetarian");
                        else setActiveFilter(filter);
                      }}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === filter ||
                        (filter === "Veg" && activeFilter === "Vegetarian") ||
                        (filter === "Non-Veg" &&
                          activeFilter === "Non-Vegetarian")
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

            {/* Food Grid */}
            <div
              className={`${
                isMobile
                  ? "space-y-4"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              }`}
            >
              {filteredItems().map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    isMobile ? "mx-4" : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  {isMobile ? (
                    <div className="flex h-32">
                      <div className="relative w-32 flex-shrink-0">
                        {/* ✅ FIXED: "item.image" → "item.image_url" */}
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <VegIcon isVeg={item.isVegetarian} />
                        </div>
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {renderStars(item.rating)}
                              <span className="text-sm font-medium text-gray-900">
                                {item.rating}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({item.reviewCount})
                              </span>
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
                              <span className="text-lg font-bold text-gray-900">
                                ₹{item.price.toFixed(0)}
                              </span>
                            </div>
                            {item.originalPrice && (
                              <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-1 rounded">
                                ₹{(item.originalPrice - item.price).toFixed(0)}{" "}
                                OFF
                              </span>
                            )}
                          </div>
                          {/* Quantity Counter */}
                          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                            <button
                              onClick={(e) => handleQuantityChange(item, -1, e)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-8 h-8 flex items-center justify-center disabled:opacity-40"
                              disabled={(quantities[item.id] || 0) <= 0}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 py-1 text-sm font-medium min-w-[1.5rem] text-center">
                              {quantities[item.id] || 0}
                            </span>
                            <button
                              onClick={(e) => handleQuantityChange(item, 1, e)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-8 h-8 flex items-center justify-center"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        {/* ✅ FIXED: "item.image" → "item.image_url" */}
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <VegIcon isVeg={item.isVegetarian} />
                        </div>
                        {item.originalPrice && (
                          <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {Math.round(
                              ((item.originalPrice - item.price) /
                                item.originalPrice) *
                                100
                            )}
                            % OFF
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {item.name}
                          </h3>
                          <button
                            onClick={(e) => handleQuantityChange(item, 1, e)}
                            className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors p-2 rounded-lg"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {item.rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({item.reviewCount})
                          </span>
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
                            <span className="text-xl font-bold text-gray-900">
                              ₹{item.price.toFixed(0)}
                            </span>
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
                <ShoppingCart
                  size={64}
                  className="mx-auto text-gray-400 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? `No items matching "${searchTerm}" found.`
                    : "No items found in this category."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar - Hidden during search */}
      {isMobile && !searchTerm && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
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
        <div
          className={`fixed ${
            isMobile ? "bottom-20 right-4" : "bottom-6 right-6"
          } z-40`}
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all"
          >
            <ShoppingCart size={20} />
            <span className="font-semibold">{itemCount}</span>
            <span className="hidden sm:inline">
              • ₹
              {cartItems
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toFixed(0)}
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
              {/* ✅ FIXED: "selectedItem.image" → "selectedItem.image_url" */}
              <img
                src={selectedItem.image_url}
                alt={selectedItem.name}
                className="w-full h-64 object-cover"
              />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedItem.name}
              </h2>
              <p className="text-gray-600 mb-4">{selectedItem.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(selectedItem.rating)}
                </div>
                <span className="font-medium text-gray-900">
                  {selectedItem.rating}
                </span>
                <span className="text-gray-500">
                  ({selectedItem.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{selectedItem.price.toFixed(0)}
                  </span>
                  {selectedItem.originalPrice && (
                    <span className="text-gray-500 line-through">
                      ₹{selectedItem.originalPrice.toFixed(0)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Leaf size={16} />
                  <span>{selectedItem.calories} cal</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Nutrition Information
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {selectedItem.protein}
                    </div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {selectedItem.carbs}
                    </div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {selectedItem.fat}
                    </div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold text-gray-900">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(selectedItem, -1)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold text-lg min-w-[2rem] text-center">
                    {quantities[selectedItem.id] || 1}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(selectedItem, 1)}
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
                Add to Cart • ₹
                {(
                  selectedItem.price * (quantities[selectedItem.id] || 1)
                ).toFixed(0)}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Real Cart Component */}
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

// MenuModal Component
const MenuModal = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
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
