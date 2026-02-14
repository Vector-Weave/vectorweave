import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import mutagenesisImg from "../assets/2.png"
import customBackboneImg from "../assets/3.png"
import multiInsertImg from "../assets/1.png"
import { Dna, Sparkles, Clock, DollarSign, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const LandingPage: React.FC = () => {
  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16" aria-label="Main">
          {/* HERO with animated background */}
          <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center relative"
          >
            {/* Floating DNA helixes in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
              <motion.div
                  animate={{
                    rotate: 360,
                    y: [0, -20, 0]
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute top-10 right-20"
              >
                <Dna size={100} className="text-sky-600" />
              </motion.div>

            </div>

            <div className="relative z-10">
              <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block mb-4"
              >
              </motion.div>

              <h1 className="text-6xl font-extrabold text-sky-800 mb-6 leading-tight">
                Clone Anything.
              </h1>

              <p className="text-xl text-slate-700 mb-8 leading-relaxed">
                You design it. We build it. Multi-insert cloning, multi-site mutagenesis,
                and custom plasmid backbones, all delivered in <span className="font-bold text-sky-600">days</span>. Send your DNA and we’ll do the rest.
              </p>

              <div className="flex gap-4 items-center">
                <Link to="/order">
                  <Button size="lg" className="group">
                    Start Cloning
                    <Zap className="ml-2 group-hover:animate-pulse" size={18} />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline">Learn More</Button>
                </Link>

              </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative h-96 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-500 to-indigo-600 shadow-2xl overflow-hidden group"
            >
              {/* Animated grid overlay */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

              {/* Floating DNA helix visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="relative w-40 h-72"
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                  {[...Array(24)].map((_, i) => {
                    const y = i * 10; // vertical spacing
                    const phase = (i / 24) * Math.PI * 2;

                    return (
                        <div key={i} className="absolute left-1/2" style={{ top: y }}>
                          {/* Left strand */}
                          <motion.div
                              className="absolute w-3 h-3 rounded-full bg-cyan-300"
                              animate={{ x: Math.sin(phase) * 30, opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />

                          {/* Right strand */}
                          <motion.div
                              className="absolute w-3 h-3 rounded-full bg-pink-300"
                              animate={{ x: -Math.sin(phase) * 30, opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />

                          {/* Base pair connection */}
                          <motion.div
                              className="absolute h-[2px] bg-white/40"
                              style={{ width: "60px", left: "-30px", top: "5px" }}
                              animate={{ opacity: [0.3, 0.8, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                    );
                  })}
                </motion.div>
              </div>


              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          </motion.section>

          {/* SERVICES ICONS*/}
          <motion.section
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-32 grid md:grid-cols-3 gap-8"
          >
            {[
              { img: mutagenesisImg, title: "Multi-Site Mutagenesis" },
              { img: multiInsertImg, title: "Multi-Insert Cloning" },
              { img: customBackboneImg, title: "Custom Backbones" }
            ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }}>
                  <Card className="relative overflow-hidden p-8 text-center group hover:shadow-xl transition-all border-2 hover:border-sky-200">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative z-10">
                      <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="inline-block mb-4"
                      >
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                          <img
                              src={s.img}
                              alt={s.title}
                              className="w-12 h-12 object-contain"
                          />
                        </div>
                      </motion.div>

                      <h3 className="text-xl font-bold mb-2 text-slate-800">{s.title}</h3>
                    </div>
                  </Card>
                </motion.div>
            ))}
          </motion.section>

          {/* VALUE PROP with personality */}
          <section className="mt-40 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6 text-slate-900">
                Stop cloning. Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">creating</span>.
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-slate-600 mb-4">
                Cloning is great…if you think weekends are overrated. We don't.
              </p>
              <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-20">
                We'll spare you the frustration and agarose. Send us your DNA and we’ll give you that plasmid you’ve
                been chasing, so you can finally take Saturday off.
              </p>
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Clock,
                  title: "Save Time",
                  text: "Spend your time on experiments that matter, not cloning. Just send us your design and DNA.",
                  color: "from-sky-600 to-sky-500"
                },
                {
                  icon: DollarSign,
                  title: "Save Money",
                  text: "Stop burning money on costly reagents and do-overs. One order one price: no kits, no repeats, no surprises.",
                  color: "from-emerald-500 to-green-500"
                },
                {
                  icon: Sparkles,
                  title: "Do Better Science",
                  text: "Build the complex plasmids you’ve only dreamed about. If you can design it, we can make it real.",
                  color: "from-violet-500 to-purple-500"
                }
              ].map((v, i) => (
                  <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.05 }}>
                    <Card className="p-8 h-full hover:shadow-2xl transition-all group">
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <v.icon className="text-white" size={32} />
                      </div>
                      <h3 className="font-bold text-xl mb-3 text-slate-800">{v.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{v.text}</p>
                    </Card>
                  </motion.div>
              ))}
            </motion.div>
          </section>

          {/* WORKFLOW - Fixed with straight dotted lines */}
          <section className="mt-40">
            <h2 className="text-4xl font-bold text-center mb-4">Your New Cloning Workflow</h2>
            <p className="text-center text-slate-600 mb-20 text-lg">Four simple steps. Zero headaches.</p>

            <div className="max-w-4xl mx-auto">
              {/* Step 1 */}
              <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="relative"
              >
                <div className="flex items-start gap-8 mb-8">
                  <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    1
                  </div>
                  <div className="flex-1 pt-4">
                    <h3 className="font-bold text-2xl mb-3 text-slate-800">Place your Order</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Upload your plasmid design online. Pay with a credit card or PO and get your submission instructions instantly.
                    </p>
                  </div>
                </div>

                {/* Dotted line connector */}
                <div className="ml-16 h-16 border-l-4 border-dashed border-sky-300"></div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="relative"
              >
                <div className="flex items-start gap-8 mb-8">
                  <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    2
                  </div>
                  <div className="flex-1 pt-4">
                    <h3 className="font-bold text-2xl mb-3 text-slate-800">Prepare Samples</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Get your DNA fragments ready for submission.
                    </p>
                  </div>
                </div>

                {/* Dotted line connector */}
                <div className="ml-16 h-16 border-l-4 border-dashed border-sky-300"></div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="relative"
              >
                <div className="flex items-start gap-8 mb-8">
                  <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    3
                  </div>
                  <div className="flex-1 pt-4">
                    <h3 className="font-bold text-2xl mb-3 text-slate-800">Submit your Samples</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Place your samples in a dropbox or mail them to us.
                    </p>
                  </div>
                </div>

                {/* Dotted line connector */}
                <div className="ml-16 h-16 border-l-4 border-dashed border-sky-300"></div>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
              >
                <div className="flex items-start gap-8">
                  <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    4
                  </div>
                  <div className="flex-1 pt-4">
                    <h3 className="font-bold text-2xl mb-3 text-slate-800">Receive your Plasmid</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      We send you your fully assembled plasmid with verified sequence.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA with more punch */}
          <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-40 relative overflow-hidden bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white rounded-3xl p-16 text-center shadow-2xl"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-4">Ready to say goodbye to cloning nightmares?</h2>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Join hundreds of researchers who've reclaimed their weekends
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/order">
                  <Button size="lg" variant="secondary" className="text-md px-8">
                    Start Your Order
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-md px-8">
                  View Pricing
                </Button>
              </div>
            </div>
          </motion.section>
        </main>
        <Footer />
      </div>
  );
};

export default LandingPage;
