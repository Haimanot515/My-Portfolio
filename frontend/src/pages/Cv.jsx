import React, { useState } from 'react';

const AdvancedCV = () => {
  const [activeTab, setActiveTab] = useState('Frontend');

  const skills = {
    Frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Redux'],
    Backend: ['Node.js', 'PostgreSQL', 'GraphQL', 'Docker'],
    Tools: ['Git', 'AWS', 'Jest', 'CI/CD']
  };

  const styles = {
    page: {
      background: '#f4f4f4',
      padding: '40px 10px',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center'
    },
    cvContainer: {
      background: '#fff',
      width: '100%',
      maxWidth: '900px',
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      overflow: 'hidden'
    },
    sidebar: {
      background: '#111',
      color: '#fff',
      padding: '40px 30px',
    },
    main: {
      padding: '40px',
      color: '#333'
    },
    sectionTitle: {
      fontSize: '1.2rem',
      fontWeight: '800',
      textTransform: 'uppercase',
      borderBottom: '2px solid #eee',
      paddingBottom: '8px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between'
    },
    jobTitle: {
      fontWeight: 'bold',
      fontSize: '1.1rem',
      margin: '0'
    },
    date: {
      fontSize: '0.85rem',
      color: '#888',
      marginBottom: '10px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.cvContainer}>
        {/* Left Sidebar */}
        <aside style={styles.sidebar}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '100px', height: '100px', background: '#333', borderRadius: '50%', margin: '0 auto 20px' }}></div>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>NAME</h1>
            <p style={{ color: '#aaa' }}>Full Stack Engineer</p>
          </div>

          <h3 style={{ fontSize: '0.9rem', color: '#666', textTransform: 'uppercase' }}>Contact</h3>
          <p style={{ fontSize: '0.9rem' }}>📧 dev@example.com<br/>📍 Remote / New York<br/>🔗 github.com/user</p>

          <h3 style={{ fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', marginTop: '30px' }}>Expertise</h3>
          {Object.keys(skills).map(cat => (
            <div 
              key={cat} 
              onClick={() => setActiveTab(cat)}
              style={{ 
                cursor: 'pointer', 
                padding: '8px 0', 
                color: activeTab === cat ? '#fff' : '#666',
                transition: '0.3s'
              }}
            >
              {cat}
            </div>
          ))}
          <div style={{ marginTop: '10px' }}>
            {skills[activeTab].map(s => (
              <span key={s} style={{ display: 'inline-block', fontSize: '0.8rem', background: '#333', padding: '2px 8px', margin: '2px', borderRadius: '4px' }}>{s}</span>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          <section>
            <h2 style={styles.sectionTitle}>Experience</h2>
            <div style={{ marginBottom: '25px' }}>
              <p style={styles.jobTitle}>Lead Frontend Engineer @ TechFlow</p>
              <p style={styles.date}>Jan 2024 — Present</p>
              <ul style={{ paddingLeft: '20px', fontSize: '0.95rem' }}>
                <li>Architected a design system used by 15+ developers.</li>
                <li>Reduced bundle size by 40% via code splitting.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 style={styles.sectionTitle}>Key Projects</h2>
            <div style={{ marginBottom: '25px' }}>
              <p style={styles.jobTitle}>E-Commerce Engine</p>
              <p style={{ fontSize: '0.95rem' }}>Built a headless commerce solution using Next.js and Stripe API. Integrated real-time inventory tracking.</p>
            </div>
          </section>

          {/* This button matches your project link style */}
          <button 
            onClick={() => window.print()}
            style={{ 
              marginTop: '40px',
              padding: '12px 24px', 
              background: '#111', 
              color: '#fff', 
              borderRadius: '8px', 
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Download PDF
          </button>
        </main>
      </div>
    </div>
  );
};

export default AdvancedCV;
