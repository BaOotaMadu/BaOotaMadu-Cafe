// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Download, Eye } from "lucide-react";
// import BillComponent from "@/components/BillComponent";

// interface OrderDetailsDialogProps {
//   open: boolean;
//   onClose: () => void;
//   tableNumber: string;
// }

// const OrderDetailsDialog = ({
//   open,
//   onClose,
//   tableNumber,
// }: OrderDetailsDialogProps) => {
//   const [tableOrder, setTableOrder] = useState<any | null>(null);
//   const [loading, setLoading] = useState(false);
//   const restaurantId = "681f3a4888df8faae5bbd380";

//   // Clean up table number for display (extract actual table number if it's an ID)
//   const displayTableNumber = tableNumber.length > 10 ?
//     `Table ${tableNumber.slice(-3)}` : // Show last 3 characters if it's a long ID
//     tableNumber;

// useEffect(() => {
//   if (open) {
//     setLoading(true);
//     setTableOrder(null); // Reset state when opening

//     fetch(`http://localhost:3001/orders/${restaurantId}/table/${tableNumber}`)
//       .then((res) => {
//         if (!res.ok) {
//           // Handle 404 and other HTTP errors
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Fetched order:", data);
//         // Handle array response - take the first order if it exists
//         const orderData = Array.isArray(data) ? data[0] : data;

//         // Check if the response contains valid order data
//         if (!orderData || orderData.message || !orderData.order_items || orderData.order_items.length === 0) {
//           setTableOrder(null);
//         } else {
//           // Transform the data to match expected structure
//           const transformedOrder = {
//             id: orderData._id || 'N/A',
//             items: orderData.order_items,
//             total: orderData.total || orderData.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
//             createdAt: orderData.created_at,
//             customer_name: orderData.customer_name
//           };
//           setTableOrder(transformedOrder);
//         }
//       })
//       .catch((err) => {
//         console.log("No order found for table:", displayTableNumber);
//         setTableOrder(null);
//       })
//       .finally(() => setLoading(false));
//   }
// }, [open, tableNumber, displayTableNumber]);

//   useEffect(() => {
//   if (open) {
//     setLoading(true);
//     setTableOrder(null); // Reset state when opening

//     fetch(`http://localhost:3001/orders/${restaurantId}/table/${tableNumber}`)
//       .then((res) => {
//         if (!res.ok) {
//           // Handle 404 and other HTTP errors
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Fetched order:", data);

//         // Handle array response - take the first order if it exists
//         const orderData = Array.isArray(data) ? data[0] : data;

//         // Check if the response contains valid order data
//         if (!orderData || orderData.message || !orderData.order_items || orderData.order_items.length === 0) {
//           console.log("No valid order data found");
//           setTableOrder(null);
//         } else {
//           // Transform the data to match expected structure
//           const transformedOrder = {
//             id: orderData._id || 'N/A',
//             items: orderData.order_items,
//             total: orderData.total || orderData.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
//             createdAt: orderData.created_at,
//             customer_name: orderData.customer_name,
//             status: orderData.status || 'pending',
//             table_number: orderData.table_number || tableNumber
//           };

//           console.log("Transformed order for display:", transformedOrder);
//           setTableOrder(transformedOrder);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching order:", err);
//         console.log("No order found for table:", displayTableNumber);
//         setTableOrder(null);
//       })
//       .finally(() => {
//         setLoading(false);
//         console.log("Order fetch completed for table:", displayTableNumber);
//       });
//   }
// }, [open, tableNumber, displayTableNumber, restaurantId]);

//   const handlePrintBill = () => {
//     if (!tableOrder) return;

//     // === 1. OPEN PRINT WINDOW ===
//     const printWindow = window.open("", "_blank");
//     if (!printWindow) {
//       alert("🖨️ Failed to open print window.");
//       return;
//     }

