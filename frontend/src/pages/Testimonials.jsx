import React, { useState, useEffect, useRef } from "react";
import API from "../api/api";

const Testimonials = () => {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", title: "", message: "" });
  const [file, setFile] = useState(null); 
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isVisible, setIsVisible] = useState(true); 
  
  const formRef = useRef(null);
  const mainContentRef = useRef(null); 

  // 1. FETCH DATA & FORCE DESCENDING ORDER
  const fetchTestimonials = async () => {
    try {
      const res = await API.get("/testimonials");
      
      // Ensure data is treated as an array and explicitly sort by date 
      // in case the backend cache or index varies
      const sortedData = Array.isArray(res.data) 
        ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      setComments(sortedData);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    }
  };

  useEffect(() => {
    fetchTestimonials();

    const handleScroll = () => {
      if (mainContentRef.current) {
        const rect = mainContentRef.current.getBoundingClientRect();
        // The button disappears when the bottom of the testimonials section 
        // reaches the top of the screen (Footer takeover)
        if (rect.bottom <= 0) { 
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
    };

    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 2. FORM HANDLERS
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("title", form.title);
    formData.append("message", form.message);
    if (file) formData.append("avatar", file);

    try {
      await API.post("/testimonials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setSuccess("Feed updated (Descending Order).");
      setForm({ name: "", title: "", message: "" });
      setFile(null);
      
      // Re-fetch to place the newest post at the very top
      fetchTestimonials(); 
      
      setTimeout(() => {
        setShowForm(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', color: '#111', fontFamily: 'Inter, sans-serif', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      
      <style>{`
        .navbar { z-index: 2000 !important; position: sticky; top: 0; background: #fff; }
        .fab-button:hover {
          transform: scale(1.1) rotate(90deg);
          background-color: #0056b3 !important;
        }
        .sidebar-container::-webkit-scrollbar { width: 5px; }
        .sidebar-container::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
      `}</style>

      {/* FLOAT BUTTON */}
      <button 
          className="fab-button"
          onClick={() => setShowForm(true)} 
          style={{ 
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#0070f3', 
              color: '#fff', 
              border: 'none', 
              fontSize: '2.2rem', 
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,112,243,0.3)',
              zIndex: 3000, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              opacity: isVisible ? 1 : 0, 
              transform: isVisible ? 'scale(1)' : 'scale(0)',
              pointerEvents: isVisible ? 'auto' : 'none',
              padding: '0',
              lineHeight: '0'
          }}
      >
          +
      </button>

      {/* WRAPPING MAIN CONTENT FOR SCROLL TRACKING */}
      <main ref={mainContentRef} style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: "7rem", lineHeight: "0.8", letterSpacing: "-5px", fontWeight: "900", margin: "0 0 20px 0" }}>
            Expert <span style={{ color: "#0070f3" }}>Feed</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Go through what people say about me.Gemini said
To allow visitors to leave a testimonial or technical assessment, they should click the floating action button (+) to open the submission modal. Once open, the user simply enters their name, professional title, and their feedback. To maintain the high standard of your portfolio, submissions are sent to a "pending" state in your database, allowing you to review and approve them before they appear in the live Expert Feed. This ensures your profile remains a verified showcase of technical excellence.</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {comments.map((item) => (
            <div key={item._id} style={{ display: "flex", alignItems: "flex-start", gap: "25px", borderBottom: '1px solid #f8f8f8', paddingBottom: '40px' }}>
              <div style={{ flex: "0 0 70px" }}>
                <img 
                  src={item.avatar || `https://ui-avatars.com/api/?name=${item.name}&background=0070f3&color=fff`} 
                  alt={item.name} 
                  style={{ width: "70px", height: "70px", borderRadius: "10px", objectFit: "cover" }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontWeight: "900", fontSize: "1.2rem" }}>{item.name}</h4>
                <p style={{ margin: "2px 0 12px 0", color: "#0070f3", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase" }}>{item.title}</p>
                <p style={{ fontSize: "1.05rem", lineHeight: "1.6", color: "#333" }}>{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* SIDEBAR FORM */}
      <aside 
        ref={formRef}
        className="sidebar-container"
        style={{ 
          position: 'fixed', 
          top: '0', 
          right: showForm ? 0 : '-450px', 
          width: '100%', maxWidth: '400px', 
          height: '100vh', 
          background: '#fff', 
          zIndex: 5000, 
          padding: '40px',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
          transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          borderLeft: '1px solid #eee', 
          display: 'flex', 
          flexDirection: 'column',
          overflowY: 'auto' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "900", margin: 0 }}>Verification Brief</h2>
          <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#ccc' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required style={inputStyle} />
          <input name="title" value={form.title} onChange={handleChange} placeholder="Job Title" required style={inputStyle} />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Write assessment..." required style={{ ...inputStyle, minHeight: "200px", resize: "none" }} />
          
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>Expert Avatar (Optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />

          <button type="submit" style={buttonStyle}>Submit to Feed</button>
          {success && <p style={{ color: 'green', fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>{success}</p>}
        </form>
      </aside>
    </div>
  );
};

const inputStyle = { width: "100%", padding: "16px", borderRadius: "10px", border: "1px solid #eee", fontSize: "0.95rem", background: '#fafafa' };
const buttonStyle = { width: "100%", cursor: "pointer", padding: "18px", background: "#111", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "900", textTransform: "uppercase" };

export default Testimonials;
