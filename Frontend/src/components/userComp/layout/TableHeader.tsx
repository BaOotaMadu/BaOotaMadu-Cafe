import React, { useState } from "react";
import MenuMain from "@/components/userComp/menu/MenuMain";
import Cart from "@/components/userComp/cart/Cart";

const TableHeader: React.FC<{ tableNumber: string }> = ({ tableNumber }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleAddToCart = (item: any) => {
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCartItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCartItems, { ...item, quantity: 1 }];
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800 font-sans">
      {/* Header Section */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">Table {tableNumber}</h1>
        <button
          onClick={handleCartToggle}
          className="relative p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <MenuMain onAddToCart={handleAddToCart} />
      </main>

      {/* Cart Modal */}
      <Cart isOpen={isCartOpen} onClose={handleCartToggle} cartItems={cartItems} tableNumber={tableNumber} />
    </div>
  );
};

export default TableHeader;