//     const orderDate = new Date(tableOrder.createdAt).toLocaleDateString();
//     const orderTime = new Date(tableOrder.createdAt).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     const billHTML = `
//       <html>
//         <head>
//           <title>Bill - ${displayTableNumber}</title>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
//             * {
//               margin: 0;
//               padding: 0;
//               box-sizing: border-box;
//             }
//             body {
//               font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//               background: white;
//               color: #2d3748;
//               padding: 20px;
//             }
//             .bill-container {
//               background: white;
//               max-width: 420px;
//               width: 100%;
//               border-radius: 16px;
//               box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
//               overflow: hidden;
//             }
//             .header {
//               text-align: center;
//               padding: 32px 24px 24px;
//               background: #f8fafc;
//               border-bottom: 1px solid #e2e8f0;
//             }
//             .restaurant-name {
//               font-size: 28px;
//               font-weight: 700;
//               color: #1a202c;
//               margin-bottom: 8px;
//             }
//             .bill-title {
//               font-size: 16px;
//               color: #64748b;
//               font-weight: 500;
//               margin-bottom: 20px;
//             }
//             .order-details {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 16px;
//               margin-top: 16px;
//             }
//             .detail-item {
//               text-align: center;
//               padding: 12px;
//               background: white;
//               border-radius: 8px;
//               box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
//             }
//             .detail-label {
//               font-size: 12px;
//               color: #64748b;
//               font-weight: 500;
//               text-transform: uppercase;
//               letter-spacing: 0.5px;
//               margin-bottom: 4px;
//             }
//             .detail-value {
//               font-size: 14px;
//               color: #1a202c;
//               font-weight: 600;
//             }
//             .items-section {
//               padding: 24px;
//             }
//             .section-title {
//               font-size: 18px;
//               font-weight: 600;
//               color: #1a202c;
//               margin-bottom: 16px;
//             }
//             .order-item {
//               display: flex;
//               justify-content: space-between;
//               margin: 12px 0;
//               padding: 12px 0;
//               border-bottom: 1px solid #f1f5f9;
//             }
//             .item-details {
//               flex: 1;
//             }
//             .item-name {
//               font-size: 15px;
//               font-weight: 500;
//               color: #1a202c;
//               margin-bottom: 2px;
//             }
//             .item-quantity {
//               font-size: 13px;
//               color: #64748b;
//               font-weight: 400;
//             }
//             .item-price {
//               font-size: 15px;
//               font-weight: 600;
//               color: #059669;
//             }
//             .separator {
//               height: 1px;
//               background: #e2e8f0;
//               margin: 20px 24px;
//             }
//             .total-section {
//               padding: 0 24px 24px;
//             }
//             .subtotal-item {
//               display: flex;
//               justify-content: space-between;
//               margin: 8px 0;
//               font-size: 14px;
//               color: #64748b;
//             }
//             .total {
//               display: flex;
//               justify-content: space-between;
//               align-items: center;
//               font-weight: 700;
//               font-size: 20px;
//               color: #1a202c;
//               padding: 16px;
//               background: #f0f9ff;
//               border-radius: 12px;
//               margin-top: 16px;
//               border: 2px solid #0ea5e9;
//             }
//             .footer {
//               text-align: center;
//               padding: 24px;
//               background: #f8fafc;
//               border-top: 1px solid #e2e8f0;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="bill-container">
//             <div class="header">
//               <h1 class="restaurant-name">Bella Vista</h1>
//               <p class="bill-title">Restaurant Bill</p>
//               <div class="order-details">
//                 <div class="detail-item">
//                   <div class="detail-label">Table</div>
//                   <div class="detail-value">${displayTableNumber}</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Order ID</div>
//                   <div class="detail-value">#${tableOrder.id}</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Customer</div>
//                   <div class="detail-value">${
//                     tableOrder.customer_name || "N/A"
//                   }</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Date</div>
//                   <div class="detail-value">${orderDate}</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Time</div>
//                   <div class="detail-value">${orderTime}</div>
//                 </div>
//               </div>
//             </div>
//             <div class="items-section">
//               <h2 class="section-title">Order Items</h2>
//               ${tableOrder.items
//                 .map(
//                   (item) => `
//                 <div class="order-item">
//                   <div class="item-details">
//                     <div class="item-name">${item.name}</div>
//                     <div class="item-quantity">Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
//                   </div>
//                   <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
//                 </div>
//               `
//                 )
//                 .join("")}
//             </div>
//             <div class="separator"></div>
//             <div class="total-section">
//               <div class="subtotal-item">
//                 <span>Subtotal:</span>
//                 <span>$${(tableOrder.total * 0.9).toFixed(2)}</span>
//               </div>
//               <div class="subtotal-item">
//                 <span>Tax (10%):</span>
//                 <span>$${(tableOrder.total * 0.1).toFixed(2)}</span>
//               </div>
//               <div class="total">
//                 <span>Total Amount:</span>
//                 <span>$${tableOrder.total.toFixed(2)}</span>
//               </div>
//             </div>
//             <div class="footer">
//               <p>Thank you for dining with us!</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `;

