// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import { CheckCircle, Clock, Utensils, AlertCircle } from "lucide-react";
// import axios from "axios";

// interface OrderItem {
//   name: string;
//   quantity: number;
//   price: number;
// }

// interface Order {
//   _id: string;
//   created_at: string;
//   customer_name: string;
//   order_items: OrderItem[];
//   payment_status: string;
//   status: string;
//   total_amount: number;
// }
// const restaurantId = "681f3a4888df8faae5bbd380"; // Replace with your actual restaurant ID

// const ChefPanel = () => {
//   const [orders, setOrders] = useState<Order[]>([]);

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3001/orders/${restaurantId}`
//       ); // Replace with your endpoint
//       const today = new Date().toISOString().split("T")[0];

//       const todayOrders = response.data.filter((order: Order) =>
//         order.created_at.startsWith(today)
//       );

//       setOrders(todayOrders);
//     } catch (error) {
//       toast.error("Failed to fetch orders");
//       console.error(error);
//     }
//   };

//   const updateStatus = async (orderId: string, newStatus: string) => {
//     try {
//       await axios.put(
//         `http://localhost:3001/orders/${restaurantId}/${orderId}/status`,
//         {
//           status: newStatus,
//         }
//       );

//       toast.success("Order status updated");
//       fetchOrders(); // refresh list
//     } catch (error) {
//       toast.error("Failed to update status");
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
//         <Utensils className="w-7 h-7 text-green-600" /> Chef Dashboard
//       </h1>

//       {orders.length === 0 ? (
//         <div className="flex flex-col items-center justify-center text-gray-600 mt-20">
//           <AlertCircle className="w-10 h-10 mb-2" />
//           <p>No orders for today</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <div>
//                   <p className="font-semibold text-lg">
//                     Order #{order._id.slice(-5)}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {new Date(order.created_at).toLocaleString()}
//                   </p>
//                 </div>
//                 <div
//                   className={`px-3 py-1 text-sm rounded-full ${
//                     order.status === "completed"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {order.status}
//                 </div>
//               </div>

//               <div className="mb-3">
//                 <p className="text-sm font-medium text-gray-700">
//                   Customer: {order.customer_name}
//                 </p>
//               </div>

//               <div className="mb-3">
//                 <p className="font-semibold text-gray-700">Items:</p>
//                 <ul className="ml-4 mt-1 list-disc text-sm text-gray-600">
//                   {order.order_items.map((item, index) => (
//                     <li key={index}>
//                       {item.name} x {item.quantity} — ₹
//                       {item.price * item.quantity}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <p className="font-semibold mt-2">Total: ₹{order.total_amount}</p>

//               <div className="flex justify-end mt-4 gap-3">
//                 {order.status !== "completed" && (
//                   <button
//                     onClick={() => updateStatus(order._id, "completed")}
//                     className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 transition"
//                   >
//                     Mark as Completed
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChefPanel;

// import { useEffect, useState } from "react";
// import {
//   Clock,
//   CheckCircle,
//   List,
//   RefreshCcw,
//   XCircle,
//   CookingPot,
// } from "lucide-react";
// import { toast } from "react-hot-toast";
// import axios from "axios";

// const ChefPanel = () => {
//   const [orders, setOrders] = useState([]);
//   const [filterStatus, setFilterStatus] = useState<"pending" | "completed">(
//     "pending"
//   );
//   const restaurantId = "681f3a4888df8faae5bbd380"; // Replace with your actual restaurant ID

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3001/orders/681f3a4888df8faae5bbd380"
//       );
//       const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
//       const todayOrders = res.data.filter(
//         (order: any) => order.created_at.slice(0, 10) === today
//       );
//       setOrders(todayOrders);
//     } catch (error) {
//       toast.error("Failed to fetch orders");
//       console.error(error);
//     }
//   };

//   const updateOrderStatus = async (id: string, newStatus: string) => {
//     try {
//       await axios.put(
//         `http://localhost:3001/orders/${restaurantId}/${orderId}/status`,
//         { status: newStatus }
//       );
//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === id ? { ...order, status: newStatus } : order
//         )
//       );
//       toast.success(`Order marked as ${newStatus}`);
//     } catch (err) {
//       toast.error("Failed to update status");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-bold flex items-center gap-2">
//           <CookingPot className="text-orange-600" />
//           Chef Dashboard
//         </h1>
//         <div className="space-x-2">
//           <button
//             onClick={() => setFilterStatus("pending")}
//             className={`px-4 py-1 rounded-full font-medium border ${
//               filterStatus === "pending"
//                 ? "bg-orange-500 text-white"
//                 : "bg-white text-orange-500 border-orange-500"
//             }`}
//           >
//             Pending
//           </button>
//           <button
//             onClick={() => setFilterStatus("completed")}
//             className={`px-4 py-1 rounded-full font-medium border ${
//               filterStatus === "completed"
//                 ? "bg-green-600 text-white"
//                 : "bg-white text-green-600 border-green-600"
//             }`}
//           >
//             Completed
//           </button>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {orders
//           .filter((o) => o.status === filterStatus)
//           .map((order, idx) => (
//             <div
//               key={idx}
//               className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
//             >
//               <div className="flex items-center justify-between">
//                 <h2 className="font-semibold text-lg">
//                   Order #{order._id.slice(-4)}
//                 </h2>
//                 <span
//                   className={`text-xs px-2 py-1 rounded-full ${
//                     order.status === "pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-green-100 text-green-700"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600">
//                 {new Date(order.created_at).toLocaleTimeString()}
//               </p>

//               <div className="mt-3">
//                 <p className="text-sm font-medium">Items:</p>
//                 <ul className="list-disc pl-5 text-sm text-gray-700">
//                   {order.order_items.map((item: any, i: number) => (
//                     <li key={i}>
//                       {item.name} × {item.quantity}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="mt-2">
//                 <p className="text-sm">
//                   <strong>Customer:</strong> {order.customer_name}
//                 </p>
//                 <p className="text-sm">
//                   <strong>Total:</strong> ₹{order.total_amount}
//                 </p>
//               </div>

//               {order.status === "pending" && (
//                 <button
//                   onClick={() => updateOrderStatus(order._id, "completed")}
//                   className="mt-3 bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 transition"
//                 >
//                   Mark as Completed
//                 </button>
//               )}
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default ChefPanel;

// src/pages/ChefPanel.tsx
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { CheckCircle, Clock, XCircle, Utensils } from "lucide-react";
import { format } from "date-fns";
import classNames from "classnames";
const restaurantId = localStorage.getItem("restaurantId"); // Replace with your actual restaurant ID
const API_URL = `http://localhost:3001`; // Replace with your actual URL

const ChefPanel = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState<"pending" | "completed">("pending");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/${restaurantId}`);
      const today = new Date().toISOString().split("T")[0];
      const todaysOrders = res.data.filter((order: any) => {
        const orderDate = order.created_at.split("T")[0];
        return orderDate === today;
      });
      setOrders(todaysOrders);
    } catch (err) {
      toast.error("Failed to load orders");
    }
  };

  const updateStatus = async (id: string) => {
    try {
      await axios.put(`${API_URL}/orders/${restaurantId}/${id}/status`, {
        status: "completed",
      });
      toast.success("Order marked as completed");
      fetchOrders(); // Refresh list
    } catch (err) {
      toast.error("Failed to update order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <Utensils className="w-7 h-7 text-orange-600" />
          Chef Panel
        </h1>
        <div className="flex gap-2">
          <button
            className={classNames(
              "px-4 py-2 rounded text-sm font-semibold border",
              filter === "pending"
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-500 border-orange-500"
            )}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={classNames(
              "px-4 py-2 rounded text-sm font-semibold border",
              filter === "completed"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 border-green-600"
            )}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders
          .filter((order: any) => order.status === filter)
          .map((order: any) => (
            <div
              key={order._id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="font-bold text-lg">
                    Order #{order._id.slice(-5).toUpperCase()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {order.customer_name || "Guest"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {order.status === "pending" ? (
                    <Clock className="text-orange-500" />
                  ) : (
                    <CheckCircle className="text-green-500" />
                  )}
                  <span className="text-sm font-medium capitalize">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-500">
                  Ordered at: {format(new Date(order.created_at), "PPpp")}
                </p>
              </div>

              <div className="mb-2">
                <h3 className="font-semibold">Items:</h3>
                <ul className="list-disc list-inside text-sm">
                  {order.order_items.map((item: any, index: number) => (
                    <li key={index}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="font-bold mt-2">Total: ₹{order.total_amount}</p>

              {order.status === "pending" && (
                <button
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => updateStatus(order._id)}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChefPanel;
