// import React from "react";
// import { X, ShoppingBag, Trash2, CreditCard } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useCart, CartItem } from "@/hooks/useCart";
// import { useOrder } from "@/hooks/useOrder";
// import axios from "axios";

// import { useSearchParams } from "react-router-dom";
// //import { useRouter } from "next/router";
// interface CartProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// interface CartItemProps {
//   item: CartItem;
// }

// // Enhanced CartItem component with better styling
// const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
//   const { updateItemQuantity, removeItem } = useCart();

//   const handleIncrement = () => {
//     updateItemQuantity(item.id, item.quantity + 1);
//   };

//   const handleDecrement = () => {
//     if (item.quantity > 1) {
//       updateItemQuantity(item.id, item.quantity - 1);
//     } else {
//       removeItem(item.id);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       className="flex items-center gap-3 py-3 group"
//     >
//       {/* Item Image */}
//       <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
//         {item.image ? (
//           <img
//             src={item.image}
//             alt={item.name}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
//             <ShoppingBag size={20} />
//           </div>
//         )}
//       </div>

//       {/* Item Details */}
//       <div className="flex-1 min-w-0">
//         <div className="flex justify-between items-start">
//           <h4 className="font-medium text-sm truncate">{item.name}</h4>
//           <span className="font-medium text-sm">
//             ₹{(item.price * item.quantity).toFixed(2)}
//           </span>
//         </div>

//         <p className="text-muted-foreground text-xs line-clamp-1 mb-2">
//           ₹{item.price.toFixed(2)} each
//         </p>

//         {/* Quantity Controls */}
//         <div className="flex items-center">
//           <div className="flex items-center border rounded-md">
//             <button
//               onClick={handleDecrement}
//               className="px-2 py-1 text-xs hover:bg-muted transition-colors"
//             >
//               -
//             </button>
//             <span className="px-3 py-1 text-xs font-medium border-x">
//               {item.quantity}
//             </span>
//             <button
//               onClick={handleIncrement}
//               className="px-2 py-1 text-xs hover:bg-muted transition-colors"
//             >
//               +
//             </button>
//           </div>

//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-7 w-7 ml-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
//             onClick={() => removeItem(item.id)}
//           >
//             <Trash2 size={14} />
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
//   const { cartItems, clearCart, cartTotal } = useCart();
//   const { placeOrder } = useOrder();
//   const urlParams = new URLSearchParams(window.location.search);
//   const restaurantId = urlParams.get("restaurant");
//   //const API_URL = "http://localhost:3001";
//   const API_URL =
//     import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com"; // Use environment variable or fallback
//   const handlePlaceOrder = async () => {
//   if (cartItems.length === 0) return;

//   try {
//     if (!restaurantId) {
//       alert("Restaurant not selected");
//       return;
//     }

//     // Step 1: Create order on your backend (which talks to Razorpay)
//     const orderRes = await fetch(`${API_URL}/orders/create-razorpay-order`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         amount: Math.round(totalWithTax * 100), // Razorpay expects paise (e.g., ₹100 = 10000)
//         currency: "INR",
//         receipt: `order_${Date.now()}`,
//         notes: {
//           restaurant_id: restaurantId,
//           items: cartItems,
//         },
//       }),
//     });

//     if (!orderRes.ok) {
//       const err = await orderRes.json();
//       console.error("Failed to create Razorpay order:", err);
//       alert("Payment setup failed. Please try again.");
//       return;
//     }

//     const { id: razorpayOrderId, amount, currency } = await orderRes.json();

//     // Step 2: Load Razorpay script dynamically (if not already loaded)
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID, // 👈 Your Razorpay Key ID (from dashboard)
//         amount: amount, // in paise
//         currency: currency,
//         name: "BaootaMadu",
//         description: "Order Payment",
//         order_id: razorpayOrderId,
//         handler: async function (response: any) {
//           // Step 3: Verify payment on backend
//           const verifyRes = await fetch(`${API_URL}/orders/verify-payment`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               restaurantId,
//               cartItems,
//               totalAmount: totalWithTax,
//             }),
//           });

