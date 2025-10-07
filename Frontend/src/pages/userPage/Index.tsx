// import React, { useState, useEffect, useRef } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { CartProvider, useCart } from "@/hooks/useCart";
// import { OrderProvider } from "@/hooks/useOrder";
// import Header from "@/components/userComp/layout/Header";
// import MenuMain from "@/components/userComp/menu/MenuMain";
// import { getTableNumber, initTableEventManager } from "@/services/tableService";
// import Cart from "@/components/userComp/cart/Cart";
// import { X, ShoppingBag, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useSearchParams } from "next/navigation";

// const TableHeader: React.FC<{ tableId: string }> = ({ tableId }) => {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showSearch, setShowSearch] = useState(false);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const { toast } = useToast();
//   const { cartItems } = useCart();
//   const searchRef = useRef<HTMLInputElement>(null);
//   const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowSearch(true);
//       if (!window.matchMedia("(max-width: 640px)").matches) {
//         setTimeout(() => {
//           searchRef.current?.focus();
//         }, 500);
//       }
//     }, 300);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleCartToggle = () => setIsCartOpen(!isCartOpen);

//   const handleCallStaff = () => {
//     toast({
//       title: "Staff Notified",
//       description: "A staff member will be with you shortly.",
//     });
//   };

//   const handleSearchClear = () => {
//     setSearchTerm("");
//     searchRef.current?.focus();
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-white text-[#1B1F3B]">
//       <Header tableNumber={tableId} onCartClick={handleCartToggle} />

//       <div className="flex-grow">
//         <MenuMain searchTerm={searchTerm} />
//       </div>

//       <Cart
//         isOpen={isCartOpen}
//         onClose={handleCartToggle}
//         tableNumber={tableId}
//       />

//       {!isCartOpen && itemCount > 0 && (
//         <div className="fixed bottom-4 right-4 z-50 md:hidden">
//           {/* <Button
//             onClick={handleCartToggle}
//             className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700"
//             aria-label="Open cart"
//           >
//             <div className="relative">
//               <ShoppingBag size={18} />
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-4 h-4 sm:min-w-5 sm:h-5 flex items-center justify-center rounded-full px-1">
//                 {itemCount}
//               </span>
//             </div>
//           </Button> */}
//         </div>
//       )}

//       <div className="fixed bottom-4 left-4 z-40">
//         {/* <Button
//           onClick={handleCallStaff}
//           variant="outline"
//           className="h-10 px-3 sm:px-4 text-xs sm:text-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50"
//         >
//           Call Staff
//         </Button> */}
//       </div>
//     </div>
//   );
// };

// const Index: React.FC = () => {
//   const [tableId, setTableId] = useState<string>("");
//   const [restaurantId, setRestaurantId] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const setupTable = async () => {
//       try {
//         initTableEventManager();

//         // Parse query params manually
//         const urlParams = new URLSearchParams(window.location.search);
//         const paramTableId = urlParams.get("table");
//         const restaurantId = urlParams.get("restaurant");

//         const fallbackTableId = getTableNumber();
//         const finalTableId =
//           paramTableId?.trim() || fallbackTableId?.trim() || "";

//         console.log(
//           "paramTableId:",
//           paramTableId,
//           "fallbackTableId:",
//           fallbackTableId
//         );

//         setTableId(finalTableId);
//         setRestaurantId(restaurantId || "");

//         if (finalTableId) {
//           document.title = `Table ${finalTableId} - Dine-In Symphony`;
//         }
//       } finally {
//         setTimeout(() => setIsLoading(false), 800);
//       }
//     };

//     setupTable();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-white">
//         <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
//         <p className="text-gray-500 text-sm sm:text-base animate-pulse">
//           Loading your table...
//         </p>
//       </div>
//     );
//   }

//   if (!tableId) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
//         <div className="text-red-500 text-xl mb-4">⚠️</div>
//         <h2 className="text-lg sm:text-xl font-semibold mb-2">
//           Table Not Found
//         </h2>
//         <p className="text-sm sm:text-base text-gray-600 mb-4">
//           Unable to identify your table. Please scan the QR code again or ask
//           for assistance.
//         </p>
//         <Button
//           onClick={() => window.location.reload()}
//           className="bg-indigo-600 hover:bg-indigo-700"
//         >
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <CartProvider>
//       <OrderProvider tableId={tableId}>
//         <TableHeader tableId={tableId} />
//       </OrderProvider>
//     </CartProvider>
//   );
// };

// export default Index;
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { CartProvider, useCart } from "@/hooks/useCart";
import { OrderProvider } from "@/hooks/useOrder";
import Header from "@/components/userComp/layout/Header";
import MenuMain from "@/components/userComp/menu/MenuMain";
import { getTableNumber, initTableEventManager } from "@/services/tableService";
import Cart from "@/components/userComp/cart/Cart";
import { X, ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

const RestaurantHeader: React.FC<{ restaurantId: string }> = ({
  restaurantId,
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { toast } = useToast();
  const { cartItems } = useCart();
  const searchRef = useRef<HTMLInputElement>(null);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSearch(true);
      if (!window.matchMedia("(max-width: 640px)").matches) {
        setTimeout(() => {
          searchRef.current?.focus();
        }, 500);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleCartToggle = () => setIsCartOpen(!isCartOpen);

  const handleCallStaff = () => {
    toast({
      title: "Staff Notified",
      description: "A staff member will be with you shortly.",
    });
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    searchRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1B1F3B]">
      <Header onCartClick={handleCartToggle} />

      <div className="flex-grow">
        <MenuMain searchTerm={searchTerm} />
      </div>

      <Cart isOpen={isCartOpen} onClose={handleCartToggle} />

      {!isCartOpen && itemCount > 0 && (
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
          {/* <Button
            onClick={handleCartToggle}
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700"
            aria-label="Open cart"
          >
            <div className="relative">
              <ShoppingBag size={18} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-4 h-4 sm:min-w-5 sm:h-5 flex items-center justify-center rounded-full px-1">
                {itemCount}
              </span>
            </div>
          </Button> */}
        </div>
      )}

      <div className="fixed bottom-4 left-4 z-40">
        {/* <Button
          onClick={handleCallStaff}
          variant="outline"
          className="h-10 px-3 sm:px-4 text-xs sm:text-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        >
          Call Staff
        </Button> */}
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  const [tableId, setTableId] = useState<string>("");
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const setupTable = async () => {
      try {
        initTableEventManager();

        // Parse query params manually
        const urlParams = new URLSearchParams(window.location.search);
        const paramTableId = urlParams.get("table");
        const restaurantId = urlParams.get("restaurant");

        const fallbackTableId = getTableNumber();
        const finalTableId =
          paramTableId?.trim() || fallbackTableId?.trim() || "";

        console.log(
          "paramTableId:",
          paramTableId,
          "fallbackTableId:",
          fallbackTableId
        );

        setTableId(finalTableId);
        setRestaurantId(restaurantId || "");

        if (finalTableId) {
          document.title = `Table ${finalTableId} - Dine-In Symphony`;
        }
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    setupTable();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <p className="text-gray-500 text-sm sm:text-base animate-pulse">
          Loading your table...
        </p>
      </div>
    );
  }

  if (!tableId) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Table Not Found
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Unable to identify your table. Please scan the QR code again or ask
          for assistance.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <CartProvider>
      <OrderProvider tableId={tableId}>
        <RestaurantHeader restaurantId={restaurantId} />
      </OrderProvider>
    </CartProvider>
  );
};

export default Index;
