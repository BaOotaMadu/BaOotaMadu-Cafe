// import React from 'react';
// import { motion } from 'framer-motion';

// const OrderConfirmation: React.FC = () => {
//   return (
//     <motion.div
//       className="fixed inset-0 bg-white z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//     />
//   );
// };

// export default OrderConfirmation;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com";

const OrderConfirmation: React.FC = () => {
  const [statusData, setStatusData] = useState<any>(null);

  useEffect(() => {
    const sessionRef = localStorage.getItem("sessionRef");
    if (!sessionRef) return;

    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/status/${sessionRef}`);
        setStatusData(res.data);
      } catch (err) {
        console.log("No active order or unable to fetch status");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center text-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        ✅ Order Placed Successfully!
      </h2>

      {statusData ? (
        <div className="bg-orange-50 border border-orange-200 rounded-xl shadow-sm p-4 w-full max-w-md">
          <p className="text-gray-800 font-semibold mb-1">
            Token #{statusData.tokenNumber}
          </p>
          <p className="text-gray-700">
            Estimated Time:{" "}
            {statusData.estimatedTime
              ? `${statusData.estimatedTime} min`
              : "Waiting for chef..."}
          </p>
          <p
            className={`text-sm font-bold mt-2 ${
              statusData.status === "completed"
                ? "text-green-600"
                : "text-orange-600"
            }`}
          >
            Status: {statusData.status}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">Fetching order details...</p>
      )}
    </motion.div>
  );
};

export default OrderConfirmation;
