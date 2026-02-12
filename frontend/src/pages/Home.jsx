import React, { useState, useEffect } from "react";
import API from "../api/api.jsx"; 
import { Link } from "react-router-dom";

const Home = () => {
  const [hero, setHero] = useState(null); 
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [storyData, setStoryData] = useState(null);

  // Dynamic Year Logic
  const currentYear = new Date().getFullYear();
  const yearFirstTwo = currentYear.toString().slice(0, 2); // e.g., "20"
  const yearLastTwo = currentYear.toString().slice(2, 4);  // e.g., "26"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, skillsRes, projectsRes, aboutRes] = await Promise.all([
          API.get("/hero"), 
          API.get("/skills"),
          API.get("/projects"),
          API.get("/about")
        ]);

        const heroData = Array.isArray(heroRes.data) ? heroRes.data[0] : heroRes.data;
        setHero(heroData);

        const aboutData = Array.isArray(aboutRes.data) ? aboutRes.data : [aboutRes.data];
        const latestStory = aboutData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setStoryData(latestStory);

        setSkills(skillsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const paragraphStyle = {
    fontSize: '1.1rem',
    color: '#555',
    lineHeight: '1.7',
    textAlign: 'justify',
    hyphens: 'auto'
  };

  return (
    <div style={{ backgroundColor: '#fff', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', scrollBehavior: 'smooth' }}>
      
      {/* 1. NAVIGATION BAR - DYNAMIC YEAR STYLED */}
      <nav style={{ 
        height: "80px", 
        padding: '20px 50px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        position: 'sticky', 
        top: 0, 
        background: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(10px)', 
        zIndex: 100, 
        borderBottom: '1px solid #eee' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {hero?.image && (
            <img 
              src={hero.image} 
              alt="H.Mekonnen Profile" 
              style={{ 
                width: '35px', 
                height: '35px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '1px solid #eee' 
              }} 
            />
          )}
          <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>Haimanot Beka</div>
        </div>

        {/* LOGO STYLE - NOW DYNAMIC BASED ON CALENDAR */}
        <h1 style={{ 
          margin: 0, 
          fontSize: '3rem', 
          fontWeight: '900', 
          letterSpacing: '80px',
          display: 'flex'
        }}>
          <span style={{ color: '#111' }}>{yearFirstTwo}</span>
          <span style={{ color: '#0070f3' }}>{yearLastTwo}</span>
        </h1>
        
        <div style={{ display: 'flex', gap: '30px', fontWeight: '500' }}>
          <a href="#about" style={{ textDecoration: 'none', color: '#111' }}>My Story</a>
          <a href="#skills" style={{ textDecoration: 'none', color: '#111' }}>Languages</a>
          <a href="#work" style={{ textDecoration: 'none', color: '#111' }}>Features</a>
         
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* 2. HERO SECTION */}
        <section id="home" style={{ display: 'flex', alignItems: 'stretch', gap: '60px', flexWrap: 'wrap', padding: '40px 0', minHeight: '80vh' }}>
          
          <div style={{ flex: 1.5, minWidth: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '5rem', lineHeight: '0.9', marginBottom: '30px', letterSpacing: '-3px' }}>
                {hero?.title ? (
                  <>
                    {hero.title.split(' ')[0]} <br/>
                    <span style={{ color: '#0070f3' }}>{hero.title.split(' ')[1]}</span> <br/>
                    {hero.title.split(' ').slice(2).join(' ')}
                  </>
                ) : (
                  <>Building <br/><span style={{ color: '#0070f3' }}>Digital</span> <br/>Excellence.</>
                )}
              </h1>
              <p style={{ textAlign:"center", fontSize: '1.5rem', color: '#111', fontWeight: '600', marginBottom: '15px' }}>
                {hero?.subtitle || "Portfolio Architect"}
              </p>
              
              <div style={{ maxWidth: '500px' }}>
                <p style={{ ...paragraphStyle, marginBottom: '20px', fontSize: '1.2rem', color: '#111' }}>
                  {hero?.description || "Loading specialized infrastructure..."}
                </p>
                <p style={{ ...paragraphStyle, color: '#888' }}>
                  "{hero?.quote || "Engineering vision into reality."}"
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', paddingTop: '20px', flexWrap: 'wrap' }}>
              <a href="/projects" style={{ padding: '16px 28px', background: '#111', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Explore Projects</a>
              <button style={{ padding: '16px 28px', background: 'transparent', border: '1px solid #111', borderRadius: '8px', fontWeight: 'bold' }}>Get CV</button>
            </div>
          </div>
          
          <div style={{ flex: 1, minWidth: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
             {hero?.image && (
               <img 
                src={hero.image} 
                alt={hero?.name || "Hero Image"} 
                style={{ width: '100%', borderRadius: '24px', boxShadow: '20px 20px 0px #f8f8f8', objectFit: 'cover' }} 
              />
             )}
            
            <div style={{ textAlign: "center", marginTop: '60px', position: 'relative', zIndex: 5 }}>
              <div style={{ marginTop: '-75px' }}> 
                <div style={{ marginTop: '3px' }}>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1px', margin: '0', color: '#000', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                    {hero?.name || "Haimanot Beka Mekonnen"}
                  </h2>
                  <p style={{ color: '#0070f3', fontWeight: '700', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', margin: '2px 0 0 0' }}>
                    {hero?.role || "Principal Engineer"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ABOUT SECTION */}
        <section id="about" style={{ padding: '80px 0', borderTop: '1px solid #eee' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '60px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div>
                <h2 style={{textAlign:"center", fontSize: '3rem', margin: 0 }}>The Story</h2>
              </div>
              <div style={{ width: '100%', height: '580px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', backgroundColor: '#f0f0f0' }}>
                {storyData?.image && (
                   <img 
                    src={storyData.image} 
                    alt="Story Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                )}
              </div>
            </div>
            
            <div style={{ paddingTop: '100px' }}>
              <p style={{ ...paragraphStyle, fontSize: '1.5rem', color: '#111', marginBottom: '30px', fontWeight: '500' }}>
                {storyData?.title || `I am ${hero?.name || "Haimanot Beka Mekonnen"}`}
              </p>
              <p style={{ ...paragraphStyle, fontSize: '1.2rem', color: '#555' }}>
                {storyData?.description || "I specialize in bridging the gap between high-level user requirements and delivery of high-performance codebases."}
              </p>
            </div>
          </div>
        </section>

        {/* 5. PROJECTS SECTION */}
        <section id="work" style={{ padding: '80px 0', borderTop: '1px solid #eee' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '60px', textAlign: 'center' }}>Featured Projects</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {projects.map((project, index) => {
                const git = project.github || project.githubLink || project.repo;
                const live = project.live || project.liveLink || project.link || project.url;
                const video = project.video || project.youtube || project.demo;

                return (
                <div key={project._id || index} style={{ display: 'flex', gap: '60px', alignItems: 'center', flexDirection: index % 2 !== 0 ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '300px', height: '450px', background: '#f0f0f0', borderRadius: '30px', overflow: 'hidden' }}>
                    {project.image && (
                      <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{project.title}</h3>
                    <p style={{ ...paragraphStyle, fontSize: '1.2rem', marginBottom: '20px' }}>
                      <strong style={{color: '#0070f3'}}>OAA </strong> {project.description}
                    </p>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '25px' }}>
                      {git && (
                        <a href={git} target="_blank" rel="noreferrer" style={{ fontWeight: '800', color: '#111', textDecoration: 'none', borderBottom: '2px solid #111', fontSize: '0.9rem' }}>
                          GITHUB
                        </a>
                      )}
                      {live && (
                        <a href={live} target="_blank" rel="noreferrer" style={{ fontWeight: '800', color: '#0070f3', textDecoration: 'none', borderBottom: '2px solid #0070f3', fontSize: '0.9rem' }}>
                          LIVE SITE
                        </a>
                      )}
                      {video && (
                        <a href={video} target="_blank" rel="noreferrer" style={{ fontWeight: '800', color: '#ff0000', textDecoration: 'none', borderBottom: '2px solid #ff0000', fontSize: '0.9rem' }}>
                          WATCH DEMO
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )})}
          </div>
        </section>
        
        {/* 4. SKILLS SECTION */}
        <section id="skills" style={{ padding: '80px 0', borderTop: '1px solid #eee' }}>
          <div style={{ maxWidth: '1100px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '50px' }}>Technical Mastery</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {skills.map((skill, index) => (
                <div key={skill._id || index} style={{ borderLeft: '2px solid #0070f3', padding: '15px 25px', background: '#fdfdfd', border: '1px solid #f1f5f9' }}>
                  <h4 style={{ color: '#111', fontSize: '1.4rem', marginBottom: '5px', margin: 0 }}>{skill.name}</h4>
                  <p style={{ color: '#0070f3', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>{skill.level}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;
