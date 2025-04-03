import React, { useState, useEffect } from "react";
import { getUpdatedMenu } from "@/services/menuService"; // Function to fetch menu
import MenuCard from "@/components/userComp/menu/MenuCard"; // Component for dish UI

const categories = ["Starters", "Main Course", "Desserts"];

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState("Starters");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenu(activeCategory);
  }, [activeCategory]);

  const fetchMenu = async (category) => {
    try {
      const data = await getUpdatedMenu(category);
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Category Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-6 py-2 rounded-full text-lg font-medium transition-all duration-300 
              ${activeCategory === category ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.length > 0 ? (
          menuItems.map((item) => <MenuCard key={item.id} item={item} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">No items available</p>
        )}
      </div>
    </div>
  );
};

export default MenuSection;
