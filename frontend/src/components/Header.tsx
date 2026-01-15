import { Button } from "./ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getUser, logout } from "../lib/auth";
import { User, ChevronDown } from "lucide-react";

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOrderPage = location.pathname === "/order";

  useEffect(() => {
    const checkUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.last_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
        : user.user_metadata.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4">
      <Link to="/">
        <h1 className="text-2xl font-bold">VectorWeave</h1>
      </Link>

      <div>
        <nav className="space-x-4">
          <a href="/services" className="hover:underline">
            Services
          </a>
          <a href="/howto" className="hover:underline">
            How-to
          </a>
          <a href="/faq" className="hover:underline">
            FAQ
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{getUserName()}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/order");
                      setDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </button>
                  <div className="my-1 h-px bg-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
            {!isOrderPage && (
              <Link to="/order">
                <Button>Order Now</Button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