//     printWindow.document.write(billHTML);
//     printWindow.document.close();

//     // Print immediately
//     printWindow.print();
//     console.log("✅ Print command sent");

//     // === 2. SEND EMAIL VIA YOUR BACKEND ===
//     setSendingEmail(true);

//     const emailPayload = {
//       to: "jayanthdn6073@gmail.com", // Change to tableOrder.customer_email if available
//       subject: `Bill from Table ${displayTableNumber}`,
//       htmlContent: billHTML, // Reuse the same HTML
//     };

//     fetch("http://localhost:3001/send-bill-email", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(emailPayload),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           console.log("✅ Email sent successfully:", data);
//           alert("✅ Bill printed and sent to your email!");
//         } else {
//           console.error("❌ Email failed:", data.error);
//           alert(`❌ Failed to send email: ${data.error}`);
//         }
//       })
//       .catch((err) => {
//         console.error("❌ Network error:", err);
//         alert("❌ Failed to send email. Check console.");
//       })
//       .finally(() => {
//         setSendingEmail(false);
//       });
//   };

//   if (loading) {
//     return (
//       <Dialog open={open} onOpenChange={onClose}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
//             <DialogDescription>Loading order information...</DialogDescription>
//           </DialogHeader>
//           <div className="py-4 text-center text-gray-500">Loading...</div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   if (!tableOrder) {
//     return (
//       <Dialog open={open} onOpenChange={onClose}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
//             <DialogDescription>No active order information available for this table.</DialogDescription>
//           </DialogHeader>
//           <div className="py-8 text-center text-gray-500">
//             <div className="text-lg mb-2">📋</div>
//             <div className="font-medium">
//               No active order found for this table.
//             </div>
//             <div className="text-sm mt-1">
//               This table doesn't have any pending orders.
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
//           <DialogDescription>View and manage the current order for this table.</DialogDescription>
//         </DialogHeader>

//         {/* Order Details Content */}
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <span className="font-medium">Order ID:</span> #{tableOrder.id}
//             </div>
//             <div>
//               <span className="font-medium">Table:</span> {displayTableNumber}
//             </div>
//             <div>
//               <span className="font-medium">Customer:</span> {tableOrder.customer_name || 'N/A'}
//             </div>
//             <div>
//               <span className="font-medium">Date:</span> {new Date(tableOrder.createdAt).toLocaleDateString()}
//             </div>
//             <div>
//               <span className="font-medium">Time:</span> {new Date(tableOrder.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </div>
//           </div>

//           <Separator />

//           <div>
//             <h3 className="font-medium mb-3">Order Items</h3>
//             <div className="space-y-2">
//               {tableOrder.items?.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
//                 >
//                   <div className="flex-1">
//                     <div className="font-medium">{item.name}</div>
//                     <div className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
//                   </div>
//                   <div className="font-medium text-green-600">${(item.price * item.quantity).toFixed(2)}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <Separator />

//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span>Subtotal:</span>
//               <span>${(tableOrder.total * 0.9).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Tax (10%):</span>
//               <span>${(tableOrder.total * 0.1).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between font-bold text-lg pt-2 border-t">
//               <span>Total:</span>
//               <span>${tableOrder.total.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Buttons - Only shown when there's an active order */}
//         <div className="flex gap-2 mt-6">
//           <Button
//             variant="outline"
//             className="flex-1"
//             onClick={() => { /* View Bill */ }}
//           >
//             <Eye className="mr-2 h-4 w-4" />
//             View Bill
//           </Button>
//           <Button
//             className="flex-1"
//             onClick={handlePrintBill}
//             disabled={sendingEmail}
//           >
//             <Download className="mr-2 h-4 w-4" />
//             {sendingEmail ? "Sending..." : "Print & Email"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default OrderDetailsDialog;

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Download, Eye } from "lucide-react";

// interface OrderDetailsDialogProps {
//   open: boolean;
//   onClose: () => void;
//   tableNumber: string;
// }

