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
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              color: #2d3748;
            }
            
            .bill-container { 
              background: white;
              max-width: 420px;
              width: 100%;
              border-radius: 16px;
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
              overflow: hidden;
              position: relative;
            }
            
            .bill-container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
            }
            
            .header { 
              text-align: center;
              padding: 32px 24px 24px;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border-bottom: 1px solid #e2e8f0;
            }
            
            .restaurant-name {
              font-size: 28px;
              font-weight: 700;
              color: #1a202c;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            
            .bill-title {
              font-size: 16px;
              color: #64748b;
              font-weight: 500;
              margin-bottom: 20px;
            }
            
            .order-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin-top: 16px;
            }
            
            .detail-item {
              text-align: center;
              padding: 12px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            
            .detail-label {
              font-size: 12px;
              color: #64748b;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            
            .detail-value {
              font-size: 14px;
              color: #1a202c;
              font-weight: 600;
            }
            
            .items-section {
              padding: 24px;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #1a202c;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .section-title::before {
              content: '🍽️';
              font-size: 20px;
            }
            
            .order-item { 
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin: 12px 0;
              padding: 12px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            
            .order-item:last-child {
              border-bottom: none;
            }
            
            .item-details {
              flex: 1;
            }
            
            .item-name {
              font-size: 15px;
              font-weight: 500;
              color: #1a202c;
              margin-bottom: 2px;
            }
            
            .item-quantity {
              font-size: 13px;
              color: #64748b;
              font-weight: 400;
            }
            
            .item-price {
              font-size: 15px;
              font-weight: 600;
              color: #059669;
              white-space: nowrap;
            }
            
            .separator { 
              height: 1px;
              background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
              margin: 20px 24px;
            }
            
            .total-section {
              padding: 0 24px 24px;
            }
            
            .subtotal-item {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              font-size: 14px;
              color: #64748b;
            }
            
            .total { 
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-weight: 700;
              font-size: 20px;
              color: #1a202c;
              padding: 16px;
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              border-radius: 12px;
              margin-top: 16px;
              border: 2px solid #0ea5e9;
            }
            
            .footer { 
              text-align: center;
              padding: 24px;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border-top: 1px solid #e2e8f0;
            }
            
            .thank-you {
              font-size: 16px;
              color: #1a202c;
              font-weight: 600;
              margin-bottom: 8px;
            }
            
            .footer-message {
              font-size: 14px;
              color: #64748b;
              line-height: 1.5;
            }
            
            .decorative-element {
              text-align: center;
              margin: 16px 0;
              font-size: 24px;
              opacity: 0.3;
            }
            
            @media print {
              body {
                background: white !important;
                padding: 0 !important;
              }
              
              .bill-container {
                box-shadow: none !important;
                border-radius: 0 !important;
                max-width: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <div class="header">
              <h1 class="restaurant-name">Bella Vista</h1>
              <p class="bill-title">Restaurant Bill</p>
              <div class="order-details">
                <div class="detail-item">
                  <div class="detail-label">Table</div>
                  <div class="detail-value">${tableNumber}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Order ID</div>
                  <div class="detail-value">#${tableOrder.id}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Date</div>
                  <div class="detail-value">${new Date(tableOrder.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Time</div>
                  <div class="detail-value">${new Date(tableOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
            </div>
            
            <div class="items-section">
              <h2 class="section-title">Order Items</h2>
              ${tableOrder.items.map(item => `
                <div class="order-item">
                  <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
                  </div>
                  <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="separator"></div>
            
            <div class="total-section">
              <div class="subtotal-item">
                <span>Subtotal:</span>
                <span>$${(tableOrder.total * 0.9).toFixed(2)}</span>
              </div>
              <div class="subtotal-item">
                <span>Tax (10%):</span>
                <span>$${(tableOrder.total * 0.1).toFixed(2)}</span>
              </div>
              
              <div class="total">
                <span>Total Amount:</span>
                <span>$${tableOrder.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="decorative-element">✨ ◆ ✨</div>
            
            <div class="footer">
              <p class="thank-you">Thank you for dining with us!</p>
              <p class="footer-message">We hope you enjoyed your meal and look forward to serving you again soon.</p>
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
