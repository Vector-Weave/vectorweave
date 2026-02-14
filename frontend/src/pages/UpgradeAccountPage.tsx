import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { upgradeToManager } from "@/lib/manager";
import { getUser } from "@/lib/auth";

const UpgradeAccountPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [supabaseUserId, setSupabaseUserId] = useState("");

  const handleUpgradeCurrentUser = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const user = await getUser();
      if (!user) {
        setError("No user is currently logged in");
        setLoading(false);
        return;
      }

      const response = await upgradeToManager(user.id);
      setSuccess(`Successfully upgraded to manager! Manager ID: ${response.managerId}`);
      console.log("Upgrade response:", response);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upgrade account";
      setError(errorMsg);
      console.error("Upgrade error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeByUserId = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await upgradeToManager(supabaseUserId);
      setSuccess(`Successfully upgraded user to manager! Manager ID: ${response.managerId}`);
      console.log("Upgrade response:", response);
      setSupabaseUserId("");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upgrade account";
      setError(errorMsg);
      console.error("Upgrade error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Upgrade</h1>
            <p className="text-gray-600">
              Upgrade customer accounts to manager status
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Upgrade Current User */}
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Current Account</CardTitle>
              <CardDescription>
                Upgrade your own account to manager status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleUpgradeCurrentUser} 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Upgrading..." : "Upgrade My Account to Manager"}
              </Button>
            </CardContent>
          </Card>

          {/* Upgrade by Supabase User ID */}
          <Card>
            <CardHeader>
              <CardTitle>Upgrade by User ID</CardTitle>
              <CardDescription>
                Upgrade any user to manager by their Supabase user ID (admin function)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpgradeByUserId} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabaseUserId">Supabase User ID</Label>
                  <Input
                    id="supabaseUserId"
                    type="text"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={supabaseUserId}
                    onChange={(e) => setSupabaseUserId(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Find the user ID in the Supabase dashboard under Authentication → Users
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Upgrading..." : "Upgrade User to Manager"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded">
            <p className="font-semibold mb-2">Note:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Upgrading creates a Manager account while keeping the Customer account</li>
              <li>The user will have both Customer and Manager access</li>
              <li>This action cannot be undone from this interface</li>
              <li>In production, this should be protected by admin authentication</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpgradeAccountPage;
