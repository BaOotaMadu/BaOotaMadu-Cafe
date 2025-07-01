import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TableStatus = 'available' | 'occupied' | 'service';

export interface Table {
  id: string;  // MongoDB _id
  number: number;
  status: TableStatus;
  items?: number;
  orderId?: string;
  lastUpdate?: string;
  orderTotal?: number;
  time?: string; 
}

export interface Order {
  id: string; 
  tableId: string;  // matches MongoDB table id
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

// No initial tables — tables will be fetched
const initialState: TableState = {
  tables: [],
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

    updateTableStatus: (state, action: PayloadAction<{ tableId: string; status: TableStatus }>) => {
      const { tableId, status } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
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

    removeTable: (state, action: PayloadAction<string>) => {
      state.tables = state.tables.filter(table => table.id !== action.payload);
    },


    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
      
      const table = state.tables.find(t => t.id === action.payload.tableId);
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
        
        if (updates.status) {
          const tableId = state.orders[orderIndex].tableId;
          const table = state.tables.find(t => t.id === tableId);
          
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
        
        const table = state.tables.find(t => t.id === tableId);
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
  }
});

export const { 
  setTables, 
  updateTableStatus, 
  addTable, 
  removeTable, 
  addOrder, 
  updateOrder, 
  completeOrder
} = tableSlice.actions;

export default tableSlice.reducer;
