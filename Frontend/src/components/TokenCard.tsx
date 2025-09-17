import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

interface Order {
  tokenNumber: number;
  userName: string;
  orderItems: string[];
  status: 'active' | 'done';
  createdAt: string;
}

interface TokenCardProps {
  order?: Order; // Made optional to handle undefined cases
  onMarkAsDone?: (tokenNumber: number) => void;
  showAction?: boolean;
}

const TokenCard: React.FC<TokenCardProps> = ({
  order,
  onMarkAsDone,
  showAction = false
}) => {
  // Early return if order is undefined or null
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
    if (onMarkAsDone && order?.tokenNumber) {
      onMarkAsDone(order.tokenNumber);
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200 border border-border bg-card">
      <CardContent className="p-4">
        {/* Token Number Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-navy">
              Token #{order.tokenNumber || 'N/A'}
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
        </div>

        {/* User Information */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground font-medium">Customer</p>
          <p className="text-lg font-semibold text-foreground">{order.userName || 'Unknown'}</p>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground font-medium mb-2">Order Items</p>
          <div className="flex flex-wrap gap-1">
            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-muted/50 hover:bg-muted"
                >
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

        {/* Action Button */}
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

        {/* Timestamp for completed orders */}
        {order.status === 'done' && order.createdAt && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Completed: {new Date(order.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenCard;