import { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, Users, DollarSign, Bell } from 'lucide-react';

// Mock data for testing
const mockOrders = [
  {
    id: 'order-001',
    tableId: 5,
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    total: 47.50,
    items: [
      {
        id: 'item-001',
        name: 'Margherita Pizza',
        quantity: 2,
        price: 16.50,
        status: 'pending',
        specialInstructions: 'Extra cheese, no basil'
      },
      {
        id: 'item-002',
        name: 'Caesar Salad',
        quantity: 1,
        price: 14.50,
        status: 'pending',
        specialInstructions: 'Dressing on the side'
      }
    ]
  },
  {
    id: 'order-002',
    tableId: 3,
    status: 'preparing',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    total: 82.75,
    items: [
      {
        id: 'item-003',
        name: 'Grilled Salmon',
        quantity: 1,
        price: 28.50,
        status: 'preparing'
      },
      {
        id: 'item-004',
        name: 'Ribeye Steak',
        quantity: 1,
        price: 35.00,
        status: 'preparing',
        specialInstructions: 'Medium rare'
      },
      {
        id: 'item-005',
        name: 'Garlic Mashed Potatoes',
        quantity: 2,
        price: 9.75,
        status: 'preparing'
      }
    ]
  },
  {
    id: 'order-003',
    tableId: 8,
    status: 'ready',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
    total: 65.25,
    items: [
      {
        id: 'item-006',
        name: 'Chicken Parmesan',
        quantity: 1,
        price: 22.50,
        status: 'ready'
      },
      {
        id: 'item-007',
        name: 'Spaghetti Carbonara',
        quantity: 1,
        price: 19.75,
        status: 'ready'
      },
      {
        id: 'item-008',
        name: 'Tiramisu',
        quantity: 2,
        price: 11.50,
        status: 'ready'
      }
    ]
  },
  {
    id: 'order-004',
    tableId: 5,
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    total: 23.50,
    items: [
      {
        id: 'item-009',
        name: 'Bruschetta',
        quantity: 1,
        price: 12.50,
        status: 'pending'
      },
      {
        id: 'item-010',
        name: 'Minestrone Soup',
        quantity: 1,
        price: 11.00,
        status: 'pending',
        specialInstructions: 'No beans'
      }
    ]
  },
  {
    id: 'order-005',
    tableId: 12,
    status: 'preparing',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
    total: 94.00,
    items: [
      {
        id: 'item-011',
        name: 'Lobster Thermidor',
        quantity: 1,
        price: 45.00,
        status: 'preparing'
      },
      {
        id: 'item-012',
        name: 'Filet Mignon',
        quantity: 1,
        price: 38.00,
        status: 'preparing',
        specialInstructions: 'Rare, no sauce'
      },
      {
        id: 'item-013',
        name: 'Wine - Cabernet Sauvignon',
        quantity: 1,
        price: 11.00,
        status: 'ready'
      }
    ]
  }
];

