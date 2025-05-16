import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TableStatus = 'available' | 'occupied' | 'service';

export interface Table {
  id: number;
  number: number;
  status: TableStatus;
  items?: number;
  time?: string;
  orderId?: string;
  lastUpdate?: string;
  orderTotal?: number;
}

export interface Order {
  id: string;
  tableId: number;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed';
  createdAt: string;
  total: number;
}

interface TableState {
  tables: Table[];
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: TableState = {
  tables: [
    { id: 1, number: 1, status: 'available' },
    { id: 2, number: 2, status: 'available' },
    { id: 3, number: 3, status: 'available' },
    { id: 4, number: 4, status: 'available' },
  ],
  orders: [],
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
          table.time = undefined;
          table.orderTotal = undefined;
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
      state.orders.push(action.payload);
      
      // Update the corresponding table
      const table = state.tables.find(t => t.number === action.payload.tableId);
      if (table) {
        table.status = 'occupied';
        table.items = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
        table.time = '1m'; // Starting timer
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
              table.time = undefined;
              table.orderId = undefined;
              table.lastUpdate = undefined;
              table.orderTotal = undefined;
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
          table.time = undefined;
          table.orderId = undefined;
          table.lastUpdate = undefined;
          table.orderTotal = undefined;
        }
      }
    },
    updateTableTime: (state) => {
      // This can be called every minute to update the elapsed time
      state.tables.forEach(table => {
        if (table.time) {
          const currentMinutes = parseInt(table.time);
          if (!isNaN(currentMinutes)) {
            table.time = `${currentMinutes + 1}m`;
          }
        }
      });
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
  updateTableTime
} = tableSlice.actions;

export default tableSlice.reducer;
