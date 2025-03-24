
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MenuList from '@/components/menu/MenuList';
import Cart from '@/components/cart/Cart';
import OrderStatus from '@/components/order/OrderStatus';
import OrderConfirmation from '@/components/order/OrderConfirmation';
import Bill from '@/components/bill/Bill';
import { CartProvider } from '@/hooks/useCart';
import { OrderProvider, useOrder } from '@/hooks/useOrder';
import { getTableNumber, initTableEventManager, callStaff } from '@/services/tableService';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';

const TableInterface: React.FC<{ tableNumber: string }> = ({ tableNumber }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast();
  const { currentOrder, orderStatus } = useOrder();

  useEffect(() => {
    // Simulate initial animation
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleOrderPlaced = () => {
    setShowConfirmation(true);
  };

  const handleCallStaff = async () => {
    await callStaff(tableNumber);
    toast({
      title: "Staff Notified",
      description: "A staff member will be with you shortly.",
    });
  };

  // When a new order is placed, show confirmation
  useEffect(() => {
    if (currentOrder && currentOrder.status === 'pending') {
      setShowConfirmation(true);
    }
  }, [currentOrder]);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        <Header tableNumber={tableNumber} onCartClick={handleCartToggle} />
        
        <main className="flex-1 container px-4 pt-24 pb-20">
          {isInitialLoad ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-5xl mb-4 font-bold tracking-tight"
              >
                Dine-In Symphony
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Welcome to Table {tableNumber}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentOrder && (
                <OrderStatus 
                  status={orderStatus || 'pending'} 
                  orderNumber={currentOrder.id}
                  estimatedTime={20}
                />
              )}

              <MenuList />
              
              {currentOrder && orderStatus === 'served' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bottom-20 right-4 z-40"
                >
                  <Button 
                    size="lg"
                    className="shadow-lg"
                    onClick={() => setIsBillOpen(true)}
                  >
                    <Receipt className="mr-2 h-5 w-5" />
                    View Bill
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </main>
        
        <Footer onCallStaff={handleCallStaff} />
      </div>
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableNumber={tableNumber}
      />
      
      {showConfirmation && currentOrder && (
        <OrderConfirmation
          orderNumber={currentOrder.id}
          onClose={() => setShowConfirmation(false)}
        />
      )}
      
      {currentOrder && (
        <Bill
          isOpen={isBillOpen}
          onClose={() => setIsBillOpen(false)}
          orderItems={currentOrder.items}
          tableNumber={tableNumber}
          orderNumber={currentOrder.id}
        />
      )}
    </>
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
        <TableInterface tableNumber={tableNumber} />
      </OrderProvider>
    </CartProvider>
  );
};

export default Index;
