// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// export type TableStatus = 'available' | 'occupied' | 'service';

// export interface Table {
//   id: string;  // MongoDB _id
//   number: number;
//   status: TableStatus;
//   items?: number;
//   orderId?: string;
//   lastUpdate?: string;
//   orderTotal?: number;
//   time?: string; 
// }

// export interface Order {
//   id: string; 
//   tableId: string;  // matches MongoDB table id
//   items: {
//     id: number;
//     name: string;
//     price: number;
//     quantity: number;
//   }[];
//   status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed';
//   createdAt: string;
//   total: number;
// }

// interface TableState {
//   tables: Table[];
//   orders: Order[];
//   loading: boolean;
//   error: string | null;
// }

// // No initial tables — tables will be fetched
// const initialState: TableState = {
//   tables: [],
//   orders: [],
//   loading: false,
//   error: null,
// };

// const tableSlice = createSlice({
//   name: 'tables',
//   initialState,
//   reducers: {
//     setTables: (state, action: PayloadAction<Table[]>) => {
//       state.tables = action.payload;
//     },

//     updateTableStatus: (state, action: PayloadAction<{ tableId: string; status: TableStatus }>) => {
//       const { tableId, status } = action.payload;
//       const table = state.tables.find(t => t.id === tableId);
//       if (table) {
//         table.status = status;
//         if (status === 'available') {
//           table.items = undefined;
//           table.orderTotal = undefined;
//           table.orderId = undefined;
//           table.lastUpdate = undefined;
//           table.time = undefined;
//         }
//       }
//     },

//     addTable: (state, action: PayloadAction<Table>) => {
//       state.tables.push(action.payload);
//     },

//     removeTable: (state, action: PayloadAction<string>) => {
//       state.tables = state.tables.filter(table => table.id !== action.payload);
//     },


//     addOrder: (state, action: PayloadAction<Order>) => {
//       state.orders.push(action.payload);
      
//       const table = state.tables.find(t => t.id === action.payload.tableId);
//       if (table) {
//         table.status = 'occupied';
//         table.items = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
//         table.orderId = action.payload.id;
//         table.lastUpdate = action.payload.createdAt;
//         table.orderTotal = action.payload.total;
//       }
//     },

//     updateOrder: (state, action: PayloadAction<Partial<Order> & { id: string }>) => {
//       const { id, ...updates } = action.payload;
//       const orderIndex = state.orders.findIndex(order => order.id === id);
      
//       if (orderIndex !== -1) {
//         state.orders[orderIndex] = { ...state.orders[orderIndex], ...updates };
        
//         if (updates.status) {
//           const tableId = state.orders[orderIndex].tableId;
//           const table = state.tables.find(t => t.id === tableId);
          
//           if (table) {
//             if (updates.status === 'completed') {
//               table.status = 'available';
//               table.items = undefined;
//               table.orderId = undefined;
//               table.lastUpdate = undefined;
//               table.orderTotal = undefined;
//               table.time = undefined;
//             } else if (updates.status === 'delivered' || updates.status === 'preparing') {
//               table.status = 'service';
//             }
//           }
//         }
//       }
//     },

//     completeOrder: (state, action: PayloadAction<string>) => {
//       const orderId = action.payload;
//       const orderIndex = state.orders.findIndex(order => order.id === orderId);
      
//       if (orderIndex !== -1) {
//         const tableId = state.orders[orderIndex].tableId;
//         state.orders[orderIndex].status = 'completed';
        
//         const table = state.tables.find(t => t.id === tableId);
//         if (table) {
//           table.status = 'available';
//           table.items = undefined;
//           table.orderId = undefined;
//           table.lastUpdate = undefined;
//           table.orderTotal = undefined;
//           table.time = undefined;
//         }
//       }
//     },
//   }
// });

// export const { 
//   setTables, 
//   updateTableStatus, 
//   addTable, 
//   removeTable, 
//   addOrder, 
//   updateOrder, 
//   completeOrder
// } = tableSlice.actions;

