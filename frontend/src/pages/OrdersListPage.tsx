import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getUser } from "../lib/auth";
import { Plus } from "lucide-react";

interface Order {
  id: string;
  date: string;
  status: "Pending" | "Completed" | "Processing";
  total: string;
  items: string;
}

export default function OrdersListPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await getUser();
      if (!userData) {
        navigate("/auth");
        return;
      }
      setUser(userData);
      // TODO: Fetch orders from backend
      // For now, using empty array
      setOrders([]);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 mt-1">View and manage your orders</p>
            </div>
            <Button 
              onClick={() => navigate("/order")}
              className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Order
            </Button>
          </div>

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <Button 
                    onClick={() => navigate("/order")}
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    Create Your First Order
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Items</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm text-gray-900 font-medium">#{order.id}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{order.date}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{order.items}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 font-medium text-right">{order.total}</td>
                          <td className="py-4 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {/* TODO: View order details */}}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
