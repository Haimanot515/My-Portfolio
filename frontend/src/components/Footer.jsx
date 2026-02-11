import React from "react";
import { Link } from "react-router-dom";
import { 
  FaGithub, FaLinkedin, FaEnvelope, FaTwitter, FaTelegram, 
  FaStackOverflow, FaArrowUp, FaYoutube, 
  FaMedium, FaWhatsapp, FaInstagram, FaFacebook 
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={footerWrapper}>
      {/* 1. Back to Top Bar - Sophisticated Dark Bar */}
      <div onClick={scrollToTop} style={backToTop} className="footer-back-to-top">
        <FaArrowUp style={{ marginRight: "10px", fontSize: "10px" }} /> 
        <span style={{ letterSpacing: "4px" }}>BACK TO TOP</span>
      </div>

      {/* 2. Main Content Area */}
      <div style={mainFooter}>
        <div style={gridContainer}>
          
          {/* Brand/Bio Section */}
          <div style={brandColumn}>
            <div style={logoArea}>
              <span style={logoText}>Haimanot <span style={blueAccent}>Beka</span></span>
            </div>
            <p style={brandDesc}>
              Software Engineering Scholar at Addis Ababa University (AAiT). 
              Crafting high-performance digital ecosystems with the MERN stack 
              and a commitment to technical excellence.
            </p>
          </div>

          {/* Navigation Links */}
          <div style={column}>
            <div style={columnTitle}>Navigation</div>
            <ul style={listStyle}>
              <li><Link to="/" style={linkStyle} className="footer-link">Home</Link></li>
              <li><Link to="/about" style={linkStyle} className="footer-link">About Me</Link></li>
              <li><Link to="/projects" style={linkStyle} className="footer-link">Projects</Link></li>
              <li><Link to="/skill" style={linkStyle} className="footer-link">Skills</Link></li>
              <li><Link to="/contact" style={linkStyle} className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Tech Presence */}
          <div style={column}>
            <div style={columnTitle}>Tech Profile</div>
            <ul style={listStyle}>
              <li>
                <a href="https://github.com/Haimanot515" target="_blank" rel="noreferrer" style={socialLinkItem} className="footer-link">
                  <FaGithub style={{ ...iconBase, color: "#171515" }} /> GitHub
                </a>
              </li>
              <li>
                <a href="https://stackoverflow.com" target="_blank" rel="noreferrer" style={socialLinkItem} className="footer-link">
                  <FaStackOverflow style={{ ...iconBase, color: "#f48024" }} /> Stack Overflow
                </a>
              </li>
              <li>
                <a href="https://medium.com" target="_blank" rel="noreferrer" style={socialLinkItem} className="footer-link">
                  <FaMedium style={{ ...iconBase, color: "#0f172a" }} /> Tech Articles
                </a>
              </li>
              <li style={socialGroupRow}>
                <a href="https://wa.me/haimanotbeka" target="_blank" rel="noreferrer" style={rowIcon}><FaWhatsapp /></a>
                <a href="https://t.me/haimasearchjobplanstart" target="_blank" rel="noreferrer" style={rowIcon}><FaTelegram /></a>
                <a href="https://facebook.com/haimanotbeka" target="_blank" rel="noreferrer" style={rowIcon}><FaFacebook /></a>
              </li>
            </ul>
          </div>

          {/* Social Network */}
          <div style={column}>
            <div style={columnTitle}>Social Connect</div>
            <ul style={listStyle}>
              <li>
                <a href="https://linkedin.com/in/haimanotbeka" target="_blank" rel="noreferrer" style={socialLinkItem} className="footer-link">
                  <FaLinkedin style={{ ...iconBase, color: "#0077b5" }} /> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" style={socialLinkItem} className="footer-link">
                  <FaTwitter style={{ ...iconBase, color: "#1DA1F2" }} /> Twitter / X
                </a>
              </li>
              <li>
                <a href="https://instagram.com/haimanotbeka" target="_blank" rel="noreferrer" style={socialLinkItem} className="footer-link">
                  <FaInstagram style={{ ...iconBase, color: "#E4405F" }} /> Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com/@haimanotbeka" target="_blank" rel="noreferrer" style={socialLinkItem} className="footer-link">
                  <FaYoutube style={{ ...iconBase, color: "#FF0000" }} /> YouTube
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Bottom Legal Bar */}
      <div style={bottomBar}>
        <div style={bottomContainer}>
          <div style={copyText}>
            © {currentYear} Haimanot Beka Mekonnen. Built with Precision in Addis Ababa.
          </div>
          <div style={socialIconsRow}>
            <a href="https://github.com/Haimanot515" target="_blank" rel="noreferrer" style={bottomIcon}><FaGithub /></a>
            <a href="https://linkedin.com/in/haimanotbeka" target="_blank" rel="noreferrer" style={bottomIcon}><FaLinkedin /></a>
            <a href="mailto:haimanotbeka@gmail.com" style={bottomIcon}><FaEnvelope /></a>
          </div>
        </div>
      </div>

      {/* Embedded CSS for hover effects */}
      <style>
        {`
          .footer-link:hover { color: #2563eb !important; transform: translateX(5px); }
          .footer-link { transition: all 0.3s ease !important; }
          .footer-back-to-top:hover { opacity: 0.9; background: #1e293b !important; }
        `}
      </style>
    </footer>
  );
};

