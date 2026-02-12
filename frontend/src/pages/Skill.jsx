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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, heroRes, mainHeroRes] = await Promise.all([
          API.get("/skills"),
          API.get("/skill-hero"),
          API.get("/hero") 
        ]);
        
        setSkills(skillsRes.data);
        setFilteredSkills(skillsRes.data); // "All" is default on load
        
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
      
      {/* 1. NAVIGATION BAR - "ALL" AT THE BEGINNING */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '160px' }}>
          {mainHero?.image && (
            <img 
              src={mainHero.image} 
              alt="Profile" 
              style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} 
            />
          )}
          <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>H.Mekonnen</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
          <div style={{ fontWeight: '900', fontSize: '1.5rem', lineHeight: '1' }}>
            <span style={{ color: '#eee' }}>{yearFirstTwo}</span>
            <span style={{ color: '#0070f3' }}>{yearLastTwo}</span>
          </div>
          <div style={{ fontSize: '0.6rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px', color: '#888' }}>
            {activeCategory === "All" ? "Full Stack Repository" : activeCategory}
          </div>
        </div>
        
        {/* SCROLLABLE NAV LINKS - "ALL" STARTING POSITION */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          fontWeight: '600', 
          fontSize: '0.8rem',
          overflowX: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none', 
          paddingLeft: '30px',
          maxWidth: '650px',
          textTransform: 'uppercase'
        }}>
          <span 
            onClick={() => handleFilter("All")} 
            style={{ 
              cursor: 'pointer', 
              color: activeCategory === "All" ? '#0070f3' : '#111',
              fontWeight: '900',
              paddingRight: '10px',
              borderRight: '1px solid #eee'
            }}
          >
            [All]
          </span>
          {["Programming Languages", "Cybersecurity", "Frontend", "Backend", "AI", "DevOps", "Mobile"].map((cat) => (
            <span 
              key={cat}
              onClick={() => handleFilter(cat)} 
              style={{ 
                cursor: 'pointer', 
                color: activeCategory === cat ? '#0070f3' : '#111',
                whiteSpace: 'nowrap',
                transition: '0.2s'
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
          alignItems: 'center', 
          gap: '60px', 
          flexWrap: 'wrap', 
          padding: '30px 0', 
          minHeight: '50vh' 
        }}>
          <div style={{ flex: 1.5, minWidth: '350px' }}>
            <h1 style={{ 
              fontSize: '4.5rem', 
              lineHeight: '0.85', 
              marginBottom: '15px', 
              letterSpacing: '-3px',
              fontWeight: '900'
            }}>
              {hero?.title || "Technology"} <br/>
              <span style={{ color: '#0070f3' }}>{hero?.subtitle || "Mastery"}</span>
            </h1>

            <p style={{ 
              fontSize: '1.05rem',
              color: '#111',
              lineHeight: '1.5',
              maxWidth: '550px',
              fontWeight: '500',
              margin: '0'
            }}>
              {hero?.description || "Architecting technical foundations..."}
            </p>
          </div>
          
          <div style={{ flex: 1, minWidth: '350px' }}>
            {hero?.image && (
              <img 
                src={hero.image} 
                alt="Architecture" 
                style={{ width: '100%', borderRadius: '24px', boxShadow: '15px 15px 0px #f8f8f8', objectFit: 'cover', height: '380px' }} 
              />
            )}
          </div>
        </section>

        <hr style={{ border: 'none', height: '1px', background: '#eee', margin: '0 0 50px 0' }} />

        {/* 3. SKILLS GRID */}
        <section style={{ paddingBottom: '100px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '30px' 
          }}>
            {filteredSkills.map((skill, index) => (
              <div 
                key={skill._id || index} 
                style={{ 
                  padding: '35px', 
                  border: '1px solid #f0f0f0', 
                  borderRadius: '24px', 
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <img src={skill.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: '900', color: '#0070f3', background: '#f0f7ff', padding: '4px 10px', borderRadius: '100px' }}>
                    {skill.level}
                  </span>
                </div>
                <h3 style={{ margin: '0', fontSize: '1.6rem', fontWeight: '800' }}>{skill.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.5', margin: '0', minHeight: '60px' }}>
                  {skill.story}
                </p>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid #f5f5f5' }}>
                  {['Where', 'When', 'How'].map((label) => (
                    <a key={label} href="#" style={{ fontSize: '0.7rem', fontWeight: '800', color: '#111', textDecoration: 'none', borderBottom: '2px solid #eee', textTransform: 'uppercase' }}>{label}</a>
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
