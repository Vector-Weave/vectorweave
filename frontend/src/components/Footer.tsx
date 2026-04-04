import logoSrc from "../assets/VectorWeave-final2-b.png";

export default function Footer() {
    return (
        <footer style={{
            background: "#1d3461",
            color: "rgba(255,255,255,0.7)",
            padding: "2.5rem 3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.82rem"
        }}>
            <a href="#" style={{display: "flex", alignItems: "center", textDecoration: "none"}}>
                <img src={logoSrc} alt="VectorWeave" style={{height: 36, width: "auto"}}/>
            </a>
            <span>© 2026 VectorWeave. All rights reserved.</span>
            <nav style={{display: "flex", gap: 0}}>
                {["Services", "How-to", "FAQ", "Contact Us"].map(l => (
                    <a key={l} href="#" style={{
                        color: "rgba(255,255,255,0.6)",
                        textDecoration: "none",
                        marginLeft: "1.5rem",
                        transition: "color 0.15s"
                    }}
                       onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                       onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    >{l}</a>
                ))}
            </nav>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3040.9662733769205!2d-74.65764882262371!3d40.34309417145136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3e6d8cd98b6e9%3A0x2ba7ed6fa90024f!2sPrinceton%20University!5e0!3m2!1sen!2sca!4v1774627569215!5m2!1sen!2sca"
                width="300"
                height="150"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VectorWeave Laboratory"
            />
        </footer>
    );
}
