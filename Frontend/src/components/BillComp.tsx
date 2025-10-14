import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Interfaces matching your backend
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  _id: string;
  tokenNumber: number;
  customer_name?: string;
  order_items?: OrderItem[];
  total_amount: number;
  created_at: string;
  status: string;
}

interface BillCompProps {
  open: boolean;
  onClose: () => void;
  tokenNumber: number;
}

const BillComp = ({ open, onClose, tokenNumber }: BillCompProps) => {
  const [orderData, setOrderData] = useState<{
    id: string;
    items: OrderItem[];
    total: number;
    createdAt: string;
    customer_name: string;
    tokenNumber: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const restaurantId = localStorage.getItem("restaurantId");
  const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:3001";

  useEffect(() => {
    if (!open || !restaurantId) return;

    setLoading(true);
    setOrderData(null);

    // ✅ Fetch order by tokenNumber — matches your backend route
    fetch(`${API_URL}/orders/${restaurantId}/token/${tokenNumber}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Backend returns array with one order
        const orders: OrderData[] = Array.isArray(data) ? data : [];
        if (orders.length === 0) {
          setOrderData(null);
          return;
        }

        const order = orders[0];
        const items = Array.isArray(order.order_items) ? order.order_items : [];

        // Calculate total (fallback to total_amount if needed)
        const total = items.reduce((sum, item) => {
          const price = typeof item.price === "number" ? item.price : 0;
          const qty = typeof item.quantity === "number" ? item.quantity : 1;
          return sum + price * qty;
        }, 0) || order.total_amount;

        setOrderData({
          id: order._id,
          items,
          total,
          createdAt: order.created_at,
          customer_name: order.customer_name || "Guest",
          tokenNumber: order.tokenNumber,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch bill:", err);
        toast({
          variant: "destructive",
          title: "Failed to load bill",
          description: "Order not found or server error.",
        });
        setOrderData(null);
      })
      .finally(() => setLoading(false));
  }, [open, tokenNumber, restaurantId]);

  const handlePrintAndEmail = () => {
    if (!orderData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("🖨️ Failed to open print window.");
      return;
    }

    const orderDate = new Date(orderData.createdAt).toLocaleDateString();
    const orderTime = new Date(orderData.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const items = Array.isArray(orderData.items) ? orderData.items : [];

    const billHTML = `
      <html>
        <head>
          <title>Bill - Token #${orderData.tokenNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', sans-serif;
              background: white;
              color: #2d3748;
              padding: 20px;
            }
            .bill-container { 
              background: white;
              max-width: 420px;
              width: 100%;
              border-radius: 16px;
              box-shadow: 0 25px 50px rgba(0,0,0,0.15);
              overflow: hidden;
            }
            .header { 
              text-align: center;
              padding: 32px 24px 24px;
              background: #f8fafc;
              border-bottom: 1px solid #e2e8f0;
            }
            .restaurant-name {
              font-size: 28px;
              font-weight: 700;
              color: #1a202c;
              margin-bottom: 8px;
            }
            .bill-title {
              font-size: 16px;
              color: #64748b;
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
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .detail-label {
              font-size: 12px;
              color: #64748b;
              font-weight: 500;
              margin-bottom: 4px;
            }
            .detail-value {
              font-size: 14px;
              color: #1a202c;
              font-weight: 600;
            }
            .items-section { padding: 24px; }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #1a202c;
              margin-bottom: 16px;
            }
            .order-item { 
              display: flex;
              justify-content: space-between;
              margin: 12px 0;
              padding: 12px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            .item-details { flex: 1; }
            .item-name { font-size: 15px; font-weight: 500; color: #1a202c; margin-bottom: 2px; }
            .item-quantity { font-size: 13px; color: #64748b; }
            .item-price { font-size: 15px; font-weight: 600; color: #059669; }
            .separator { height: 1px; background: #e2e8f0; margin: 20px 24px; }
            .total-section { padding: 0 24px 24px; }
            .subtotal-item { display: flex; justify-content: space-between; margin: 8px 0; color: #64748b; }
            .total { 
              display: flex;
              justify-content: space-between;
              font-weight: 700;
              font-size: 20px;
              color: #1a202c;
              padding: 16px;
              background: #f0f9ff;
              border-radius: 12px;
              margin-top: 16px;
              border: 2px solid #0ea5e9;
            }
            .footer { 
              text-align: center;
              padding: 24px;
              background: #f8fafc;
              border-top: 1px solid #e2e8f0;
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
                  <div class="detail-label">Token</div>
                  <div class="detail-value">#${orderData.tokenNumber}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Order ID</div>
                  <div class="detail-value">#${orderData.id.slice(-6)}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Customer</div>
                  <div class="detail-value">${orderData.customer_name}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Date</div>
                  <div class="detail-value">${orderDate}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Time</div>
                  <div class="detail-value">${orderTime}</div>
                </div>
              </div>
            </div>
            <div class="items-section">
              <h2 class="section-title">Order Items</h2>
              ${items
                .map(
                  (item) => `
                <div class="order-item">
                  <div class="item-details">
                    <div class="item-name">${item.name || "Unknown Item"}</div>
                    <div class="item-quantity">Qty: ${
                      item.quantity || 1
                    } × ₹${(item.price || 0).toFixed(2)}</div>
                  </div>
                  <div class="item-price">₹${(
                    (item.price || 0) * (item.quantity || 1)
                  ).toFixed(2)}</div>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="separator"></div>
            <div class="total-section">
              <div class="subtotal-item">
                <span>Subtotal:</span>
                <span>₹${(orderData.total * 0.9).toFixed(2)}</span>
              </div>
              <div class="subtotal-item">
                <span>Tax (10%):</span>
                <span>₹${(orderData.total * 0.1).toFixed(2)}</span>
              </div>
              <div class="total">
                <span>Total Amount:</span>
                <span>₹${orderData.total.toFixed(2)}</span>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for your order!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.print();

    setSendingEmail(true);
    fetch(`${API_URL}/send-bill-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "jayanthdn6073@gmail.com",
        subject: `Bill for Token #${orderData.tokenNumber}`,
        htmlContent: billHTML,
      }),
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}...`);
        }
        if (!contentType?.includes("application/json")) {
          throw new Error("Expected JSON response");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          alert("✅ Bill printed and sent to your email!");
        } else {
          alert(`❌ Failed to send email: ${data.error}`);
        }
      })
      .catch((err) => {
        console.error("Email failed:", err);
        alert(`❌ Email failed: ${err.message}`);
      })
      .finally(() => setSendingEmail(false));
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Token #{tokenNumber} - Bill</DialogTitle>
            <DialogDescription>Loading bill...</DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">🌀 Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!orderData) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Token #{tokenNumber}</DialogTitle>
            <DialogDescription>Bill not found</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-gray-500">
            <div className="text-2xl mb-2">📄</div>
            <p>Order not found or already completed.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const items = Array.isArray(orderData.items) ? orderData.items : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Token #{orderData.tokenNumber} - Bill</DialogTitle>
          <DialogDescription>View and print the bill.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Order ID:</span> #{" "}
              {orderData.id.slice(-6)}
            </div>
            <div>
              <span className="font-medium">Token:</span> #{orderData.tokenNumber}
            </div>
            <div>
              <span className="font-medium">Customer:</span>{" "}
              {orderData.customer_name}
            </div>
            <div>
              <span className="font-medium">Date:</span>{" "}
              {new Date(orderData.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Time:</span>{" "}
              {new Date(orderData.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Order Items</h3>
            <div className="space-y-2">
              {items.length > 0 ? (
                items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.name || "Unknown"}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity || 1} × ₹{(item.price || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="font-medium text-green-600">
                      ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items in this order.</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₹{(orderData.total * 0.9).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%):</span>
              <span>₹{(orderData.total * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>₹{orderData.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button variant="outline" className="flex-1">
              <Eye className="mr-2 h-4 w-4" /> View Bill
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handlePrintAndEmail}
              disabled={sendingEmail}
            >
              <Download className="mr-2 h-4 w-4" />
              {sendingEmail ? "Sending..." : "Print & Email"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillComp;