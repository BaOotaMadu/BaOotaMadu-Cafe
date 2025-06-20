import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  // Use the correct function names from the fixed cart hook
  const { updateItemQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      // Use removeItem instead of removeFromCart
      removeItem(item.id);
    } else {
      // Use updateItemQuantity instead of addToCart
      updateItemQuantity(item.id, newQuantity);
    }
  };

  // Handle increment
  const handleIncrement = () => {
    updateItemQuantity(item.id, item.quantity + 1);
  };

  // Handle decrement
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateItemQuantity(item.id, item.quantity - 1);
    } else {
      // Remove item when quantity becomes 0
      removeItem(item.id);
    }
  };

  const customizationText = item.customizations && item.customizations.length > 0
    ? item.customizations.map(c => `${c.name}: ${c.value}`).join(', ')
    : null;

  return (
    <div className="py-4 flex gap-3 border-b border-border">
      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 overflow-hidden">
            <h4 className="font-medium text-sm truncate">{item.name}</h4>
            {customizationText && (
              <p className="text-xs text-muted-foreground truncate">
                {customizationText}
              </p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={handleDecrement}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="text-sm w-4 text-center">{item.quantity}</span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;