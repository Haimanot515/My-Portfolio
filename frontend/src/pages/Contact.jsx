import React, { useState, useEffect } from "react";
import API from "../api/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [mainHero, setMainHero] = useState(null);

  // Logic for dynamic calendar year
  const currentYear = new Date().getFullYear();
  const yearFirstTwo = currentYear.toString().slice(0, 2);
  const yearLastTwo = currentYear.toString().slice(2, 4);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/hero");
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setMainHero(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const res = await API.post("/contact", form);
      setSuccess(res.data.msg || "Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      const serverMsg = err.response?.data?.msg || "Something went wrong!";
      setError(serverMsg);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', scrollBehavior: 'smooth', minHeight: '100vh' }}>
      
      {/* 1. NAVIGATION BAR - 2026 REPOSITORY SYNC */}
      <nav style={{ 
        height: "80px", padding: '20px 50px', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(10px)', zIndex: 1100, borderBottom: '1px solid #eee' 
      }}>
        {/* Profile Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '180px' }}>
          {mainHero?.image && (
            <img src={mainHero.image} alt="Profile" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} />
          )}
          <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>H.Mekonnen</div>
        </div>

        {/* 2026 REPOSITORY LOGO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
          <div style={{ fontWeight: '900', fontSize: '1.5rem', lineHeight: '1' }}>
            <span style={{ color: '#eee' }}>{yearFirstTwo}</span>
            <span style={{ color: '#0070f3' }}>{yearLastTwo}</span>
          </div>
          <div style={{ fontSize: '0.6rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px', color: '#888' }}>
            GET IN TOUCH
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '30px', fontWeight: '600', minWidth: '180px', justifyContent: 'flex-end', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <a href="/services" style={{ textDecoration: 'none', color: '#111' }}>Services</a>
          <a href="/social" style={{ textDecoration: 'none', color: '#111' }}>Social</a>
          <a href="/advisory" style={{ textDecoration: 'none', color: '#0070f3' }}>Advisory</a>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* 2. HERO & FORM SECTION */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
          gap: "60px", 
          padding: "40px 0 80px 0", 
          minHeight: "75vh", 
          alignItems: "start"
        }}>
          <div style={{ marginTop: "20px" }}>
            <h1 style={{ 
              fontSize: "8rem", 
              lineHeight: "0.8", 
              letterSpacing: "-6px", 
              marginBottom: "40px", 
              fontWeight: "900" 
            }}>
              Get in <br />
              <span style={{ color: "#0070f3" }}>Touch</span>
            </h1>
            
            <p style={{ 
              fontSize: "1.2rem", color: "#444", lineHeight: "1.7", 
              maxWidth: "520px", fontWeight: "500", textAlign: "justify", paddingLeft: "5px"
            }}>
              "Great digital products are forged through disciplined engineering. 
              I prioritize absolute quality over speed. If you value precision and 
              clean code, let’s start the conversation."
            </p>
          </div>

          <div style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit} style={{ 
              width: "100%", padding: "50px", borderRadius: "30px", 
              background: "#fff", border: "1px solid #f0f0f0",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)",
              marginTop: "10px"
            }}>
              <h2 style={{ marginBottom: "30px", fontSize: "1.8rem", fontWeight: "900", letterSpacing: "-1px" }}>Project Brief</h2>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required style={{ marginBottom: "20px", width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #eee", fontSize: "1rem", outline: "none" }} />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required style={{ marginBottom: "20px", width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #eee", fontSize: "1rem", outline: "none" }} />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your vision..." required style={{ marginBottom: "25px", width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #eee", minHeight: "150px", fontSize: "1rem", outline: "none" }} />
              <button type="submit" style={{ width: "100%", cursor: "pointer", padding: "18px", background: "#111", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>Send Inquiry</button>
              {success && <p style={{ color: "#4ade80", marginTop: "20px", fontWeight: "700" }}>{success}</p>}
              {error && <p style={{ color: "#fb7185", marginTop: "20px", fontWeight: "700" }}>{error}</p>}
            </form>
          </div>
        </section>

        {/* 3. IMPACT STATS */}
        <section style={{ padding: "80px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px" }}>
            <div style={{ textAlign: "left" }}><h2 style={{ fontSize: "4rem", color: "#0070f3", margin: "0", fontWeight: "900", letterSpacing: "-3px" }}>100%</h2><p style={{ color: "#111", fontWeight: "800", textTransform: "uppercase", fontSize: "0.8rem" }}>Client Respect</p></div>
            <div style={{ textAlign: "left" }}><h2 style={{ fontSize: "4rem", color: "#0070f3", margin: "0", fontWeight: "900", letterSpacing: "-3px" }}>Quality</h2><p style={{ color: "#111", fontWeight: "800", textTransform: "uppercase", fontSize: "0.8rem" }}>Over Speed</p></div>
            <div style={{ textAlign: "left" }}><h2 style={{ fontSize: "4rem", color: "#0070f3", margin: "0", fontWeight: "900", letterSpacing: "-3px" }}>MERN</h2><p style={{ color: "#111", fontWeight: "800", textTransform: "uppercase", fontSize: "0.8rem" }}>Specialization</p></div>
          </div>
        </section>

        {/* 4. BEHIND THE CODE */}
        <section style={{ padding: "120px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "80px", alignItems: "center" }}>
          <div style={{ 
            backgroundImage: `url('https://res.cloudinary.com/dq3jkpys8/image/upload/v1770378640/home_hero/pwll8bimogcspsbydgeg.jpg')`,
            backgroundSize: 'cover', backgroundPosition: 'center', height: "550px", 
            borderRadius: "30px", boxShadow: '30px 30px 0px #f8f8f8'
          }}></div>
          <div>
            <h2 style={{ fontSize: "3rem", marginBottom: "30px", color: "#000", fontWeight: "900", letterSpacing: "-2px" }}>The Coder's Creed.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
              <div><strong style={{ color: "#0070f3", fontSize: "0.75rem", textTransform: "uppercase" }}>Discipline</strong><p style={{ margin: "5px 0", fontWeight: "700" }}>No food 'til done.</p></div>
              <div><strong style={{ color: "#0070f3", fontSize: "0.75rem", textTransform: "uppercase" }}>Core Stack</strong><p style={{ margin: "5px 0", fontWeight: "700" }}>MERN Specialist</p></div>
              <div><strong style={{ color: "#0070f3", fontSize: "0.75rem", textTransform: "uppercase" }}>Priority</strong><p style={{ margin: "5px 0", fontWeight: "700" }}>Quality over Speed</p></div>
              <div><strong style={{ color: "#0070f3", fontSize: "0.75rem", textTransform: "uppercase" }}>Values</strong><p style={{ margin: "5px 0", fontWeight: "700" }}>Absolute Respect</p></div>
            </div>
            <p style={{ marginTop: "40px", color: "#555", lineHeight: "1.8", fontSize: "1.1rem" }}>
              I don't just write code; I respect the craft. My philosophy is simple: complete the mission first, respect the customer always, and never compromise on the quality of the final product. 
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
