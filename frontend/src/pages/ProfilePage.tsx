import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getUser } from "../lib/auth";
import Sidebar from "../components/Sidebar";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  const getUserName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.last_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
        : user.user_metadata.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {getUserName()}</p>
          </div>

          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">$0</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-600">Your recent orders and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">No recent activity</p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="flex gap-4">
                <Button onClick={() => navigate("/order")} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Create New Order
                </Button>
                <Button onClick={() => navigate("/orders")} variant="outline" className="border-gray-300 text-gray-700">
                  View All Orders
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
