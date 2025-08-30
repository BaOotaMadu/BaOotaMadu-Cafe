// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import TableCard from "@/components/TableCard";
// import OrderDetailsDialog from "@/components/OrderDetailsDialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import { Plus } from "lucide-react";
// import { useAppSelector } from "@/hooks/useAppSelector";
// import { useAppDispatch } from "@/hooks/useAppDispatch";
// import { addTable, setTables, type Order } from "@/store/slices/tableSlice";
// import { addActivity, updateStats } from "@/store/slices/dashboardSlice";
// import QRCodeGenerator from "@/components/QRCodeGenerator";

// //const API_BASE = "http://localhost:3001";
// const API_BASE =
//   import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com/";
// const restaurantId = localStorage.getItem("restaurantId");

// // Backend integration functions
// const tableBackendActions = {
//   occupyTable: async (tableId: string) => {
//     const response = await fetch(`${API_BASE}/tables/occupy/${tableId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//     });
//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || "Failed to occupy table");
//     return data;
//   },
//   clearTable: async (tableId: string) => {
//     const response = await fetch(`${API_BASE}/tables/clear/${tableId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//     });
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Failed to clear table");
//     }
//     return await response.json();
//   },
//   createTable: async (restaurantId: string, tableNumber: number) => {
//     const res = await fetch(`${API_BASE}/tables`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         restaurant_id: restaurantId,
//         table_number: tableNumber,
//       }),
//     });
//     if (!res.ok) throw new Error("Failed to create table");
//     return await res.json();
//   },
//   deleteTable: async (tableId: string) => {
//     const res = await fetch(`${API_BASE}/tables/${tableId}`, {
//       method: "DELETE",
//     });
//     if (!res.ok) throw new Error(await res.text());
//     return res.status === 204 ? {} : await res.json();
//   },
//   generateQRCode: async (tableId: string) => {
//     console.log(`Backend: Generating QR code for table ${tableId}`);
//     return true;
//   },
// };

// const Tables = () => {
//   const { toast } = useToast();
//   const dispatch = useAppDispatch();
//   const { tables, orders } = useAppSelector((state) => state.tables);

//   const [activeTab, setActiveTab] = useState<string>("all");
//   const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
//   const [newTableNumber, setNewTableNumber] = useState<string>("");
//   const [showQRDialog, setShowQRDialog] = useState(false);
//   const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
//   const [showOrderDialog, setShowOrderDialog] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedTableForOrder, setSelectedTableForOrder] = useState<
//     string | null
//   >(null);

//   // Fetch tables from backend
//   const fetchTables = async () => {
//     try {
//       const res = await fetch(
//         `${API_BASE}/tables?restaurant_id=${restaurantId}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch tables");
//       const data = await res.json();
//       dispatch(
//         setTables(
//           data.map((table: any) => ({
//             id: table._id,
//             number: table.table_number,
//             status: table.status || "available",
//           }))
//         )
//       );
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Could not load tables",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchTables();
//   }, [dispatch]);

//   const handleViewOrder = (tableId: string) => {
//     setSelectedTableForOrder(tableId);
//     setShowOrderDialog(true);
//   };

//   // Automatically occupy table when QR is generated
//   const handleGenerateQR = async (tableId: string) => {
//     try {
//       await tableBackendActions.generateQRCode(tableId);
//       await tableBackendActions.occupyTable(tableId);
//       setSelectedTableId(tableId);
//       setShowQRDialog(true);

//       dispatch(
//         addActivity({
//           type: "other",
//           message: `QR code generated for Table ${tableId} (now occupied)`,
//           timestamp: "Just now",
//         })
//       );
//       toast({
//         title: "QR Code Generated",
//         description: `Table ${tableId} is now occupied`,
//       });

