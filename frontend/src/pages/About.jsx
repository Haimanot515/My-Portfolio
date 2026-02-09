import React, { useEffect, useState } from "react";
import API from "../api/api";

const About = () => {
  const [aboutList, setAboutList] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await API.get("/about");
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setAboutList(data);
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <div style={{ color: "#2563eb", fontWeight: "600", letterSpacing: "1px" }}>LOADING...</div>
    </div>
  );

  return (
    <section style={{ 
      width: "100%",
      background: "#ffffff",
      padding: "60px 0", 
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px" }}>
        {aboutList.map((item) => (
          <div key={item._id} style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            alignItems: "flex-start", // Changed to flex-start for a taller look
            justifyContent: "center",
            gap: "50px",
            marginBottom: "60px" 
          }}>
            
            {/* TALLER PHOTO SIDE */}
            <div style={{ flex: "0 1 380px", position: "relative" }}> 
              {item.image && (
                <div style={{ position: "relative", zIndex: 2 }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ 
                      width: "100%", 
                      height: "450px", // Increased height for impact
                      borderRadius: "20px",
                      objectFit: "cover", 
                      objectPosition: "center",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                      display: "block",
                      border: "4px solid #fff"
                    }}
                  />
                </div>
              )}
              {/* Artistic accent background */}
              <div style={{ 
                position: "absolute", 
                top: "20px", 
                left: "20px", 
                width: "100%", 
                height: "100%", 
                background: "#f1f5f9", 
                borderRadius: "20px", 
                zIndex: 1,
                border: "1px solid #e2e8f0" 
              }}></div>
            </div>

            {/* TEXT SIDE */}
            <div style={{ flex: "1.2 1 450px", paddingTop: "10px" }}>
              <span style={{ 
                color: "#2563eb", 
                fontWeight: "700", 
                textTransform: "uppercase", 
                letterSpacing: "2px",
                fontSize: "0.9rem" 
              }}>
                Software as a carear full stack developer addis abab university
              </span>
              
              <h2 style={{ 
                fontSize: "2.8rem", 
                color: "#0f172a", 
                margin: "15px 0", 
                fontWeight: "800",
                lineHeight: "1.1"
              }}>
                {item.title}
              </h2>

              <div style={{ 
                fontSize: "1.1rem", 
                lineHeight: "1.8", 
                color: "#475569", 
                textAlign: "justify",
                marginBottom: "30px"
              }}>
                <p style={{ whiteSpace: "pre-line" }}>{item.description}</p>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <div style={tagStyle}>AAIT Scholar</div>
                <div style={tagStyle}>Software Engineering</div>
                <div style={tagStyle}>MERN Stack</div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

const tagStyle = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "0.85rem",
  color: "#475569",
  fontWeight: "600"
};

export default About;