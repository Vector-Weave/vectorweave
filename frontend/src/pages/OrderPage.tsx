import Header from "../components/Header";
import Footer from "../components/Footer";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react";
import { MULTI_INSERT_PRCIING } from "@/config/pricing";
import React, { useState, useEffect, Component } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

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
    showBackbone: true,
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

const options = {
  animationEnabled: true,
  theme: "dark3",
  backgroundColor: "#7dd3fc",
  data: [{
    type: "doughnut",
    showInLegend: false,
    yValueFormatString: "#,###'%'",
    dataPoints: [
      { y: 5 },
      { y: 31 },
      { y: 40 },
      { y: 17 },
      { y: 7 }
    ]
  }]
}

const { CanvasJSChart } = CanvasJSReact;

const OrderPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<0 | 1 | 2 | null>(0);
  const [showBackboneCard, setShowBackboneCard] = useState(false);
  const [newBackboneName, setNewBackboneName] = useState("");
  const [newBackboneSequence, setNewBackboneSequence] = useState("");
  const [backboneUploadError, setBackboneUploadError] = useState("");
  const [fragments, setFragments] = useState<string[]>(Array(buildConfigs[0].fragments).fill(""));
  const [plasmidName, setPlasmidName] = useState("");
  const [plasmidError, setPlasmidError] = useState("");
  const [fragmentErrors, setFragmentErrors] = useState<string[]>([]);
  const [submissionError, setSubmissionError] = useState("");
  const [dnaTypes, setDnaTypes] = useState<string[]>(Array(buildConfigs[0].fragments).fill(""));
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [selectedBackbone, setSelectedBackbone] = useState<string | null>(null);
  const [backboneSelectedError, setBackboneSelectedError] = useState("");
  //dummy variable for now - will change when connected to backend
  const [loggedIn, setLoggedIn] = useState(false);
  const config = selectedOption !== null ? buildConfigs[selectedOption] : null;
  const backbonePercentageMap: Record<number, number> = {
    1: 77,
    2: 75,
    3: 67,
    4: 59,
    5: 48,
  };
  //multi-site mutagenesis
  const MAX_MUTATIONS = 4;
  const [mutations, setMutations] = useState<string[]>(Array(MAX_MUTATIONS).fill(""));
  const [mutationErrors, setMutationErrors] = useState<string[]>(Array(MAX_MUTATIONS).fill(""));
  const mutationRegex = /^[ACGTacgt0-9]*$/;
  const [mutationSubmitError, setMutationSubmitError] = useState("");


  type Backbone = {
    name: string;
    sequence: string;
  }
  const [backbones, setBackbones] = useState<Backbone[]>([]);

  const computeChartOptions = () => {
    const dnaRegex = /^[ACGTacgt]+$/;
    const nonEmptyFragments = fragments
      .map(f => f.trim())
      .filter(f => f !== "" && dnaRegex.test(f));

    const fragmentCount = nonEmptyFragments.length;

    //return null if not enough data
    if (fragmentCount < 1 || !selectedBackbone)
      return null;

    const backbonePercent = backbonePercentageMap[fragmentCount];

    const totalLength = nonEmptyFragments.reduce((sum, f) => sum + f.length, 0);

    const remaining = 100 - backbonePercent;

    //build data points array
    const dataPoints: { y: number; label?: string }[] = [];

    //backbone slice
    dataPoints.push({ y: backbonePercent });

    //fragment slices
    if (fragmentCount === 1)
      dataPoints.push({ y: remaining });
    else {
      nonEmptyFragments.forEach(frag => {
        const ratio = frag.length / totalLength;
        dataPoints.push({ y: ratio * remaining });
      });
    }
    // Create a separate array of labels for tooltip only
    const labels = ["Backbone", ...nonEmptyFragments.map((_, i) => `Fragment ${i + 1}`)];

    const dataPointsWithTooltip = dataPoints.map((dp, i) => ({
      ...dp,
      toolTipContent: `${labels[i]}: ${dp.y.toFixed(1)}%`,
    }));

    return {
      animationEnabled: true,
      theme: "dark3",
      backgroundColor: "#7dd3fc",
      data: [
        {
          type: "doughnut",
          showInLegend: false,
          indexLabel: "",
          toolTipContent: "{label}: {y}",
          yValueFormatString: "#,###'%'",
          dataPoints: dataPointsWithTooltip,
        },
      ],
    };

  };

  const isValidDNA = (seq: string) => /^[ACGTacgt]+$/.test(seq);

  const computeGCPercent = (seq: string) => {
    const gcCount = seq.match(/[GCgc]/g)?.length ?? 0;
    return (gcCount / seq.length) * 100;
  }

  const computeMultiInsertPrice = () => {
    //must select backbone
    if (!selectedBackbone) return null;

    const validFragments = fragments.map((f, i) => ({ seq: f.trim(), index: i }))
      .filter(f => f.seq !== "" && isValidDNA(f.seq));
    //if no valid fragments, return
    if (validFragments.length < 1) return null;

    const fragmentPricing: {
      index: number;
      price: number;
      surcharges: number;
    }[] = [];

    let total = MULTI_INSERT_PRCIING.BASE_PRICE;

    validFragments.forEach((frag, idx) => {
      let price = 0;
      let surcharges = 0;

      //first frag included in base price
      if (idx > 0) {
        price += MULTI_INSERT_PRCIING.ADDITIONAL_FRAGMENT_PRICE;
        total += MULTI_INSERT_PRCIING.ADDITIONAL_FRAGMENT_PRICE;
      }

      const gc = computeGCPercent(frag.seq);

      if (gc > MULTI_INSERT_PRCIING.GC_THRESHOLD_PERCENT)
        surcharges += MULTI_INSERT_PRCIING.SURCHARGE_PRICE;
      if (frag.seq.length > MULTI_INSERT_PRCIING.LENGTH_THRESHOLD_BP)
        surcharges += MULTI_INSERT_PRCIING.SURCHARGE_PRICE;

      total += surcharges;

      fragmentPricing.push({
        index: frag.index,
        price,
        surcharges,
      });
    });

    return {
      backbonePrice: MULTI_INSERT_PRCIING.BASE_PRICE,
      fragments: fragmentPricing,
      total
    };
  };

  const validatePlasmidName = (name: string) => {
    let error = "";
    if (name.trim() === "") {
      error = "Plasmid name is required.";
    }
    else if (name.length > 50) {
      error = "Plasmid name must be 50 characters or less.";
    }
    else if (!/^[a-zA-Z0-9]+$/.test(name)) {
      error = "Plasmid name can only contain letters and numbers.";
    }
    setPlasmidError(error);
    return (error === "");
  };

  const validateFragments = () => {
    const errors: string[] = Array(fragments.length).fill("");
    const dnaRegex = /^[ACGTacgt]+$/;

    fragments.forEach((frag, i) => {
      const trimmed = frag.trim();
      if (trimmed === "") {
        if (selectedOption === 0 && dnaTypes[i]?.trim())
          errors[i] = "Please enter a corresponding fragment sequence.";
        else
          return;
      }
      else if (!dnaRegex.test(trimmed)) {
        errors[i] = "Fragment can only contain A, C, G, or T.";
        return;
      }
      else if (selectedOption === 0 && (!dnaTypes[i] || dnaTypes[i] === "")) {
        errors[i] = "Please select a DNA type.";
      }
    });
    setFragmentErrors(errors);
    //return true if any fragment error exists
    return errors.some((e) => e !== "");
  };

  const validateBackbone = (name: string, sequence: string) => {
    let error = "";
    // Validate backbone name
    if (!name.trim())
      error = "Backbone name is required.";
    else if (name.length > 100)
      error = "Backbone name must be 100 characters or less.";
    else if (!/^[a-zA-Z0-9]+$/.test(name))
      error = "Backbone name can only contain letters and numbers.";

    // Validate sequence
    else if (!sequence.trim())
      error = "Backbone sequence is required.";
    else if (!/^[ACGTacgt]+$/.test(sequence))
      error = "Backbone sequence can only contain DNA bases (A, C, G, T).";

    setBackboneUploadError(error);

    // Return true if an error exists
    return error !== ""
  }

  const backboneSelected = () => {
    let error = ""
    if (selectedBackbone === "" || selectedBackbone === null)
      error = "Select or upload a backbone."
    setBackboneSelectedError(error);
  }

  const validateOrder = () => {
    let error = "";
    if (selectedOption === 0 && !fragments.some(frag => frag.trim() !== "")) {
      error = "Enter at least one fragment.";
    }
    setSubmissionError(error);

    //return true if an error exists
    return (error !== "");
  }

  const validateMutations = () => {
    if (selectedOption !== 1) {
      setMutationSubmitError("");
      return false;
    }

    const backboneLength = getBackboneLength();
    if (!backboneLength) {
      setMutationSubmitError("A backbone must be selected to validate mutations.");
      return true;
    }

    // Valid base substitutions
    const validPairs: Record<string, string> = {
      A: "T",
      T: "A",
      C: "G",
      G: "C",
    };

    for (let i = 0; i < mutations.length; i++) {
      const mut = mutations[i].trim();
      if (!mut) continue;

      // Strict format: Base + number + Base
      const match = mut.match(/^([ACGTacgt])(\d+)([ACGTacgt])$/);
      if (!match) {
        setMutationSubmitError(
          `Mutation ${i + 1} must be in the format A123T (A, C, G, T only).`
        );
        return true;
      }

      const fromBase = match[1].toUpperCase();
      const position = parseInt(match[2], 10);
      const toBase = match[3].toUpperCase();

      //Base-pair validity
      if (validPairs[fromBase] !== toBase) {
        setMutationSubmitError(
          `Mutation ${i + 1} is invalid: ${fromBase} can only mutate to ${validPairs[fromBase]}.`
        );
        return true;
      }

      //Position bounds
      if (position < 1 || position > backboneLength) {
        setMutationSubmitError(
          `Mutation ${i + 1} position ${position} is outside the backbone length (${backboneLength} bp).`
        );
        return true;
      }
    }

    setMutationSubmitError("");
    return false;
  }

  const handleSubmit = () => {
    const plasmidErr = !validatePlasmidName(plasmidName);
    const hasFragmentErrors = validateFragments();
    const hasOrderErrors = validateOrder();
    const backboneErr = backboneSelected();
    const hasMutationErrors = validateMutations();

    if (plasmidErr || hasFragmentErrors || hasOrderErrors || backboneErr || hasMutationErrors) {
      return false;
    }

    return true;
  }

  const getBackboneSize = (): string => {
    const bb = backbones.find(b => b.name === selectedBackbone);
    if (!bb) return "";
    return `${bb.sequence.length} bp`;
  }
  const getBackboneLength = (): number => {
    const bb = backbones.find(b => b.name === selectedBackbone);
    if (!bb) return 0;
    return bb.sequence.length;
  }

  useEffect(() => {

    if (loggedIn) {
      setBackbones([
        { name: "puc", sequence: "ACGTACGTACGTACGT" },
        { name: "pcdna", sequence: "ACGTACGTAAAAACCCCCGGGGGTTTTT" }
      ]);
    }
    else {
      setBackbones([]);
      setSelectedBackbone(null);
    }

  }, [loggedIn]);

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
                    if (i !== selectedOption) {
                      setSelectedOption(i as 0 | 1 | 2);
                      const initialCount = buildConfigs[i as 0 | 1 | 2].fragments;
                      setFragments(Array(initialCount).fill(""));

                      //only add dna type for multi insert
                      if (i === 0) {
                        setDnaTypes(Array(initialCount).fill(""));
                      }
                      else if (i == 1) {
                        setMutations(Array(MAX_MUTATIONS).fill(""));
                        setMutationErrors(Array(MAX_MUTATIONS).fill(""));
                      }
                      else {
                        setDnaTypes([]);
                      }
                      //re-set plasmid name, backbone, and fragments
                      setPlasmidName("");
                      setSelectedBackbone(null);
                      setDnaTypes([]);
                      //re-set errors
                      setFragmentErrors([]);
                      setPlasmidError("");
                      setSubmissionError("");
                      setBackboneSelectedError("");
                      setBackboneUploadError("");
                      setMutationSubmitError("");
                      setMutationErrors([]);
                    }

                  }}
                  className={`w-40 h-40 py-2 px-2 rounded-[30px] transform transition-all duration-300 overflow-hidden flex flex-col cursor-pointer
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
                        validatePlasmidName(value);
                      }}
                      onBlur={() => {
                        validatePlasmidName(plasmidName);
                      }}
                      className={`bg-sky-100 border-sky-400 focus-visible:ring-sky-500 focus-visible:border-sky-500 ${plasmidError ? "border-red-500" : ""}`}
                      required
                    />
                    {plasmidError && <p className="text-red-500 text-sm">{plasmidError}</p>}
                  </div>

                  <div className="grid gap-2">
                    {config?.showBackbone && (
                      <div className="grid gap-2">
                        <Label>Vector Backbone</Label>
                        {/* Message for when user is logged out */}
                        {!loggedIn && (
                          <p className="text-sm text-sky-800">
                            <button
                              type="button"
                              onClick={() => setShowLoginCard(true)}
                              className="font-semibold underline hover:text-sky-600"
                            >
                              Log in
                            </button>{" "}
                            to view your previously used backbones
                          </p>
                        )}
                        <Select
                          value={selectedBackbone || ""}
                          onValueChange={(val) => {
                            setSelectedBackbone(val);
                            setBackboneSelectedError("");
                          }}
                        >
                          <SelectTrigger className={`w-[180px] bg-sky-100 border-sky-400 focus-visible:ring-sky-500 focus-visible:border-sky-500 ${backboneSelectedError ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select a backbone" />
                          </SelectTrigger>
                          <SelectContent>
                            {backbones.map((b, i) => (
                              <SelectItem key={i} value={b.name}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setBackboneSelectedError("");
                            setShowBackboneCard(true);
                          }}
                          className="inline-block text-sm underline-offset-4 hover:underline"
                        >
                          + Upload a new backbone
                        </a>

                        {backboneSelectedError && <p className="text-red-500 text-sm">{backboneSelectedError}</p>}

                        {/* Pop-up card */}
                        {showBackboneCard && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <Card className="w-full max-w-sm">
                              <CardHeader>
                                <CardTitle>Add New Backbone</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid gap-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor="newBackboneName">Backbone Name</Label>
                                    <Input
                                      id="newBackboneName"
                                      placeholder="Enter backbone name"
                                      value={newBackboneName}
                                      onChange={(e) => setNewBackboneName(e.target.value)}
                                      className="bg-sky-100 border-sky-400"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="newBackboneSequence">Backbone Sequence</Label>
                                    <Input
                                      id="newBackboneSequence"
                                      placeholder="Enter backbone sequence"
                                      value={newBackboneSequence}
                                      onChange={(e) => setNewBackboneSequence(e.target.value)}
                                      className="bg-sky-100 border-sky-400"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    {backboneUploadError && <p className="text-red-500 text-sm">{backboneUploadError}</p>}
                                  </div>
                                </div>

                              </CardContent>
                              <CardFooter className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowBackboneCard(false);
                                    setNewBackboneName("");
                                    setNewBackboneSequence("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    if (validateBackbone(newBackboneName, newBackboneSequence)) {
                                      return;
                                    }
                                    // Add new backbone to state and select it
                                    setBackbones((prev) => [...prev, { name: newBackboneName, sequence: newBackboneSequence }]);
                                    setSelectedBackbone(newBackboneName);
                                    setShowBackboneCard(false);
                                    // Clear inputs and close modal
                                    setNewBackboneName("");
                                    setNewBackboneSequence("");
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
                      {selectedOption === 0 && (
                        <>
                          {config &&
                            fragments.map((value, i) => (
                              <div key={i} className="grid gap-2">
                                <Label>Fragment {i + 1}</Label>

                                <div className="flex items-center gap-2">
                                  <Input
                                    placeholder="Enter a sequence"
                                    value={value}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const nextFragments = [...fragments];
                                      nextFragments[i] = value;
                                      setFragments(nextFragments);

                                      // Validate the current fragment
                                      const dnaRegex = /^[ACGTacgt]*$/; // allow empty while typing
                                      const error = value.trim() !== "" && !dnaRegex.test(value)
                                        ? "Fragment can only contain A, C, G, or T."
                                        : "";

                                      const nextErrors = [...fragmentErrors];
                                      nextErrors[i] = error;
                                      setFragmentErrors(nextErrors);
                                    }}
                                    className={`bg-sky-100 border-sky-400 ${fragmentErrors[i] ? "border-red-500" : ""}`}
                                  />


                                  {/* DNA type dropdown — only for Multi-insert */}
                                  {selectedOption === 0 && (
                                    <Select
                                      value={dnaTypes[i] || ""}
                                      onValueChange={(val) => {
                                        const nextTypes = [...dnaTypes];
                                        nextTypes[i] = val;
                                        setDnaTypes(nextTypes);

                                        setFragmentErrors((prev) => {
                                          const nextErrors = [...prev];
                                          nextErrors[i] = "";
                                          return nextErrors;
                                        });
                                      }}
                                    >
                                      <SelectTrigger className={`w-[150px] bg-sky-100 border-sky-400 ${fragmentErrors[i] ? "border-red-500" : ""}`}>
                                        <SelectValue placeholder="DNA type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="genomic">Genomic</SelectItem>
                                        <SelectItem value="synthetic">Synthetic</SelectItem>
                                        <SelectItem value="plasmid">Plasmid</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}

                                  {/* Trash icon — only if there is text or if a dna type is selected*/}
                                  {((value.trim() !== "") || (selectedOption === 0 && dnaTypes[i]?.trim())) && (
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
                                {fragmentErrors[i] && (
                                  <p className="text-red-500 text-sm">{fragmentErrors[i]}</p>
                                )}

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
                        </>
                      )}

                      {/* MUTAGENESIS (new mutation UI) */}
                      {selectedOption === 1 && (
                        <>
                          {mutations.map((value, i) => (
                            <div key={i} className="grid gap-2">
                              <Label>Mutation {i + 1}</Label>
                              <Input
                                placeholder="e.g. A123T"
                                value={value}
                                onChange={(e) => {
                                  const val = e.target.value;

                                  //update mutations
                                  setMutations((prev) => {
                                    const next = [...prev];
                                    next[i] = val;
                                    return next;
                                  });

                                  //validate mutations
                                  const error =
                                    val.trim() !== "" && !mutationRegex.test(val)
                                      ? "Mutation can only contain A, C, T, G, and numbers."
                                      : "";

                                  setMutationErrors((prev) => {
                                    const next = [...prev];
                                    next[i] = error;
                                    return next;
                                  });
                                }}
                                className={`bg-sky-100 border-sky-400 ${mutationErrors[i] ? "border-red-500" : ""}`}
                              />
                              {mutationErrors[i] && (<p className="text-red-500 text-sm">{mutationErrors[i]}</p>)}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                    {submissionError && <p className="text-red-500 text-sm">{submissionError}</p>}
                    {mutationSubmitError && (<p className="text-red-500 text-sm mt-2">{mutationSubmitError}</p>``)}
                  </div>
                </div>


              </div>

              {/* Right side */}
              <div className="w-1/2 flex flex-col gap-4">
                {/* Existing plasmid build box */}
                <div className="bg-sky-300 rounded-[20px] flex flex-col p-6 ">
                  <Label htmlFor="plasmid">Plasmid Build:</Label>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="mt-2 w-80 h-80 bg-sky-300 py-2 px-2 rounded-[30px] overflow-hidden flex flex-col">
                      <div className="flex items-center bg-sky-300 justify-center flex-1 min-h-0">
                        {(() => {
                          const dynamicOptions = computeChartOptions();
                          if (!dynamicOptions) {
                            return;
                          }
                          return <CanvasJSChart options={dynamicOptions} />;
                        })()}
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
                  {selectedOption === 0 && (() => {
                    const pricing = computeMultiInsertPrice();
                    if (!pricing) return null;

                    return (
                      <div className="grid grid-cols-3 gap-y-2 text-sm">
                        {/* Backbone row */}
                        <span>{selectedBackbone}</span>
                        <span className="text-center">{getBackboneSize()}</span>
                        <span className="text-right">
                          ${pricing.backbonePrice}
                        </span>

                        {/* Fragment rows */}
                        {pricing.fragments.map(({ index, price, surcharges }) => {
                          const seq = fragments[index].trim();
                          const totalFragmentPrice = price + surcharges;

                          return (
                            <React.Fragment key={index}>
                              <span>Fragment {index + 1}</span>
                              <span className="text-center">{seq.length} bp</span>
                              <span className="text-right">
                                {totalFragmentPrice === 0
                                  ? "Included"
                                  : `$${totalFragmentPrice}`}
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    );
                  })()}

                  <hr className="border-sky-900 my-2" />

                  {/* Total */}
                  {selectedOption === 0 && (() => {
                    const pricing = computeMultiInsertPrice();
                    if (!pricing) return null;
                    return (
                      <div className="flex justify-between font-semibold">
                        <span>
                          Total
                        </span>
                        <span>${pricing.total}</span>
                      </div>
                    );
                  })()}
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



        {showLoginCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Welcome to VectorWeave
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Sign In Form */}
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setLoggedIn(true);
                    setShowLoginCard(false);
                  }}
                >
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" required />
                  </div>

                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;