// --- Enhanced Styles ---

const footerWrapper = {
  fontFamily: "'Inter', sans-serif",
  background: "#ffffff",
  color: "#0f172a",
  width: "100%",
  borderTop: "1px solid #f1f5f9",
};

const backToTop = {
  background: "#0f172a", 
  color: "#ffffff",
  padding: "20px 0",
  textAlign: "center",
  fontSize: "10px",
  fontWeight: "900",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease",
};

const mainFooter = {
  padding: "100px 0", 
  background: "#ffffff",
  display: "flex",
  justifyContent: "center",
};

const gridContainer = {
  width: "100%",
  maxWidth: "1100px",
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr 1fr 1fr", 
  gap: "60px",
  padding: "0 20px",
};

const brandColumn = { minWidth: "280px" };
const logoArea = { marginBottom: "25px" };
const logoText = { fontSize: "28px", fontWeight: "900", letterSpacing: "-1px", color: "#0f172a" };
const blueAccent = { color: "#2563eb" };
const brandDesc = { color: "#475569", fontSize: "1rem", lineHeight: "1.8", maxWidth: "320px" };

const column = { display: "flex", flexDirection: "column" };
const columnTitle = { 
  color: "#0f172a", 
  fontSize: "0.85rem", 
  fontWeight: "800", 
  textTransform: "uppercase", 
  marginBottom: "30px", 
  letterSpacing: "2px" 
};

const listStyle = { listStyle: "none", padding: 0, margin: 0 };
const linkStyle = { 
  color: "#475569", 
  textDecoration: "none", 
  fontSize: "1rem", 
  display: "inline-block", 
  marginBottom: "16px" 
};

const socialLinkItem = { ...linkStyle, display: "flex", alignItems: "center" };
const iconBase = { marginRight: "14px", fontSize: "18px" };

const socialGroupRow = { display: "flex", gap: "20px", marginTop: "15px" };
const rowIcon = { color: "#64748b", fontSize: "20px", transition: "color 0.3s" };

const bottomBar = { background: "#f8fafc", padding: "40px 0", borderTop: "1px solid #f1f5f9" };
const bottomContainer = { 
  maxWidth: "1100px", 
  margin: "0 auto", 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  padding: "0 20px" 
};

const copyText = { color: "#94a3b8", fontSize: "0.9rem", fontWeight: "500" };
const socialIconsRow = { display: "flex", alignItems: "center", gap: "25px" };
const bottomIcon = { color: "#64748b", fontSize: "20px", transition: "all 0.3s" };

export default Footer;
