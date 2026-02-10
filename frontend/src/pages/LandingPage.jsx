import React, { useState, useEffect } from "react";
import API from "../api/api.jsx";

const YouTubeEmbed = ({ videoId, title, isAutoplay = false }) => {
  const isCloudinary = videoId?.includes("cloudinary.com");

  if (isCloudinary) {
    return (
      <div style={{ width: "100%", height: "100%", backgroundColor: "#f8fafc", position: "relative" }}>
        <video 
          src={videoId} 
          controls 
          autoPlay={isAutoplay} 
          muted={isAutoplay} 
          loop={isAutoplay}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  // Helper to extract ID from URL if necessary to ensure params like playlist (for looping) work
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
    <div style={{ width: "100%", height: "100%", backgroundColor: "#f8fafc", position: "relative" }}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${cleanId}${params}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: "none" }}
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
    <div style={containerStyle}>
      {/* 1️⃣ HERO SECTION */}
      <section style={heroSection}>
        <div style={contentWrapper}>
          <div style={heroGrid}>
            <div style={heroTextWrapper}>
              <h1 style={mainTitle}>
                {landing?.title ? (
                   <>
                    {landing.title.split(' ')[0]} <span style={textGradient}>{landing.title.split(' ').slice(1).join(' ')}</span>
                   </>
                ) : (
                  <>Building <span style={textGradient}>Digital</span> Excellence</>
                )}
              </h1>
              <p style={description}>
                {landing?.description || "My name is Haimanot Beka Mekonnen, a Software Engineering student at Addis Ababa University and a high-performance Full-Stack Developer. My work is a fusion of rigorous academic standards and creative digital execution. I specialize in architecting the complete lifecycle of an application—from building intuitive, high-speed frontend interfaces to engineering secure, scalable backend systems. For me, coding is a powerful medium of self-expression; I view every project as a manifesto for clean architecture and technical excellence. Beyond building, I am a dedicated technical educator, producing in-depth tutorials that demystify complex code, ensuring that innovation and knowledge are accessible to the next generation of engineers."}
              </p>
            </div>
            <div style={heroImageWrapper}>
              <div style={heroImageContainer}>
                <img 
                  src={getImageUrl(landing?.heroImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770572615/portfolio/e9w0fstodhbevdxhnnnf.jpg")} 
                  alt="Professional Profile" 
                  style={ownerImgStyleHero} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ MAIN SHOWCASE (MY CAMPUS) */}
      <section style={videoSectionTop}>
        <div style={contentWrapper}>
          <div style={heroTextWrapper}>
            <h2 style={mainTitle}>
              {landing?.missionTitle || <>My <span style={textGradient}>Campus</span></>}
            </h2>
            <p style={{...description, maxWidth: "800px"}}>
              {landing?.missionDescription ||  "Studying Software Engineering at Addis Ababa University (AAU) is more than just an academic path; it is the foundation of my professional identity. As Ethiopia’s flagship institution, AAU—specifically the historic Sidist Kilo and 6 Kilo (AAiT) campuses—provides a rigorous environment where the spirit of innovation meets deep-rooted tradition. The university’s motto, Prove all things; hold fast that which is good, has become my personal engineering philosophy. It has taught me to approach every line of code with critical thinking and to build solutions that aren't just functional, but enduring and impactful. The challenges of a high-standard curriculum have shaped my resilience and problem-solving mindset. Being surrounded by some of the brightest minds in the country pushed me to look beyond local boundaries and compete at a global level. This environment is where my passion for Full-Stack Development was born—I realized that to truly solve problems, I needed to understand the entire digital ecosystem. AAU's emphasis on \"serving humanity through knowledge\" is the reason I create coding tutorials today; I believe that the prestige of an AAU education comes with a responsibility to share that knowledge and elevate the tech community around me."}
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
             <div style={videoWrapper}>
                <YouTubeEmbed
                  videoId={PORTFOLIO_ASSETS.mainShowcaseId}
                  title="Main Showcase"
                  isAutoplay={true}
                />
              </div>
              <div style={heroImageContainer}>
                <img 
                  src={getImageUrl(landing?.image, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770619033/portfolio/yvc5rfpk5et01rwqrkim.png")} 
                  alt="Campus Background" 
                  style={ownerImgStyleHero} 
                />
              </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ ACADEMIC AWARDS */}
      <section style={heroSection}>
        <div style={contentWrapper}>
          <div style={heroGrid}>
            <div style={heroTextWrapper}>
              <h2 style={mainTitle}> Academic <span style={textGradient}>Awards</span></h2>
              <p style={description}>
                {landing?.personalBio || "Driven by a relentless pursuit of excellence at Addis Ababa University, my academic journey is defined by high-level achievements and technical innovation. Being recognized as a Top Academic Performer within the Software Engineering department is a testament to my dedication to mastering complex theoretical concepts and translating them into practical, real-world solutions. These awards represent more than just grades; they signify my ability to lead as an Innovation Leader, consistently pushing the boundaries of what is possible in full-stack development. Whether optimizing backend algorithms or architecting intuitive frontend systems, my academic success reflects a deep-seated commitment to quality and a passion for engineering products that meet the highest standards of the industry."}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {landing?.awards ? (
                  landing.awards.split(',').map((award, index) => (
                    <p key={index} style={awardItem}>• {award.trim()}</p>
                  ))
                ) : (
                  <>
                    <p style={awardItem}>• Top Academic Performer</p>
                    <p style={awardItem}>• Innovation Leader</p>
                  </>
                )}
              </div>
            </div>
            <div style={heroImageWrapper}>
              <div style={heroImageContainer}>
                <img 
                  src={getImageUrl(landing?.aboutImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770619475/portfolio/izvpeipsofgqj58dnwpj.avif")} 
                  alt="Academic Awards" 
                  style={ownerImgStyleHero} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ FEATURED PROJECT */}
      <section style={videoSection}>
        <div style={contentWrapper}>
          <div style={sectionHeader}>
            <h2 style={mainTitle}>Academic <span style={textGradient}>Events</span></h2>
          </div>
          <div style={{...videoWrapper, height: "500px"}}>
            {/* Added isAutoplay={true} here */}
            <YouTubeEmbed videoId={PORTFOLIO_ASSETS.selectedProjectId} title="Selected Project" isAutoplay={true} />
          </div>
        </div>
      </section>

      {/* 5️⃣ TECHNICAL PROOF & TUTORIALS */}
      <section style={ownerGallerySection}>
        <div style={contentWrapper}>
          <div style={sectionHeader}>
            <h2 style={mainTitle}>Technical <span style={textGradient}>Proof</span></h2>
          </div>
          <div style={videoGridContainer}>
            {/* Added isAutoplay={true} here */}
            <div style={galleryItemVideo}><YouTubeEmbed videoId={PORTFOLIO_ASSETS.architectureId} title="Architecture" isAutoplay={true} /></div>
            <div style={galleryItemVideo}><YouTubeEmbed videoId={PORTFOLIO_ASSETS.innovationId} title="Innovation" isAutoplay={true} /></div>
          </div>
          
          <div style={{...heroGrid, marginTop: "80px"}}>
            <div style={heroImageWrapper}>
              <div style={heroImageContainer}>
                <img 
                  src={getImageUrl(landing?.tutorialImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770621612/portfolio/iiahvf8cdrxpetttftky.jpg")} 
                  alt="Tutorials" 
                  style={ownerImgStyleHero} 
                />
              </div>
            </div>
            <div style={heroTextWrapper}>
              <h2 style={mainTitle}>Knowledge <span style={textGradient}>Sharing</span></h2>
              <p style={description}>
                {landing?.tutorialDesc || "My approach to technical education is rooted in the belief that true mastery comes from the ability to simplify the complex. Through my coding tutorials, I provide a comprehensive roadmap for developers looking to navigate the intricate world of full-stack engineering. I don't just teach syntax; I focus on the behind every architectural decision, from optimizing backend database queries to crafting responsive frontend components. By documenting my journey as a student at Addis Ababa University, I turn academic rigor into practical, production-ready knowledge. My goal is to empower others to build their own digital voices, ensuring that high-quality technical education is accessible, modular, and grounded in industry-standard clean code practices."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ LIFESTYLE */}
      <section style={heroSection}>
        <div style={contentWrapper}>
          <div style={heroGrid}>
            <div style={heroTextWrapper}>
              <h2 style={mainTitle}>Life Beyond <span style={textGradient}>Work</span></h2>
              <p style={description}>
                {landing?.lifestyleDesc || "I believe in a balanced life where curiosity and passion drive everything I do.Outside the world of compilers and full-stack architecture, I believe in a philosophy of balanced growth and constant curiosity. For me, life beyond work is about exploring the intersection of technology and human experience. Whether I am exploring the vibrant landscapes of Ethiopia or diving into a new creative hobby, I seek out experiences that broaden my perspective and recharge my creative energy. This balance is what allows me to return to the keyboard with fresh ideas and a renewed focus. I am a firm believer that being a great engineer requires understanding the world you are building for, and I find that inspiration everywhere—from the historic streets surrounding the Addis Ababa University campus to the latest developments in art and global culture."}
              </p>
            </div>
            <div style={heroImageWrapper}>
              <div style={heroImageContainer}>
                <img 
                  src={getImageUrl(landing?.lifestyleImage, "https://res.cloudinary.com/dq3jkpys8/image/upload/v1770621614/portfolio/ow87lbfgpdt62nigg6st.jpg")} 
                  alt="Lifestyle" 
                  style={ownerImgStyleHero} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={footerStyle}>
        <div style={contentWrapper}>
          <div style={contactGroup}>
            <div style={contactItem}><strong>Haimanot Beka Mekonnen</strong></div>
            <div style={contactItem}><span style={{color: "#2563eb"}}>Full-Stack Developer</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const containerStyle = { backgroundColor: "#ffffff", color: "#0f172a", fontFamily: "'Inter', sans-serif", overflowX: "hidden" };
const contentWrapper = { maxWidth: "1100px", margin: "0 auto", padding: "0 20px" };
const heroSection = { padding: "100px 0", backgroundColor: "#ffffff" };
const heroGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" };
const heroTextWrapper = { textAlign: "left" };
const mainTitle = { fontSize: "3.5rem", fontWeight: "900", letterSpacing: "-2px", lineHeight: "1.1", margin: "0 0 25px 0", color: "#0f172a" };
const textGradient = { color: "#2563eb", background: "linear-gradient(to right, #2563eb, #60a5fa)", WebkitBackgroundClip: "text", WebkitFillColor: "transparent" };
const description = { fontSize: "1.15rem", color: "#334155", marginBottom: "30px", lineHeight: "1.7", textAlign: "justify", hyphens: "auto", wordBreak: "break-word" };
const awardItem = { ...description, margin: 0, fontSize: "1.05rem", fontWeight: "500", color: "#1e293b", textAlign: "left" };
const heroImageWrapper = { position: "relative" };
const heroImageContainer = { height: "500px", overflow: "hidden", borderRadius: "30px", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" };
const ownerImgStyleHero = { width: "100%", height: "100%", objectFit: "cover" };
const videoSectionTop = { padding: "0 0 100px 0", backgroundColor: "#ffffff" };
const videoSection = { padding: "80px 0", backgroundColor: "#ffffff" };
const sectionHeader = { display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" };
const videoWrapper = { height: "500px", borderRadius: "40px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.05)", border: "1px solid #f1f5f9" };
const ownerGallerySection = { padding: "100px 0", backgroundColor: "#fcfdfe" }; 
const videoGridContainer = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "25px" };
const galleryItemVideo = { height: "300px", borderRadius: "24px", overflow: "hidden", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" };
const footerStyle = { padding: "60px 0", borderTop: "1px solid #f1f5f9", backgroundColor: "#ffffff" };
const contactGroup = { display: "flex", justifyContent: "center", gap: "60px" };
const contactItem = { fontSize: "1rem", color: "#475569" };

export default LandingPage;