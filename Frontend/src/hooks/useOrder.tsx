import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CartItem, Order, OrderStatus } from "@/types";
import {
  placeOrder as apiPlaceOrder,
  getTableOrders,
} from "@/services/orderService";
import { toast } from "sonner";

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  orderStatus: OrderStatus | null;
  isLoading: boolean;
  placeOrder: (tableId: string, items: CartItem[]) => Promise<Order>;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  currentOrder: null,
  orderStatus: null,
  isLoading: false,
  placeOrder: async () => {
    throw new Error("OrderProvider not found");
  },
});

interface OrderProviderProps {
  children: React.ReactNode;
  tableId: string;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({
  children,
  tableId,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load orders for this table
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const tableOrders = await getTableOrders(tableId);
        setOrders(tableOrders);

        // Set the most recent order as current
        if (tableOrders.length > 0) {
          const latestOrder = tableOrders.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];

          setCurrentOrder(latestOrder);
          setOrderStatus(latestOrder.status);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (tableId) {
      fetchOrders();
    }
  }, [tableId]);

  // Subscribe to order status updates
  useEffect(() => {
    if (!window.tableEventManager || !currentOrder) return;

    const unsubscribe = window.tableEventManager.subscribe(
      "orderStatusUpdate",
      (data) => {
        if (data.orderId === currentOrder.id) {
          setOrderStatus(data.status);

          // Update the current order
          setCurrentOrder((prev) => {
            if (!prev) return null;
            return { ...prev, status: data.status };
          });

          // Update the order in the orders array
          setOrders((prev) =>
            prev.map((order) =>
              order.id === data.orderId
                ? { ...order, status: data.status }
                : order
            )
          );

          // Show toast notification
          const statusMessages = {
            pending: "Your order has been received!",
            preparing: "Your order is being prepared!",
            ready: "Your order is ready to be served!",
            served: "Enjoy your meal!",
          };

          toast(statusMessages[data.status] || "Order status updated", {
            description: `Order #${data.orderId}`,
          });
        }
      }
    );

    return unsubscribe;
  }, [currentOrder]);

  const placeOrder = useCallback(async (tableId: string, items: CartItem[]) => {
    setIsLoading(true);

    try {
      const newOrder = await apiPlaceOrder(tableId, items);

      // Update state
      setOrders((prev) => [newOrder, ...prev]);
      setCurrentOrder(newOrder);
      setOrderStatus(newOrder.status);

      return newOrder;
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place your order. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        orderStatus,
        isLoading,
        placeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
