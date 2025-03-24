
import { CartItem, Order, OrderStatus } from '@/types';

// Mock order tracking
let orderCounter = 1000;
const activeOrders: Record<string, Order> = {};

// Simulate placing an order
export const placeOrder = async (tableNumber: string, items: CartItem[]): Promise<Order> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const orderNumber = `${orderCounter++}`;
  const timestamp = new Date().toISOString();
  
  const newOrder: Order = {
    id: orderNumber,
    tableNumber,
    items,
    status: 'pending',
    timestamp,
    totalAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0)
  };
  
  // Save to our mock "database"
  activeOrders[orderNumber] = newOrder;
  
  // For demo purposes, automatically progress the order status
  scheduleStatusUpdates(orderNumber);
  
  return newOrder;
};

// Get order details
export const getOrder = async (orderId: string): Promise<Order | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return activeOrders[orderId] || null;
};

// Get all active orders for a table
export const getTableOrders = async (tableNumber: string): Promise<Order[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return Object.values(activeOrders).filter(
    order => order.tableNumber === tableNumber
  );
};

// Simulate order status updates
const scheduleStatusUpdates = (orderId: string) => {
  // After 10 seconds, update to 'preparing'
  setTimeout(() => {
    if (activeOrders[orderId]) {
      activeOrders[orderId].status = 'preparing';
      
      // Publish event for real-time updates
      if (window.tableEventManager) {
        window.tableEventManager.publish('orderStatusUpdate', {
          orderId,
          status: 'preparing'
        });
      }
    }
  }, 10000);
  
  // After 25 seconds, update to 'ready'
  setTimeout(() => {
    if (activeOrders[orderId]) {
      activeOrders[orderId].status = 'ready';
      
      // Publish event for real-time updates
      if (window.tableEventManager) {
        window.tableEventManager.publish('orderStatusUpdate', {
          orderId,
          status: 'ready'
        });
      }
    }
  }, 25000);
  
  // After 35 seconds, update to 'served'
  setTimeout(() => {
    if (activeOrders[orderId]) {
      activeOrders[orderId].status = 'served';
      
      // Publish event for real-time updates
      if (window.tableEventManager) {
        window.tableEventManager.publish('orderStatusUpdate', {
          orderId,
          status: 'served'
        });
      }
    }
  }, 35000);
};
