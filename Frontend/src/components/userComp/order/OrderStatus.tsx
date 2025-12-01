// import React from 'react';
// import { motion } from 'framer-motion';

// const OrderStatus: React.FC = () => {
//   return (
//     <motion.div
//       className="fixed inset-0 bg-white z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//     />
//   );
// };

// export default OrderStatus;

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com";

interface StatusData {
  tokenNumber: string;
  estimatedTime: number | null;
  status: string;
}

const OrderStatus = () => {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionRef = localStorage.getItem("sessionRef");
    if (!sessionRef) {
      console.warn("No sessionRef found — cannot track order");
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/status/${sessionRef}`);
        setStatusData(res.data);
      } catch (err) {
        console.log("No active order or unable to fetch status");
      } finally {
        setLoading(false);
      }
    };

    // Fetch initially
    fetchStatus();

    // Poll every 10 seconds for updates
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;
  if (!statusData) return null;

  return (
    <div className="p-4 mt-6 bg-orange-50 border border-orange-200 rounded-xl text-center shadow-sm">
      <h3 className="font-bold text-lg text-orange-700 mb-2">
        Your Order Status
      </h3>
      <p className="text-gray-800 font-medium mb-1">
        Token #{statusData.tokenNumber}
      </p>
      <p className="text-gray-700">
        Estimated Time:{" "}
        {statusData.estimatedTime
          ? `${statusData.estimatedTime} min`
          : "Waiting for chef..."}
      </p>
      <p
        className={`text-sm font-semibold mt-2 ${
          statusData.status === "completed"
            ? "text-green-600"
            : "text-orange-600"
        }`}
      >
        Status: {statusData.status}
      </p>
    </div>
  );
};

export default OrderStatus;