// export default tableSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TableStatus = 'available' | 'occupied' | 'service';
export type DishStatus = 'pending' | 'preparing' | 'prepared' | 'unavailable';

export interface Table {
  id: number;
  number: number;
  status: TableStatus;
  items?: number;
  orderId?: string;
  lastUpdate?: string;
  orderTotal?: number;
  time?: string; // Keep this optional for compatibility with Dashboard
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  status: DishStatus;
  specialInstructions?: string;
  estimatedTime?: number; // in minutes
}

export interface Order {
  id: string;
  tableId: number;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed';
  createdAt: string;
  total: number;
  kot?: {
    id: string;
    generatedAt: string;
    printedAt?: string;
  };
}

export interface KOT {
  id: string;
  orderId: string;
  tableId: number;
  items: OrderItem[];
  generatedAt: string;
  printedAt?: string;
  status: 'new' | 'acknowledged' | 'completed';
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  isOutOfStock: boolean;
}

interface TableState {
  tables: Table[];
  orders: Order[];
  kots: KOT[];
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
  notifications: {
    id: string;
    type: 'out_of_stock' | 'order_ready' | 'table_ready';
    message: string;
    tableId?: number;
    orderId?: string;
    timestamp: string;
    read: boolean;
  }[];
}

// All tables start as available
const initialState: TableState = {
  tables: [
    { id: 1, number: 1, status: 'available' },
    { id: 2, number: 2, status: 'available' },
    { id: 3, number: 3, status: 'available' },
    { id: 4, number: 4, status: 'available' },
  ],
  orders: [],
  kots: [],
  inventory: [
    { id: 'ing-1', name: 'Mozzarella Cheese', quantity: 50, unit: 'kg', lowStockThreshold: 10, isOutOfStock: false },
    { id: 'ing-2', name: 'Beef Patties', quantity: 5, unit: 'pieces', lowStockThreshold: 10, isOutOfStock: false },
    { id: 'ing-3', name: 'Pizza Dough', quantity: 25, unit: 'pieces', lowStockThreshold: 5, isOutOfStock: false },
  ],
  notifications: [],
  loading: false,
  error: null,
};

