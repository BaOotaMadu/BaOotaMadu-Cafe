
// Menu item definition
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  customizable: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}
// Customization option for cart items
export interface Customization {
  name: string;
  value: string;
}

// Cart item definition (extends MenuItem with quantity and customizations)
export interface CartItem extends MenuItem {
  quantity: number;
  customizations: Customization[];
}

// Order status types
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served';

// Order definition
export interface Order {
  id: string;
  tableNumber: string;
  items: CartItem[];
  status: OrderStatus;
  timestamp: string;
  totalAmount: number;
}

// Payment method types
export type PaymentMethod = 'card' | 'cash';
