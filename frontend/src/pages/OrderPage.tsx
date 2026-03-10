import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react";
import { MULTI_INSERT_PRCIING, MULTI_MUTAGENESIS_PRICING, OWN_BACKBONE_PRICING } from "@/config/pricing";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getUser } from "@/lib/auth";
import { orderService } from "@/services/orderService";

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
    fragments: 1,
    image: "assets/1.png",
  },

  1: {
    title: "Mutagenesis build",
    showBackbone: true,
    fragments: 1,
    image: "assets/2.png",
  },

  2: {
    title: "New backbone design",
    showBackbone: false,
    fragments: 2,
    image: "assets/3.png",
  },
} as const;


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
  const [selectedBackbone, setSelectedBackbone] = useState<string | null>(null);
  const [backboneSelectedError, setBackboneSelectedError] = useState("");
  // const [viewingBackbone, setViewingBackbone] = useState<Backbone | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setLoggedIn(authenticated);
    };
    checkAuth();
  }, []);

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
  const [mutations, setMutations] = useState<string[]>([""]);
  const [mutationErrors, setMutationErrors] = useState<string[]>([""]);
  const mutationRegex = /^[ACGTacgt0-9]*$/;
  const mutationFormat = /^([ACGT])(\d+)([ACGT])$/i;
  const [mutationSubmitError, setMutationSubmitError] = useState("");


  type Backbone = {
    name: string;
    sequence: string;
  }
  const [backbones, setBackbones] = useState<Backbone[]>([]);

  const computeChartMultiInsert = () => {
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

  const computeChartNewBackbones = () => {
    const validFragments = fragments.map(f => f.trim()).filter(f => f !== "" && isValidDNA(f));
    if (validFragments.length === 0) return null;

    const totalLength = validFragments.reduce((sum, frag) => sum + frag.length, 0);

    const dataPoints = validFragments.map((frag, i) => ({
      y: (frag.length / totalLength) * 100,
      toolTipContent: `Fragment ${i + 1}: ${frag.length} bp (${(
        (frag.length / totalLength) *
        100
      ).toFixed(1)}%)`,
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
          yValueFormatString: "#,##0.0'%'",
          dataPoints,
        },
      ],
    };
  };

  const computeChartMutagenesis = () => {
    if (!selectedBackbone) return null;

    const backboneLength = getBackboneLength();
    if (!backboneLength) return null;

    // Get valid mutations in the correct format
    const validMutations = mutations
      .map((m, i) => ({ value: m.trim(), index: i }))
      .filter(m => m.value !== "" && mutationFormat.test(m.value))
      .map(m => {
        const match = m.value.match(/^([ACGTacgt])(\d+)([ACGTacgt])$/);
        return {
          position: parseInt(match![2], 10),
          label: m.value.toUpperCase(),
          originalIndex: m.index
        };
      })
      .sort((a, b) => a.position - b.position);

    if (validMutations.length === 0) {
      // Show entire backbone if no valid mutations
      return {
        animationEnabled: true,
        theme: "dark3",
        backgroundColor: "#7dd3fc",
        data: [
          {
            type: "doughnut",
            showInLegend: false,
            indexLabel: "",
            dataPoints: [
              {
                y: 100,
                color: "#0ea5e9", // Sky blue for backbone
                toolTipContent: `Backbone: ${backboneLength} bp`,
              },
            ],
          },
        ],
      };
    }

    // Create segments: backbone sections and mutation points
    const dataPoints: any[] = [];
    const mutationWidth = 1; // Percentage width for each mutation marker

    let currentPosition = 0;

    validMutations.forEach((mut, idx) => {
      // Calculate the percentage of backbone before this mutation
      const segmentLength = mut.position - currentPosition;
      const segmentPercent = (segmentLength / backboneLength) * 100;

      // Add backbone segment before mutation (if there's space)
      if (segmentPercent > mutationWidth) {
        dataPoints.push({
          y: segmentPercent - mutationWidth / 2,
          color: "#0ea5e9", // Sky blue for backbone
          toolTipContent: `Backbone: ${segmentLength} bp`,
        });
      }

      // Add mutation marker
      dataPoints.push({
        y: mutationWidth,
        color: getMutationColor(idx),
        toolTipContent: `Mutation ${mut.originalIndex + 1}: ${mut.label} (position ${mut.position})`,
      });

      currentPosition = mut.position;
    });
    // Add final backbone segment
    const finalSegmentLength = backboneLength - currentPosition;
    const finalSegmentPercent = (finalSegmentLength / backboneLength) * 100;

    if (finalSegmentPercent > 0) {
      dataPoints.push({
        y: finalSegmentPercent,
        color: "#0ea5e9", // Sky blue for backbone
        toolTipContent: `Backbone: ${finalSegmentLength} bp`,
      });
    }

    return {
      animationEnabled: true,
      theme: "dark3",
      backgroundColor: "#7dd3fc",
      data: [
        {
          type: "doughnut",
          showInLegend: false,
          indexLabel: "",
          startAngle: -90, // Start from top
          dataPoints,
        },
      ],
    };
  };

  // Helper function to get distinct colors for mutations
  const getMutationColor = (index: number): string => {
    const colors = [
      "#ef4444", // Red
      "#f59e0b", // Amber
      "#10b981", // Emerald
      "#8b5cf6", // Violet
    ];
    return colors[index % colors.length];
  };

  const computeChartSkeleton = () => {
    return {
      animationEnabled: true,
      theme: "dark3",
      backgroundColor: "#7dd3fc",
      data: [
        {
          type: "doughnut",
          showInLegend: false,
          indexLabel: "",
          dataPoints: [
            {
              y: 100,
              color: "#a6a6a6", // Gray color for skeleton
              toolTipContent: "Enter data to visualize plasmid",
            },
          ],
        },
      ],
    };
  };

  ///////////////////// Plasmid Sequence display ///////////////////////////
  type PlasmidPart = {
    label: string;
    sequence: string;
    color: string;
  };

  type PlasmidPartWithMutations = PlasmidPart & {
    mutations: {
      position: number;
      toBase: string;
      label: string;
      originalIndex: number;
    }[];
  };

  type PlasmidSequenceResult = (PlasmidPart | PlasmidPartWithMutations)[];

  const getBackboneSequence = (): string => {
    const bb = backbones.find(b => b.name === selectedBackbone);
    if (!bb) return "";
    return bb.sequence;
  };

  const buildPlasmidSequence = (): PlasmidSequenceResult | null => {
    if (selectedOption === 0) {
      if (!selectedBackbone) return null;
      const validFragments = fragments
        .map((f, i) => ({ seq: f.trim(), index: i }))
        .filter(f => f.seq !== "" && isValidDNA(f.seq));

      if (validFragments.length === 0) return null;

      const backboneSeq = getBackboneSequence();
      const parts: PlasmidPart[] = [
        { label: "Backbone", sequence: backboneSeq, color: "#0ea5e9" }
      ];

      validFragments.forEach((frag, idx) => {
        parts.push({
          label: `Fragment ${frag.index + 1}`,
          sequence: frag.seq,
          color: getFragmentColor(idx)
        });
      });

      return parts;
    }
    else if (selectedOption === 1) {
      // Mutagenesis: backbone with mutations applied
      if (!selectedBackbone) return null;

      const backboneSeq = getBackboneSequence();
      if (!backboneSeq) return null;

      const validMutations = mutations
        .map((m, i) => ({ value: m.trim(), index: i }))
        .filter(m => m.value !== "" && mutationFormat.test(m.value))
        .map(m => {
          const match = m.value.match(/^([ACGTacgt])(\d+)([ACGTacgt])$/);
          return {
            position: parseInt(match![2], 10) - 1, // Convert to 0-indexed
            toBase: match![3].toUpperCase(),
            label: m.value.toUpperCase(),
            originalIndex: m.index
          };
        });

      // Apply mutations to backbone sequence
      let mutatedSeq = backboneSeq.split('');
      validMutations.forEach(mut => {
        if (mut.position >= 0 && mut.position < mutatedSeq.length) {
          mutatedSeq[mut.position] = mut.toBase;
        }
      });

      const result: PlasmidPartWithMutations[] = [{
        label: "Backbone (with mutations)",
        sequence: mutatedSeq.join(''),
        mutations: validMutations,
        color: "#0ea5e9"
      }];

      return result;
    }
    else if (selectedOption === 2) {
      // Build your own backbone: frag1 -> frag2 -> ...
      const validFragments = fragments
        .map((f, i) => ({ seq: f.trim(), index: i }))
        .filter(f => f.seq !== "" && isValidDNA(f.seq));

      if (validFragments.length === 0) return null;

      return validFragments.map((frag, idx) => ({
        label: `Fragment ${frag.index + 1}`,
        sequence: frag.seq,
        color: getFragmentColor(idx)
      }));
    }
    return null;
  };

  // Helper function to get distinct colors for fragments
  const getFragmentColor = (index: number): string => {
    const colors = [
      "#22c55e", // Green
      "#3b82f6", // Blue
      "#a855f7", // Purple
      "#f59e0b", // Amber
      "#ec4899", // Pink
    ];
    return colors[index % colors.length];
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

  const computeMutagenesisPrice = () => {
    if (!selectedBackbone) return null;

    const validMutations = mutations
      .map((m, i) => ({ value: m.trim(), index: i }))
      // Only keep non-empty mutations that match the format
      .filter(m => m.value !== "" && mutationFormat.test(m.value));

    if (validMutations.length === 0) return null;

    const mutationPricing = validMutations.map((m, idx) => ({
      index: m.index,
      price: idx === 0 ? 0 : MULTI_MUTAGENESIS_PRICING.ADDITIONAL_MUTATION_PRICE,
      included: idx === 0,
    }));

    const extraCount = Math.max(0, validMutations.length - 1);

    return {
      base: MULTI_MUTAGENESIS_PRICING.BASE_PRICE,
      mutations: mutationPricing,
      total:
        MULTI_MUTAGENESIS_PRICING.BASE_PRICE +
        extraCount * MULTI_MUTAGENESIS_PRICING.ADDITIONAL_MUTATION_PRICE,
    };
  };

  const computeOwnBackbonePrice = () => {
    const validFragments = fragments.map((f, i) => ({ seq: f.trim(), index: i }))
      .filter(f => f.seq !== "" && isValidDNA(f.seq));
    //if no valid fragments, return
    if (validFragments.length < 1) return null;

    const fragmentPricing: {
      index: number;
      price: number;
      surcharges: number;
    }[] = [];

    let total = OWN_BACKBONE_PRICING.BASE_PRICE;

    validFragments.forEach((frag, idx) => {
      let price = 0;
      let surcharges = 0;

      //first frag included in base price
      if (idx > 0) {
        price += OWN_BACKBONE_PRICING.ADDITIONAL_FRAGMENT_PRICE;
        total += OWN_BACKBONE_PRICING.ADDITIONAL_FRAGMENT_PRICE;
      }

      const gc = computeGCPercent(frag.seq);

      if (gc > OWN_BACKBONE_PRICING.GC_THRESHOLD_PERCENT)
        surcharges += OWN_BACKBONE_PRICING.SURCHARGE_PRICE;
      if (frag.seq.length > OWN_BACKBONE_PRICING.LENGTH_THRESHOLD_BP)
        surcharges += OWN_BACKBONE_PRICING.SURCHARGE_PRICE;

      total += surcharges;

      fragmentPricing.push({
        index: frag.index,
        price,
        surcharges,
      });
    });

    return {
      basePrice: MULTI_INSERT_PRCIING.BASE_PRICE,
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
    if ((selectedOption === 0 || selectedOption === 2) && !fragments.some(frag => frag.trim() !== "")) {
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

  const submitOrder = async () => {
    if (!handleSubmit()) {
      return;
    }

    if (!loggedIn) {
      setOrderError("You must be logged in to place an order");
      return;
    }

    setIsSubmitting(true);
    setOrderError("");
    setOrderSuccess(false);

    try {
      // Get current user
      const user = await getUser();
      if (!user) {
        setOrderError("Unable to get user information");
        setIsSubmitting(false);
        return;
      }

      // Determine build type
      let buildType: 'MULTI_INSERT' | 'MUTAGENESIS' | 'NEW_BACKBONE' = 'MULTI_INSERT';
      if (selectedOption === 1) buildType = 'MUTAGENESIS';
      else if (selectedOption === 2) buildType = 'NEW_BACKBONE';

      // Calculate total price
      let totalPrice = 0;
      if (selectedOption === 0) {
        const pricing = computeMultiInsertPrice();
        totalPrice = pricing?.total || 0;
      } else if (selectedOption === 1) {
        const pricing = computeMutagenesisPrice();
        totalPrice = pricing?.total || 0;
      } else if (selectedOption === 2) {
        const pricing = computeOwnBackbonePrice();
        totalPrice = pricing?.total || 0;
      }

      // Prepare fragments data
      const fragmentsData = fragments
        .map((seq, idx) => ({
          sequence: seq.trim(),
          dnaType: dnaTypes[idx] || 'SYNTHETIC'
        }))
        .filter(f => f.sequence !== "");

      // Prepare mutations data
      const mutationsData = mutations
        .map(m => m.trim())
        .filter(m => m !== "" && mutationFormat.test(m));

      // Create order request
      const orderData = {
        supabaseUserId: user.id,
        plasmidName: plasmidName,
        buildType: buildType,
        backboneName: selectedBackbone,
        fragments: fragmentsData,
        mutations: mutationsData,
        totalPrice: totalPrice
      };

      const response = await orderService.createOrder(orderData);

      if (response.orderId) {
        setOrderSuccess(true);
        // Optionally navigate to orders page or show success message
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        setOrderError(response.message || "Failed to create order");
      }

    } catch (error: any) {
      setOrderError(error.response?.data?.message || error.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
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
    const loadBackbones = async () => {
      if (loggedIn) {
        try {
          const user = await getUser();
          if (user) {
            const backbonesData = await orderService.getUserBackbones(user.id);
            setBackbones(backbonesData);
          }
        }
        catch (error) {
          console.error('Failed to load backbones:', error);
        }
      }
      else {
        setBackbones([]);
        setSelectedBackbone(null);
      }
    };
    loadBackbones();
  }, [loggedIn]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {loggedIn && <Sidebar />}

      <div className="flex-1 flex flex-col">
        {!loggedIn && <Header />}
        <main className="flex-1 container mx-auto px-4 py-12" aria-label="Main">
          <h1 className="text-5xl font-extrabold mb-4">Get Started</h1>
          <hr className="my-6 border-gray-300" />



          <div className="flex flex-col items-center gap-2">
            {/* First blue box with 4 squares */}
            <div className="w-full  bg-sky-200 rounded-[20px] flex flex-col px-8 py-4">
              {/* Text at top-left */}
              <p className="text-lg font-medium text-sky-900 mb-2">
                1. Choose your plasmid option:
              </p>

              {/* Inner squares container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 max-w-3xl mx-auto justify-items-center">
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
                          setMutations([""]);
                          setMutationErrors([""]);
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
                      {(selectedOption === 0 || selectedOption === 1) && (
                        <div className="grid gap-2">
                          <Label>Vector Backbone</Label>
                          {/* Message for when user is logged out */}
                          {!loggedIn && (
                            <p className="text-sm text-sky-800">
                              <button
                                type="button"
                                onClick={() => navigate("/auth")}
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
                        {(selectedOption === 0 || selectedOption === 2) && (
                          <>
                            {config &&
                              fragments.map((value, i) => {
                                const isRequired = i < config.fragments;
                                const hasContent =
                                  value.trim() !== "" ||
                                  (selectedOption === 0 && dnaTypes[i]?.trim());

                                return (
                                  <div key={i} className="grid gap-2">
                                    <Label>Fragment {i + 1}</Label>

                                    <div className="flex items-center gap-2">
                                      <Input
                                        placeholder="Enter DNA sequence (5′ → 3′)"
                                        value={value}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          const nextFragments = [...fragments];
                                          nextFragments[i] = val;
                                          setFragments(nextFragments);

                                          const dnaRegex = /^[ACGTacgt]*$/;
                                          const error =
                                            val.trim() !== "" && !dnaRegex.test(val)
                                              ? "Fragment can only contain A, C, G, or T."
                                              : "";

                                          const nextErrors = [...fragmentErrors];
                                          nextErrors[i] = error;
                                          setFragmentErrors(nextErrors);
                                        }}
                                        className={`bg-sky-100 border-sky-400 ${fragmentErrors[i] ? "border-red-500" : ""
                                          }`}
                                      />

                                      {/* DNA type dropdown — only for Multi-insert */}
                                      {((selectedOption === 0) || (selectedOption === 2)) && (
                                        <Select
                                          value={dnaTypes[i] || ""}
                                          onValueChange={(val) => {
                                            const nextTypes = [...dnaTypes];
                                            nextTypes[i] = val;
                                            setDnaTypes(nextTypes);

                                            setFragmentErrors((prev) => {
                                              const next = [...prev];
                                              next[i] = "";
                                              return next;
                                            });
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

                                      {/* Trash icon */}
                                      {(!isRequired || hasContent) && (
                                        <button
                                          type="button"
                                          aria-label={`Delete fragment ${i + 1}`}
                                          onClick={() => {
                                            setFragments((prev) => {
                                              const next = [...prev];
                                              isRequired ? (next[i] = "") : next.splice(i, 1);
                                              return next;
                                            });

                                            setDnaTypes((prev) => {
                                              const next = [...prev];
                                              isRequired ? (next[i] = "") : next.splice(i, 1);
                                              return next;
                                            });

                                            setFragmentErrors((prev) => {
                                              const next = [...prev];
                                              isRequired ? (next[i] = "") : next.splice(i, 1);
                                              return next;
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
                                );
                              })}



                            {/* Only show "Add fragment" if fragments > 1 & < */}
                            {config && fragments.length < 5 && (
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
                            {mutations.map((value, i) => {
                              const isRequired = i === 0;
                              const hasContent = value.trim() !== "";

                              return (
                                <div key={i} className="grid gap-2">
                                  <Label>Mutation {i + 1}</Label>

                                  <div className="flex items-center gap-2">
                                    <Input
                                      placeholder="e.g. A123T"
                                      value={value}
                                      onChange={(e) => {
                                        const val = e.target.value;

                                        setMutations((prev) => {
                                          const next = [...prev];
                                          next[i] = val;
                                          return next;
                                        });

                                        const error =
                                          val.trim() !== "" && !mutationRegex.test(val)
                                            ? "Mutation can only contain A, C, G, T, and numbers."
                                            : "";

                                        setMutationErrors((prev) => {
                                          const next = [...prev];
                                          next[i] = error;
                                          return next;
                                        });
                                      }}
                                      className={`bg-sky-100 border-sky-400 ${mutationErrors[i] ? "border-red-500" : ""
                                        }`}
                                    />

                                    {/* Trash icon logic */}
                                    {(!isRequired || hasContent) && (
                                      <button
                                        type="button"
                                        aria-label={`Delete mutation ${i + 1}`}
                                        onClick={() => {
                                          setMutations((prev) => {
                                            const next = [...prev];
                                            isRequired ? (next[i] = "") : next.splice(i, 1);
                                            return next;
                                          });

                                          setMutationErrors((prev) => {
                                            const next = [...prev];
                                            isRequired ? (next[i] = "") : next.splice(i, 1);
                                            return next;
                                          });
                                        }}
                                        className="text-sky-700 hover:text-red-500 transition"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>

                                  {mutationErrors[i] && (
                                    <p className="text-red-500 text-sm">{mutationErrors[i]}</p>
                                  )}
                                </div>
                              );
                            })}

                            {/* Add mutation button */}
                            {mutations.length < MAX_MUTATIONS && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMutations((prev) => [...prev, ""]);
                                  setMutationErrors((prev) => [...prev, ""]);
                                }}
                                className="inline-block text-sm underline-offset-4 hover:underline my-2 text-left"
                              >
                                + Add mutation
                              </button>
                            )}
                          </>
                        )}



                      </div>
                      {submissionError && <p className="text-red-500 text-sm">{submissionError}</p>}
                      {mutationSubmitError && (<p className="text-red-500 text-sm mt-2">{mutationSubmitError}</p>)}
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
                            let chartOptions = null;

                            if (selectedOption === 0) {
                              chartOptions = computeChartMultiInsert();
                            }
                            else if (selectedOption === 2) {
                              chartOptions = computeChartNewBackbones();
                            }
                            else if (selectedOption === 1) {
                              chartOptions = computeChartMutagenesis();
                            }
                            if (!chartOptions) {
                              chartOptions = computeChartSkeleton();
                            }
                            
                            // Convert CanvasJS format to Recharts format
                            const chartData = chartOptions?.data?.[0]?.dataPoints?.map((dp: any, idx: number) => ({
                              name: dp.toolTipContent || `Segment ${idx + 1}`,
                              value: dp.y,
                              color: dp.color || undefined
                            })) || [];
                            
                            // Default colors if not specified
                            const COLORS = ['#0ea5e9', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];
                            
                            return (
                              <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                  <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                  >
                                    {chartData.map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip formatter={(value) => typeof value === 'number' ? `${value.toFixed(1)}%` : '0%'} />
                                </PieChart>
                              </ResponsiveContainer>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Plasmid Sequence Display */}
                    {(() => {
                      const plasmidParts = buildPlasmidSequence();
                      if (!plasmidParts) return null;

                      const firstPart = plasmidParts[0];
                      const hasMutations = 'mutations' in firstPart;

                      return (
                        <div className="mt-4 mb-2">
                          <Label className="text-sm font-medium mb-2 block">Plasmid Structure:</Label>
                          <div className="bg-white rounded-lg p-3 border border-sky-400">
                            {selectedOption === 1 ? (
                              // Mutagenesis display - show backbone with mutation highlights
                              // Mutagenesis display - show backbone with mutation highlights
                              <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2 text-xs">
                                  <span className="font-medium">Backbone:</span>
                                  <span className="text-gray-600">
                                    {firstPart.sequence.length} bp
                                    {hasMutations && (firstPart as PlasmidPartWithMutations).mutations.length > 0 && (
                                      <span className="ml-2 text-sky-700">
                                        ({(firstPart as PlasmidPartWithMutations).mutations.length} mutation{(firstPart as PlasmidPartWithMutations).mutations.length > 1 ? 's' : ''})
                                      </span>
                                    )}
                                  </span>
                                </div>
                                {hasMutations && (firstPart as PlasmidPartWithMutations).mutations.length > 0 && (
                                  <div className="flex flex-wrap justify-center gap-2">
                                    {(firstPart as PlasmidPartWithMutations).mutations.map((mut, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                                        style={{ backgroundColor: getMutationColor(idx) + '20', border: `1px solid ${getMutationColor(idx)}` }}
                                      >
                                        <div
                                          className="w-2 h-2 rounded-full"
                                          style={{ backgroundColor: getMutationColor(idx) }}
                                        />
                                        <span className="font-mono font-semibold">{mut.label}</span>
                                        <span className="text-gray-600">at position {mut.position + 1}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Multi-insert and Build your own backbone display
                              <div className="flex items-center justify-center gap-1 flex-wrap">
                                {plasmidParts.map((part, idx) => (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && (
                                      <span className="text-gray-400 font-bold mx-1">→</span>
                                    )}
                                    <div
                                      className="flex items-center gap-2 px-3 py-1.5 rounded-md"
                                      style={{ backgroundColor: part.color + '20', border: `2px solid ${part.color}` }}
                                    >
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: part.color }}
                                      />
                                      <div className="flex flex-col">
                                        <span className="text-xs font-semibold">{part.label}</span>
                                        <span className="text-xs text-gray-600">{part.sequence.length} bp</span>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                            )}

                            {/* Entire sequence with a copy icon to copy the sequence */}
                            <div className="mt-3 pt-2 border-t border-sky-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">Complete Sequence ({plasmidParts.reduce((sum, part) => sum + part.sequence.length, 0)} bp)</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const fullSequence = plasmidParts.map(part => part.sequence).join('');
                                    navigator.clipboard.writeText(fullSequence);
                                    // Optional: Add a toast notification here
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 text-xs bg-sky-100 hover:bg-sky-200 text-sky-700 rounded transition-colors"
                                  title="Copy sequence to clipboard"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                  Copy
                                </button>
                              </div>
                              <div className="bg-gray-50 rounded p-2 border border-gray-200 max-h-24 overflow-y-auto">
                                <code className="text-xs font-mono text-gray-700 break-all">
                                  {plasmidParts.map(part => part.sequence).join('')}
                                </code>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Table header */}
                    <div className="grid grid-cols-3 w-full text-sm font-medium mt-2">
                      <span>Name</span>
                      <span className="text-center">
                        {selectedOption === 1 ? "Mutation" : "Size"}
                      </span>
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

                    {selectedOption === 1 && (() => {
                      const pricing = computeMutagenesisPrice();
                      if (!pricing) return null;

                      return (
                        <div className="grid grid-cols-3 gap-y-2 text-sm">
                          {/* Backbone row */}
                          <span>{selectedBackbone}</span>
                          <span className="text-center">—</span>
                          <span className="text-right">
                            ${pricing.base}
                          </span>

                          {/* Mutation rows */}
                          {pricing.mutations.map(({ index, price, included }) => (
                            <React.Fragment key={index}>
                              <span>Mutation {index + 1}</span>
                              <span className="text-center">
                                {mutations[index]}
                              </span>
                              <span className="text-right">
                                {included ? "Included" : `$${price}`}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      );
                    })()}
                    {selectedOption === 2 && (() => {
                      const pricing = computeOwnBackbonePrice();
                      if (!pricing) return null;

                      return (
                        <div className="grid grid-cols-3 gap-y-2 text-sm">

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
                                    ? `$${pricing.basePrice}`
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
                    {selectedOption === 1 && (() => {
                      const pricing = computeMutagenesisPrice();
                      if (!pricing) return null;

                      return (
                        <div className="flex justify-between font-semibold mt-2">
                          <span>Total</span>
                          <span>${pricing.total}</span>
                        </div>
                      );
                    })()}
                    {selectedOption === 2 && (() => {
                      const pricing = computeOwnBackbonePrice();
                      if (!pricing) return null;

                      return (
                        <div className="flex justify-between font-semibold mt-2">
                          <span>Total</span>
                          <span>${pricing.total}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Success/Error Messages */}
                  {orderSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
                      ✅ Order placed successfully! Redirecting to orders page...
                    </div>
                  )}
                  {orderError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                      ❌ {orderError}
                    </div>
                  )}

                  {/* Buttons below the box */}
                  <div className="flex gap-4 justify-end mt-1">
                    <Button
                      onClick={submitOrder}
                      disabled={isSubmitting || !loggedIn}
                      className="bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Add to Cart'}
                    </Button>
                    <Button
                      onClick={submitOrder}
                      disabled={isSubmitting || !loggedIn}
                      className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Proceed to Checkout'}
                    </Button>
                  </div>

                  {!loggedIn && (
                    <p className="text-sm text-red-600 mt-2 text-right">
                      Please log in to place an order
                    </p>
                  )}
                </div>



              </div>
            </div>
          </div>
        </main>
        {!loggedIn && <Footer />}
      </div>
    </div>
  );
};

export default OrderPage;
