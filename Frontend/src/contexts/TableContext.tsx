// TableContext.tsx
import { createContext, useState, useContext, useEffect } from 'react';
import tableEventManager from '@/components/TableEventManager';

interface Table {
  id: number;
  number: number;
  status: 'available' | 'occupied' | 'service';
  items?: number;
  time?: string;
  orderStatus?: 'cooking' | 'served';
  isOccupied: boolean;
}

interface TableContextType {
  tables: Table[];
  addTable: (tableNumber: number) => void;
  deleteTable: (tableId: number) => void;
  toggleAvailability: (tableId: number, available: boolean) => void;
  occupyTable: (tableId: number) => void;
  placeOrder: (tableId: number) => void;
  updateOrderStatus: (tableId: number, status: 'cooking' | 'served') => void;
}

const TableContext = createContext<TableContextType | null>(null);

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, number: 1, status: 'available', isOccupied: false },
    { id: 2, number: 2, status: 'available', isOccupied: false },
    { id: 3, number: 3, status: 'available', isOccupied: false },
  ]);

  // Add a new table
  const addTable = (tableNumber: number) => {
    if (tables.some((table) => table.number === tableNumber)) return;
    setTables((prev) => [...prev, { id: Date.now(), number: tableNumber, status: 'available', isOccupied: false }]);
  };

  // Delete a table
  const deleteTable = (tableId: number) => {
    setTables((prev) => prev.filter((table) => table.number !== tableId));
  };

  // Toggle table availability
  const toggleAvailability = (tableId: number, available: boolean) => {
    setTables((prev) =>
      prev.map((table) =>
        table.number === tableId
          ? { ...table, status: available ? 'available' : 'occupied', ...(available && { items: undefined, time: undefined }) }
          : table
      )
    );
  };

  // Simulate QR code scanning (mark table as occupied)
  const occupyTable = (tableId: number) => {
    setTables((prev) =>
      prev.map((table) =>
        table.number === tableId ? { ...table, status: 'occupied', isOccupied: true } : table
      )
    );
  };

  // Simulate placing an order
  const placeOrder = (tableId: number) => {
    setTables((prev) =>
      prev.map((table) =>
        table.number === tableId ? { ...table, status: 'service', orderStatus: 'cooking', items: 1 } : table
      )
    );
  };

  // Update order status (cooking -> served)
  const updateOrderStatus = (tableId: number, status: 'cooking' | 'served') => {
    setTables((prev) =>
      prev.map((table) =>
        table.number === tableId ? { ...table, orderStatus: status } : table
      )
    );
  };

  // Listen for events from the EventManager
  useEffect(() => {
    const handleOccupyTable = (tableId: number) => occupyTable(tableId);
    const handlePlaceOrder = (tableId: number) => placeOrder(tableId);
    const handleUpdateOrderStatus = ({ tableId, status }: { tableId: number; status: 'cooking' | 'served' }) =>
      updateOrderStatus(tableId, status);

    tableEventManager.subscribe('occupyTable', handleOccupyTable);
    tableEventManager.subscribe('placeOrder', handlePlaceOrder);
    tableEventManager.subscribe('updateOrderStatus', handleUpdateOrderStatus);

    return () => {
      tableEventManager.unsubscribe('occupyTable', handleOccupyTable);
      tableEventManager.unsubscribe('placeOrder', handlePlaceOrder);
      tableEventManager.unsubscribe('updateOrderStatus', handleUpdateOrderStatus);
    };
  }, []);

  return (
    <TableContext.Provider
      value={{
        tables,
        addTable,
        deleteTable,
        toggleAvailability,
        occupyTable,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) throw new Error('useTableContext must be used within a TableProvider');
  return context;
};