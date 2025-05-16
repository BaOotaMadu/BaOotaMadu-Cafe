import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Table {
  id: number;
  number: number;
  status: 'available' | 'occupied' | 'service';
  items?: number;
  time?: string;
}

interface TableState {
  tables: Table[];
  addTable: (tableNumber: number) => void;
  updateTableStatus: (tableId: number, status: Table['status']) => void;
  deleteTable: (tableId: number) => void;
  resetTablesToDefault: () => void;
}

// Initial default tables
const defaultTables: Table[] = [
  { id: 1, number: 1, status: 'occupied', items: 4, time: '32m' },
  { id: 2, number: 2, status: 'service', items: 2, time: '12m' },
  { id: 3, number: 3, status: 'available' },
  { id: 4, number: 4, status: 'occupied', items: 6, time: '45m' },
  { id: 5, number: 5, status: 'available' },
  { id: 6, number: 6, status: 'occupied', items: 3, time: '18m' },
  { id: 7, number: 7, status: 'service', items: 1, time: '5m' },
  { id: 8, number: 8, status: 'available' },
];

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      tables: [...defaultTables],
      
      addTable: (tableNumber) => set((state) => {
        const newTable: Table = {
          id: Date.now(),
          number: tableNumber,
          status: 'available'
        };
        return { tables: [...state.tables, newTable] };
      }),
      
      updateTableStatus: (tableId, status) => set((state) => ({
        tables: state.tables.map((table) => {
          if (table.number === tableId) {
            // Reset items and time if table becomes available
            if (status === 'available') {
              return { ...table, status, items: undefined, time: undefined };
            }
            return { ...table, status };
          }
          return table;
        }),
      })),
      
      deleteTable: (tableId) => set((state) => ({
        tables: state.tables.filter((table) => table.number !== tableId),
      })),
      
      resetTablesToDefault: () => set({ tables: [...defaultTables] }),
    }),
    {
      name: 'table-storage', // unique name for localStorage
    }
  )
);