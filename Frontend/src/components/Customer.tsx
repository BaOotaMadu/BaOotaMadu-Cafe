// Customer.tsx
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import tableEventManager from '@/components/TableEventManager';

const Customer = () => {
  const [tableNumber, setTableNumber] = useState<number | null>(null);

  // Simulate scanning a QR code
  const handleScanQR = () => {
    if (!tableNumber) {
      toast({
        title: 'Invalid Table Number',
        description: 'Please enter a valid table number.',
        variant: 'destructive',
      });
      return;
    }

    tableEventManager.publish('occupyTable', tableNumber);
    toast({
      title: 'QR Code Scanned',
      description: `Table ${tableNumber} is now occupied.`,
    });
  };

  // Simulate placing an order
  const handlePlaceOrder = () => {
    if (!tableNumber) {
      toast({
        title: 'Invalid Table Number',
        description: 'Please enter a valid table number.',
        variant: 'destructive',
      });
      return;
    }

    tableEventManager.publish('placeOrder', tableNumber);
    toast({
      title: 'Order Placed',
      description: `Order placed for Table ${tableNumber}.`,
    });
  };

  // Simulate updating the order status
  const handleUpdateOrderStatus = () => {
    if (!tableNumber) {
      toast({
        title: 'Invalid Table Number',
        description: 'Please enter a valid table number.',
        variant: 'destructive',
      });
      return;
    }

    tableEventManager.publish('updateOrderStatus', { tableId: tableNumber, status: 'served' });
    toast({
      title: 'Order Served',
      description: `Order for Table ${tableNumber} is now served.`,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customer Interface</h1>
      <p className="text-gray-500 mt-1">Interact with the system as a customer.</p>

      {/* Table Number Input */}
      <div>
        <label htmlFor="table-number" className="block text-sm font-medium text-gray-700">
          Enter Table Number
        </label>
        <Input
          id="table-number"
          type="number"
          placeholder="Table Number"
          value={tableNumber || ''}
          onChange={(e) => setTableNumber(parseInt(e.target.value))}
        />
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <Button onClick={handleScanQR} disabled={!tableNumber}>
          Scan QR Code
        </Button>
        <Button onClick={handlePlaceOrder} disabled={!tableNumber}>
          Place Order
        </Button>
        <Button onClick={handleUpdateOrderStatus} disabled={!tableNumber}>
          Mark as Served
        </Button>
      </div>
    </div>
  );
};

export default Customer;