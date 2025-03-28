import React from "react";

// MenuMain Component
const MenuMain: React.FC = () => {
  // Handle Click - Placeholder for future
  const handleMenuClick = (category: string) => {
    console.log(`${category} Clicked`);
    // Future: Fetch and display items when clicked
  };

  return (
    <div className="w-full px-6 mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Starter Card */}
      <div
        onClick={() => handleMenuClick("Starters")}
        className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 p-6 text-center"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">🥗 Starters</h3>
        <p className="text-gray-600">Begin your meal with something delicious!</p>
      </div>

      {/* Main Course Card */}
      <div
        onClick={() => handleMenuClick("Main Course")}
        className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 p-6 text-center"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">🍝 Main Course</h3>
        <p className="text-gray-600">Satisfy your hunger with mouth-watering dishes!</p>
      </div>

      {/* Desserts Card */}
      <div
        onClick={() => handleMenuClick("Desserts")}
        className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 p-6 text-center"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">🍰 Desserts</h3>
        <p className="text-gray-600">End your meal with something sweet!</p>
      </div>
    </div>
  );
};

export default MenuMain;