//           if (verifyRes.ok) {
//             alert("Payment successful! Order confirmed.");
//             window.dispatchEvent(new Event("orderPlaced"));
//             clearCart();
//             onClose();
//           } else {
//             alert("Payment verification failed. Please contact support.");
//           }
//         },
//         prefill: {
//           name: "Customer",
//           email: "customer@example.com",
//           contact: "9999999999",
//         },
//         theme: {
//           color: "#6366f1", // Tailwind indigo-500
//         },
//         modal: {
//           ondismiss: function () {
//             alert("Payment cancelled.");
//           },
//         },
//       };

//       // @ts-ignore
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     };

//     script.onerror = () => {
//       alert("Failed to load Razorpay. Please try again.");
//     };
//   } catch (error) {
//     console.error("Payment initiation error:", error);
//     alert("Something went wrong. Please try again.");
//   }
// };

//   const taxAmount = cartTotal * 0; // 8% tax
//   const serviceCharge = cartTotal * 0; // 5% service charge
//   const totalWithTax = cartTotal + taxAmount + serviceCharge;
//   const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             key="overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
//             onClick={onClose}
//           />

//           {/* Cart panel */}
//           <motion.div
//             key="cart"
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ type: "spring", damping: 25, stiffness: 300 }}
//             className="fixed top-0 right-0 w-full max-w-md h-full bg-background z-50 shadow-xl flex flex-col"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b">
//               <div>
//                 <h2 className="text-xl font-semibold flex items-center gap-2">
//                   <ShoppingBag size={18} /> Your Order
//                 </h2>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={onClose}
//                 className="rounded-full"
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>

//             {/* Cart Items */}
//             <ScrollArea className="flex-1">
//               <div className="p-4">
//                 <AnimatePresence>
//                   {cartItems.length === 0 ? (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="h-64 flex flex-col items-center justify-center text-center p-4"
//                     >
//                       <div className="text-6xl mb-4">🍽️</div>
//                       <h3 className="text-xl font-medium mb-2">
//                         Your cart is empty
//                       </h3>
//                       <p className="text-muted-foreground mb-4">
//                         Add some delicious items from the menu to get started.
//                       </p>
//                       <Button variant="outline" onClick={onClose}>
//                         Browse Menu
//                       </Button>
//                     </motion.div>
//                   ) : (
//                     <div>
//                       <div className="flex justify-between items-center mb-4">
//                         <Badge variant="outline" className="px-2 py-1">
//                           {itemCount} {itemCount === 1 ? "item" : "items"}
//                         </Badge>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="text-xs h-8"
//                           onClick={clearCart}
//                         >
//                           Clear all
//                         </Button>
//                       </div>

//                       <div className="space-y-1">
//                         {cartItems.map((item) => (
//                           <React.Fragment key={item.id}>
//                             <CartItemComponent item={item} />
//                             <Separator />
//                           </React.Fragment>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </ScrollArea>

//             {/* Summary and Checkout */}
//             {cartItems.length > 0 && (
//               <div className="border-t">
//                 <div className="p-4 bg-muted/30">
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Subtotal</span>
//                       <span>₹{cartTotal.toFixed(2)}</span>
//                     </div>

//                     {/* <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Tax (8%)</span>
//                       <span>₹{taxAmount.toFixed(2)}</span>
//                     </div> */}

//                     {/* <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">
//                         Service Charge (5%)
//                       </span>
//                       <span>₹{serviceCharge.toFixed(2)}</span>
//                     </div> */}

//                     <Separator />

//                     <div className="flex justify-between pt-2 font-medium">
//                       <span>Total</span>
//                       <span className="text-lg">
//                         ₹{totalWithTax.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-4">
//                   <Button
//   className="w-full h-12 text-base font-medium flex items-center justify-center"
//   size="lg"
//   onClick={async () => {
//     try {
//       // 🧾 1️⃣ Create order on backend
//       const { data } = await axios.post("http://localhost:3001/api/payments/create-order", {
//         amount: 500, // Replace with your dynamic total
//       });

//       // 💳 2️⃣ Configure Razorpay checkout
//       const options = {
//         key: "rzp_test_XXXXXXXXXXXXXX", // Replace with your Razorpay test key ID
//         amount: data.amount,
//         currency: "INR",
//         name: "BaOotaMadu",
//         description: "Food Order Payment",
//         order_id: data.id,
//         handler: async function (response) {
//           // 🔐 3️⃣ Verify payment on backend
//           const verify = await axios.post("http://localhost:3001/api/payments/verify-payment", response);

