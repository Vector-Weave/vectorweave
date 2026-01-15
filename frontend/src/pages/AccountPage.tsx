import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getUser } from "../lib/auth";

export default function AccountPage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information</p>
          </div>

          <div className="space-y-6">
            {/* Account Information */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Account Information</CardTitle>
                <CardDescription className="text-gray-600">Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <p className="text-gray-900 mt-1">{user?.user_metadata?.first_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <p className="text-gray-900 mt-1">{user?.user_metadata?.last_name || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 mt-1">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">User ID</label>
                  <p className="text-gray-900 mt-1 font-mono text-xs">{user?.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Member Since</label>
                  <p className="text-gray-900 mt-1">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Security</CardTitle>
                <CardDescription className="text-gray-600">Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-gray-300 text-gray-700">
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Preferences</CardTitle>
                <CardDescription className="text-gray-600">Customize your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Preferences settings coming soon</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