const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTables: (state, action: PayloadAction<Table[]>) => {
      state.tables = action.payload;
    },
    updateTableStatus: (state, action: PayloadAction<{ tableId: number; status: TableStatus }>) => {
      const { tableId, status } = action.payload;
      const table = state.tables.find(t => t.number === tableId);
      if (table) {
        table.status = status;
        if (status === 'available') {
          table.items = undefined;
          table.orderTotal = undefined;
          table.orderId = undefined;
          table.lastUpdate = undefined;
          table.time = undefined;
        }
      }
    },
    addTable: (state, action: PayloadAction<Table>) => {
      state.tables.push(action.payload);
    },
    removeTable: (state, action: PayloadAction<number>) => {
      state.tables = state.tables.filter(table => table.number !== action.payload);
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      // Auto-generate KOT when order is added
      const kot: KOT = {
        id: `kot-${Date.now()}`,
        orderId: action.payload.id,
        tableId: action.payload.tableId,
        items: action.payload.items.map(item => ({ ...item, status: 'pending' as DishStatus })),
        generatedAt: new Date().toISOString(),
        status: 'new'
      };
      
      state.orders.push(action.payload);
      state.kots.push(kot);
      
      // Update the corresponding table
      const table = state.tables.find(t => t.number === action.payload.tableId);
      if (table) {
        table.status = 'occupied';
        table.items = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
        table.orderId = action.payload.id;
        table.lastUpdate = action.payload.createdAt;
        table.orderTotal = action.payload.total;
      }
    },
    updateOrder: (state, action: PayloadAction<Partial<Order> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === id);
      
      if (orderIndex !== -1) {
        state.orders[orderIndex] = { ...state.orders[orderIndex], ...updates };
        
        // If order status is updated, update the table as well
        if (updates.status) {
          const tableId = state.orders[orderIndex].tableId;
          const table = state.tables.find(t => t.number === tableId);
          
          if (table) {
            if (updates.status === 'completed') {
              table.status = 'available';
              table.items = undefined;
              table.orderId = undefined;
              table.lastUpdate = undefined;
              table.orderTotal = undefined;
              table.time = undefined;
            } else if (updates.status === 'delivered' || updates.status === 'preparing') {
              table.status = 'service';
            }
          }
        }
      }
    },
    completeOrder: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        const tableId = state.orders[orderIndex].tableId;
        state.orders[orderIndex].status = 'completed';
        
        // Free up the table
        const table = state.tables.find(t => t.number === tableId);
        if (table) {
          table.status = 'available';
          table.items = undefined;
          table.orderId = undefined;
          table.lastUpdate = undefined;
          table.orderTotal = undefined;
          table.time = undefined;
        }
      }
    },
    
    // New Chef Panel Actions
    updateDishStatus: (state, action: PayloadAction<{ orderId: string; itemId: number; status: DishStatus }>) => {
      const { orderId, itemId, status } = action.payload;
      
      // Update in orders
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        const item = order.items.find(i => i.id === itemId);
        if (item) {
          item.status = status;
          
          // If marked as unavailable, create notification
          if (status === 'unavailable') {
            state.notifications.push({
              id: `notif-${Date.now()}`,
              type: 'out_of_stock',
              message: `${item.name} is out of stock for Table ${order.tableId}`,
              tableId: order.tableId,
              orderId: orderId,
              timestamp: new Date().toISOString(),
              read: false
            });
          }
        }
      }
      
      // Update in KOTs
      const kot = state.kots.find(k => k.orderId === orderId);
      if (kot) {
        const kotItem = kot.items.find(i => i.id === itemId);
        if (kotItem) {
          kotItem.status = status;
        }
      }
    },
    
    acknowledgeKOT: (state, action: PayloadAction<string>) => {
      const kotId = action.payload;
      const kot = state.kots.find(k => k.id === kotId);
      if (kot) {
        kot.status = 'acknowledged';
        kot.printedAt = new Date().toISOString();
      }
    },
    
    completeKOT: (state, action: PayloadAction<string>) => {
      const kotId = action.payload;
      const kot = state.kots.find(k => k.id === kotId);
      if (kot) {
        kot.status = 'completed';
        
        // Check if all items in the order are prepared
        const order = state.orders.find(o => o.id === kot.orderId);
        if (order) {
          const allPrepared = order.items.every(item => 
            item.status === 'prepared' || item.status === 'unavailable'
          );
          
          if (allPrepared) {
            order.status = 'ready';
            
            // Notify waiters
            state.notifications.push({
              id: `notif-${Date.now()}`,
              type: 'order_ready',
              message: `Order for Table ${order.tableId} is ready for service`,
              tableId: order.tableId,
              orderId: order.id,
              timestamp: new Date().toISOString(),
              read: false
            });
          }
        }
      }
    },
    
    updateInventory: (state, action: PayloadAction<{ itemId: string; quantity: number; isOutOfStock?: boolean }>) => {
      const { itemId, quantity, isOutOfStock } = action.payload;
      const inventoryItem = state.inventory.find(i => i.id === itemId);
      if (inventoryItem) {
        inventoryItem.quantity = quantity;
        if (isOutOfStock !== undefined) {
          inventoryItem.isOutOfStock = isOutOfStock;
        }
      }
    },
    
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    
    clearNotifications: (state) => {
      state.notifications = state.notifications.filter(n => !n.read);
    }
  }
});

export const { 
  setTables, 
  updateTableStatus, 
  addTable, 
  removeTable, 
  addOrder, 
  updateOrder, 
  completeOrder,
  updateDishStatus,
  acknowledgeKOT,
  completeKOT,
  updateInventory,
  markNotificationAsRead,
  clearNotifications
} = tableSlice.actions;

export default tableSlice.reducer;