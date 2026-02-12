import React, { useState, useEffect } from "react";
import API from "../api/api.jsx";

const Skill = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]); 
  const [activeCategory, setActiveCategory] = useState("All");
  const [hero, setHero] = useState(null); 
  const [mainHero, setMainHero] = useState(null);

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
        setFilteredSkills(skillsRes.data);
        
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
      
      {/* 1. NAVIGATION BAR */}
      <nav style={{ 
        height: "80px", 
        padding: '20px 40px', 
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '150px' }}>
          {mainHero?.image && (
            <img 
              src={mainHero.image} 
              alt="Profile" 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
            />
          )}
          <div style={{ fontWeight: '800', fontSize: '1rem' }}>H.Mekonnen</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: '900', fontSize: '1.4rem', lineHeight: '1' }}>
            <span style={{ color: '#eee' }}>{yearFirstTwo}</span>
            <span style={{ color: '#0070f3' }}>{yearLastTwo}</span>
          </div>
          <div style={{ fontSize: '0.55rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#888' }}>
            {activeCategory === "All" ? "Full Stack Repository" : activeCategory}
          </div>
        </div>
        
        {/* ALL CATEGORIES ADDED HERE */}
        <div style={{ display: 'flex', gap: '15px', fontWeight: '600', minWidth: '150px', justifyContent: 'flex-end', fontSize: '0.75rem', textTransform: 'uppercase' }}>
          {["Programming Languages", "Cybersecurity", "Frontend", "Backend", "AI", "DevOps", "Mobile"].map((cat) => (
            <span 
              key={cat}
              onClick={() => handleFilter(cat)} 
              style={{ 
                cursor: 'pointer', 
                color: activeCategory === cat ? '#0070f3' : '#111',
                whiteSpace: 'nowrap'
              }}
            >
              {cat === "Programming Languages" ? "Languages" : cat}
            </span>
          ))}
          <span onClick={() => handleFilter("All")} style={{ cursor: 'pointer', color: '#ccc' }}>[reset]</span>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* 2. HERO SECTION - TIGHTENED VERTICAL SPACING */}
        <section style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '50px', 
          flexWrap: 'wrap', 
          padding: '30px 0', 
          minHeight: '50vh' 
        }}>
          <div style={{ flex: 1.5, minWidth: '350px' }}>
            <h1 style={{ 
              fontSize: '4.8rem', 
              lineHeight: '0.8', 
              marginBottom: '15px', 
              letterSpacing: '-4px',
              fontWeight: '900',
              margin: '0 0 10px 0'
            }}>
              {hero?.title || "Technology"} <br/>
              <span style={{ color: '#0070f3' }}>{hero?.subtitle || "Mastery"}</span>
            </h1>

            <p style={{ 
              fontSize: '1rem',
              color: '#444',
              lineHeight: '1.5',
              maxWidth: '500px',
              fontWeight: '500',
              margin: '0'
            }}>
              {hero?.description || "Architecting digital solutions across the modern stack."}
            </p>
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            {hero?.image && (
              <img 
                src={hero.image} 
                alt="Architecture" 
                style={{ 
                  width: '100%', 
                  borderRadius: '20px', 
                  boxShadow: '15px 15px 0px #fafafa', 
                  height: '350px',
                  objectFit: 'cover'
                }} 
              />
            )}
          </div>
        </section>

        <hr style={{ border: 'none', height: '1px', background: '#f0f0f0', margin: '20px 0 50px 0' }} />

        {/* 3. SKILLS GRID */}
        <section style={{ paddingBottom: '80px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '30px' 
          }}>
            {filteredSkills.map((skill, index) => (
              <div 
                key={skill._id || index} 
                style={{ 
                  padding: '30px', 
                  border: '1px solid #f0f0f0', 
                  borderRadius: '20px', 
                  backgroundColor: '#fff',
                  transition: 'transform 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <img src={skill.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#0070f3', background: '#f0f7ff', padding: '3px 8px', borderRadius: '4px' }}>
                    {skill.level}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', fontWeight: '800' }}>{skill.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.4', margin: '0 0 15px 0', minHeight: '50px' }}>
                  {skill.story}
                </p>
                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f9f9f9', paddingTop: '15px' }}>
                  {['Where', 'When', 'How'].map((label) => (
                    <a key={label} href="#" style={{ fontSize: '0.65rem', fontWeight: '700', color: '#111', textDecoration: 'none', borderBottom: '1px solid #ddd' }}>{label}</a>
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
