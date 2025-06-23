"use client";

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
  updateTableTime,
  type Order
} from '@/store/slices/tableSlice';
import { addActivity, updateStats } from '@/store/slices/dashboardSlice';
import QRCodeGenerator from '@/components/QRCodeGenerator';

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

  // Update table times every minute
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(updateTableTime());
    }, 60000); // Every minute
    
    return () => clearInterval(timer);
  }, [dispatch]);

  // Simulate a new order every 2 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      const availableTables = tables.filter(t => t.status === 'available');
      if (availableTables.length > 0) {
        // Randomly select an available table for a new order
        const randomIndex = Math.floor(Math.random() * availableTables.length);
        const tableForNewOrder = availableTables[randomIndex];
        
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const menuItems = [
          { id: 1, name: 'Burger', price: 12.99 },
          { id: 2, name: 'Pizza', price: 15.99 },
          { id: 3, name: 'Pasta', price: 14.99 },
          { id: 4, name: 'Salad', price: 9.99 },
          { id: 5, name: 'Steak', price: 24.99 }
        ];
        
        const orderItems = Array(itemCount).fill(0).map((_, i) => {
          const randomMenuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          return {
            ...randomMenuItem,
            quantity
          };
        });
        
        const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // The fix: explicitly type the status as one of the allowed values
        const newOrder: Order = {
          id: `order-${Date.now()}`,
          tableId: tableForNewOrder.number,
          items: orderItems,
          status: 'pending',
          createdAt: new Date().toISOString(),
          total
        };
        
        dispatch(addOrder(newOrder));
        
        // Update dashboard stats
        dispatch(addActivity({
          type: 'order',
          message: `New order placed at Table ${tableForNewOrder.number}`,
          timestamp: 'Just now'
        }));
        
        dispatch(updateStats({
          totalOrders: (parseInt(tables.length.toString()) + 1).toString(),
          pendingOrders: (parseInt(tables.filter(t => t.status === 'service').length.toString()) + 1).toString()
        }));
        
        toast({
          title: "New Order",
          description: `Table ${tableForNewOrder.number} has placed a new order`,
        });
      }
    }, 120000); // Every 2 minutes
    
    return () => clearInterval(timer);
  }, [dispatch, tables, toast]);

  const handleViewOrder = (tableId: number) => {
    setSelectedTableForOrder(tableId);
    setShowOrderDialog(true);
  };

  const handleGenerateQR = (tableId: number) => {
    setSelectedTableId(tableId);
    setShowQRDialog(true);
    
    dispatch(addActivity({
      type: 'other',
      message: `QR code generated for Table ${tableId}`,
      timestamp: 'Just now'
    }));
  };

  const handleToggleAvailability = (tableId: number, available: boolean) => {
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
  };

  const handleDeleteTable = (tableId: number) => {
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
  };

  const handleAddTable = () => {
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
    
    // Add new table
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
                  orderItems={table.items}
                  timeElapsed={table.time}
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
                    orderItems={table.items}
                    timeElapsed={table.time}
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
