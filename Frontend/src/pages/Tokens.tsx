import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import TokenCard from "../components/TokenCard";
import { Clock, CheckCircle2, Coffee } from "lucide-react";

interface Order {
  tokenNumber: number;
  userName: string;
  orderItems: string[];
  status: "completed" | "pending";
  createdAt: string;
}
//const restaurantId = "68dbf720876cfd9ab51b9f6b"; // Replace with actual restaurant ID
const restaurantId = localStorage.getItem("restaurantId") || "";
const Tokens: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/orders/${restaurantId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const handleMarkAsDone = async (tokenNumber: number) => {
    try {
      await fetch(`/orders/${restaurantId}/${tokenNumber}/complete`, {
        method: "POST",
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.tokenNumber === tokenNumber
            ? { ...order, status: "done" as const }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to mark order as done:", error);
    }
  };

  const activeOrders = orders.filter((order) => order.status === "completed");
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return (
      order.status === "done" &&
      orderDate.toDateString() === today.toDateString()
    );
  });

  return (
    <div className="container mx-auto p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Coffee className="w-8 h-8 text-orange" />
        <h1 className="text-3xl font-bold text-navy font-montserrat">Tokens</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-orange/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Orders
                </p>
                <p className="text-2xl font-bold text-navy">
                  {activeOrders.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed Today
                </p>
                <p className="text-2xl font-bold text-navy">
                  {todayOrders.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-navy/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-navy" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-navy">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-orange data-[state=active]:text-white"
          >
            <Clock className="w-4 h-4 mr-2" />
            Active Orders
            {activeOrders.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-white/20 text-white"
              >
                {activeOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-navy data-[state=active]:text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Today's Orders
            {todayOrders.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-white/20 text-white"
              >
                {todayOrders.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Active Orders Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy">
                <Clock className="w-5 h-5 text-orange" />
                Active Orders
                <Badge
                  variant="outline"
                  className="bg-orange/10 text-orange border-orange/20"
                >
                  {activeOrders.length} pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeOrders.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium text-muted-foreground">
                    No active orders
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All orders have been completed!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeOrders
                    .sort((a, b) => a.tokenNumber - b.tokenNumber)
                    .map((order) => (
                      <TokenCard
                        key={order.tokenNumber}
                        order={order}
                        onMarkAsDone={handleMarkAsDone}
                        showAction={true}
                      />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Orders Tab */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Today's Completed Orders
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  {todayOrders.length} completed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Coffee className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium text-muted-foreground">
                    No completed orders today
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Completed orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todayOrders
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((order) => (
                      <TokenCard
                        key={order.tokenNumber}
                        order={order}
                        showAction={false}
                      />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tokens;
