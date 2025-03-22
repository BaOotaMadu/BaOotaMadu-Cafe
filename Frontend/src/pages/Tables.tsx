// Tables.tsx
import { useTableContext } from '@/contexts/TableContext';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import TableCard from '@/components/TableCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Tables = () => {
  const { tables, addTable, deleteTable, toggleAvailability } = useTableContext();

  // State for adding a new table
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newTableNumber, setNewTableNumber] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Debugging: Log tables to verify state updates
  useEffect(() => {
    console.log('Tables state updated:', tables);
  }, [tables]);

  // Add a new table
  const handleAddTable = () => {
    const tableNumber = parseInt(newTableNumber);

    if (isNaN(tableNumber) || tableNumber <= 0) {
      toast({
        title: 'Invalid Table Number',
        description: 'Please enter a valid table number',
        variant: 'destructive',
      });
      return;
    }

    if (tables.some((table) => table.number === tableNumber)) {
      toast({
        title: 'Table Already Exists',
        description: `Table ${tableNumber} already exists`,
        variant: 'destructive',
      });
      return;
    }

    addTable(tableNumber);
    setNewTableNumber('');
    setOpenAddDialog(false);

    toast({
      title: 'Table Added',
      description: `Table ${tableNumber} has been added`,
    });
  };

  // Filter tables based on status
  const filterTables = (status: string) => {
    if (status === 'all') return tables;
    return tables.filter((t) => t.status === status);
  };

  const filteredTables = filterTables(activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <DialogDescription>Enter the table number to add a new table.</DialogDescription>
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
              <Button onClick={handleAddTable}>Add Table</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Tables</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="occupied">Occupied</TabsTrigger>
            <TabsTrigger value="service">In Service</TabsTrigger>
          </TabsList>
          <div className="text-sm text-gray-500">{filteredTables.length} table{filteredTables.length !== 1 ? 's' : ''}</div>
        </div>

        {/* Table Cards */}
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                tableNumber={table.number}
                status={table.status}
                orderItems={table.items}
                timeElapsed={table.time}
                orderStatus={table.orderStatus}
                isOccupied={table.isOccupied}
                onViewOrder={() =>
                  toast({
                    title: `Viewing Order for Table ${table.number}`,
                    description: `Order Status: ${table.orderStatus || 'No order placed'}`,
                  })
                }
                onGenerateQR={() =>
                  toast({
                    title: `QR Code Generated for Table ${table.number}`,
                  })
                }
                onToggleAvailability={(available) => toggleAvailability(table.number, available)}
                onDelete={() => deleteTable(table.number)}
              />
            ))}
          </div>
        </TabsContent>

        {['available', 'occupied', 'service'].map((status) => (
          <TabsContent key={status} value={status} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filterTables(status).map((table) => (
                <TableCard
                  key={table.id}
                  tableNumber={table.number}
                  status={table.status}
                  orderItems={table.items}
                  timeElapsed={table.time}
                  orderStatus={table.orderStatus}
                  isOccupied={table.isOccupied}
                  onViewOrder={() =>
                    toast({
                      title: `Viewing Order for Table ${table.number}`,
                      description: `Order Status: ${table.orderStatus || 'No order placed'}`,
                    })
                  }
                  onGenerateQR={() =>
                    toast({
                      title: `QR Code Generated for Table ${table.number}`,
                    })
                  }
                  onToggleAvailability={(available) => toggleAvailability(table.number, available)}
                  onDelete={() => deleteTable(table.number)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Tables;