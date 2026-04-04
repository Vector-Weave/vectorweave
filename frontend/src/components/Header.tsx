import { useState } from "react";

interface DropdownItem { label: string; href: string; }
interface NavItem { label: string; href?: string; dropdown?: DropdownItem[]; }

const NAV: NavItem[] = [
  { label: "Services", href: "/services", dropdown: [
      { label: "Single & Multi-Insert Cloning", href: "#" },
      { label: "Custom Backbone Construction", href: "#" },
      { label: "Multi-Site & Codon Mutagenesis", href: "#" },
      { label: "Domain Mutagenesis", href: "#" },
      { label: "Synthetic DNA Cloning", href: "#" },
    ]},
  { label: "How-to", dropdown: [
      { label: "Submit Orders", href: "#" },
      { label: "Submit Samples", href: "#" },
      { label: "Start a Dropbox", href: "#" },
      { label: "Cancel an Order", href: "#" },
    ]},
  { label: "FAQ", href: "#" },
  { label: "Contact Us", href: "#" },
];

import logoSrc from "../assets/VectorWeave-final2-b.png";

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  if (!item.dropdown) {
    return (
        <a href={item.href ?? "#"}
           style={{ color: "#4a5a78", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.15s" }}
           onMouseEnter={e => (e.currentTarget.style.color = "#1d3461")}
           onMouseLeave={e => (e.currentTarget.style.color = "#4a5a78")}
        >{item.label}</a>
    );
  }
  return (
      <div style={{ position: "relative" }}
           onMouseEnter={() => setOpen(true)}
           onMouseLeave={() => setOpen(false)}
      >
        <a href={item.href ?? "#"} style={{ background: "none", border: "none", cursor: "pointer", color: "#4a5a78", fontSize: "0.875rem", fontWeight: 500, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, padding: 0, textDecoration: "none" }}>
          {item.label} <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>▾</span>
        </a>
        {open && (
            <div style={{ position: "absolute", top: "100%", left: 0, paddingTop: 12, zIndex: 50, minWidth: 240 }}>
              <div style={{ background: "#fff", border: "1px solid #d4dae8", borderRadius: 10, padding: "0.5rem 0", boxShadow: "0 8px 32px rgba(29,52,97,0.12)" }}>
                {item.dropdown.map(d => (
                    <a key={d.label} href={d.href}
                       style={{ display: "block", padding: "0.6rem 1.25rem", fontSize: "0.84rem", color: "#4a5a78", textDecoration: "none", transition: "background 0.12s, color 0.12s" }}
                       onMouseEnter={e => { e.currentTarget.style.background = "#eef1f7"; e.currentTarget.style.color = "#1d3461"; }}
                       onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#4a5a78"; }}
                    >{d.label}</a>
                ))}
              </div>
            </div>
        )}
      </div>
  );
}

export default function Header() {
  return (
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2.5rem", height: 60,
        background: "rgba(244,246,250,0.88)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(212,218,232,0.6)",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={logoSrc} alt="VectorWeave" style={{ height: 47, width: "auto" }} />
        </a>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {NAV.map(item => <NavDropdown key={item.label} item={item} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a href="/auth" style={{ background: "none", border: "1.5px solid #d4dae8", color: "#4a5a78", padding: "0.4rem 1.1rem", borderRadius: 7, fontSize: "0.83rem", fontWeight: 500, textDecoration: "none", transition: "all 0.15s" }}
             onMouseEnter={e => { e.currentTarget.style.borderColor = "#1d3461"; e.currentTarget.style.color = "#1d3461"; }}
             onMouseLeave={e => { e.currentTarget.style.borderColor = "#d4dae8"; e.currentTarget.style.color = "#4a5a78"; }}
          >Sign In</a>
          <a href="/order" style={{ background: "#1d3461", border: "none", color: "#fff", padding: "0.45rem 1.25rem", borderRadius: 7, fontSize: "0.83rem", fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}
             onMouseEnter={e => (e.currentTarget.style.background = "#3a5a99")}
             onMouseLeave={e => (e.currentTarget.style.background = "#1d3461")}
          >Order Now</a>
        </div>
      </nav>
  );
}