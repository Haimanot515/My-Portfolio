import React, { useState, useEffect } from "react";
import API from "../api/api.jsx";

const Skill = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]); 
  const [activeCategory, setActiveCategory] = useState("All");
  const [hero, setHero] = useState(null); 
  const [mainHero, setMainHero] = useState(null);

  // Logic for dynamic calendar year
  const currentYear = new Date().getFullYear();
  const yearFirstTwo = currentYear.toString().slice(0, 2);
  const yearLastTwo = currentYear.toString().slice(2, 4);

  // Categories list ensuring "All" and "Programming Languages" are distinct
  const categories = [
    "All", "Programming Languages", "Cybersecurity", "Frontend", 
    "Backend", "AI", "DevOps", "Mobile"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, heroRes, mainHeroRes] = await Promise.all([
          API.get("/skills"),
          API.get("/skill-hero"),
          API.get("/hero") 
        ]);
        
        setSkills(skillsRes.data);
        setFilteredSkills(skillsRes.data); // Default: Show all on load
        
        const heroData = Array.isArray(heroRes.data) ? heroRes.data[0] : heroRes.data;
        setHero(heroData);

        const mHeroData = Array.isArray(mainHeroRes.data) ? mainHeroRes.data[0] : mainHeroRes.data;
        setMainHero(mHeroData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilter = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      setFilteredSkills(skills);
    } else {
      setFilteredSkills(skills.filter(s => s.category === cat));
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', scrollBehavior: 'smooth', minHeight: '100vh' }}>
      
      {/* 1. NAVIGATION BAR - CONSISTENT WITH PROJECTS */}
      <nav style={{ 
        height: "80px", 
        padding: '0 50px', 
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
            {activeCategory === "All" ? "Repository" : activeCategory}
          </div>
        </div>
        
        {/* Category Links - Exact Styling from your Projects code */}
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
              {cat === "Programming Languages" ? "Languages" : cat}
            </span>
          ))}
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* 2. HERO SECTION - TIGHT VERTICAL SPACING */}
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
                <>Technical <br/><span style={{ color: '#0070f3' }}>Mastery</span></>
              )}
            </h1>

            <p style={{ 
              fontSize: '1.2rem',
              color: '#555',
              lineHeight: '1.7',
              textAlign: 'justify',
              maxWidth: '550px'
            }}>
              {hero?.description || "Architecting technical foundations and specialized implementations within the repository."}
            </p>

            {hero?.quote && (
              <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#888', borderLeft: '4px solid #0070f3', paddingLeft: '20px', fontSize: '0.95rem' }}>
                "{hero.quote}"
              </p>
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: '350px' }}>
            {hero?.image ? (
              <img 
                src={hero.image} 
                alt="Technical Architecture" 
                style={{ 
                  marginTop: "55px",
                  width: '100%', 
                  borderRadius: '24px', 
                  boxShadow: '20px 20px 0px #f8f8f8', 
                  objectFit: 'cover',
                  height: '550px'
                }} 
              />
            ) : (
              <div style={{ width: '100%', height: '550px', background: '#f8f8f8', borderRadius: '24px', marginTop: "55px" }}></div>
            )}
          </div>
        </section>

        <hr style={{ border: 'none', height: '1px', background: '#eee', margin: '0 0 80px 0' }} />

        {/* 3. SKILLS GRID */}
        <section style={{ paddingBottom: '100px' }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", 
            gap: "50px" 
          }}>
            {filteredSkills.map((skill, index) => (
              <div 
                key={skill._id || index} 
                style={{ 
                  padding: '40px', 
                  border: '1px solid #f0f0f0', 
                  borderRadius: '24px', 
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <img 
                    src={skill.image || "https://via.placeholder.com/60"} 
                    alt={skill.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
                  />
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: '900', 
                    color: '#0070f3', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px',
                    background: '#f0f7ff',
                    padding: '4px 12px',
                    borderRadius: '100px'
                  }}>
                    {skill.level}
                  </span>
                </div>

                <h3 style={{ margin: '0', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px' }}>
                  {skill.name}
                </h3>

                <p style={{ 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6', 
                  color: '#555', 
                  margin: '0',
                  minHeight: '80px'
                }}>
                  {skill.story || `Specialized implementation of ${skill.name}.`}
                </p>

                <div style={{ 
                  display: 'flex', 
                  gap: '15px', 
                  marginTop: '10px', 
                  paddingTop: '20px', 
                  borderTop: '1px solid #f5f5f5' 
                }}>
                  {['Where', 'When', 'How'].map((label) => (
                    <a 
                      key={label}
                      href={skill[`${label.toLowerCase()}Link`] || "#"} 
                      style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '800', 
                        color: '#111', 
                        textDecoration: 'none', 
                        borderBottom: '2px solid #eee',
                        textTransform: 'uppercase'
                      }}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Skill;
