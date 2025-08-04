// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
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

//   useEffect(() => {
//     if (open) {
//       setLoading(true);
//       fetch(`http://localhost:3001/orders/${restaurantId}/table/${tableNumber}`)
//         .then((res) => res.json())
//         .then((data) => {
//           console.log("Fetched order:", data);
//           setTableOrder(data);
//         })
//         .catch((err) => {
//           console.error("Failed to fetch order", err);
//           setTableOrder(null);
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [open, tableNumber]);

//   if (loading) {
//     return (
//       <Dialog open={open} onOpenChange={onClose}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Table {tableNumber} - Order Details</DialogTitle>
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
//             <DialogTitle>Table {tableNumber} - Order Details</DialogTitle>
//           </DialogHeader>
//           <div className="py-4 text-center text-gray-500">
//             No active order found for this table.
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   const handlePrintBill = () => {
//     const printWindow = window.open("", "_blank");
//     if (printWindow) {
//       printWindow.document.write(`
//       <html>
//         <head>
//           <title>Bill - Table ${tableNumber}</title>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

//             * {
//               margin: 0;
//               padding: 0;
//               box-sizing: border-box;
//             }

//             body {
//               font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//               min-height: 100vh;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               padding: 20px;
//               color: #2d3748;
//             }

//             .bill-container {
//               background: white;
//               max-width: 420px;
//               width: 100%;
//               border-radius: 16px;
//               box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
//               overflow: hidden;
//               position: relative;
//             }

//             .bill-container::before {
//               content: '';
//               position: absolute;
//               top: 0;
//               left: 0;
//               right: 0;
//               height: 4px;
//               background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
//             }

//             .header {
//               text-align: center;
//               padding: 32px 24px 24px;
//               background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
//               border-bottom: 1px solid #e2e8f0;
//             }

//             .restaurant-name {
//               font-size: 28px;
//               font-weight: 700;
//               color: #1a202c;
//               margin-bottom: 8px;
//               letter-spacing: -0.5px;
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
//               display: flex;
//               align-items: center;
//               gap: 8px;
//             }

//             .section-title::before {
//               content: '🍽️';
//               font-size: 20px;
//             }

//             .order-item {
//               display: flex;
//               justify-content: space-between;
//               align-items: flex-start;
//               margin: 12px 0;
//               padding: 12px 0;
//               border-bottom: 1px solid #f1f5f9;
//             }

//             .order-item:last-child {
//               border-bottom: none;
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
//               white-space: nowrap;
//             }

//             .separator {
//               height: 1px;
//               background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
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
//               background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
//               border-radius: 12px;
//               margin-top: 16px;
//               border: 2px solid #0ea5e9;
//             }

//             .footer {
//               text-align: center;
//               padding: 24px;
//               background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
//               border-top: 1px solid #e2e8f0;
//             }

//             .thank-you {
//               font-size: 16px;
//               color: #1a202c;
//               font-weight: 600;
//               margin-bottom: 8px;
//             }

//             .footer-message {
//               font-size: 14px;
//               color: #64748b;
//               line-height: 1.5;
//             }

//             .decorative-element {
//               text-align: center;
//               margin: 16px 0;
//               font-size: 24px;
//               opacity: 0.3;
//             }

//             @media print {
//               body {
//                 background: white !important;
//                 padding: 0 !important;
//               }

//               .bill-container {
//                 box-shadow: none !important;
//                 border-radius: 0 !important;
//                 max-width: none !important;
//               }
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
//                   <div class="detail-value">${tableNumber}</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Order ID</div>
//                   <div class="detail-value">#${tableOrder.id}</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Date</div>
//                   <div class="detail-value">${new Date(
//                     tableOrder.createdAt
//                   ).toLocaleDateString()}</div>
//                 </div>
//                 <div class="detail-item">
//                   <div class="detail-label">Time</div>
//                   <div class="detail-value">${new Date(
//                     tableOrder.createdAt
//                   ).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}</div>
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

//             <div class="decorative-element">✨ ◆ ✨</div>

//             <div class="footer">
//               <p class="thank-you">Thank you for dining with us!</p>
//               <p class="footer-message">We hope you enjoyed your meal and look forward to serving you again soon.</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `);
//       printWindow.document.close();
//       printWindow.print();
//     }
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onClose}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Table {tableNumber} - Order Details</DialogTitle>
//           </DialogHeader>
//           {/* your order details UI here */}
//           <div className="flex gap-2 mt-6">
//             <Button
//               variant="outline"
//               className="flex-1"
//               onClick={() => {
//                 /* show bill */
//               }}
//             >
//               <Eye className="mr-2 h-4 w-4" />
//               View Bill
//             </Button>
//             <Button className="flex-1" onClick={handlePrintBill}>
//               <Download className="mr-2 h-4 w-4" />
//               Print Bill
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
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
  const [tableOrder, setTableOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const restaurantId = localStorage.getItem("restaurantId");
  const API_URL = "http://localhost:3001";
  // Clean up table number for display
  const displayTableNumber =
    tableNumber.length > 10 ? `Table ${tableNumber.slice(-3)}` : tableNumber;

  // Fetch order data when dialog opens
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
          const orderData = Array.isArray(data) ? data[0] : data;

          if (!orderData || !orderData.order_items?.length) {
            setTableOrder(null);
            return;
          }

          const transformedOrder = {
            id: orderData._id || "N/A",
            items: orderData.order_items,
            total:
              orderData.total ||
              orderData.order_items.reduce(
                (sum: number, item: any) => sum + item.price * item.quantity,
                0
              ),
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

  const handlePrintBill = () => {
    if (!tableOrder) return;

    // === 1. OPEN PRINT WINDOW ===
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
                  (item: any) => `
                <div class="order-item">
                  <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Qty: ${
                      item.quantity
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

    // === 2. SEND EMAIL TO BACKEND ===
    setSendingEmail(true);

    const emailPayload = {
      to: "jayanthdn6073@gmail.com", // ✅ Use your verified Resend email to avoid 403
      subject: `Bill from Table ${displayTableNumber}`,
      htmlContent: billHTML,
    };

    fetch(`${API_URL}/send-bill-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload),
    })
      .then(async (res) => {
        // Handle non-JSON responses (like HTML 404 pages)
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}...`);
        }
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error("Expected JSON, got: " + text.substring(0, 100));
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
        console.error("❌ Email send failed:", err);
        alert(`❌ Failed to send email: ${err.message}`);
      })
      .finally(() => {
        setSendingEmail(false);
      });
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
            <DialogDescription>Loading order information...</DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center text-gray-500">Loading...</div>
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
            <DialogDescription>
              No active order found for this table.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-gray-500">
            <div className="text-lg mb-2">📋</div>
            <div className="font-medium">No active order found.</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{displayTableNumber} - Order Details</DialogTitle>
          <DialogDescription>
            View and manage the current order.
          </DialogDescription>
        </DialogHeader>

        {/* Order Summary */}
        <div className="space-y-4">
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
              {tableOrder.items.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-medium text-green-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
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
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            View Bill
          </Button>
          <Button
            className="flex-1"
            onClick={handlePrintBill}
            disabled={sendingEmail}
          >
            <Download className="mr-2 h-4 w-4" />
            {sendingEmail ? "Sending..." : "Print & Email"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