const ChefPanel = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Get active orders (not completed)
  const activeOrders = orders.filter(order => 
    order.status !== 'completed' && order.status !== 'delivered'
  );
  
  // Group orders by table
  const ordersByTable = activeOrders.reduce((acc, order) => {
    const existing = acc.find(item => item.tableId === order.tableId);
    if (existing) {
      existing.orders.push(order);
    } else {
      acc.push({
        tableId: order.tableId,
        orders: [order]
      });
    }
    return acc;
  }, []);

  const showNotification = (title, description) => {
    const notification = {
      id: Date.now(),
      title,
      description,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only last 5 notifications
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const handleOrderReceived = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'preparing' }
        : order
    ));
    showNotification(
      "Order Received",
      `Order #${orderId.slice(-4)} has been marked as received by chef`
    );
  };

  const handleOrderOut = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'ready' }
        : order
    ));
    showNotification(
      "Order Ready",
      `Order #${orderId.slice(-4)} has been sent out to table`
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-table-service/20 text-table-service border-table-service/30';
      case 'preparing': return 'bg-orange/20 text-orange border-orange/30';
      case 'ready': return 'bg-table-available/20 text-table-available border-table-available/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'preparing': return <AlertTriangle className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300 ease-in-out animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange" />
              <h4 className="font-semibold text-sm font-montserrat text-card-foreground">{notification.title}</h4>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-roboto">{notification.description}</p>
            <p className="text-xs text-muted-foreground/70 mt-2 font-roboto">{notification.timestamp}</p>
          </div>
        ))}
      </div>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy font-montserrat">Chef Panel</h1>
            <p className="text-muted-foreground mt-1 font-roboto">Manage kitchen orders</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground font-roboto">
              {activeOrders.length} Active Orders
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-table-service/20 text-table-service rounded-full text-xs font-medium font-roboto">
                <Clock className="h-3 w-3" />
                {activeOrders.filter(o => o.status === 'pending').length} Pending
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange/20 text-orange rounded-full text-xs font-medium font-roboto">
                <AlertTriangle className="h-3 w-3" />
                {activeOrders.filter(o => o.status === 'preparing').length} Preparing
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-table-available/20 text-table-available rounded-full text-xs font-medium font-roboto">
                <CheckCircle className="h-3 w-3" />
                {activeOrders.filter(o => o.status === 'ready').length} Ready
              </span>
            </div>
          </div>
        </div>

        {/* Table Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ordersByTable.map(({ tableId, orders: tableOrders }) => {
            const totalItems = tableOrders.reduce((sum, order) => 
              sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            );
            const totalAmount = tableOrders.reduce((sum, order) => sum + order.total, 0);
            const hasNewOrders = tableOrders.some(order => order.status === 'pending');
            
            return (
              <div 
                key={tableId}
                className={`bg-card rounded-lg shadow-md border-2 cursor-pointer transition-all hover:shadow-lg animate-fade-in ${
                  hasNewOrders ? 'border-orange shadow-orange/20' : 'border-border'
                } ${selectedOrder && tableOrders.some(o => o.id === selectedOrder) ? 'ring-2 ring-orange' : ''}`}
              >
                <div className="p-4 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-navy font-montserrat">Table {tableId}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-roboto">{totalItems} items</span>
                      </div>
                    </div>
                    {hasNewOrders && (
                      <span className="inline-flex items-center px-2 py-1 bg-orange text-white rounded-full text-xs font-medium font-roboto">
                        New
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-table-available" />
                      <span className="font-semibold font-montserrat text-foreground">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-roboto">
                      {new Date(tableOrders[0].createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {/* Order Status Summary */}
                  <div className="space-y-2">
                    {tableOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border font-roboto ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <span className="text-sm font-roboto text-foreground">#{order.id.slice(-4)}</span>
                        </div>
                        <button
                          className="px-3 py-1 text-xs border border-border rounded hover:bg-muted/50 transition-colors font-roboto text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(selectedOrder === order.id ? null : order.id);
                          }}
                        >
                          {selectedOrder === order.id ? 'Hide' : 'View'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          
          {ordersByTable.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2 font-montserrat">No Active Orders</h3>
              <p className="font-roboto">Orders will appear here when customers place them</p>
            </div>
          )}
        </div>

        {/* Selected Order Details */}
        {selectedOrder && (
          <div className="bg-card rounded-lg shadow-md border-2 border-orange animate-fade-in">
            <div className="p-4 border-b border-border">
              <h3 className="text-xl font-bold font-montserrat text-navy">Order Details - #{selectedOrder.slice(-4)}</h3>
            </div>
            <div className="p-4">
              {(() => {
                const order = orders.find(o => o.id === selectedOrder);
                if (!order) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 font-montserrat text-foreground">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <div>
                                <div className="font-medium font-roboto text-foreground">{item.name}</div>
                                <div className="text-sm text-muted-foreground font-roboto">Qty: {item.quantity}</div>
                                {item.specialInstructions && (
                                  <div className="text-sm text-orange italic font-roboto">
                                    Note: {item.specialInstructions}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-medium font-montserrat text-foreground">${(item.price * item.quantity).toFixed(2)}</div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-roboto ${getStatusColor(item.status)}`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 font-montserrat text-foreground">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-roboto text-muted-foreground">Table:</span>
                            <span className="font-roboto text-foreground">Table {order.tableId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-roboto text-muted-foreground">Order Time:</span>
                            <span className="font-roboto text-foreground">{new Date(order.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-roboto text-muted-foreground">Status:</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-roboto ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold border-t border-border pt-2">
                            <span className="font-montserrat text-foreground">Total:</span>
                            <span className="font-montserrat text-foreground">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleOrderReceived(order.id)}
                          className="px-4 py-2 bg-navy text-white rounded hover:bg-navy/90 transition-colors font-roboto"
                        >
                          Order Received by Chef
                        </button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleOrderOut(order.id)}
                          className="px-4 py-2 bg-table-available text-white rounded hover:bg-table-available/90 transition-colors font-roboto"
                        >
                          Order Out to Table
                        </button>
                      )}
                      
                      {order.status === 'ready' && (
                        <span className="inline-flex items-center px-3 py-2 bg-table-available/20 text-table-available rounded border border-table-available/30 font-roboto">
                          Order Ready for Pickup
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefPanel;