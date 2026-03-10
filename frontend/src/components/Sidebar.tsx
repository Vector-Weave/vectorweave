import { useNavigate, useLocation } from "react-router-dom";
import { Package, User as UserIcon, LogOut, ShoppingCart, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { logout } from "../lib/auth";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { cartCount: cartItemCount } = useCart();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 p-6 flex flex-col min-h-screen transition-all duration-300`}>
      <div className="mb-8 flex items-center justify-between">
        {!isCollapsed && (
          <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity">
            <h2 className="text-xl font-bold text-gray-900">VectorWeave</h2>
          </button>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="space-y-2 flex-1">
        <button
          onClick={() => navigate("/profile")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive("/profile")
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Dashboard"
        >
          <Package className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </button>

        <button
          onClick={() => navigate("/orders")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive("/orders") || isActive("/order")
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Orders"
        >
          <ShoppingCart className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Orders</span>}
        </button>

        <button
          onClick={() => navigate("/cart")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive("/cart")
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 flex-shrink-0" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          {!isCollapsed && <span>Cart ({cartItemCount})</span>}
        </button>

        <button
          onClick={() => navigate("/account")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive("/account")
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Profile"
        >
          <UserIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Profile</span>}
        </button>
      </nav>

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Log out"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