//           if (verify.data.success) {
//             alert("✅ Payment Successful!");
//             // Optionally mark as paid:
//             // await axios.patch(`/orders/${restaurantId}/${orderId}/pay`);
//           } else {
//             alert("❌ Payment Verification Failed!");
//           }
//         },
//         theme: {
//           color: "#F37254",
//         },
//       };

//       // 🚀 4️⃣ Open Razorpay popup
//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error(error);
//       alert("Error initiating payment");
//     }
//   }}
// >
//   <CreditCard className="mr-2 h-4 w-4" /> Place Order
// </Button>

//                   <p className="text-center text-xs text-muted-foreground mt-3">
//                     By placing your order, you agree to our Terms of Service and
//                     Privacy Policy
//                   </p>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Cart;

import React, { useState } from "react";
import { X, ShoppingBag, Trash2, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart, CartItem } from "@/hooks/useCart";
import axios from "axios";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItemProps {
  item: CartItem;
}

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

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, clearCart, cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  //const restaurantId = urlParams.get("restaurant");
  const restaurantId = urlParams.get("restaurant");
  const API_URL =
    import.meta.env.VITE_API_BASE?.trim() || "https://baootamadu.onrender.com";
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // Total with tax/charges (currently 0%)
  const taxAmount = cartTotal * 0;
  const serviceCharge = cartTotal * 0;
  const totalWithTax = cartTotal + taxAmount + serviceCharge;
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || !restaurantId) return;

    setIsProcessing(true);

    try {
      // 1️⃣ Create Razorpay order on backend
      const { data: orderData } = await axios.post(
        `${API_URL}/api/payment/create-order`,
        {
          amount: Math.round(totalWithTax * 100), // in paise
          currency: "INR",
          receipt: `order_${Date.now()}`,
          notes: {
            restaurant_id: restaurantId,
            items: cartItems.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        }
      );

      // 2️⃣ Load Razorpay if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
          script.onerror = () => {
            throw new Error("Failed to load Razorpay SDK");
          };
        });
      }

      // 3️⃣ Open Razorpay modal
      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "BaootaMadu",
        description: "Order Payment",
        order_id: orderData.id,

        handler: async (response: any) => {
          try {
            // 4️⃣ Verify payment
            const verifyRes = await axios.post(
              `${API_URL}/api/payment/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                restaurantId,
                totalAmount: totalWithTax,
              }
            );

            if (verifyRes.data.success) {
              // ✅ Payment successful, now place the order
              try {
                const orderRes = await axios.post(
                  `${API_URL}/orders/${restaurantId}/place`,
                  {
                    restaurant_id: restaurantId,
                    customer_name: "Customer", // Replace with actual customer name if available
                    order_items: cartItems.map((item) => ({
                      name: item.name,
                      price: item.price,
                      quantity: item.quantity,
                    })),
                  }
                );

                if (orderRes.status === 201) {
                  alert(
                    `✅ Payment and order successful! Token: ${orderRes.data.order.tokenNumber}`
                  );
                  window.dispatchEvent(new Event("orderPlaced"));
                  clearCart();
                  onClose();
                } else {
                  alert("❌ Payment succeeded but order placement failed.");
                }
              } catch (orderErr) {
                console.error("Order placement error:", orderErr);
                alert("❌ Failed to place order after payment.");
              }
            } else {
              alert("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification error.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => {
            alert("Payment cancelled.");
            setIsProcessing(false);
          },
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      alert(
        error.response?.data?.message ||
          "Failed to start payment. Please try again."
      );
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            key="cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-background z-50 shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingBag size={18} /> Your Order
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

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
                          <div key={item.id}>
                            <CartItemComponent item={item} />
                            <Separator />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {cartItems.length > 0 && (
              <div className="border-t">
                <div className="p-4 bg-muted/30">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
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
                    className="w-full h-12 flex items-center justify-center"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" /> Place Order
                      </>
                    )}
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
