import React, { useEffect, useState } from "react";
import API from "../api/api.jsx";
import ProjectCard from "../components/ProjectCard.jsx";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hero, setHero] = useState(null);
  const [mainHero, setMainHero] = useState(null);

  // Logic for dynamic calendar year
  const currentYear = new Date().getFullYear();
  const yearFirstTwo = currentYear.toString().slice(0, 2);
  const yearLastTwo = currentYear.toString().slice(2, 4);

  const categories = [
    "All", "Full-Stack", "Frontend", "Backend", "Mobile App", 
    "SaaS", "AI/ML", "UI/UX", "Blockchain", "Cybersecurity", 
    "Cloud Native", "DevOps", "Data Science", "E-commerce", 
    "API Design", "Open Source", "Automation"
  ];

  useEffect(() => {
    // Fetch Projects
    API.get("/projects")
      .then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      })
      .catch((err) => console.error("Error fetching projects:", err));

    // Fetch Project Hero
    API.get("/project-hero")
      .then((res) => {
        setHero(res.data);
      })
      .catch((err) => console.error("Error fetching project hero:", err));

    // Fetch Main Hero for Navbar Profile consistency
    API.get("/hero")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setMainHero(data);
      })
      .catch((err) => console.error("Error fetching main hero:", err));
  }, []);

  const handleFilter = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === cat));
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', scrollBehavior: 'smooth', minHeight: '100vh' }}>
      
      {/* 1. NAVIGATION BAR */}
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
        zIndex: 1100, 
        borderBottom: '1px solid #eee' 
      }}>
        {/* Profile Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '180px' }}>
          {mainHero?.image && (
            <img 
              src={mainHero.image} 
              alt="Profile" 
              style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} 
            />
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
            Repository
          </div>
        </div>
        
        {/* Category Links */}
        <div className="category-scroll" style={{ 
          display: 'flex', 
          gap: '25px', 
          fontWeight: '500', 
          fontSize: '0.9rem',
          maxWidth: '450px',
          overflowX: 'auto',
          padding: '5px 10px',
          scrollbarWidth: 'none'
        }}>
          <style>{`.category-scroll::-webkit-scrollbar { display: none; }`}</style>
          {categories.map((cat) => (
            <span
              key={cat}
              onClick={() => handleFilter(cat)}
              style={{ 
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: activeCategory === cat ? '#0070f3' : '#111',
                transition: 'color 0.2s ease',
                fontWeight: activeCategory === cat ? '700' : '500'
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* 2. HERO SECTION */}
        <section style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '60px', 
          flexWrap: 'wrap', 
          padding: '60px 0', 
          minHeight: '60vh' 
        }}>
          <div style={{ flex: 1.5, minWidth: '350px' }}>
            <h1 style={{ 
              fontSize: '5rem', 
              lineHeight: '0.9', 
              marginBottom: '40px', 
              letterSpacing: '-3px',
              fontWeight: '900'
            }}>
              {hero?.title ? (
                <>
                  {hero.title.split(' ').slice(0, -1).join(' ')} <br/>
                  <span style={{ color: '#0070f3' }}>
                    {hero.title.split(' ').slice(-1)}
                  </span>
                </>
              ) : (
                <>My Project <br/><span style={{ color: '#0070f3' }}>Repository</span></>
              )}
            </h1>
            
            <p style={{ 
              fontSize: '1.2rem',
              color: '#555',
              lineHeight: '1.7',
              textAlign: 'justify',
              maxWidth: '550px'
            }}>
              {hero?.description || "This index represents a complete breakdown of my technical capabilities. From the core MERN stack to edge technologies, each category holds a curated selection of my work."}
            </p>
          </div>
          
          <div style={{ flex: 1, minWidth: '350px' }}>
            {hero?.image ? (
              <img 
                src={hero.image} 
                alt="Architecture" 
                style={{ 
                  marginTop: "55px",
                  width: '100%', 
                  borderRadius: '24px', 
                  boxShadow: '20px 20px 0px #f8f8f8', 
                  objectFit: 'cover',
                  height: '550px',
                }} 
              />
            ) : (
              <div style={{ width: '100%', height: '550px', background: '#f8f8f8', borderRadius: '24px', marginTop: "55px" }}></div>
            )}
          </div>
        </section>

        <hr style={{ border: 'none', height: '1px', background: '#eee', margin: '0 0 80px 0' }} />

        {/* 3. DYNAMIC GRID */}
        <section style={{ paddingBottom: '100px' }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", 
            gap: "50px" 
          }}>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", padding: '100px 0', textAlign: 'center' }}>
                <p style={{ color: '#888', fontWeight: '800', letterSpacing: '2px', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  No active records found for {activeCategory}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Projects;