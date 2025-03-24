import React, { useState, useEffect } from 'react';
import { CartProvider } from '@/hooks/useCart';
import { OrderProvider } from '@/hooks/useOrder';
import { getTableNumber, initTableEventManager } from '@/services/tableService';
import { motion } from 'framer-motion';

const BlankScreen: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-white z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

const Index: React.FC = () => {
  const [tableNumber, setTableNumber] = useState<string>('');

  useEffect(() => {
    // Initialize global event manager
    initTableEventManager();

    // Get table number from URL or generate one for demo
    const table = getTableNumber();
    setTableNumber(table);

    // Set page title
    document.title = `Table ${table} - Dine-In Symphony`;

    // Add framer-motion
    const addFramerMotion = async () => {
      try {
        await import('framer-motion');
      } catch (error) {
        console.error('Failed to load framer-motion:', error);
      }
    };

    addFramerMotion();
  }, []);

  if (!tableNumber) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <CartProvider>
      <OrderProvider tableNumber={tableNumber}>
        <BlankScreen />
      </OrderProvider>
    </CartProvider>
  );
};

export default Index;