// const OrderDetailsDialog = ({
//   open,
//   onClose,
//   tableNumber,
// }: OrderDetailsDialogProps) => {
//   const [tableOrder, setTableOrder] = useState<any | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [sendingEmail, setSendingEmail] = useState(false);

//   const restaurantId = localStorage.getItem("restaurantId");
//   const API_URL = "http://localhost:3001";
//   // Clean up table number for display
//   const displayTableNumber =
//     tableNumber.length > 10 ? `Table ${tableNumber.slice(-3)}` : tableNumber;

//   // Fetch order data when dialog opens
//   useEffect(() => {
//     if (open) {
//       setLoading(true);
//       setTableOrder(null);
//       fetch(`${API_URL}/orders/${restaurantId}/table/${tableNumber}`)
//         .then((res) => {
//           if (!res.ok) throw new Error(`HTTP ${res.status}`);
//           return res.json();
//         })
//         .then((data) => {
//           const orderData = Array.isArray(data) ? data[0] : data;

//           if (!orderData || !orderData.order_items?.length) {
//             setTableOrder(null);
//             return;
//           }

//           const transformedOrder = {
//             id: orderData._id || "N/A",
//             items: orderData.order_items,
//             total:
//               orderData.total ||
//               orderData.order_items.reduce(
//                 (sum: number, item: any) => sum + item.price * item.quantity,
//                 0
//               ),
//             createdAt: orderData.created_at,
//             customer_name: orderData.customer_name || "Guest",
//             table_number: orderData.table_number || tableNumber,
//             customer_email:
//               orderData.customer_email || "jayanthoffical18@gmail.com",
//           };

//           setTableOrder(transformedOrder);
//         })
//         .catch((err) => {
//           console.error("Failed to fetch order:", err);
//           setTableOrder(null);
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [open, tableNumber, restaurantId]);

//   const handlePrintBill = () => {
//     if (!tableOrder) return;

//     // === 1. OPEN PRINT WINDOW ===
//     const printWindow = window.open("", "_blank");
//     if (!printWindow) {
//       alert("🖨️ Failed to open print window.");
//       return;
//     }

