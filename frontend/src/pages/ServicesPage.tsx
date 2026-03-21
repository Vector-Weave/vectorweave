import Header from "../components/Header";
import Footer from "../components/Footer";

/* ── Types ─────────────────────────────────────────── */
interface ServiceItem { title: string; tagline: string; body: string; features: string[]; wide?: boolean; }

/* ── Data ───────────────────────────────────────────── */
const SERVICES: ServiceItem[] = [
  {
    title: "Multi-Insert Cloning",
    tagline: '"Maybe it\'ll work this time" isn\'t a workflow.',
    body: "Seamlessly assemble complex plasmids with up to 5 inserts in a single step. Each plasmid is sequence-verified and ready to use, saving you from wasted weekends and repeat reactions.",
    features: ["Up to 5 fragments in one seamless build", "No restriction sites, no scars", "Sequence-verified results in days"],
  },
  {
    title: "Custom Backbone Construction",
    tagline: "Why settle for someone else's plasmid backbone?",
    body: "Design and build entirely new plasmid backbones from scratch. Combine any elements — markers, origins, promoters, reporters — to create the custom vector you've always wanted.",
    features: ["Freedom from pre-built constructs", "Mix & match any combination of parts", "Concept to construct in days, not months"],
  },
  {
    title: "Multi-Site & Codon Mutagenesis",
    tagline: "Why make one change when you can make five?",
    body: "Make targeted site-directed or codon-level mutations at up to five sites in a single build. Create parallel designs or randomized libraries without iterative PCRs or screening cycles.",
    features: ["Up to 5 mutations per build", "Point mutations or codon-level changes", "Parallel variant libraries in one step"],
  },
  {
    title: "Domain Mutagenesis",
    tagline: "Why mutagenize just one domain when you can do three?",
    body: "Create variant libraries by mutating separate DNA domains simultaneously. Swap, randomize, and reengineer regions in parallel. Focus on what your variants teach you, not how to make them.",
    features: ["Up to 3 simultaneous domain mutations", "Seamless integration of parts", "Outsource the grind, keep the science"],
  },
  {
    title: "Synthetic DNA Cloning",
    tagline: "We handle the vendors. You handle the science.",
    body: "Clone synthetic DNA fragments into any plasmid backbone, without onboarding fees. We coordinate with synthesis providers, clone into any vector — even low copy plasmids — and send you verified constructs.",
    features: ["Clone into your vector, not a vendor's", "No onboarding fees or setup minimums", "We handle all vendor communication"],
    wide: true,
  },
];

export default function ServicesPage() {
  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: #f4f6fa; color: #1a2236; overflow-x: hidden; }

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
      `}</style>

        <Header />

        <div style={{ background: "#f4f6fa", minHeight: "100vh", paddingTop: 80 }}>
          {/* Services */}
          <section style={{ padding: "5rem 3rem", maxWidth: 1200, margin: "0 auto" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#5b7fb5", marginBottom: "0.75rem", textAlign: "center" }}>Services</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: "2.6rem", letterSpacing: "-0.03em", color: "#1d3461", marginBottom: "3.5rem", textAlign: "center" }}>Everything you need to clone.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              {SERVICES.map(s => (
                  <div key={s.title} className="svc-card" style={{ background: "#fff", border: "1.5px solid #d4dae8", borderRadius: 14, padding: "2rem", transition: "all 0.2s", position: "relative", overflow: "hidden", gridColumn: s.wide ? "1 / -1" : undefined }}>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.3rem", color: "#1d3461", marginBottom: "0.5rem" }}>{s.title}</h3>
                    <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.875rem", color: "#5b7fb5", marginBottom: "0.75rem" }}>{s.tagline}</p>
                    <p style={{ fontSize: "0.875rem", color: "#4a5a78", lineHeight: 1.7, marginBottom: "1.25rem" }}>{s.body}</p>
                    <div style={{ display: "flex", flexDirection: s.wide ? "row" : "column", flexWrap: "wrap", gap: s.wide ? "0.75rem 2rem" : "0.3rem", marginBottom: "1.5rem" }}>
                      {s.features.map(f => (
                          <span key={f} style={{ fontSize: "0.8rem", color: "#4a5a78", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8fa8d0", flexShrink: 0, display: "inline-block" }} />{f}
                    </span>
                      ))}
                    </div>
                    <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "none", border: "1.5px solid #1d3461", color: "#1d3461", padding: "0.45rem 1rem", borderRadius: 7, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}
                       onMouseEnter={e => { e.currentTarget.style.background = "#1d3461"; e.currentTarget.style.color = "#fff"; }}
                       onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#1d3461"; }}
                    >Order Now →</a>
                  </div>
              ))}
            </div>
          </section>
        </div>

        <Footer />
      </>
  );
}
