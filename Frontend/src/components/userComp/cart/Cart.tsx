import React from "react";
import { X, ShoppingBag, Trash2, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart, CartItem } from "@/hooks/useCart";
import { useOrder } from "@/hooks/useOrder";
import { useSearchParams } from "react-router-dom";
//import { useRouter } from "next/router";
interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
}

interface CartItemProps {
  item: CartItem;
}

// Enhanced CartItem component with better styling
const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
  const { updateItemQuantity, removeItem } = useCart();

  const handleIncrement = () => {
    updateItemQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateItemQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 py-3 group"
    >
      {/* Item Image */}
      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <ShoppingBag size={20} />
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm truncate">{item.name}</h4>
          <span className="font-medium text-sm">
            ₹{(item.price * item.quantity).toFixed(2)}
          </span>
        </div>

        <p className="text-muted-foreground text-xs line-clamp-1 mb-2">
          ₹{item.price.toFixed(2)} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center">
          <div className="flex items-center border rounded-md">
            <button
              onClick={handleDecrement}
              className="px-2 py-1 text-xs hover:bg-muted transition-colors"
            >
              -
            </button>
            <span className="px-3 py-1 text-xs font-medium border-x">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="px-2 py-1 text-xs hover:bg-muted transition-colors"
            >
              +
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 ml-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const Cart: React.FC<CartProps> = ({ isOpen, onClose, tableNumber }) => {
  const { cartItems, clearCart, cartTotal } = useCart();
  const { placeOrder } = useOrder();
  const urlParams = new URLSearchParams(window.location.search);
  const paramTableId = urlParams.get("table");
  const restaurantId = urlParams.get("restaurant");
  //const API_URL = "http://localhost:3001";
  const API_URL =
    import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com"; // Use environment variable or fallback
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      //const restaurantId = localStorage.getItem("restaurantId");
      if (!restaurantId) {
        console.error("No restaurant ID provided");
        return;
      }
      const customerName = "hello";

      const orderData = {
        restaurant_id: restaurantId,
        //table_id: tableNumber, // Make sure tableNumber is set correctly!
        table_id: paramTableId, // Use paramTableId if available
        customer_name: customerName,
        order_items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      console.log("Order payload", orderData);

      const res = await fetch(
        `${API_URL}/orders/${restaurantId}/place`, // if this is your API route
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error:", errorText);
        throw new Error("Failed to place order");
      }

      const json = await res.json();
      console.log("Order placed successfully:", json);
      window.dispatchEvent(new Event("orderPlaced"));
      clearCart();
      onClose();
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  const taxAmount = cartTotal * 0.08; // 8% tax
  const serviceCharge = cartTotal * 0.05; // 5% service charge
  const totalWithTax = cartTotal + taxAmount + serviceCharge;
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Cart panel */}
          <motion.div
            key="cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-background z-50 shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ShoppingBag size={18} /> Your Order
                </h2>
                <p className="text-sm text-muted-foreground">
                  Table {tableNumber}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <AnimatePresence>
                  {cartItems.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-64 flex flex-col items-center justify-center text-center p-4"
                    >
                      <div className="text-6xl mb-4">🍽️</div>
                      <h3 className="text-xl font-medium mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Add some delicious items from the menu to get started.
                      </p>
                      <Button variant="outline" onClick={onClose}>
                        Browse Menu
                      </Button>
                    </motion.div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Badge variant="outline" className="px-2 py-1">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8"
                          onClick={clearCart}
                        >
                          Clear all
                        </Button>
                      </div>

                      <div className="space-y-1">
                        {cartItems.map((item) => (
                          <React.Fragment key={item.id}>
                            <CartItemComponent item={item} />
                            <Separator />
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Summary and Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t">
                <div className="p-4 bg-muted/30">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>₹{taxAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Service Charge (5%)
                      </span>
                      <span>₹{serviceCharge.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between pt-2 font-medium">
                      <span>Total</span>
                      <span className="text-lg">
                        ₹{totalWithTax.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <Button
                    className="w-full h-12"
                    size="lg"
                    onClick={handlePlaceOrder}
                  >
                    <CreditCard className="mr-2 h-4 w-4" /> Place Order
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-3">
                    By placing your order, you agree to our Terms of Service and
                    Privacy Policy
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