//     const orderDate = new Date(tableOrder.createdAt).toLocaleDateString();
//     const orderTime = new Date(tableOrder.createdAt).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     const billHTML = `
//       <html>
//         <head>
//           <title>Bill - ${displayTableNumber}</title>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
//             * { margin: 0; padding: 0; box-sizing: border-box; }
//             body {
//               font-family: 'Inter', sans-serif;
//               background: white;
//               color: #2d3748;
//               padding: 20px;
//             }
//             .bill-container {
//               background: white;
//               max-width: 420px;
//               width: 100%;
//               border-radius: 16px;
//               box-shadow: 0 25px 50px rgba(0,0,0,0.15);
//               overflow: hidden;
//             }
//             .header {
//               text-align: center;
//               padding: 32px 24px 24px;
//               background: #f8fafc;
//               border-bottom: 1px solid #e2e8f0;
//             }
//             .restaurant-name {
//               font-size: 28px;
//               font-weight: 700;
//               color: #1a202c;
//               margin-bottom: 8px;
//             }
//             .bill-title {
//               font-size: 16px;
//               color: #64748b;
//               margin-bottom: 20px;
//             }
//             .order-details {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 16px;
//               margin-top: 16px;
//             }
//             .detail-item {
//               text-align: center;
//               padding: 12px;
//               background: white;
//               border-radius: 8px;
//               box-shadow: 0 2px 4px rgba(0,0,0,0.05);
//             }
//             .detail-label {
//               font-size: 12px;
//               color: #64748b;
//               font-weight: 500;
//               margin-bottom: 4px;
//             }
//             .detail-value {
//               font-size: 14px;
//               color: #1a202c;
//               font-weight: 600;
//             }
//             .items-section { padding: 24px; }
//             .section-title {
//               font-size: 18px;
//               font-weight: 600;
//               color: #1a202c;
//               margin-bottom: 16px;
//             }
//             .order-item {
//               display: flex;
//               justify-content: space-between;
//               margin: 12px 0;
//               padding: 12px 0;
//               border-bottom: 1px solid #f1f5f9;
//             }
//             .item-details { flex: 1; }
//             .item-name { font-size: 15px; font-weight: 500; color: #1a202c; margin-bottom: 2px; }
//             .item-quantity { font-size: 13px; color: #64748b; }
//             .item-price { font-size: 15px; font-weight: 600; color: #059669; }
//             .separator { height: 1px; background: #e2e8f0; margin: 20px 24px; }
//             .total-section { padding: 0 24px 24px; }
//             .subtotal-item { display: flex; justify-content: space-between; margin: 8px 0; color: #64748b; }
//             .total {
//               display: flex;
//               justify-content: space-between;
//               font-weight: 700;
//               font-size: 20px;
//               color: #1a202c;
//               padding: 16px;
//               background: #f0f9ff;
//               border-radius: 12px;
//               margin-top: 16px;
//               border: 2px solid #0ea5e9;
//             }
//             .footer {
//               text-align: center;
//               padding: 24px;
//               background: #f8fafc;
//               border-top: 1px solid #e2e8f0;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="bill-container">
//             <div class="header">
//               <h1 class="restaurant-name">Bella Vista</h1>
//               <p class="bill-title">Restaurant Bill</p>
//               <div class="order-details">
//                 <div class="detail-item">
//                   <div class="detail-label">Table</div>
//                   <div class="detail-value">${displayTableNumber}</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Order ID</div>
//                   <div class="detail-value">#${tableOrder.id}</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Customer</div>
//                   <div class="detail-value">${tableOrder.customer_name}</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Date</div>
//                   <div class="detail-value">${orderDate}</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Time</div>
//                   <div class="detail-value">${orderTime}</div>
//                 </div>
//               </div>
//             </div>
//             <div class="items-section">
//               <h2 class="section-title">Order Items</h2>
//               ${tableOrder.items
//                 .map(
//                   (item: any) => `
//                 <div class="order-item">
//                   <div class="item-details">
//                     <div class="item-name">${item.name}</div>
//                     <div class="item-quantity">Qty: ${
//                       item.quantity
//                     } × $${item.price.toFixed(2)}</div>
//                   </div>
//                   <div class="item-price">$${(
//                     item.price * item.quantity
//                   ).toFixed(2)}</div>
//                 </div>
//               `
//                 )
//                 .join("")}
//             </div>
//             <div class="separator"></div>
//             <div class="total-section">
//               <div class="subtotal-item">
//                 <span>Subtotal:</span>
//                 <span>$${(tableOrder.total * 0.9).toFixed(2)}</span>
//               </div>
//               <div class="subtotal-item">
//                 <span>Tax (10%):</span>
//                 <span>$${(tableOrder.total * 0.1).toFixed(2)}</span>
//               </div>
//               <div class="total">
//                 <span>Total Amount:</span>
//                 <span>$${tableOrder.total.toFixed(2)}</span>
//               </div>
//             </div>
//             <div class="footer">
//               <p>Thank you for dining with us!</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `;

//     printWindow.document.write(billHTML);
//     printWindow.document.close();
//     printWindow.print();

//     // === 2. SEND EMAIL TO BACKEND ===
//     setSendingEmail(true);

//     const emailPayload = {
//       to: "jayanthdn6073@gmail.com", // ✅ Use your verified Resend email to avoid 403
//       subject: `Bill from Table ${displayTableNumber}`,
//       htmlContent: billHTML,
//     };

//     fetch(`${API_URL}/send-bill-email`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(emailPayload),
//     })
//       .then(async (res) => {
//         // Handle non-JSON responses (like HTML 404 pages)
//         const contentType = res.headers.get("content-type");
//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}...`);
//         }
//         if (!contentType || !contentType.includes("application/json")) {
//           const text = await res.text();
//           throw new Error("Expected JSON, got: " + text.substring(0, 100));
//         }
//         return res.json();
//       })
//       .then((data) => {
//         if (data.success) {
//           alert("✅ Bill printed and sent to your email!");
//         } else {
//           alert(`❌ Failed to send email: ${data.error}`);
//         }
//       })
//       .catch((err) => {
//         console.error("❌ Email send failed:", err);
//         alert(`❌ Failed to send email: ${err.message}`);
//       })
//       .finally(() => {
//         setSendingEmail(false);
//       });
//   };

