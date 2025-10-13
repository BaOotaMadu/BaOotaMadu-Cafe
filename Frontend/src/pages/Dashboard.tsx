import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  BarChart3,
  ShoppingBag,
  TableProperties,
  Clock,
  DollarSign,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import TableCard from "@/components/TokenCard";
import OrderDetailsDialog from "@/components/OrderDetailsDialog";
import { useToast } from "@/hooks/use-toast";

//const API_URL = "http://localhost:3001";
const API_URL =
  import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com/"; // Replace with your actual API URL
const socket = io(API_URL);

type Table = {
  id: string;
  number: number;
  status: "available" | "occupied" | "service";
  items?: number;
  time?: string;
};

const Dashboard = () => {
  const { toast } = useToast();
  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalSalesToday, setTotalSalesToday] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [activeTokens, setActiveTokens] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<
    { message: string; time: string }[]
  >([]);
  const [activeTableList, setActiveTableList] = useState<Table[]>([]);

  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  //const restaurantId = "681f3a4888df8faae5bbd380"; // Replace with useParams() if dynamic

  const restaurantId = localStorage.getItem("restaurantId") || "";
  //const restaurantId = "68e4b3dac9fbde6f9ae51777";
  console.log("Restaurant ID:", restaurantId);
  // Fetch Dashboard Stats
  useEffect(() => {
    fetch(`${API_URL}/insights/today/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        setTotalOrdersToday(data.totalOrdersToday || 0);
        setTotalSalesToday(data.totalSalesToday || 0);
        setPendingOrders(data.pendingOrdersToday || 0);
        console.log("Dashboard stats:", data);
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // Fetch Recent Activity
  useEffect(() => {
    fetch(`${API_URL}/activities/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecentMessages(data);
      })
      .catch((err) => console.error("Failed to fetch activities", err));
  }, []);

  // Fetch Active Tokens
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/orders/${restaurantId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        console.log("Fetched orders:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Listen for activity socket updates
  useEffect(() => {
    socket.on("updateRecent", (newMessage) => {
      setRecentMessages((prev) => [newMessage, ...prev.slice(0, 14)]);
    });

    return () => {
      socket.off("updateRecent");
    };
  }, []);

  const handleViewOrder = (tableId: string) => {
    setSelectedTableId(tableId);
    setShowOrderDialog(true);
  };

  const handleGenerateQR = (tableId: string) => {
    toast({
      title: "QR Code Generated",
      description: `QR code for Table ${tableId} has been generated`,
    });
  };

  const getElapsedTime = (createdAt: string) => {
    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();
    const diff = Math.floor((now - createdTime) / 60000); // in minutes
    return `${diff}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={String(totalOrdersToday)}
          icon={<ShoppingBag className="text-navy" />}
          trend={{ value: "12%", positive: true }}
        />
        <StatCard
          title="Daily Revenue"
          value={`₹${totalSalesToday}`}
          icon={<DollarSign className="text-navy" />}
          trend={{ value: "8%", positive: true }}
        />
        <StatCard
          title="Pending Orders"
          value={String(pendingOrders)}
          icon={<Clock className="text-navy" />}
          trend={{ value: "2", positive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 h-80 overflow-hidden">
            <div className="space-y-4 overflow-y-auto h-full pr-2">
              {recentMessages.length === 0 ? (
                <p className="text-sm text-gray-400">No recent activity yet.</p>
              ) : (
                recentMessages.map((msg, index) => (
                  <div
                    key={index}
                    className="flex gap-3 pb-4 border-b last:border-0"
                  >
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <ShoppingBag size={18} className="text-navy" />
                    </div>
                    <div>
                      <p className="font-medium">{msg.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(msg.time).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Tables</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeTableList.map((table) => (
              <TableCard
                key={table.id}
                status={table.status}
                orderItems={table.items}
                timeElapsed={table.time}
                onViewOrder={() => handleViewOrder(table.id)}
                onGenerateQR={() => handleGenerateQR(table.id)}
              />
            ))}
          </div>
        </div> */}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Revenue Overview</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 h-80 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto text-gray-300" />
            <p className="mt-2 text-gray-500">
              Sales analytics will appear here
            </p>
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      {showOrderDialog && selectedTableId && (
        <OrderDetailsDialog
          open={showOrderDialog}
          onClose={() => {
            setShowOrderDialog(false);
            setSelectedTableId(null);
          }}
          tableNumber={selectedTableId}
        />
      )}
    </div>
  );
};

export default Dashboard;
