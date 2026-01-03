import Header from "../components/Header";
import Footer from "../components/Footer";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Button
} from "@/components/ui/button";



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
} as const;

const OrderPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<0 | 1 | 2 | null>(null);
  const [showBackboneCard, setShowBackboneCard] = useState(false);
  const [newBackbone, setNewBackbone] = useState("");
  const [fragments, setFragments] = useState<string[]>([]);
  const [plasmidName, setPlasmidName] = useState("");
  const [plasmidError, setPlasmidError] = useState("");
  const [dnaTypes, setDnaTypes] = useState<string[]>([]);

  const config = selectedOption !== null ? buildConfigs[selectedOption] : null;

  const validatePlasmidName = (name: string) => {
    if (name.trim() === "") {
      return "Plasmid name is required.";
    }
    if (name.length > 50) {
      return "Plasmid name must be 50 characters or less.";
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      return "Plasmid name can only contain letters and numbers.";
    }
    return "";
  };

  const validateFragments = () => {
    const dnaRegex = /^[ACGTacgt]+$/;

    for (let i = 0; i < fragments.length; i++) {
      const frag = fragments[i].trim();
      if (frag !== "" && !dnaRegex.test(frag)) {
        return `Fragment ${i + 1} can only contain valid DNA bases (A, C, G, T).`;
      }
    }
    if (selectedOption === 0) {
      for (let i = 0; i < fragments.length; i++) {
        if (fragments[i].trim() !== "" && (!dnaTypes[i] || dnaTypes[i] === "")) {
          return `Please select a DNA type for Fragment ${i + 1}.`;
        }
      }
    }
    return "";
  };

  const handleSubmit = () => {
    const plasmidErr = validatePlasmidName(plasmidName);
    const fragmentErr = validateFragments();

    if (plasmidErr) {
      setPlasmidError(plasmidErr);
      return false;
    }

    if (fragmentErr) {
      alert(fragmentErr);
      return false;
    }

    if(!fragments.some(frag => frag.trim() !== "")){
      alert( `Enter at least one fragment.`)
      return false;
    }

    return true;
  }

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
              ].map((label, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedOption(i as 0 | 1 | 2);
                    const initialCount = buildConfigs[i as 0 | 1 | 2].fragments;
                    setFragments(Array(initialCount).fill(""));
                    if (i === 0) {
                      setDnaTypes(Array(initialCount).fill(""));
                    } else {
                      setDnaTypes([]);
                    }
                  }}
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
          <div className="w-full bg-sky-200 rounded-[20px] flex-col flex px-8 py-4">
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
                    <Label htmlFor="plasmidName">Plasmid Name</Label>
                    <Input
                      id="plasmidName"
                      type="text"
                      placeholder="Enter a plasmid name"
                      value={plasmidName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPlasmidName(value);
                        setPlasmidError(validatePlasmidName(value));
                      }}
                      onBlur={() => {
                        setPlasmidError(validatePlasmidName(plasmidName));
                      }}
                      className={`bg-sky-100 border-sky-400 focus-visible:ring-sky-500 focus-visible:border-sky-500 ${plasmidError ? "border-red-500" : ""
                        }`}
                      required
                    />
                    {plasmidError && <p className="text-red-500 text-sm">{plasmidError}</p>}
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
                          onClick={(e) => {
                            e.preventDefault();
                            setShowBackboneCard(true);
                          }}
                          className="inline-block text-sm underline-offset-4 hover:underline"
                        >
                          + Upload a new backbone
                        </a>

                        {/* Pop-up card */}
                        {showBackboneCard && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <Card className="w-full max-w-sm">
                              <CardHeader>
                                <CardTitle>Add New Backbone</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid gap-2">
                                  <Label htmlFor="newBackbone">Backbone Name</Label>
                                  <Input
                                    id="newBackbone"
                                    placeholder="Enter backbone sequence"
                                    value={newBackbone}
                                    onChange={(e) => setNewBackbone(e.target.value)}
                                    className="bg-sky-100 border-sky-400"
                                  />
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowBackboneCard(false);
                                    setNewBackbone("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    // handle submission of new backbone here
                                    console.log("New backbone:", newBackbone);
                                    setShowBackboneCard(false);
                                    setNewBackbone("");
                                  }}
                                >
                                  Add
                                </Button>
                              </CardFooter>
                            </Card>
                          </div>
                        )}

                      </div>
                    )}

                    <hr className="border-sky-900 my-4" />
                    <div className="grid gap-2">
                      {config &&
                        fragments.map((value, i) => (
                          <div key={i} className="grid gap-2">
                            <Label>Fragment {i + 1}</Label>

                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Enter a sequence"
                                value={value}
                                onChange={(e) => {
                                  const next = [...fragments];
                                  next[i] = e.target.value;
                                  setFragments(next);
                                }}
                                className="bg-sky-100 border-sky-400"
                              />

                              {/* DNA type dropdown — only for Multi-insert */}
                              {selectedOption === 0 && (
                                <Select
                                  value={dnaTypes[i] || ""}
                                  onValueChange={(val) => {
                                    const nextTypes = [...dnaTypes];
                                    nextTypes[i] = val;
                                    setDnaTypes(nextTypes);
                                  }}
                                >
                                  <SelectTrigger className="w-[150px] bg-sky-100 border-sky-400">
                                    <SelectValue placeholder="DNA type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="genomic">Genomic</SelectItem>
                                    <SelectItem value="synthetic">Synthetic</SelectItem>
                                    <SelectItem value="plasmid">Plasmid</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}

                              {/* Trash icon — only if there is text */}
                              {value.trim() !== "" && (
                                <button
                                  type="button"
                                  aria-label={`Delete fragment ${i + 1}`}
                                  onClick={() => {
                                    setFragments((prev) => {
                                      const next = [...prev];

                                      // If fragment 4 or 5 → remove it
                                      if (i >= 3) {
                                        next.splice(i, 1);
                                      } else {
                                        // Otherwise just clear it
                                        next[i] = "";
                                      }

                                      return next;
                                    });

                                    // Also reset the DNA type at the same index
                                    setDnaTypes((prev) => {
                                      const nextTypes = [...prev];
                                      if (i >= 3) {
                                        // remove extra fragment type if removed
                                        nextTypes.splice(i, 1);
                                      } else {
                                        nextTypes[i] = "";
                                      }
                                      return nextTypes;
                                    });
                                  }}
                                  className="text-sky-700 hover:text-red-500 transition"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}


                      {/* Only show "Add fragment" if fragments > 1 & < */}
                      {config && config.fragments > 1 && fragments.length < 5 && (
                        <button
                          type="button"
                          onClick={() => setFragments((prev) => [...prev, ""])}
                          className="inline-block text-sm underline-offset-4 hover:underline my-2 text-left"
                        >
                          + Add fragment
                        </button>
                      )}
                    </div>


                  </div>
                </div>


              </div>

              {/* Right side */}
              <div className="w-1/2 flex flex-col gap-4">
                {/* Existing plasmid build box */}
                <div className="bg-sky-300 rounded-[20px] flex flex-col p-6 ">
                  <Label htmlFor="plasmid">Plasmid Build:</Label>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="mt-2 w-80 h-80 bg-gray-50 py-2 px-2 rounded-[30px] overflow-hidden flex flex-col">
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
                  <div className="grid grid-cols-3 w-full text-sm font-medium mt-2">
                    <span>Name</span>
                    <span className="text-center">Size</span>
                    <span className="text-right">Price</span>
                  </div>

                  <hr className="border-sky-900 my-2" />

                  {/* Rows */}
                  {config && (
                    <div className="grid grid-cols-3 gap-y-2 text-sm">
                      {config.rows.map((row, i) => (
                        <React.Fragment key={i}>
                          <span>{row.name}</span>
                          <span className="text-center">{row.size}</span>
                          <span className="text-right">${row.price}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  <hr className="border-sky-900 my-2" />

                  {/* Total */}
                  {config && (
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>
                        ${config.rows.reduce((sum, r) => sum + r.price, 0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Buttons below the box */}
                <div className="flex gap-4 justify-end mt-1">
                  <Button
                    onClick={() => {
                      if (!handleSubmit())
                        return;
                      console.log("Added to cart.");
                    }}
                    className="bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => {
                      if (!handleSubmit())
                        return;
                      console.log("Added to cart.");
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Proceed to Checkout
                  </Button>
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
