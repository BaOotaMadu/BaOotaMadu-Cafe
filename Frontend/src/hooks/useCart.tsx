import { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  addItemToCart: (item: Omit<CartItem, 'quantity'>) => void; // New function
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  isItemInCart: (id: string) => boolean; // Helper function
  getItemQuantity: (id: string) => number; // Helper function
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Note: localStorage is not supported in Claude artifacts, using regular state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Helper function to check if item is in cart
  const isItemInCart = (id: string): boolean => {
    return cartItems.some(item => item.id === id);
  };

  // Helper function to get item quantity
  const getItemQuantity = (id: string): number => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  // Add item to cart with quantity 0 initially (for display purposes)
  const addItemToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item already exists, don't add duplicate
        return prevItems;
      } else {
        // Add new item with quantity 0
        return [...prevItems, { ...item, quantity: 0 }];
      }
    });
  };

  // Legacy addItem function (kept for backward compatibility)
  const addItem = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add new one
        return [...prevItems, item];
      }
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Update item quantity
  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        addItemToCart,
        removeItem,
        updateItemQuantity,
        clearCart,
        cartTotal,
        isItemInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};