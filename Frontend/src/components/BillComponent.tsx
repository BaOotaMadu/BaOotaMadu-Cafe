import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, ArrowLeft } from 'lucide-react';
import { Order } from '@/store/slices/tableSlice';

interface BillComponentProps {
  order: Order;
  tableNumber: number;
  onClose: () => void;
  onPrint: () => void;
}

const BillComponent = ({ order, tableNumber, onClose, onPrint }: BillComponentProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Bill - Table {tableNumber}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4" id="bill-content">
          {/* Restaurant Header */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold">Restaurant Name</h2>
            <p className="text-sm text-gray-600">123 Restaurant Street</p>
            <p className="text-sm text-gray-600">Phone: (555) 123-4567</p>
          </div>
          
          <Separator />
          
          {/* Order Details */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Table:</span>
              <span>{tableNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Order ID:</span>
              <span>{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time:</span>
              <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
          
          <Separator />
          
          {/* Items */}
          <div className="space-y-2">
            <h4 className="font-medium">Items:</h4>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="flex-1">
                  <span>{item.name}</span>
                  <span className="text-gray-500"> x {item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <Separator />
          
          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (10%):</span>
              <span>${(order.total * 0.1).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${(order.total * 1.1).toFixed(2)}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center text-sm text-gray-600">
            <p>Thank you for dining with us!</p>
            <p>Please come again</p>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Back to Order
            </Button>
            <Button 
              className="flex-1"
              onClick={onPrint}
            >
              <Download className="mr-2 h-4 w-4" />
              Print Bill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillComponent;
