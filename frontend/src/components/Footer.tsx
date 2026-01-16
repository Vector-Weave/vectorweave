import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  return (
      <footer className="bg-black text-gray-300 mt-32">
          <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
              <div>
                  <h3 className="text-white font-bold text-lg mb-4">EZVector</h3>
                  <p className="text-sm text-gray-400">Custom plasmid construction, mutagenesis, and synthetic cloning—built fast and built right.</p>
              </div>

              <div>
                  <h4 className="text-white font-semibold mb-3">Services</h4>
                  <ul className="space-y-2 text-sm">
                      <li><Link to="/services/multi-insert" className="hover:text-white">Multi-Insert Cloning</Link></li>
                      <li><Link to="/services/custom-backbone" className="hover:text-white">Custom Backbones</Link></li>
                      <li><Link to="/services/multi-site-mutagenesis" className="hover:text-white">Multi-Site Mutagenesis</Link></li>
                      <li><Link to="/services/synthetic-dna" className="hover:text-white">Synthetic DNA Cloning</Link></li>
                  </ul>
              </div>

              <div>
                  <h4 className="text-white font-semibold mb-3">Company</h4>
                  <ul className="space-y-2 text-sm">
                      <li><Link to="/about" className="hover:text-white">About</Link></li>
                      <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                      <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                      <li><Link to="/sample-prep" className="hover:text-white">Sample Prep</Link></li>
                  </ul>
              </div>

              <div>
                  <h4 className="text-white font-semibold mb-3">Get Started</h4>
                  <Link to="/order">
                    <Button variant="secondary" className="w-full">Start Cloning</Button>
                  </Link>
              </div>
          </div>

          <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} EZVector. All rights reserved.
          </div>
      </footer>
  );
};

export default Footer;
