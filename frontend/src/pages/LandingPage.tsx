import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">  {/* className to push footer to bottom of page */}
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12" aria-label="Main">
        <section className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 flex flex-col justify-center items-start p-4">
            <h1 className="text-5xl font-extrabold mb-4">Clone Anything</h1>
            <p className="text-lg mb-6">
              You design it. We build it. Multi-insert cloning, multi-site
              mutagenesis, and custom plasmid backbones, all delivered in days.
              Send your DNA and we’ll do the rest.
            </p>
            <div>
              <Link to="/order">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 p-4">
            {/* Placeholder visual — replace with an illustrative SVG or optimized image */}
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">
                Preview image / hero illustration
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
