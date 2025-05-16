import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { updateTableStatus } from '@/store/slices/tableSlice';
import QRScanner from '@/components/QRScanner';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { QrCode, ShoppingCart, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerView = () => {
  const dispatch = useAppDispatch();
  const { tables } = useAppSelector(state => state.tables);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tableId, setTableId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Check if the table ID is stored in local storage and sync with Redux state
  useEffect(() => {
    const storedTableId = localStorage.getItem('tableId');
    if (storedTableId) {
      const parsedTableId = parseInt(storedTableId);
      setTableId(parsedTableId);
      
      // Check if there was a stored order status
      const orderStatus = localStorage.getItem('orderPlaced');
      if (orderStatus === 'true') {
        setOrderPlaced(true);
        
        // Ensure table status is synced with localStorage
        dispatch(updateTableStatus({
          tableId: parsedTableId,
          status: 'service'
        }));
      } else {
        // If table is assigned but order not placed, ensure it's marked as occupied
        dispatch(updateTableStatus({
          tableId: parsedTableId,
          status: 'occupied'
        }));
      }
    }
  }, [dispatch]);

  // Function to check if a table is available
  const checkTableAvailability = (id: number) => {
    const table = tables.find(t => t.number === id);
    return table && table.status === 'available';
  };

  const handleScan = (scannedTableId: number) => {
    // Final availability check before setting
    if (!checkTableAvailability(scannedTableId)) {
      toast({
        title: "Table Not Available",
        description: `Table ${scannedTableId} is already occupied or in service`,
        variant: "destructive"
      });
      return;
    }
    
    setTableId(scannedTableId);
    setOpen(false);
    
    // Store the table ID in local storage
    localStorage.setItem('tableId', scannedTableId.toString());
    localStorage.setItem('orderPlaced', 'false');
    
    // Update table status to occupied
    dispatch(updateTableStatus({
      tableId: scannedTableId,
      status: 'occupied'
    }));
    
    toast({
      title: "Table Assigned",
      description: `You are now seated at Table ${scannedTableId}`,
    });
  };

  const handlePlaceOrder = () => {
    if (tableId) {
      // Update table status to in service
      dispatch(updateTableStatus({
        tableId: tableId,
        status: 'service'
      }));
      
      setOrderPlaced(true);
      localStorage.setItem('orderPlaced', 'true');
      
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully",
      });
    }
  };

  const handlePayBill = () => {
    if (tableId) {
      // Update table status back to available
      dispatch(updateTableStatus({
        tableId: tableId,
        status: 'available'
      }));
      
      // Clear the stored table ID
      localStorage.removeItem('tableId');
      localStorage.removeItem('orderPlaced');
      setTableId(null);
      setOrderPlaced(false);
      
      toast({
        title: "Payment Successful",
        description: "Thank you for dining with us!",
      });
      
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  // Check if current tableId is still valid or already taken by someone else
  useEffect(() => {
    if (tableId) {
      const currentTable = tables.find(t => t.number === tableId);
      
      // If table doesn't exist anymore or was reset by another device
      if (!currentTable || (currentTable.status === 'available' && orderPlaced)) {
        toast({
          title: "Table Status Changed",
          description: "Your table status has been reset",
          variant: "destructive"
        });
        
        localStorage.removeItem('tableId');
        localStorage.removeItem('orderPlaced');
        setTableId(null);
        setOrderPlaced(false);
      }
    }
  }, [tables, tableId, orderPlaced, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Restaurant Customer View</h1>
          {tableId ? (
            <p className="text-gray-500 mt-2">Table {tableId}</p>
          ) : (
            <p className="text-gray-500 mt-2">Please scan a QR code to get started</p>
          )}
        </div>
        
        <div className="flex flex-col space-y-4">
          {!tableId && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <QrCode className="mr-2" />
                  Scan Table QR Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan QR Code</DialogTitle>
                </DialogHeader>
                <QRScanner 
                  onScan={handleScan} 
                  onClose={() => setOpen(false)} 
                  checkTableAvailability={checkTableAvailability}
                />
              </DialogContent>
            </Dialog>
          )}
          
          {tableId && !orderPlaced && (
            <Button onClick={handlePlaceOrder} className="w-full">
              <ShoppingCart className="mr-2" />
              Place Order
            </Button>
          )}
          
          {tableId && orderPlaced && (
            <Button onClick={handlePayBill} className="w-full">
              <CreditCard className="mr-2" />
              Pay Bill
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerView;
