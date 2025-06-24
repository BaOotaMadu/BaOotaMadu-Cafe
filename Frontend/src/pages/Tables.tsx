import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import TableCard from '@/components/TableCard';
import OrderDetailsDialog from '@/components/OrderDetailsDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  addTable, 
  removeTable, 
  updateTableStatus, 
  addOrder,
  type Order
} from '@/store/slices/tableSlice';
import { addActivity, updateStats } from '@/store/slices/dashboardSlice';
import QRCodeGenerator from '@/components/QRCodeGenerator';

// Backend integration functions - replace these with actual API calls
const tableBackendActions = {
  // Function to mark table as occupied (when customer scans QR)
  occupyTable: async (tableId: number) => {
    console.log(`Backend: Table ${tableId} occupied`);
    // TODO: Replace with actual API call
    // await fetch(`/api/tables/${tableId}/occupy`, { method: 'POST' });
    return true;
  },

  // Function to mark table as in service (when order is placed)
  serviceTable: async (tableId: number, orderData: any) => {
    console.log(`Backend: Table ${tableId} in service with order:`, orderData);
    // TODO: Replace with actual API call
    // await fetch(`/api/tables/${tableId}/service`, { 
    //   method: 'POST', 
    //   body: JSON.stringify(orderData) 
    // });
    return true;
  },

  // Function to mark table as available (when bill is paid/table is cleared)
  clearTable: async (tableId: number) => {
    console.log(`Backend: Table ${tableId} cleared and available`);
    // TODO: Replace with actual API call
    // await fetch(`/api/tables/${tableId}/clear`, { method: 'POST' });
    return true;
  },

  // Function to add new table
  createTable: async (tableNumber: number) => {
    console.log(`Backend: Creating table ${tableNumber}`);
    // TODO: Replace with actual API call
    // await fetch(`/api/tables`, { 
    //   method: 'POST', 
    //   body: JSON.stringify({ number: tableNumber }) 
    // });
    return true;
  },

  // Function to delete table
  deleteTable: async (tableId: number) => {
    console.log(`Backend: Deleting table ${tableId}`);
    // TODO: Replace with actual API call
    // await fetch(`/api/tables/${tableId}`, { method: 'DELETE' });
    return true;
  },

  // Function to generate QR code
  generateQRCode: async (tableId: number) => {
    console.log(`Backend: Generating QR code for table ${tableId}`);
    // TODO: Replace with actual API call
    // await fetch(`/api/tables/${tableId}/qr`, { method: 'POST' });
    return true;
  }
};

