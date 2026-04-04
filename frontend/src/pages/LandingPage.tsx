import BG_B64 from "../assets/hero.png";
import ARTSY_WEAVE from "../assets/artsy_weave.jpeg";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* ── Types ─────────────────────────────────────────── */
interface StepItem { n: string; title: string; body: string; }
interface CompareRow { feat: string; us: string; vendors: string; diy: string; }

/* ── Data ───────────────────────────────────────────── */

const STEPS: StepItem[] = [
  { n: "1", title: "Place your Order", body: "Upload your plasmid design online. Pay with credit card or PO and receive your submission instructions." },
  { n: "2", title: "Prepare Samples", body: "Prepare your DNA fragments for submission following our simple sample prep guide." },
  { n: "3", title: "Submit Samples", body: "Place your samples in a dropbox or mail them directly to us. No complicated shipping." },
  { n: "4", title: "Receive your Plasmid", body: "We'll send your sequence-verified plasmid, ready to use in your experiments." },
];

const COMPARE_ROWS: CompareRow[] = [
  { feat: "Vector Flexibility", us: "Clone into any plasmid. No vendor lock-in.", vendors: "Restricted to vendor-approved backbones.", diy: "Requires manual prep and compatibility work." },
  { feat: "Assembly Capability", us: "Up to 5 inserts of any length, GC content & complexity.", vendors: "Long or complex sequences often fail.", diy: "1–2 inserts before failure rates spike." },
  { feat: "Onboarding Costs", us: "No onboarding fees. Pay only for what you build.", vendors: "Added setup and onboarding fees per vector.", diy: "High reagent and consumable costs." },
  { feat: "Speed & Time", us: "Zero bench time and ~1 week turnaround.", vendors: "No hands-on work, but long delivery times.", diy: "Hours of setup, repeats, and troubleshooting." },
  { feat: "Total Cost", us: "Predictable and affordable. No hidden fees.", vendors: "High costs for long or complex builds.", diy: "High reagent, labor, and re-do costs." },
];

/* ── Service Icons ──────────────────────────────────── */
function IconSyntheticInserts() {
  return (
      <svg viewBox="0 0 80 80" fill="none"
           style={{ width: 80, height: 80, display: "block", margin: "0 auto 1rem" }}>

        {/* base circle */}
        <circle cx="40" cy="40" r="32"
                stroke="#d4dae8" strokeWidth="6.5" fill="none" />

        {/* aligned arc */}
        <circle
            cx="40"
            cy="40"
            r="32"
            stroke="#d94f2b"
            strokeWidth="6.5"
            fill="none"
            strokeDasharray="100 200"
            strokeDashoffset="140"
            strokeLinecap="butt"
        />
      </svg>
  );
}

function IconMultiInsert() {
  return (
      <svg viewBox="0 0 80 80" fill="none"
           style={{ width: 80, height: 80, display: "block", margin: "0 auto 1rem" }}>

        {/* base circle */}
        <circle cx="40" cy="40" r="32"
                stroke="#d4dae8" strokeWidth="6.5" fill="none" />

        {/* segments */}
        <circle
            cx="40" cy="40" r="32"
            stroke="#b8cfe8" strokeWidth="6.5"
            fill="none"
            strokeDasharray="70 230"
            strokeDashoffset="120"
        />

        <circle
            cx="40" cy="40" r="32"
            stroke="#5b7fb5" strokeWidth="6.5"
            fill="none"
            strokeDasharray="50 250"
            strokeDashoffset="190"
        />

        <circle
            cx="40" cy="40" r="32"
            stroke="#d94f2b" strokeWidth="6.5"
            fill="none"
            strokeDasharray="50 250"
            strokeDashoffset="20"
        />
      </svg>
  );
}

