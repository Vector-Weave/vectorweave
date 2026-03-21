import logoSrc from "../assets/VectorWeave-final2-b.png";

export default function Footer() {
    return (
        <footer style={{ background: "#1d3461", color: "rgba(255,255,255,0.7)", padding: "2.5rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem" }}>
            <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <img src={logoSrc} alt="VectorWeave" style={{ height: 36, width: "auto" }} />
            </a>
            <span>© 2026 VectorWeave. All rights reserved.</span>
            <nav style={{ display: "flex", gap: 0 }}>
                {["Services", "How-to", "FAQ", "Contact Us"].map(l => (
                    <a key={l} href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", marginLeft: "1.5rem", transition: "color 0.15s" }}
                       onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                       onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    >{l}</a>
                ))}
            </nav>
        </footer>
    );
}