const Tables = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { tables, orders } = useAppSelector(state => state.tables);
  
  const [activeTab, setActiveTab] = useState<string>('all');
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newTableNumber, setNewTableNumber] = useState<string>('');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<number | null>(null);

  // Add sample orders on component mount for demonstration
  useEffect(() => {
    const sampleOrders: Order[] = [
      {
        id: 'order-001',
        tableId: 1,
        items: [
          { id: 1, name: 'Margherita Pizza', price: 15.99, quantity: 1 },
          { id: 2, name: 'Caesar Salad', price: 9.99, quantity: 2 },
          { id: 3, name: 'Coca Cola', price: 2.99, quantity: 3 }
        ],
        status: 'pending',
        createdAt: new Date().toISOString(),
        total: 34.95
      },
      {
        id: 'order-002',
        tableId: 2,
        items: [
          { id: 4, name: 'Beef Burger', price: 12.99, quantity: 2 },
          { id: 5, name: 'French Fries', price: 5.99, quantity: 1 }
        ],
        status: 'preparing',
        createdAt: new Date().toISOString(),
        total: 31.97
      }
    ];

    // Add sample orders if they don't exist
    sampleOrders.forEach(order => {
      const existingOrder = orders.find(o => o.id === order.id);
      if (!existingOrder) {
        dispatch(addOrder(order));
      }
    });
  }, [dispatch, orders]);

  const handleViewOrder = (tableId: number) => {
    setSelectedTableForOrder(tableId);
    setShowOrderDialog(true);
  };

  const handleGenerateQR = async (tableId: number) => {
    try {
      await tableBackendActions.generateQRCode(tableId);
      setSelectedTableId(tableId);
      setShowQRDialog(true);
      
      dispatch(addActivity({
        type: 'other',
        message: `QR code generated for Table ${tableId}`,
        timestamp: 'Just now'
      }));

      toast({
        title: "QR Code Generated",
        description: `QR code for Table ${tableId} has been generated`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (tableId: number, available: boolean) => {
    try {
      if (available) {
        await tableBackendActions.clearTable(tableId);
      } else {
        await tableBackendActions.occupyTable(tableId);
      }

      dispatch(updateTableStatus({
        tableId,
        status: available ? 'available' : 'occupied'
      }));
      
      toast({
        title: available ? "Table Available" : "Table Occupied",
        description: `Table ${tableId} is now ${available ? 'available' : 'occupied'}`,
      });
      
      // Update dashboard stats
      const activeTables = tables.filter(t => t.status !== 'available').length;
      const newActiveCount = available ? activeTables - 1 : activeTables + 1;
      
      dispatch(updateStats({
        activeTables: `${newActiveCount}/${tables.length}`
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update table status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTable = async (tableId: number) => {
    try {
      await tableBackendActions.deleteTable(tableId);
      
      dispatch(removeTable(tableId));
      
      toast({
        title: "Table Deleted",
        description: `Table ${tableId} has been removed`,
        variant: "destructive",
      });
      
      // Update dashboard stats
      dispatch(updateStats({
        activeTables: `${tables.filter(t => t.status !== 'available').length - 1}/${tables.length - 1}`
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete table",
        variant: "destructive",
      });
    }
  };

  const handleAddTable = async () => {
    const tableNumber = parseInt(newTableNumber);
    
    if (isNaN(tableNumber) || tableNumber <= 0) {
      toast({
        title: "Invalid Table Number",
        description: "Please enter a valid table number",
        variant: "destructive",
      });
      return;
    }
    
    // Check if table number already exists
    if (tables.some(table => table.number === tableNumber)) {
      toast({
        title: "Table Already Exists",
        description: `Table ${tableNumber} already exists`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      await tableBackendActions.createTable(tableNumber);
      
      // Add new table - always starts as available
      const newTable = {
        id: Date.now(),
        number: tableNumber,
        status: 'available' as const
      };
      
      dispatch(addTable(newTable));
      setNewTableNumber('');
      setOpenAddDialog(false);
      
      toast({
        title: "Table Added",
        description: `Table ${tableNumber} has been added`,
      });
      
      // Update dashboard stats
      dispatch(updateStats({
        activeTables: `${tables.filter(t => t.status !== 'available').length}/${tables.length + 1}`
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add table",
        variant: "destructive",
      });
    }
  };

  // Function to manually set table to service (when order is placed)
  const handleSetTableToService = async (tableId: number, orderData: any) => {
    try {
      await tableBackendActions.serviceTable(tableId, orderData);
      
      dispatch(updateTableStatus({
        tableId,
        status: 'service'
      }));
      
      toast({
        title: "Table In Service",
        description: `Table ${tableId} is now in service`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set table to service",
        variant: "destructive",
      });
    }
  };

  const filterTables = (status: string) => {
    if (status === 'all') return tables;
    return tables.filter(t => t.status === status);
  };

  const filteredTables = filterTables(activeTab);

  // Helper function to check if a table has an order
  const getTableOrder = (tableNumber: number) => {
    return orders.find(order => order.tableId === tableNumber);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tables & Orders</h1>
          <p className="text-gray-500 mt-1">Manage your restaurant tables and active orders</p>
        </div>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange hover:bg-orange/90 text-white">
              <Plus size={16} className="mr-2" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
              <DialogDescription>
                Enter the table number to add a new table to your restaurant.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="number"
                placeholder="Table Number"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTable}>
                Add Table
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Tables</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="occupied">Occupied</TabsTrigger>
            <TabsTrigger value="service">In Service</TabsTrigger>
          </TabsList>
          <div className="text-sm text-gray-500">
            {filteredTables.length} table{filteredTables.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => {
              const tableOrder = getTableOrder(table.number);
              return (
                <TableCard 
                  key={table.id}
                  tableNumber={table.number}
                  status={table.status}
                  orderItems={table.items || 0}
                  timeElapsed={undefined} // Removed automatic time tracking
                  hasOrder={!!tableOrder}
                  onViewOrder={() => handleViewOrder(table.number)}
                  onGenerateQR={() => handleGenerateQR(table.number)}
                  onToggleAvailability={(available) => handleToggleAvailability(table.number, available)}
                  onDelete={() => handleDeleteTable(table.number)}
                />
              );
            })}
          </div>
        </TabsContent>
        
        {['available', 'occupied', 'service'].map((status) => (
          <TabsContent key={status} value={status} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filterTables(status).map((table) => {
                const tableOrder = getTableOrder(table.number);
                return (
                  <TableCard 
                    key={table.id}
                    tableNumber={table.number}
                    status={table.status}
                    orderItems={table.items || 0}
                    timeElapsed={undefined} // Removed automatic time tracking
                    hasOrder={!!tableOrder}
                    onViewOrder={() => handleViewOrder(table.number)}
                    onGenerateQR={() => handleGenerateQR(table.number)}
                    onToggleAvailability={(available) => handleToggleAvailability(table.number, available)}
                    onDelete={() => handleDeleteTable(table.number)}
                  />
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* QR Code Generation Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Table QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to access the table.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTableId && (
            <QRCodeGenerator tableId={selectedTableId} />
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQRDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      {showOrderDialog && selectedTableForOrder && (
        <OrderDetailsDialog
          open={showOrderDialog}
          onClose={() => {
            setShowOrderDialog(false);
            setSelectedTableForOrder(null);
          }}
          tableNumber={selectedTableForOrder}
        />
      )}
    </div>
  );
};

export default Tables;