function IconPlasmiBackbones() {
  return (
      <svg viewBox="0 0 80 80" fill="none" style={{ width: 80, height: 80, display: "block", margin: "0 auto 1rem" }}>
        <path d="M 40 8 A 32 32 0 0 1 72 40" fill="none" stroke="#1d3461" strokeWidth="6.5" strokeLinecap="butt"/>
        <path d="M 72 40 A 32 32 0 0 1 40 72" fill="none" stroke="#5b7fb5" strokeWidth="6.5" strokeLinecap="butt"/>
        <path d="M 40 72 A 32 32 0 0 1 8 40" fill="none" stroke="#d94f2b" strokeWidth="6.5" strokeLinecap="butt"/>
        <path d="M 8 40 A 32 32 0 0 1 40 8" fill="none" stroke="#f1c40f" strokeWidth="6.5" strokeLinecap="butt"/>
      </svg>
  );
}

function IconMutagenesis() {
  return (
      <svg viewBox="0 0 80 80" fill="none"
           style={{ width: 80, height: 80, display: "block", margin: "0 auto 1rem" }}>

        {/* base circle */}
        <circle cx="40" cy="40" r="32"
                stroke="#d4dae8" strokeWidth="6.5" fill="none" />

        {/* top star (aligned to circle edge at y = 8) */}
        <polygon
            points="40,8 42.5,14 49,14 43.5,18 46,24 40,20 34,24 36.5,18 31,14 37.5,14"
            fill="#d94f2b"
        />

        {/* right star (aligned to x = 72) */}
        <polygon
            points="72,40 74.5,46 81,46 75.5,50 78,56 72,52 66,56 68.5,50 63,46 69.5,46"
            fill="#5b7fb5"
        />

        {/* bottom-left star (aligned along circle) */}
        <polygon
            points="16,64 18.5,70 25,70 19.5,74 22,80 16,76 10,80 12.5,74 7,70 13.5,70"
            fill="#b8cfe8"
        />
      </svg>
  );
}

