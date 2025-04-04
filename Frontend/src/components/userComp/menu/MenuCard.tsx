import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
        <CardDescription className="text-gray-500 text-sm mb-2">{item.description}</CardDescription>
        <div className="flex items-center justify-between mt-2">
          <span className="text-orange-500 font-bold text-lg">₹{item.price}</span>
          {item.offer && <Badge variant="destructive">{item.offer}</Badge>}
        </div>
        <Button className="w-full mt-4" onClick={() => addToCart(item)}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
