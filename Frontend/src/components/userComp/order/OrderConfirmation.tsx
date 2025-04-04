import React from 'react';
import { motion } from 'framer-motion';

const OrderConfirmation: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-white z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

export default OrderConfirmation;
