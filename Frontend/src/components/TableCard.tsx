import { Utensils, QrCode, Trash2, CookingPot, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useTableContext } from '@/contexts/TableContext';
import { toast } from '@/hooks/use-toast';

type TableStatus = 'available' | 'occupied' | 'service';

interface TableCardProps {
  tableNumber: number;
  status: TableStatus;
  orderItems?: number;
  timeElapsed?: string;
  className?: string;
  onViewOrder?: () => void;
  onGenerateQR?: () => void;
  onToggleAvailability?: (available: boolean) => void;
  onDelete?: () => void;
  orderStatus?: 'cooking' | 'served'; // New prop for order status
  isOccupied: boolean; // Tracks if the table is occupied
}

const statusToLabel: Record<TableStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  service: 'In Service',
};

const statusToColor: Record<TableStatus, string> = {
  available: 'bg-green-500',
  occupied: 'bg-yellow-500',
  service: 'bg-blue-500',
};

const TableCard = ({
  tableNumber,
  status,
  orderItems = 0,
  timeElapsed,
  className,
  onViewOrder,
  onGenerateQR,
  onToggleAvailability,
  onDelete,
  orderStatus,
  isOccupied,
}: TableCardProps) => {
  const { occupyTable, placeOrder, updateOrderStatus } = useTableContext();

  // Simulate QR code scanning
  const handleScanQR = () => {
    occupyTable(tableNumber);
    toast({
      title: 'QR Code Scanned',
      description: `Table ${tableNumber} is now occupied.`,
    });
  };

  // Simulate placing an order
  const handlePlaceOrder = () => {
    placeOrder(tableNumber);
    toast({
      title: 'Order Placed',
      description: `Order placed for Table ${tableNumber}.`,
    });
  };

  // Update order status (cooking -> served)
  const handleUpdateOrderStatus = (status: 'cooking' | 'served') => {
    updateOrderStatus(tableNumber, status);
    toast({
      title: `Order ${status}`,
      description: `Order for Table ${tableNumber} is now ${status}.`,
    });
  };

  return (
    <div
      className={cn(
        'rounded-xl shadow-sm overflow-hidden border border-gray-100',
        statusToColor[status], // Dynamic background color based on status
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Table {tableNumber}</h3>
          <span className="text-white">{statusToLabel[status]}</span>
        </div>
      </div>

      {/* Details Section */}
      {status !== 'available' && (
        <div className="p-4 bg-white">
          <div className="flex justify-between mb-3">
            <span className="text-gray-500 text-sm">Order Items:</span>
            <span className="font-medium">{orderItems}</span>
          </div>
          {timeElapsed && (
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Time:</span>
              <span className="font-medium">{timeElapsed}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions Section */}
      <div className="p-4 bg-gray-50 flex flex-col gap-3">
        <div className="flex gap-2">
          {/* View Order Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onViewOrder}
            className="flex-1 flex items-center gap-1"
            disabled={status === 'available'}
          >
            <Utensils size={14} />
            <span>View Order</span>
          </Button>

          {/* Generate QR Code Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateQR}
            className="flex items-center gap-1"
          >
            <QrCode size={14} />
          </Button>
        </div>

        <div className="flex justify-between items-center">
          {/* Availability Toggle */}
          {onToggleAvailability && (
            <div className="flex items-center gap-2">
              <Switch
                checked={status === 'available'}
                onCheckedChange={(checked) => onToggleAvailability(checked)}
                disabled={status === 'service'}
              />
              <span className="text-xs text-gray-500">Available</span>
            </div>
          )}

          {/* Delete Table Button */}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 size={15} />
            </Button>
          )}
        </div>

        {/* QR Code Scan Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleScanQR}
          disabled={isOccupied}
        >
          Scan QR Code
        </Button>

        {/* Place Order Button */}
        {isOccupied && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePlaceOrder}
            disabled={!!orderStatus}
          >
            Place Order
          </Button>
        )}

        {/* Order Status Buttons */}
        {orderStatus === 'cooking' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleUpdateOrderStatus('served')}
          >
            <CheckCircle size={14} className="mr-2" />
            Mark as Served
          </Button>
        )}

        {/* Order Status Icon */}
        {orderStatus && (
          <div className="flex items-center gap-2">
            {orderStatus === 'cooking' && (
              <CookingPot size={16} className="text-orange-500" />
            )}
            {orderStatus === 'served' && (
              <CheckCircle size={16} className="text-green-500" />
            )}
            <span>{orderStatus === 'cooking' ? 'Cooking' : 'Served'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableCard;