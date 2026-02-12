import React, { useState, useEffect } from "react";
import API from "../api/api.jsx";
import "./LandingPage.css";

const YouTubeEmbed = ({ videoId, title, isAutoplay = false }) => {
  const isCloudinary = videoId?.includes("cloudinary.com");

  if (isCloudinary) {
    return (
      <div className="yt-embed-container">
        <video 
          src={videoId} 
          controls 
          autoPlay={isAutoplay} 
          muted={isAutoplay} 
          loop={isAutoplay}
          className="yt-video-element"
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
    <div className="yt-embed-container">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${cleanId}${params}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="yt-iframe-element"
      />
    </div>
  );
};

const LandingPage = () => {
  const [landing, setLanding] = useState(() => {
    const savedData = localStorage.getItem("portfolio_landing_cache");
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const response = await API.get("/landing");
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
    <div className="lp-container">
      {/* 1️⃣ HERO SECTION */}
      <section className="lp-hero-section">
        <div className="lp-content-wrapper">
          <div className="lp-hero-grid">
            <div className="lp-hero-text-wrapper">
              <h1 className="lp-main-title">
                {landing?.title ? (
                   <>
                    {landing.title.split(' ')[0]} <span className="lp-text-gradient">{landing.title.split(' ').slice(1).join(' ')}</span>
                   </>
                ) : (
                  <>Building <span className="lp-text-gradient">Digital</span> Excellence</>
                )}
              </h1>
              <p className="lp-description">
                {landing?.description || "My name is Haimanot Beka Mekonnen, a Software Engineering student at Addis Ababa University and a high-performance Full-Stack Developer. My work is a fusion of rigorous academic standards and creative digital execution. I specialize in architecting the complete lifecycle of an application—from building intuitive, high-speed frontend interfaces to engineering secure, scalable backend systems. For me, coding is a powerful medium of self-expression; I view every project as a manifesto for clean architecture and technical excellence. Beyond building, I am a dedicated technical educator, producing in-depth tutorials that demystify complex code, ensuring that innovation and knowledge are accessible to the next generation of engineers."}
              </p>
            </div>
            <div className="lp-hero-image-wrapper">
              <div className="lp-hero-image-container">
                <img 
                  src={getImageUrl(landing?.heroImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770572615/portfolio/e9w0fstodhbevdxhnnnf.jpg")} 
                  alt="Professional Profile" 
                  className="lp-owner-img-hero" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ MAIN SHOWCASE (MY CAMPUS) */}
      <section className="lp-video-section-top">
        <div className="lp-content-wrapper">
          <div className="lp-hero-text-wrapper">
            <h2 className="lp-main-title">
              {landing?.missionTitle || <>My <span className="lp-text-gradient">Campus</span></>}
            </h2>
            <p className="lp-description" style={{ maxWidth: "800px" }}>
              {landing?.missionDescription ||  "Studying Software Engineering at Addis Ababa University (AAU) is more than just an academic path; it is the foundation of my professional identity. As Ethiopia’s flagship institution, AAU—specifically the historic Sidist Kilo and 6 Kilo (AAiT) campuses—provides a rigorous environment where the spirit of innovation meets deep-rooted tradition. The university’s motto, Prove all things; hold fast that which is good, has become my personal engineering philosophy. It has taught me to approach every line of code with critical thinking and to build solutions that aren't just functional, but enduring and impactful. The challenges of a high-standard curriculum have shaped my resilience and problem-solving mindset. Being surrounded by some of the brightest minds in the country pushed me to look beyond local boundaries and compete at a global level. This environment is where my passion for Full-Stack Development was born—I realized that to truly solve problems, I needed to understand the entire digital ecosystem. AAU's emphasis on \"serving humanity through knowledge\" is the reason I create coding tutorials today; I believe that the prestige of an AAU education comes with a responsibility to share that knowledge and elevate the tech community around me."}
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
             <div className="lp-video-wrapper">
                <YouTubeEmbed
                  videoId={PORTFOLIO_ASSETS.mainShowcaseId}
                  title="Main Showcase"
                  isAutoplay={true}
                />
              </div>
              <div className="lp-hero-image-container">
                <img 
                  src={getImageUrl(landing?.image, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770619033/portfolio/yvc5rfpk5et01rwqrkim.png")} 
                  alt="Campus Background" 
                  className="lp-owner-img-hero" 
                />
              </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ ACADEMIC AWARDS */}
      <section className="lp-hero-section">
        <div className="lp-content-wrapper">
          <div className="lp-hero-grid">
            <div className="lp-hero-text-wrapper">
              <h2 className="lp-main-title"> Academic <span className="lp-text-gradient">Awards</span></h2>
              <p className="lp-description">
                {landing?.personalBio || "Driven by a relentless pursuit of excellence at Addis Ababa University, my academic journey is defined by high-level achievements and technical innovation. Being recognized as a Top Academic Performer within the Software Engineering department is a testament to my dedication to mastering complex theoretical concepts and translating them into practical, real-world solutions. These awards represent more than just grades; they signify my ability to lead as an Innovation Leader, consistently pushing the boundaries of what is possible in full-stack development. Whether optimizing backend algorithms or architecting intuitive frontend systems, my academic success reflects a deep-seated commitment to quality and a passion for engineering products that meet the highest standards of the industry."}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {landing?.awards ? (
                  landing.awards.split(',').map((award, index) => (
                    <p key={index} className="lp-award-item">• {award.trim()}</p>
                  ))
                ) : (
                  <>
                    <p className="lp-award-item">• Top Academic Performer</p>
                    <p className="lp-award-item">• Innovation Leader</p>
                  </>
                )}
              </div>
            </div>
            <div className="lp-hero-image-wrapper">
              <div className="lp-hero-image-container">
                <img 
                  src={getImageUrl(landing?.aboutImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770619475/portfolio/izvpeipsofgqj58dnwpj.avif")} 
                  alt="Academic Awards" 
                  className="lp-owner-img-hero" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ FEATURED PROJECT */}
      <section className="lp-video-section">
        <div className="lp-content-wrapper">
          <div className="lp-section-header">
            <h2 className="lp-main-title">Academic <span className="lp-text-gradient">Events</span></h2>
          </div>
          <div className="lp-video-wrapper" style={{ height: "500px" }}>
            <YouTubeEmbed videoId={PORTFOLIO_ASSETS.selectedProjectId} title="Selected Project" isAutoplay={true} />
          </div>
        </div>
      </section>

      {/* 5️⃣ TECHNICAL PROOF & TUTORIALS */}
      <section className="lp-owner-gallery-section">
        <div className="lp-content-wrapper">
          <div className="lp-section-header">
            <h2 className="lp-main-title">Technical <span className="lp-text-gradient">Proof</span></h2>
          </div>
          <div className="lp-video-grid-container">
            <div className="lp-gallery-item-video"><YouTubeEmbed videoId={PORTFOLIO_ASSETS.architectureId} title="Architecture" isAutoplay={true} /></div>
            <div className="lp-gallery-item-video"><YouTubeEmbed videoId={PORTFOLIO_ASSETS.innovationId} title="Innovation" isAutoplay={true} /></div>
          </div>
          
          <div className="lp-hero-grid" style={{ marginTop: "80px" }}>
            <div className="lp-hero-image-wrapper">
              <div className="lp-hero-image-container">
                <img 
                  src={getImageUrl(landing?.tutorialImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770621612/portfolio/iiahvf8cdrxpetttftky.jpg")} 
                  alt="Tutorials" 
                  className="lp-owner-img-hero" 
                />
              </div>
            </div>
            <div className="lp-hero-text-wrapper">
              <h2 className="lp-main-title">Knowledge <span className="lp-text-gradient">Sharing</span></h2>
              <p className="lp-description">
                {landing?.tutorialDesc || "My approach to technical education is rooted in the belief that true mastery comes from the ability to simplify the complex. Through my coding tutorials, I provide a comprehensive roadmap for developers looking to navigate the intricate world of full-stack engineering. I don't just teach syntax; I focus on the behind every architectural decision, from optimizing backend database queries to crafting responsive frontend components. By documenting my journey as a student at Addis Ababa University, I turn academic rigor into practical, production-ready knowledge. My goal is to empower others to build their own digital voices, ensuring that high-quality technical education is accessible, modular, and grounded in industry-standard clean code practices."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ LIFESTYLE */}
      <section className="lp-hero-section">
        <div className="lp-content-wrapper">
          <div className="lp-hero-grid">
            <div className="lp-hero-text-wrapper">
              <h2 className="lp-main-title">Life Beyond <span className="lp-text-gradient">Work</span></h2>
              <p className="lp-description">
                {landing?.lifestyleDesc || "I believe in a balanced life where curiosity and passion drive everything I do.Outside the world of compilers and full-stack architecture, I believe in a philosophy of balanced growth and constant curiosity. For me, life beyond work is about exploring the intersection of technology and human experience. Whether I am exploring the vibrant landscapes of Ethiopia or diving into a new creative hobby, I seek out experiences that broaden my perspective and recharge my creative energy. This balance is what allows me to return to the keyboard with fresh ideas and a renewed focus. I am a firm believer that being a great engineer requires understanding the world you are building for, and I find that inspiration everywhere—from the historic streets surrounding the Addis Ababa University campus to the latest developments in art and global culture."}
              </p>
            </div>
            <div className="lp-hero-image-wrapper">
              <div className="lp-hero-image-container">
                <img 
                  src={getImageUrl(landing?.lifestyleImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770621614/portfolio/ow87lbfgpdt62nigg6st.jpg")} 
                  alt="Lifestyle" 
                  className="lp-owner-img-hero" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-content-wrapper">
          <div className="lp-contact-group">
            <div className="lp-contact-item"><strong>Haimanot Beka Mekonnen</strong></div>
            <div className="lp-contact-item"><span style={{ color: "#2563eb" }}>Full-Stack Developer</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