//   if (loading) {
//     return (
//       <Dialog open={open} onOpenChange={onClose}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
//             <DialogDescription>Loading order information...</DialogDescription>
//           </DialogHeader>
//           <div className="py-4 text-center text-gray-500">Loading...</div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   if (!tableOrder) {
//     return (
//       <Dialog open={open} onOpenChange={onClose}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
//             <DialogDescription>
//               No active order found for this table.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-8 text-center text-gray-500">
//             <div className="text-lg mb-2">📋</div>
//             <div className="font-medium">No active order found.</div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
//           <DialogDescription>
//             View and manage the current order.
//           </DialogDescription>
//         </DialogHeader>

//         {/* Order Summary */}
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <span className="font-medium">Order ID:</span> #{tableOrder.id}
//             </div>
//             <div>
//               <span className="font-medium">Table:</span> {displayTableNumber}
//             </div>
//             <div>
//               <span className="font-medium">Customer:</span>{" "}
//               {tableOrder.customer_name}
//             </div>
//             <div>
//               <span className="font-medium">Date:</span>{" "}
//               {new Date(tableOrder.createdAt).toLocaleDateString()}
//             </div>
//             <div>
//               <span className="font-medium">Time:</span>{" "}
//               {new Date(tableOrder.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </div>
//           </div>
//           <Separator />
//           <div>
//             <h3 className="font-medium mb-3">Order Items</h3>
//             <div className="space-y-2">
//               {tableOrder.items.map((item: any, i: number) => (
//                 <div
//                   key={i}
//                   className="flex justify-between py-2 border-b last:border-b-0"
//                 >
//                   <div className="flex-1">
//                     <div className="font-medium">{item.name}</div>
//                     <div className="text-sm text-gray-500">
//                       Qty: {item.quantity} × ${item.price.toFixed(2)}
//                     </div>
//                   </div>
//                   <div className="font-medium text-green-600">
//                     ${(item.price * item.quantity).toFixed(2)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <Separator />
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span>Subtotal:</span>
//               <span>${(tableOrder.total * 0.9).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Tax (10%):</span>
//               <span>${(tableOrder.total * 0.1).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between font-bold text-lg pt-2 border-t">
//               <span>Total:</span>
//               <span>${tableOrder.total.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-2 mt-6">
//           <Button variant="outline" className="flex-1">
//             <Eye className="mr-2 h-4 w-4" />
//             View Bill
//           </Button>
//           <Button
//             className="flex-1"
//             onClick={handlePrintBill}
//             disabled={sendingEmail}
//           >
//             <Download className="mr-2 h-4 w-4" />
//             {sendingEmail ? "Sending..." : "Print & Email"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default OrderDetailsDialog;

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Eye, QrCode } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Define TypeScript interfaces
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  _id: string;
  order_items: OrderItem[];
  total?: number;
  created_at: string;
  customer_name?: string;
  table_number?: string;
  customer_email?: string;
}

interface OrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  tableNumber: string;
}