/* ── Main ───────────────────────────────────────────── */
export default function LandingPage() {
  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: #f4f6fa; color: #1a2236; overflow-x: hidden; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-0 { animation: fadeUp 0.6s 0.0s ease both; }
        .anim-1 { animation: fadeUp 0.6s 0.1s ease both; }
        .anim-2 { animation: fadeUp 0.6s 0.2s ease both; }
        .anim-3 { animation: fadeUp 0.6s 0.3s ease both; }
        .anim-4 { animation: fadeUp 0.6s 0.4s ease both; }
        .anim-5 { animation: fadeUp 0.7s 0.25s ease both; }

        .svc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #1d3461, #8fa8d0);
          opacity: 0;
          transition: opacity 0.2s;
          border-radius: 14px 14px 0 0;
        }
        .svc-card:hover::before { opacity: 1; }
        .svc-card:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(29,52,97,0.08); border-color: #8fa8d0 !important; }
        .value-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(29,52,97,0.08); border-color: #8fa8d0 !important; }
      `}</style>

        <Header />

        {/* HERO */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: 60 }}>
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: `url(${BG_B64})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.25,
          }} />
          <div style={{
            position: "relative", zIndex: 5, flex: 1,
            display: "grid", gridTemplateColumns: "1fr 1fr",
            alignItems: "center", maxWidth: 1200, margin: "0 auto",
            padding: "5rem 3rem 8rem", gap: "4rem", width: "100%",
          }}>
            <div>
              <h1 className="anim-1" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(3.2rem, 6vw, 5.5rem)", lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
                <span style={{ color: "#1d3461" }}>Clone</span><br />
                <span style={{ color: "#d94f2b" }}>Anything.</span>
              </h1>
              <p className="anim-2" style={{ fontSize: "1.15rem", fontWeight: 400, color: "#4a5a78", letterSpacing: "0.01em", marginBottom: "0.75rem" }}>
                You design it. We build it.
              </p>
              <p className="anim-3" style={{ fontSize: "0.95rem", color: "#4a5a78", lineHeight: 1.7, maxWidth: 420, marginBottom: "2.5rem" }}>
                Multi-insert cloning, multi-site mutagenesis, and custom plasmid backbones — all delivered in days. Send your DNA and we'll do the rest.
              </p>
              <div className="anim-4" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <a href="#" style={{ background: "#d94f2b", color: "#fff", border: "none", padding: "0.85rem 2.2rem", borderRadius: 8, fontSize: "1rem", fontWeight: 600, textDecoration: "none", transition: "all 0.18s", display: "inline-block" }}
                   onMouseEnter={e => { e.currentTarget.style.background = "#b84020"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(217,79,43,0.3)"; }}
                   onMouseLeave={e => { e.currentTarget.style.background = "#d94f2b"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >Start Cloning</a>
                <a href="#" style={{ color: "#1d3461", fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", borderBottom: "1px solid transparent", transition: "border-color 0.15s" }}
                   onMouseEnter={e => (e.currentTarget.style.borderBottomColor = "#1d3461")}
                   onMouseLeave={e => (e.currentTarget.style.borderBottomColor = "transparent")}
                >See our services →</a>
              </div>
            </div>
            <div className="anim-5" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "2.5rem", border: "1px solid rgba(212,218,232,0.7)", boxShadow: "0 12px 48px rgba(29,52,97,0.1)" }}>
                <img
                    src={ARTSY_WEAVE}
                    alt="VectorWeave"
                    style={{ display: "block", width: 280, height: 280, objectFit: "cover", borderRadius: 10 }}
                />
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, width: "100%", zIndex: 10, lineHeight: 0 }}>
            <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%", height: 100 }}>
              <path d="M0,100 L0,62 C120,12 240,92 360,55 C480,15 600,88 720,52 C840,14 960,90 1080,54 C1200,16 1320,88 1440,54 L1440,100 Z" fill="#f4f6fa" />
            </svg>
          </div>
        </section>

        {/* BELOW HERO */}
        <div style={{ background: "#f4f6fa", position: "relative", zIndex: 5 }}>

          {/* Stop Cloning Section */}
          <section style={{ padding: "5rem 3rem", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: "2.6rem", letterSpacing: "-0.03em", color: "#1d3461", marginBottom: "1.5rem" }}>Stop cloning. Start creating.</h2>
            <p style={{ fontSize: "1rem", color: "#4a5a78", lineHeight: 1.7, maxWidth: 800, margin: "0 auto 3.5rem" }}>
              Cloning is great... if you think weekends are overrated. We don't. We'll spare you the frustration and the agarose. Send us your DNA and we'll give you that plasmid you've been chasing, so you can finally take Saturday off.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
              {[
                { title: "Synthetic Inserts",           icon: <IconSyntheticInserts /> },
                { title: "Multi-Insert Cloning",        icon: <IconMultiInsert /> },
                { title: "Build New Plasmid Backbones", icon: <IconPlasmiBackbones /> },
                { title: "Multi-Site Mutagenesis",      icon: <IconMutagenesis /> },
              ].map(item => (
                  <div key={item.title} className="value-card" style={{ background: "#fff", border: "1px solid #d4dae8", borderRadius: 14, padding: "2rem 1.5rem", textAlign: "center", transition: "all 0.2s" }}>
                    {item.icon}
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1a2236" }}>{item.title}</h3>
                  </div>
              ))}
            </div>
          </section>

          {/* Workflow */}
          <section style={{ background: "#fff", padding: "5rem 3rem", borderTop: "1px solid #d4dae8", borderBottom: "1px solid #d4dae8" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#5b7fb5", marginBottom: "0.75rem", textAlign: "center" }}>How It Works</p>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: "2.6rem", letterSpacing: "-0.03em", color: "#1d3461", marginBottom: "3.5rem", textAlign: "center" }}>Your new cloning workflow.</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", position: "relative" }}>
                <div style={{ position: "absolute", top: "calc(1.5rem + 28px)", left: "calc(12.5% + 28px)", right: "calc(12.5% + 28px)", height: 1, background: "linear-gradient(90deg, #d4dae8, #8fa8d0, #d4dae8)", zIndex: 0 }} />
                {STEPS.map(s => (
                    <div key={s.n} style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "1.5rem 1rem" }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1d3461", color: "#fff", fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: "0 4px 16px rgba(29,52,97,0.25)" }}>{s.n}</div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1a2236", marginBottom: "0.5rem" }}>{s.title}</h4>
                      <p style={{ fontSize: "0.82rem", color: "#4a5a78", lineHeight: 1.6 }}>{s.body}</p>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Value Props */}
          <section style={{ background: "#f4f6fa", padding: "5rem 3rem", borderTop: "1px solid #d4dae8", borderBottom: "1px solid #d4dae8" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#5b7fb5", marginBottom: "0.75rem" }}>Why VectorWeave?</p>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: "2.6rem", letterSpacing: "-0.03em", color: "#1d3461", marginBottom: "3.5rem" }}>Science, not cloning.</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
                {[
                  {
                    title: "Save Time",
                    body: "Spend your time on experiments that matter, not cloning. Just send us your design and DNA.",
                    icon: <svg viewBox="0 0 44 44" fill="none" style={{ width: 44, height: 44, display: "block", margin: "0 auto 1.25rem" }}>
                      <circle cx="22" cy="22" r="20" stroke="#d4dae8" strokeWidth="1.5"/>
                      <circle cx="22" cy="22" r="15" fill="none" stroke="#1d3461" strokeWidth="2"/>
                      <line x1="22" y1="22" x2="22" y2="10" stroke="#1d3461" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="22" y1="22" x2="30" y2="26" stroke="#5b7fb5" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="22" cy="22" r="2" fill="#d94f2b"/>
                    </svg>,
                  },
                  {
                    title: "Save Money",
                    body: "Stop burning money on costly reagents and do-overs. One order, one price: no kits, no repeats, no surprises.",
                    icon: <svg viewBox="0 0 44 44" fill="none" style={{ width: 44, height: 44, display: "block", margin: "0 auto 1.25rem" }}>
                      <circle cx="22" cy="22" r="20" stroke="#d4dae8" strokeWidth="1.5"/>
                      <text x="22" y="30" textAnchor="middle" fontFamily="DM Sans" fontWeight="700" fontSize="22" fill="#1d3461">$</text>
                    </svg>,
                  },
                  {
                    title: "Do Better Science",
                    body: "Build the complex plasmids you've only dreamed about. If you can design it, we can make it real.",
                    icon: <svg viewBox="0 0 44 44" fill="none" style={{ width: 44, height: 44, display: "block", margin: "0 auto 1.25rem" }}>
                      <circle cx="22" cy="8" r="5" fill="none" stroke="#5b7fb5" strokeWidth="2"/>
                      <circle cx="8" cy="30" r="5" fill="none" stroke="#d94f2b" strokeWidth="2"/>
                      <circle cx="36" cy="30" r="5" fill="none" stroke="#1a7a4a" strokeWidth="2"/>
                      <line x1="22" y1="13" x2="22" y2="38" stroke="#1d3461" strokeWidth="1.5" strokeDasharray="2,2"/>
                      <line x1="13" y1="30" x2="31" y2="30" stroke="#1d3461" strokeWidth="1.5"/>
                    </svg>,
                  },
                ].map(v => (
                    <div key={v.title} className="value-card" style={{ background: "#fff", border: "1px solid #d4dae8", borderRadius: 14, padding: "2rem", textAlign: "center", transition: "all 0.2s" }}>
                      {v.icon}
                      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#1a2236", marginBottom: "0.5rem" }}>{v.title}</h3>
                      <p style={{ fontSize: "0.875rem", color: "#4a5a78", lineHeight: 1.65 }}>{v.body}</p>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section style={{ background: "#fff", padding: "5rem 3rem", borderTop: "1px solid #d4dae8", borderBottom: "1px solid #d4dae8" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#5b7fb5", marginBottom: "0.75rem", textAlign: "center" }}>How We Compare</p>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: "2.6rem", letterSpacing: "-0.03em", color: "#1d3461", marginBottom: "3.5rem", textAlign: "center" }}>The better choice is clear.</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                <tr>
                  <th style={{ padding: "1rem 1.5rem 1rem 0", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7a8ca8", borderBottom: "2px solid #d4dae8" }}>Feature</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1d3461", borderBottom: "2px solid #d4dae8", background: "rgba(29,52,97,0.04)", borderRadius: "8px 8px 0 0" }}>VectorWeave</th>
                  <th style={{ padding: "1rem 1rem 1rem 1.5rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7a8ca8", borderBottom: "2px solid #d4dae8" }}>DNA Synthesis Vendors</th>
                  <th style={{ padding: "1rem 0 1rem 1rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7a8ca8", borderBottom: "2px solid #d4dae8" }}>DIY Cloning</th>
                </tr>
                </thead>
                <tbody>
                {COMPARE_ROWS.map(r => (
                    <tr key={r.feat}>
                      <td style={{ padding: "1rem 1.5rem 1rem 0", borderBottom: "1px solid #d4dae8", color: "#1a2236", fontWeight: 500, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", verticalAlign: "top" }}>{r.feat}</td>
                      <td style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #d4dae8", color: "#1a2236", fontWeight: 500, background: "rgba(29,52,97,0.03)", verticalAlign: "top" }}>{r.us}</td>
                      <td style={{ padding: "1rem 1rem 1rem 1.5rem", borderBottom: "1px solid #d4dae8", color: "#4a5a78", verticalAlign: "top" }}>{r.vendors}</td>
                      <td style={{ padding: "1rem 0 1rem 1rem", borderBottom: "1px solid #d4dae8", color: "#4a5a78", verticalAlign: "top" }}>{r.diy}</td>
                    </tr>
                ))}
                </tbody>
              </table>
              <div style={{ marginTop: "2rem", background: "linear-gradient(135deg, rgba(91,127,181,0.1), rgba(29,52,97,0.06))", border: "1px solid #8fa8d0", borderRadius: 12, padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
                <p style={{ fontSize: "0.9rem", color: "#4a5a78" }}>
                  💾 <strong style={{ color: "#1d3461" }}>Want even less hassle?</strong> Let us store your vector for future use. Only $50 for 1 year of storage — no re-submission needed on your next order.
                </p>
                <a href="#" style={{ flexShrink: 0, display: "inline-flex", background: "none", border: "1.5px solid #1d3461", color: "#1d3461", padding: "0.45rem 1rem", borderRadius: 7, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.15s" }}
                   onMouseEnter={e => { e.currentTarget.style.background = "#1d3461"; e.currentTarget.style.color = "#fff"; }}
                   onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#1d3461"; }}
                >Learn More</a>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <div style={{ padding: "6rem 3rem", textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "2.8rem", letterSpacing: "-0.03em", color: "#1d3461", marginBottom: "1rem", lineHeight: 1.1 }}>
              Ready to clone<br /><em>anything?</em>
            </h2>
            <p style={{ color: "#4a5a78", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              Join hundreds of researchers who've stopped wasting weekends in the lab. Send us your design and let VectorWeave handle the rest.
            </p>
            <a href="#" style={{ background: "#d94f2b", color: "#fff", border: "none", padding: "0.85rem 2.2rem", borderRadius: 8, fontSize: "1rem", fontWeight: 600, textDecoration: "none", display: "inline-block", transition: "all 0.18s" }}
               onMouseEnter={e => { e.currentTarget.style.background = "#b84020"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(217,79,43,0.3)"; }}
               onMouseLeave={e => { e.currentTarget.style.background = "#d94f2b"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >Start Cloning Today</a>
          </div>
        </div>

        <Footer />
      </>
  );
}