import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Eye } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Order } from '@/store/slices/tableSlice';
import BillComponent from '@/components/BillComponent';

interface OrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  tableNumber: number;
}

const OrderDetailsDialog = ({ open, onClose, tableNumber }: OrderDetailsDialogProps) => {
  const { orders } = useAppSelector(state => state.tables);
  const [showBill, setShowBill] = useState(false);
  
  // Find the order for this table
  const tableOrder = orders.find(order => order.tableId === tableNumber);
  
  if (!tableOrder) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Table {tableNumber} - Order Details</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-gray-500">
            No active order found for this table.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handlePrintBill = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bill - Table ${tableNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .bill-container { max-width: 400px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .order-item { display: flex; justify-content: space-between; margin: 5px 0; }
              .total { font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px; }
              .separator { border-bottom: 1px dashed #ccc; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="bill-container">
              <div class="header">
                <h2>Restaurant Bill</h2>
                <p>Table ${tableNumber}</p>
                <p>Order ID: ${tableOrder.id}</p>
                <p>Date: ${new Date(tableOrder.createdAt).toLocaleDateString()}</p>
                <p>Time: ${new Date(tableOrder.createdAt).toLocaleTimeString()}</p>
              </div>
              <div class="separator"></div>
              <div class="items">
                ${tableOrder.items.map(item => `
                  <div class="order-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
              </div>
              <div class="separator"></div>
              <div class="total">
                <div class="order-item">
                  <span>Total:</span>
                  <span>$${tableOrder.total.toFixed(2)}</span>
                </div>
              </div>
              <div style="text-align: center; margin-top: 20px;">
                <p>Thank you for dining with us!</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <>
      <Dialog open={open && !showBill} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Table {tableNumber} - Order Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Order ID:</span>
                <span>{tableOrder.id}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Status:</span>
                <span className="capitalize">{tableOrder.status}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Time:</span>
                <span>{new Date(tableOrder.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium">Order Items:</h4>
              {tableOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-2">x {item.quantity}</span>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span>${tableOrder.total.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowBill(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Bill
              </Button>
              <Button 
                className="flex-1"
                onClick={handlePrintBill}
              >
                <Download className="mr-2 h-4 w-4" />
                Print Bill
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {showBill && (
        <BillComponent
          order={tableOrder}
          tableNumber={tableNumber}
          onClose={() => setShowBill(false)}
          onPrint={handlePrintBill}
        />
      )}
    </>
  );
};

export default OrderDetailsDialog;