const OrderDetailsDialog = ({
  open,
  onClose,
  tableNumber,
}: OrderDetailsDialogProps) => {
  const [tableOrder, setTableOrder] = useState<{
    id: string;
    items: OrderItem[];
    total: number;
    createdAt: string;
    customer_name: string;
    table_number: string;
    customer_email: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | null>(
    null
  );
  const [cashGiven, setCashGiven] = useState<string>("");
  const [upiPaid, setUpiPaid] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const paymentRef = useRef<HTMLDivElement>(null);

  const restaurantId = localStorage.getItem("restaurantId");
  const API_URL = "http://localhost:3001";

  const displayTableNumber =
    tableNumber.length > 10 ? `Table ${tableNumber.slice(-3)}` : tableNumber;

  useEffect(() => {
    if (open) {
      setLoading(true);
      setTableOrder(null);

      fetch(`${API_URL}/orders/${restaurantId}/table/${tableNumber}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          // Normalize: ensure we have an object
          const orderData: OrderData = Array.isArray(data) ? data[0] : data;
          if (!orderData) {
            setTableOrder(null);
            return;
          }

          // Safely extract and normalize order_items
          const rawItems = orderData.order_items;
          const items: OrderItem[] = Array.isArray(rawItems) ? rawItems : [];

          if (items.length === 0) {
            setTableOrder(null);
            return;
          }

          // Calculate total safely
          const total =
            typeof orderData.total === "number"
              ? orderData.total
              : items.reduce((sum, item) => {
                  const price = typeof item.price === "number" ? item.price : 0;
                  const quantity =
                    typeof item.quantity === "number" ? item.quantity : 1;
                  return sum + price * quantity;
                }, 0);

          const transformedOrder = {
            id: orderData._id || "N/A",
            items,
            total,
            createdAt: orderData.created_at,
            customer_name: orderData.customer_name || "Guest",
            table_number: orderData.table_number || tableNumber,
            customer_email:
              orderData.customer_email || "jayanthoffical18@gmail.com",
          };

          setTableOrder(transformedOrder);
        })
        .catch((err) => {
          console.error("Failed to fetch order:", err);
          setTableOrder(null);
        })
        .finally(() => setLoading(false));
    }
  }, [open, tableNumber, restaurantId]);

  const handlePayClick = () => {
    if (!tableOrder) return;
    setShowPayment(true);
    setTimeout(() => {
      paymentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (!open) {
      setShowPayment(false);
      setContact("");
      setPaymentMethod(null);
      setCashGiven("");
      setUpiPaid(false);
      setPaymentDone(false);
    }
  }, [open]);

  // Validation
  const isValidContact = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(contact) || phoneRegex.test(contact);
  };

  const isValidPaymentMethod = !!paymentMethod;
  const parsedCashGiven = parseFloat(cashGiven) || 0;
  const balance = parsedCashGiven - (tableOrder?.total || 0);
  const isValidCashGiven =
    paymentMethod === "cash"
      ? parsedCashGiven >= (tableOrder?.total || 0)
      : true;

  const isFormValid =
    isValidContact() && isValidPaymentMethod && isValidCashGiven;

  const handleUPISuccess = () => {
    setUpiPaid(true);
    setPaymentDone(true);
  };

  const handlePaymentSubmit = () => {
    if (!isFormValid) return;

    if (paymentMethod === "upi" && !upiPaid) {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          handleUPISuccess();
          finalizePayment();
        } else {
          alert("❌ UPI Payment Failed. Try again.");
        }
      }, 1500);
      return;
    }

    if (paymentMethod === "cash") {
      setPaymentDone(true);
      finalizePayment();
    }
  };

  const finalizePayment = async () => {
    if (!tableOrder) return;

    try {
      const res = await fetch(`${API_URL}/orders/${tableOrder.id}/pay`, {
        method: "PATCH", // or POST/PUT/DELETE depending on your backend
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "paid", // optional, depending on backend
          table_number: tableOrder.table_number, // if you want to clear table too
          payment_method: paymentMethod,
          contact: contact,
          total: tableOrder.total,
        }),
      });

      if (!res.ok) throw new Error(`Failed with status ${res.status}`);

      toast({
        title: "✅ Payment successful",
        description: `Order for Table ${tableOrder.table_number} is now marked as paid.`,
      });

      // Clear the tableOrder from frontend state
      setTableOrder(null);
      setShowPayment(false);

      // Optionally refetch tables/orders or trigger a state update
    } catch (err) {
      console.error("❌ Failed to mark order as paid:", err);
      toast({
        variant: "destructive",
        title: "Payment Save Failed",
        description: "Could not update order status. Please try again.",
      });
    }
  };

  const handlePrintAndEmail = () => {
    if (!tableOrder) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("🖨️ Failed to open print window.");
      return;
    }

    const orderDate = new Date(tableOrder.createdAt).toLocaleDateString();
    const orderTime = new Date(tableOrder.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const billHTML = `
      <html>
        <head>
          <title>Bill - ${displayTableNumber}</title>
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
                  <div class="detail-label">Table</div>
                  <div class="detail-value">${displayTableNumber}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Order ID</div>
                  <div class="detail-value">#${tableOrder.id}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Customer</div>
                  <div class="detail-value">${tableOrder.customer_name}</div>
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
              ${tableOrder.items
                .map(
                  (item) => `
                <div class="order-item">
                  <div class="item-details">
                    <div class="item-name">${item.name || "Unknown Item"}</div>
                    <div class="item-quantity">Qty: ${
                      item.quantity || 1
                    } × $${item.price.toFixed(2)}</div>
                  </div>
                  <div class="item-price">$${(
                    item.price * item.quantity
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
            <div class="footer">
              <p>Thank you for dining with us!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.print();

    setSendingEmail(true);
    const emailPayload = {
      to: "jayanthdn6073@gmail.com",
      subject: `Bill from Table ${displayTableNumber}`,
      htmlContent: billHTML,
    };

    fetch(`${API_URL}/send-bill-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload),
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}...`);
        }
        if (!contentType?.includes("application/json")) {
          const text = await res.text();
          throw new Error("Expected JSON");
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
        console.error("❌ Email failed:", err);
        alert(`❌ Failed to send email: ${err.message}`);
      })
      .finally(() => setSendingEmail(false));
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
            <DialogDescription>Loading order...</DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">🌀 Loading order details...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!tableOrder) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
            <DialogDescription>No active order found.</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-gray-500">
            <div className="text-2xl mb-2">🍽️</div>
            <div className="font-medium">No order found for this table.</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
          <DialogDescription>
            View and manage the current order.
          </DialogDescription>
        </DialogHeader>

        {!showPayment ? (
          <div className="space-y-6 pb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Order ID:</span> #{tableOrder.id}
              </div>
              <div>
                <span className="font-medium">Table:</span> {displayTableNumber}
              </div>
              <div>
                <span className="font-medium">Customer:</span>{" "}
                {tableOrder.customer_name}
              </div>
              <div>
                <span className="font-medium">Date:</span>{" "}
                {new Date(tableOrder.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Time:</span>{" "}
                {new Date(tableOrder.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Order Items</h3>
              <div className="space-y-2">
                {tableOrder.items.length > 0 ? (
                  tableOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-2 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          Qty: {item.quantity} × ${(item.price || 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="font-medium text-green-600">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
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
                <span>${(tableOrder.total * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%):</span>
                <span>${(tableOrder.total * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>${tableOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1">
                <Eye className="mr-2 h-4 w-4" /> View Bill
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handlePayClick}
              >
                Pay
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-6" ref={paymentRef}>
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-800">
                TOTAL: ₹{tableOrder.total.toFixed(2)}
              </div>
            </div>

            <Separator />

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number / Email
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter phone or email"
                className={`w-full p-2 border rounded-md outline-none transition ${
                  contact && !isValidContact()
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-300"
                }`}
              />
              {contact && !isValidContact() && (
                <p className="text-red-500 text-xs mt-1">
                  Enter valid 10-digit phone or email.
                </p>
              )}
            </div>

            <Separator />

            <div>
              <label className="block text-sm font-medium mb-3">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="h-4 w-4"
                  />
                  <span>Cash</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="h-4 w-4"
                  />
                  <span>UPI</span>
                </label>
              </div>
              {!paymentMethod && (
                <p className="text-red-500 text-xs mt-1">
                  Please select a payment method.
                </p>
              )}
            </div>

            {paymentMethod === "cash" && (
              <div className="space-y-3">
                <label className="block text-sm font-medium">Cash Given</label>
                <input
                  type="number"
                  step="0.01"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  placeholder="Enter amount"
                  className={`w-full p-2 border rounded-md outline-none ${
                    cashGiven && parsedCashGiven < tableOrder.total
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {cashGiven && parsedCashGiven < tableOrder.total && (
                  <p className="text-red-500 text-xs">
                    Must be at least ₹{tableOrder.total.toFixed(2)}.
                  </p>
                )}
                {parsedCashGiven >= tableOrder.total && (
                  <p className="text-green-600 font-medium">
                    Balance to Return: ₹{balance.toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="space-y-4 text-center">
                <div className="p-4 border rounded-lg bg-white shadow-sm inline-block">
                  <QrCode className="h-16 w-16 text-gray-600 mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">Scan to Pay</p>
                </div>
                <p
                  className={`font-medium ${
                    upiPaid ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {upiPaid ? "✅ Payment Successful" : "⏳ Payment Pending..."}
                </p>
                {!upiPaid && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleUPISuccess}
                  >
                    Simulate UPI Success
                  </Button>
                )}
              </div>
            )}

            <Separator />

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!isFormValid || paymentDone}
              onClick={handlePaymentSubmit}
            >
              {paymentMethod === "upi" && !upiPaid
                ? "Confirm Payment"
                : "Confirm Payment"}
            </Button>

            {paymentDone && (
              <div className="space-y-4">
                <div className="text-green-600 font-bold text-center text-lg">
                  ✅ Payment Done
                </div>
                <Button
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                  onClick={handlePrintAndEmail}
                  disabled={sendingEmail}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {sendingEmail ? "Sending..." : "Print & Email"}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
