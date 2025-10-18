// src/pages/ChefPanel.tsx
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { CheckCircle, Clock, XCircle, Utensils } from "lucide-react";
import { format } from "date-fns";
import classNames from "classnames";
const restaurantId = localStorage.getItem("restaurantId"); // Replace with your actual restaurant ID
//const API_URL = `http://localhost:3001`; // Replace with your actual URL
const API_URL =
  import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com/";
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
                    Token #{order.tokenNumber}
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
