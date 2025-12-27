import Header from "../components/Header";
import Footer from "../components/Footer";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const buildConfigs = {
  0: {
    title: "Multi-insert build",
    showBackbone: true,
    fragments: 3,
    image: "assets/1.png",
    rows: [
      { name: "Backbone (pUC)", size: "3.2 kb", price: 120 },
      { name: "Fragment 1", size: "500 bp", price: 45 },
      { name: "Fragment 2", size: "800 bp", price: 60 },
    ],
  },

  1: {
    title: "Mutagenesis build",
    showBackbone: false,
    fragments: 1,
    image: "assets/2.png",
    rows: [
      { name: "Template plasmid", size: "4.1 kb", price: 150 },
      { name: "Mutation", size: "-", price: 80 },
    ],
  },

  2: {
    title: "New backbone design",
    showBackbone: false,
    fragments: 0,
    image: "assets/3.png",
    rows: [
      { name: "Custom backbone", size: "5.0 kb", price: 300 },
    ],
  },

  3: {
    title: "Synthetic insert",
    showBackbone: true,
    fragments: 1,
    image: "assets/4.png",
    rows: [
      { name: "Insert A", size: "1.2 kb", price: 90 }
    ],
  },
} as const;

const OrderPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<0 | 1 | 2 | 3 | null>(null);

  const options = [
    { label: "Multi-insert", img: "assets/1.png" },
    { label: "Mutagenesis", img: "assets/2.png" },
    { label: "New backbones", img: "assets/3.png" },
    { label: "Synthetic insert", img: "assets/4.png" },
  ];

  const config = selectedOption !== null ? buildConfigs[selectedOption] : null;

  return (
    <div className="min-h-screen flex flex-col">  {/* className to push footer to bottom of page */}
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12" aria-label="Main">
        <h1 className="text-5xl font-extrabold mb-4">Get Started</h1>
        <hr className="my-6 border-gray-300" />


        <div className="flex flex-col items-center gap-2">
          {/* First blue box with 4 squares */}
          <div className="w-full h-60 bg-sky-200 rounded-[20px] flex flex-col px-8 py-4">

            {/* Text at top-left */}
            <p className="text-lg font-medium text-sky-900 mb-2">
              1. Choose your plasmid option:
            </p>

            {/* Inner squares container */}
            <div className="flex justify-between w-full px-80 ">
              {[
                "Multi-insert",
                "Mutagenesis",
                "New backbones",
                "Synthetic insert",
              ].map((label, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedOption(i as 0 | 1 | 2 | 3)}
                  className={`
                    w-40 h-40 py-2 px-2 rounded-[30px]
                    transform transition-all duration-300
                    overflow-hidden flex flex-col cursor-pointer

                    ${selectedOption === i
                      ? "bg-sky-400 ring-4 ring-sky-500 scale-105"
                      : "bg-sky-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"}
                  `}    >
                  {/* Top content */}
                  <div className="px-1 text-center">
                    <p className="text-sm font-semibold text-sky-900">{label}</p>
                    <hr className="border-sky-900 my-1" />
                  </div>

                  {/* Image filling remaining space */}
                  <div className="flex items-center justify-center flex-1 min-h-0">
                    <img
                      src={`assets/${i + 1}.png`}
                      alt={`Plasmid option ${i + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>



          </div>

          {/* Second blue box */}
          <div className="w-full h-160 bg-sky-200 rounded-[20px] flex-col flex px-8 py-4">
            {/* Top left text */}
            <p className="text-lg font-medium text-sky-900 mb-4">
              2. Build your plasmid:
            </p>

            {/* Left + right columns */}
            <div className="flex flex-1 gap-4">
              {/* Left column: vertical stack */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Component 1 */}
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Plasmid Name</Label>
                    <Input id="plasmidName" type="text" placeholder="Enter a plasmid name" required className="bg-sky-100  border-sky-400 focus-visible:ring-sky-500 focus-visible:border-sky-500 " />
                  </div>
                  <div className="grid gap-2">
                    {config?.showBackbone && (
                      <div className="grid gap-2">
                        <Label>Vector Backbone</Label>
                        <Select>
                          <SelectTrigger className="w-[180px] bg-sky-100 border-sky-400">
                            <SelectValue placeholder="Select a backbone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="puc">pUC</SelectItem>
                            <SelectItem value="pcdna">pcDNA</SelectItem>
                          </SelectContent>
                        </Select>
                        <a
                          href="#"
                          className=" inline-block text-sm underline-offset-4 hover:underline"
                        >
                          + Upload a new backbone
                        </a>
                      </div>
                    )}

                    <hr className="border-sky-900 my-4" />
                    <div className="grid gap-2">
                      {config &&
                        Array.from({ length: config.fragments }).map((_, i) => (
                          <div key={i} className="grid gap-2">
                            <Label>Fragment {i + 1}</Label>
                            <Input
                              placeholder="Enter a sequence"
                              className="bg-sky-100 border-sky-400"
                            />
                          </div>
                        ))}

                      {/* Add fragment link */}
                      <a
                        href="#"
                        className="inline-block text-sm underline-offset-4 hover:underline my-2"
                      >
                        + Add fragment
                      </a>
                    </div>


                  </div>
                </div>


              </div>

              {/* Right side */}
              <div className="w-1/2 bg-sky-300 rounded-[20px] flex flex-col p-6 ">
                {/* You can put text, image, or anything here */}
                <Label htmlFor="plasmid">Plasmid Build:</Label>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-80 h-80 bg-gray-50 py-2 px-2 rounded-[30px] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-center flex-1 min-h-0">
                      {config && (
                        <img
                          src={config.image}
                          alt={config.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* Table header */}
                <div className="grid grid-cols-3 w-full text-sm font-medium">
                  <span>Name</span>
                  <span className="text-center">Size</span>
                  <span className="text-right">Price</span>
                </div>

                <hr className="border-sky-900 my-2" />

                {/* Rows */}
                <div className="grid grid-cols-3 w-full text-sm gap-y-2">
                  <span>Backbone (pUC)</span>
                  <span className="text-center">3.2 kb</span>
                  <span className="text-right">$120</span>

                  <span>Fragment 1</span>
                  <span className="text-center">500 bp</span>
                  <span className="text-right">$45</span>

                  <span>Fragment 2</span>
                  <span className="text-center">800 bp</span>
                  <span className="text-right">$60</span>
                </div>

                <hr className="border-sky-900 my-2" />

                {/* Total */}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>$225</span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;
