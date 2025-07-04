import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import TableCard from "@/components/TableCard";
import OrderDetailsDialog from "@/components/OrderDetailsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  addTable,
  removeTable,
  updateTableStatus,
  addOrder,
  setTables,
  type Order,
} from "@/store/slices/tableSlice";
import { addActivity, updateStats } from "@/store/slices/dashboardSlice";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import mongoose from "mongoose";

const API_BASE = "http://localhost:3001";
const restaurantId = "681f3a4888df8faae5bbd380";

// Backend integration functions - replace these with actual API calls
const tableBackendActions = {
  occupyTable: async (tableId: string) => {
    try {
      const response = await fetch(`${API_BASE}/tables/occupy/${tableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to occupy table");
      }

      return data; // contains { message, table }
    } catch (error) {
      console.error(`Error occupying table ${tableId}:`, error);
      throw error; // Let the UI handle it
    }
  },

  // // Function to mark table as available (when bill is paid/table is cleared)
  clearTable: async (tableId: string) => {
    try {
      const response = await fetch(`${API_BASE}/tables/clear/${tableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clear table");
      }

      const data = await response.json();
      return data; // Contains message, table, etc.
    } catch (error) {
      console.error(`Error clearing table ${tableId}:`, error);
      throw error; // Let caller handle error
    }
  },

  // Function to add new table
  createTable: async (restaurantId: string, tableNumber: number) => {
    const res = await fetch(`${API_BASE}/tables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: restaurantId,
        table_number: tableNumber,
      }),
    });

    if (!res.ok) throw new Error("Failed to create table");

    return await res.json();
  },

  deleteTable: async (tableId: string) => {
    const res = await fetch(`${API_BASE}/tables/${tableId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Failed to delete table");
      throw new Error(errorText);
    }

    // If no body (e.g. 204), return nothing
    if (res.status === 204) return {};

    // Else parse body
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  },

  // Function to generate QR code
  generateQRCode: async (tableId: string) => {
    console.log(`Backend: Generating QR code for table ${tableId}`);
    // TODO: Replace with actual API call
    // await fetch(`/api/tables/${tableId}/qr`, { method: 'POST' });
    return true;
  },
};

const Tables = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { tables, orders } = useAppSelector((state) => state.tables);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newTableNumber, setNewTableNumber] = useState<string>("");
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<
    string | null
  >(null);

  // Add sample orders on component mount for demonstration
  const fetchTables = async () => {
    try {
      console.log("Fetching tables...");
      const res = await fetch(
        `${API_BASE}/tables?restaurant_id=${restaurantId}`
      );
      if (!res.ok) throw new Error("Failed to fetch tables");

      const data = await res.json();
      console.log("Fetched tables:", data);

      dispatch(
        setTables(
          data.map((table: any) => ({
            id: table._id,
            number: table.table_number,
            status: table.status || "available",
          }))
        )
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not load tables",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTables();
  }, [dispatch]);

  const handleViewOrder = (tableId: string) => {
    setSelectedTableForOrder(tableId);
    setShowOrderDialog(true);
  };

  const handleGenerateQR = async (tableId: string) => {
    try {
      await tableBackendActions.generateQRCode(tableId);
      setSelectedTableId(tableId);
      setShowQRDialog(true);

      dispatch(
        addActivity({
          type: "other",
          message: `QR code generated for Table ${tableId}`,
          timestamp: "Just now",
        })
      );

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

  const handleToggleAvailability = async (
    tableId: string,
    available: boolean
  ) => {
    try {
      if (available) {
        await tableBackendActions.clearTable(tableId);
      } else {
        await tableBackendActions.occupyTable(tableId);
      }

      dispatch(
        updateTableStatus({
          tableId,
          status: available ? "available" : "occupied",
        })
      );

      toast({
        title: available ? "Table Available" : "Table Occupied",
        description: `Table ${tableId} is now ${
          available ? "available" : "occupied"
        }`,
      });

      // Update dashboard stats
      const activeTables = tables.filter(
        (t) => t.status !== "available"
      ).length;
      const newActiveCount = available ? activeTables - 1 : activeTables + 1;

      dispatch(
        updateStats({
          activeTables: `${newActiveCount}/${tables.length}`,
        })
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update table status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      await tableBackendActions.deleteTable(tableId);

      toast({
        title: "Table Deleted",
        description: "Table deleted successfully",
      });

      // Refresh fresh table list
      await fetchTables();
    } catch (error) {
      console.error(error);
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
    if (tables.some((table) => table.number === tableNumber)) {
      toast({
        title: "Table Already Exists",
        description: `Table ${tableNumber} already exists`,
        variant: "destructive",
      });
      return;
    }

    try {
      const createdTable = await tableBackendActions.createTable(
        restaurantId,
        tableNumber
      );

      // Add new table - always starts as available
      const newTable = {
        id: createdTable._id,
        number: createdTable.table_number,
        status: createdTable.status || "available",
      };

      dispatch(addTable(newTable));
      setNewTableNumber("");
      setOpenAddDialog(false);

      toast({
        title: "Table Added",
        description: `Table ${tableNumber} has been added`,
      });

      // Update dashboard stats
      dispatch(
        updateStats({
          activeTables: `${
            tables.filter((t) => t.status !== "available").length
          }/${tables.length + 1}`,
        })
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add table",
        variant: "destructive",
      });
    }
  };

  // Function to manually set table to service (when order is placed)
  // const handleSetTableToService = async (tableId: number, orderData: any) => {
  //   try {
  //     await tableBackendActions.serviceTable(tableId, orderData);

  //     dispatch(
  //       updateTableStatus({
  //         tableId,
  //         status: "service",
  //       })
  //     );

  //     toast({
  //       title: "Table In Service",
  //       description: `Table ${tableId} is now in service`,
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to set table to service",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const filterTables = (status: string) => {
    if (status === "all") return tables;
    return tables.filter((t) => t.status === status);
  };

  const filteredTables = filterTables(activeTab);

  // Helper function to check if a table has an order
  const getTableOrder = (tableId: string) => {
    return orders.find((order) => order.tableId === tableId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tables & Orders</h1>
          <p className="text-gray-500 mt-1">
            Manage your restaurant tables and active orders
          </p>
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
              <Button onClick={handleAddTable}>Add Table</Button>
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
            {filteredTables.length} table
            {filteredTables.length !== 1 ? "s" : ""}
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => {
              //const tableOrder = getTableOrder(table.id);
              return (
                <TableCard
                  key={table.id}
                  tableNumber={table.number}
                  status={table.status}
                  orderItems={table.items || 0}
                  timeElapsed={undefined} // Removed automatic time tracking
                  // hasOrder={!!tableOrder}
                  onViewOrder={() => handleViewOrder(table.id)}
                  // onGenerateQR={() => handleGenerateQR(table.number)}
                  onToggleAvailability={(available) =>
                    handleToggleAvailability(table.id, available)
                  }
                  onDelete={() => handleDeleteTable(table.id)}
                />
              );
            })}
          </div>
        </TabsContent>

        {["available", "occupied", "service"].map((status) => (
          <TabsContent key={status} value={status} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filterTables(status).map((table) => {
                const tableOrder = getTableOrder(table.id);
                return (
                  <TableCard
                    key={table.id}
                    tableNumber={table.number}
                    status={table.status}
                    orderItems={table.items || 0}
                    timeElapsed={undefined} // Removed automatic time tracking
                    //hasOrder={!!tableOrder}
                    onViewOrder={() => handleViewOrder(table.number)}
                    //onGenerateQR={() => handleGenerateQR(table.number)}
                    onToggleAvailability={(available) =>
                      handleToggleAvailability(table.id, available)
                    }
                    onDelete={() => handleDeleteTable(table.id)}
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

          {selectedTableId && <QRCodeGenerator tableId={selectedTableId} />}

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
