import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { CartItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartTotal: 0,
});

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      // If item doesn't exist in cart, add it
      if (existingItemIndex === -1 && item.quantity > 0) {
        toast.success(`Added ${item.name} to your order`);
        return [...prevItems, item];
      }
      
      // If item exists, update its quantity
      const updatedItems = [...prevItems];
      
      // If new quantity is 0 or less, remove item
      if (item.quantity <= 0) {
        toast.info(`Removed ${updatedItems[existingItemIndex].name} from your order`);
        return updatedItems.filter(i => i.id !== item.id);
      }
      
      // Otherwise, update quantity
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: item.quantity,
        customizations: item.customizations
      };
      
      return updatedItems;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      if (itemToRemove) {
        toast.info(`Removed ${itemToRemove.name} from your order`);
      }
      return prevItems.filter(item => item.id !== id);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
  }), [cartItems, addToCart, removeFromCart, clearCart, cartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
