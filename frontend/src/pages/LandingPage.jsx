import React, { useState, useEffect } from "react";
import API from "../api/api.jsx";
import "./LandingPage.css"; 

const YouTubeEmbed = ({ videoId, title, isAutoplay = false }) => {
  const isCloudinary = videoId?.includes("cloudinary.com");

  if (isCloudinary) {
    return (
      <div className="media-bg-container">
        <video 
          src={videoId} 
          controls 
          autoPlay={isAutoplay} 
          muted={isAutoplay} 
          loop={isAutoplay}
          className="media-fill"
        />
      </div>
    );
  }

  const getCleanId = (id) => {
    if (!id) return "";
    if (id.includes("v=")) return id.split("v=")[1].split("&")[0];
    if (id.includes("youtu.be/")) return id.split("youtu.be/")[1].split("?")[0];
    return id;
  };

  const cleanId = getCleanId(videoId);

  const params = isAutoplay
    ? `?autoplay=1&mute=1&loop=1&playlist=${cleanId}&controls=0&modestbranding=1&rel=0`
    : `?autoplay=0&mute=0&controls=1&modestbranding=1&rel=0`;

  return (
    <div className="media-bg-container">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${cleanId}${params}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: "none", position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

const LandingPage = () => {
  const [landing, setLanding] = useState(() => {
    const savedData = localStorage.getItem("portfolio_landing_cache");
    return savedData ? JSON.parse(savedData) : null;
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);

    const fetchLandingData = async () => {
      try {
        // Adjusted to /landingheros to match your server.js plural route
        const response = await API.get("/landingheros");
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        
        if (data) {
          setLanding(data);
          localStorage.setItem("portfolio_landing_cache", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Failed to fetch landing page:", error);
      }
    };
    fetchLandingData();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getImageUrl = (path, fallback) => {
    if (!path) return fallback;
    if (path.startsWith("http")) return path; 
    return `${API.defaults.baseURL}${path}`; 
  };

  const PORTFOLIO_ASSETS = {
    mainShowcaseId: landing?.mainShowcaseId || "ym-Q_7BgoV0",
    selectedProjectId: landing?.selectedProjectId || "EWTrBBjJk64",
    architectureId: landing?.architectureId || "helX4z4-2sc",
    innovationId: landing?.innovationId || "KYPWqoTO0vw",
    professionalId: landing?.professionalId || "S-ZQC-PIKy4"
  };

  return (
    <div className="portfolio-container">
      {/* 1️⃣ HERO SECTION */}
      <section style={{ paddingTop: "60px" }} className="hero-section">
        <div className="content-wrapper">
          <div className="hero-grid" style={{ alignItems: "start" }}>
            <div className="hero-text-wrapper">
              <h1 className="main-title" style={{ marginTop: "0" }}>
                {landing?.title ? (
                   <>
                    {landing.title.split(' ')[0]}{" "}
                    <span className="text-gradient">
                      {landing.title.split(' ').slice(1).join(' ')}
                    </span>
                   </>
                ) : (
                  <>Building<br/> <span className="text-gradient">Digital<br/></span> Excellence</>
                )}
              </h1>
              <p className="description">
                {landing?.description || "My name is Haimanot Beka Mekonnen, a dedicated Software Engineering student at Addis Ababa University."}
              </p>
            </div>

            <div className="hero-image-wrapper">
              <div className="hero-image-container">
                <img 
                  src={getImageUrl(landing?.heroImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770572615/portfolio/e9w0fstodhbevdxhnnnf.jpg")} 
                  alt="Professional Profile" 
                  className="owner-img-hero" 
                />
              </div>
              <div className="hero-owner-info" style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '0', fontSize: '1.5rem', fontWeight: '800' }}>Haimanot Beka Mekonnen</h3>
                <p style={{ margin: '5px 0 0', color: '#2563eb', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Stack Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ MAIN SHOWCASE (MY CAMPUS) */}
      <section className="video-section-top">
        <div className="content-wrapper">
          <h2 className="main-title">
            {landing?.missionTitle || <>My <span className="text-gradient">Campus</span></>}
          </h2>
          
          <div className="hero-grid" style={{ alignItems: "center" }}>
             <p className="description" style={{ margin: 0 }}>
                {landing?.missionDescription ? landing.missionDescription : "Studying Software Engineering at Addis Ababa University (AAU) is more than just an academic path. It is an immersion into Ethiopia's hub of technical innovation."}
             </p>
             <div className="hero-image-container">
                {/* Adjusted field name to campusImage to match Admin syncing */}
                <img src={getImageUrl(landing?.campusImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770619033/portfolio/yvc5rfpk5et01rwqrkim.png")} alt="Campus" className="owner-img-hero" />
             </div>
          </div>

          <div className="video-wrapper" style={{ marginTop: "40px" }}>
             <YouTubeEmbed videoId={PORTFOLIO_ASSETS.mainShowcaseId} title="Main Showcase" isAutoplay={true} />
          </div>
        </div>
      </section>

      {/* 3️⃣ ACADEMIC AWARDS */}
      <section className="hero-section">
        <div className="content-wrapper">
          <h2 className="main-title"><span className="text-gradient">Awards</span></h2>
          
          <div className="hero-grid" style={{ alignItems: "start" }}>
            <div className="hero-text-wrapper">
              <div className="description">
                {landing?.personalBio || "Driven by a relentless pursuit of excellence at Addis Ababa University..."}
              </div>
              <div className="awards-list">
                {landing?.awards ? (
                  landing.awards.split(',').map((award, index) => (
                    <p key={index} className="award-item">• {award.trim()}</p>
                  ))
                ) : (
                  <>
                    <p className="award-item">• Top Academic Performer</p>
                    <p className="award-item">• Innovation Leader</p>
                  </>
                )}
              </div>
            </div>

            <div className="hero-image-wrapper">
              <div className="hero-image-container">
                <img src={getImageUrl(landing?.aboutImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770619475/portfolio/izvpeipsofgqj58dnwpj.avif")} alt="Awards" className="owner-img-hero" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ KNOWLEDGE SHARING */}
      <section className="owner-gallery-section">
        <div className="content-wrapper">
          <h2 className="main-title">Knowledge <br/><span className="text-gradient">Sharing</span></h2>
          <div className="hero-grid" style={{ alignItems: "start" }}>
            <p className="description" style={{ margin: 0 }}>
              {landing?.tutorialDesc || "My approach to technical education is rooted in the belief that true mastery is achieved when one can simplify complex concepts."}
            </p>
            <div className="hero-image-wrapper">
               <div className="hero-image-container" style={{ maxWidth: "380px" }}>
                  <img src={getImageUrl(landing?.tutorialImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770621612/portfolio/iiahvf8cdrxpetttftky.jpg")} alt="Tutorials" className="owner-img-hero" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ LIFESTYLE */}
      <section className="hero-section">
        <div className="content-wrapper">
          <h2 className="main-title">Life Beyond <br/><span className="text-gradient">Work</span></h2>
          
          <div className="hero-grid" style={{ alignItems: "start" }}>
            <p className="description" style={{ margin: 0 }}>
              {landing?.lifestyleDesc || "I believe in a balanced life where curiosity and passion drive everything I do."}
            </p>
            <div className="hero-image-wrapper">
              <div className="hero-image-container">
                <img src={getImageUrl(landing?.lifestyleImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770621614/portfolio/ow87lbfgpdt62nigg6st.jpg")} alt="Lifestyle" className="owner-img-hero" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-style">
        <div className="content-wrapper">
          <div className="contact-group">
            <div className="contact-item"><strong>Haimanot Beka Mekonnen</strong></div>
            <div className="contact-item"><span className="blue-text">Full-Stack Developer</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;