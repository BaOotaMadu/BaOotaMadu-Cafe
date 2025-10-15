import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, Megaphone } from 'lucide-react';
import BillComp from './BillComp';
import Announce from './Announce';
const API_URL = "http://localhost:3001";
const restaurantId = localStorage.getItem("restaurantId");
import { toast } from 'react-hot-toast';
import axios from 'axios';
interface Order {
  tokenNumber: number;
  tableNumber: string;
  userName: string;
  orderItems?: string[];
  status: 'active' | 'done';
  createdAt: string;
}

interface TokenCardProps {
  order?: Order;
  onMarkAsDone?: (tokenNumber: number) => void;
  showAction?: boolean;
  token: number; // 👈 This is required
}

// ✅ Proper component definition — no broken default
const TokenCard = ({ 
  order, 
  onMarkAsDone, 
  showAction = false, 
  token // ✅ Now correctly destructured
}: TokenCardProps) => {
  const [isBillOpen, setIsBillOpen] = useState(false);

  if (!order) {
    return (
      <Card className="w-full border border-border bg-card">
        <CardContent className="p-4">
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No order data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleMarkAsDone = () => {
    onMarkAsDone?.(order.tokenNumber);
  };

  const handleViewBill = () => {
    setIsBillOpen(true); 
  };

 // Add this function inside TokenCard
const handleAnnounce = async () => {
  if (!order) return;

  try {
    // Call your backend to mark as completed (which triggers announcement)
    await axios.put(`${API_URL}/orders/${restaurantId}/${order._id}/status`, {
      status: "completed",
    });
    toast.success(`Announced token ${order.tokenNumber}`);
    onMarkAsDone?.(order.tokenNumber); // Optional: update local state
  } catch (err) {
    toast.error("Failed to announce order");
    console.error(err);
  }
};

  const items = Array.isArray(order.orderItems) ? order.orderItems : [];

  return (
    <>
      <BillComp
        open={isBillOpen}
        onClose={() => setIsBillOpen(false)}
        tokenNumber={order.tokenNumber}
      />

      <Card className="w-full hover:shadow-md transition-shadow duration-200 border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-navy">
                Token #{order.tokenNumber}
              </h3>
              {order.status === 'active' && (
                <Badge variant="secondary" className="bg-orange/10 text-orange border-orange/20">
                  <Clock className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
              {order.status === 'done' && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Done
                </Badge>
              )}
            </div>

            {/* Bill Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewBill}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
              aria-label="View bill"
            >
              <FileText className="h-4 w-4" />
            </Button>

            {/* Announce Button */}
           <Button
  variant="ghost"
  size="icon"
  onClick={handleAnnounce}
  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
  aria-label="Announce order"
>
  <Megaphone className="h-4 w-4" />
</Button>
          </div>

          <div className="mb-3">
            <p className="text-sm text-muted-foreground font-medium">Customer</p>
            <p className="text-lg font-semibold text-foreground">{order.userName || 'Unknown'}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground font-medium mb-2">Order Items</p>
            <div className="flex flex-wrap gap-1">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-muted/50">
                    {item}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-xs bg-muted/50">
                  No items
                </Badge>
              )}
            </div>
          </div>

          {showAction && order.status === 'active' && (
            <Button
              onClick={handleMarkAsDone}
              className="w-full bg-navy hover:bg-navy/90 text-white font-medium"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Done
            </Button>
          )}

          {order.status === 'done' && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Completed: {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TokenCard;