//       fetchTables(); // refresh table list
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to generate QR code",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteTable = async (tableId: string) => {
//     try {
//       await tableBackendActions.deleteTable(tableId);
//       toast({
//         title: "Table Deleted",
//         description: "Table deleted successfully",
//       });
//       fetchTables();
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to delete table",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAddTable = async () => {
//     const tableNumber = parseInt(newTableNumber);
//     if (isNaN(tableNumber) || tableNumber <= 0) {
//       toast({
//         title: "Invalid Table Number",
//         description: "Please enter a valid table number",
//         variant: "destructive",
//       });
//       return;
//     }
//     if (tables.some((t) => t.number === tableNumber)) {
//       toast({
//         title: "Table Already Exists",
//         description: `Table ${tableNumber} already exists`,
//         variant: "destructive",
//       });
//       return;
//     }
//     try {
//       const createdTable = await tableBackendActions.createTable(
//         restaurantId!,
//         tableNumber
//       );
//       dispatch(
//         addTable({
//           id: createdTable._id,
//           number: createdTable.table_number,
//           status: createdTable.status || "available",
//         })
//       );
//       setNewTableNumber("");
//       setOpenAddDialog(false);
//       toast({
//         title: "Table Added",
//         description: `Table ${tableNumber} has been added`,
//       });
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to add table",
//         variant: "destructive",
//       });
//     }
//   };

//   const filterTables = (status: string) => {
//     if (status === "all") return tables;
//     return tables.filter((t) => t.status === status);
//   };

//   const filteredTables = filterTables(activeTab);

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Tables & Orders</h1>
//           <p className="text-gray-500 mt-1">
//             Manage your restaurant tables and active orders
//           </p>
//         </div>
//         <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
//           <DialogTrigger asChild>
//             <Button className="bg-orange hover:bg-orange/90 text-white">
//               <Plus size={16} className="mr-2" />
//               Add Table
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Table</DialogTitle>
//               <DialogDescription>
//                 Enter the table number to add a new table to your restaurant.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="py-4">
//               <Input
//                 type="number"
//                 placeholder="Table Number"
//                 value={newTableNumber}
//                 onChange={(e) => setNewTableNumber(e.target.value)}
//               />
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddTable}>Add Table</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Tabs defaultValue="all" onValueChange={setActiveTab}>
//         <div className="flex justify-between items-center">
//           <TabsList>
//             <TabsTrigger value="all">All Tables</TabsTrigger>
//             <TabsTrigger value="available">Available</TabsTrigger>
//             <TabsTrigger value="occupied">Occupied</TabsTrigger>
//           </TabsList>
//           <div className="text-sm text-gray-500">
//             {filteredTables.length} table
//             {filteredTables.length !== 1 ? "s" : ""}
//           </div>
//         </div>

//         {["all", "available", "occupied"].map((status) => (
//           <TabsContent key={status} value={status} className="mt-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {filterTables(status).map((table) => (
//                 <TableCard
//                   key={table.id}
//                   tableId={table.id}
//                   tableNumber={table.number}
//                   status={table.status}
//                   orderItems={table.items || 0}
//                   timeElapsed={undefined}
//                   onViewOrder={() => handleViewOrder(table.id)}
//                   onGenerateQR={() => handleGenerateQR(table.id)}
//                   onDelete={() => handleDeleteTable(table.id)}
//                   hideAvailabilityToggle // NEW: remove manual availability toggle
//                 />
//               ))}
//             </div>
//           </TabsContent>
//         ))}
//       </Tabs>

//       {/* QR Code Dialog */}
//       <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Table QR Code</DialogTitle>
//             <DialogDescription>
//               Scan this QR code to access the table.
//             </DialogDescription>
//           </DialogHeader>
//           {selectedTableId && <QRCodeGenerator tableId={selectedTableId} />}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowQRDialog(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Order Details Dialog */}
//       {showOrderDialog && selectedTableForOrder && (
//         <OrderDetailsDialog
//           open={showOrderDialog}
//           onClose={() => {
//             setShowOrderDialog(false);
//             setSelectedTableForOrder(null);
//           }}
//           tableNumber={selectedTableForOrder}
//         />
//       )}
//     </div>
//   );
// };

// export default Tables;

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
import { addTable, setTables } from "@/store/slices/tableSlice";
import { addActivity } from "@/store/slices/dashboardSlice";
import QRCodeGenerator from "@/components/QRCodeGenerator";

//const API_BASE = "http://localhost:3001";
const API_BASE = import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com/";

const Tables = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { tables } = useAppSelector((state) => state.tables);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newTableNumber, setNewTableNumber] = useState<string>("");
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // ✅ Get restaurantId from URL first, fallback to localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("restaurant");
    const storedId = localStorage.getItem("restaurantId");

    if (urlId) {
      setRestaurantId(urlId);
      localStorage.setItem("restaurantId", urlId); // Persist for future visits
    } else if (storedId) {
      setRestaurantId(storedId);
    } else {
      toast({
        title: "Error",
        description: "Restaurant ID not found. Please log in again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [toast]);

  // Backend integration functions
  const tableBackendActions = {
    occupyTable: async (tableId: string) => {
      const response = await fetch(`${API_BASE}/tables/occupy/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to occupy table");
      return data;
    },
    clearTable: async (tableId: string) => {
      const response = await fetch(`${API_BASE}/tables/clear/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clear table");
      }
      return await response.json();
    },
    createTable: async (tableNumber: number) => {
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
      if (!res.ok) throw new Error(await res.text());
      return res.status === 204 ? {} : await res.json();
    },
    generateQRCode: async (tableId: string) => {
      console.log(`Backend: Generating QR code for table ${tableId}`);
      return true;
    },
  };

  // Fetch tables from backend
  const fetchTables = async () => {
    if (!restaurantId) return;

    try {
      const res = await fetch(`${API_BASE}/tables?restaurant_id=${restaurantId}`);
      if (!res.ok) throw new Error("Failed to fetch tables");
      const data = await res.json();
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
    if (restaurantId) {
      fetchTables();
    }
  }, [dispatch, restaurantId]);

  const handleViewOrder = (tableId: string) => {
    setSelectedTableForOrder(tableId);
    setShowOrderDialog(true);
  };

  // Automatically occupy table when QR is generated
  const handleGenerateQR = async (tableId: string) => {
    if (!restaurantId) return;

    try {
      await tableBackendActions.generateQRCode(tableId);
      await tableBackendActions.occupyTable(tableId);
      setSelectedTableId(tableId);
      setShowQRDialog(true);
      dispatch(
        addActivity({
          type: "other",
          message: `QR code generated for Table ${tableId} (now occupied)`,
          timestamp: "Just now",
        })
      );
      toast({
        title: "QR Code Generated",
        description: `Table ${tableId} is now occupied`,
      });
      fetchTables(); // refresh table list
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate QR code",
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
      fetchTables();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete table",
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
    if (tables.some((t) => t.number === tableNumber)) {
      toast({
        title: "Table Already Exists",
        description: `Table ${tableNumber} already exists`,
        variant: "destructive",
      });
      return;
    }

    try {
      const createdTable = await tableBackendActions.createTable(tableNumber);
      dispatch(
        addTable({
          id: createdTable._id,
          number: createdTable.table_number,
          status: createdTable.status || "available",
        })
      );
      setNewTableNumber("");
      setOpenAddDialog(false);
      toast({
        title: "Table Added",
        description: `Table ${tableNumber} has been added`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add table",
        variant: "destructive",
      });
    }
  };

  const filterTables = (status: string) => {
    if (status === "all") return tables;
    return tables.filter((t) => t.status === status);
  };

  const filteredTables = filterTables(activeTab);

  if (!restaurantId && loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading restaurant data...</p>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Restaurant ID not found. Please check your login link.</p>
      </div>
    );
  }

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
          </TabsList>
          <div className="text-sm text-gray-500">
            {filteredTables.length} table{filteredTables.length !== 1 ? "s" : ""}
          </div>
        </div>

        {["all", "available", "occupied"].map((status) => (
          <TabsContent key={status} value={status} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filterTables(status).map((table) => (
                <TableCard
                  key={table.id}
                  tableId={table.id}
                  tableNumber={table.number}
                  status={table.status}
                  orderItems={table.items || 0}
                  timeElapsed={undefined}
                  onViewOrder={() => handleViewOrder(table.id)}
                  onGenerateQR={() => handleGenerateQR(table.id)}
                  onDelete={() => handleDeleteTable(table.id)}
                  hideAvailabilityToggle
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* QR Code Dialog */}
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