import { Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image_url: string;
  className?: string;
  onToggleAvailability: (id: string, available: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// Use a reliable local or public fallback image
const DEFAULT_IMAGE = "/images/placeholder-menu.jpg";

const MenuItemCard = ({
  id,
  name,
  category,
  price,
  available,
  image_url,
  className,
  onToggleAvailability,
  onEdit,
  onDelete,
}: MenuItemCardProps) => {
  // Handle empty, undefined, or invalid image URLs
  const safeImage = !image_url || 
                    image_url.trim() === "" || 
                    image_url === "undefined" ||
                    image_url.startsWith("http://undefined") ||
                    image_url.startsWith("https://undefined")
    ? DEFAULT_IMAGE
    : image_url;

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300",
        !available && "opacity-50 bg-gray-50 border-gray-200",
        className
      )}
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={safeImage + `?t=${Date.now()}`}
          alt={name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-300",
            available ? "hover:scale-105" : "grayscale"
          )}
          onError={(e) => {
            console.warn(`Failed to load image for "${name}". Falling back to default.`, {
              original: image_url,
              used: safeImage,
            });
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
        />
        {!available && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white font-semibold text-lg bg-red-600 px-3 py-1 rounded-full">
              Not Available
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3
              className={cn(
                "font-semibold text-lg line-clamp-1",
                !available && "text-gray-500"
              )}
            >
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {available ? "Available" : "Unavailable"}
              </span>
              <span
                className={cn(
                  "text-xs uppercase",
                  available ? "text-gray-500" : "text-gray-400"
                )}
              >
                {category}
              </span>
            </div>
          </div>
          <span
            className={cn(
              "text-lg font-semibold",
              available ? "text-navy" : "text-gray-400"
            )}
          >
            ₹ {price.toFixed(2)}
          </span>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Switch
              checked={available}
              onCheckedChange={(checked) => onToggleAvailability(id, checked)}
            />
            <span
              className={cn(
                "text-sm font-medium",
                available ? "text-green-600" : "text-red-500"
              )}
            >
              {available ? "Available" : "Not Available"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;