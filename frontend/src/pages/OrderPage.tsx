import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const OrderPage: React.FC = () => {
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
                "Synthetic inserts",
              ].map((label, i) => (
                <div
                  key={i}
                  className="w-40 h-40 bg-sky-300 py-2 px-2 rounded-[30px] transform transition-transform duration-300 
             hover:-translate-y-1 hover:scale-105 hover:shadow-lg overflow-hidden flex flex-col"
                >
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
                    <Label htmlFor="backbone">Vector Backbone</Label>
                    <Select>
                      <SelectTrigger className="w-[180px] bg-sky-100  border-sky-400  focus-visible:ring-sky-500 focus-visible:border-sky-500 ">
                        <SelectValue placeholder="Select a backbone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <a
                      href="#"
                      className=" inline-block text-sm underline-offset-4 hover:underline"
                    >
                      + Upload a new backbone
                    </a>
                    <hr className="border-sky-900 my-4" />
                    <div className="grid gap-2">
                      <Label htmlFor="fragment">Fragment 1</Label>
                      <Input id="fragment1" type="text" placeholder="Enter a sequence" required className="bg-sky-100  border-sky-400 focus-visible:ring-sky-500 focus-visible:border-sky-500 " />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fragment">Fragment 2</Label>
                      <Input id="fragment2" type="text" placeholder="Enter a sequence" required className="bg-sky-100  border-sky-400 focus-visible:ring-sky-500 focus-visible:border-sky-500 "/>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fragment">Fragment 3</Label>
                      <Input id="fragment3" type="text" placeholder="Enter a sequence" required className="bg-sky-100  border-sky-400 focus-visible:ring-sky-500 focus-visible:border-sky-500 "/>
                    </div>

                    <a
                      href="#"
                      className=" inline-block text-sm underline-offset-4 hover:underline my-2"
                    >
                      + Add fragment
                    </a>
                  </div>
                </div>


              </div>

              {/* Right side */}
              <div className="w-1/2 bg-sky-300 rounded-[20px] flex items-center justify-center">
                {/* You can put text, image, or anything here */}
                <p className="text-white">Right box content</p>
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
