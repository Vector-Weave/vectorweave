import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
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
      <div className="space-x-2">
        <Link to="/auth">
          <Button>Sign In</Button>
        </Link>
        <Link to="/order">
          <Button>Order Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
