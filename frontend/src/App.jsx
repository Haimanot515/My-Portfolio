import React, { useState, useEffect } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import About from "./pages/About"; 
import Skill from "./pages/Skill";
import Testimonials from "./pages/Testimonials"; 
import LandingPage from "./pages/LandingPage";
import CV from "./pages/Cv";

/* ADMIN */
import AdminNavbar from "./components/AdminNavbar";
import AdminUser from "./pages/admin/AdminUser";
import AdminProject from "./pages/admin/AdminProject";
import AdminMessages from "./pages/admin/AdminContacts/AdminMessage";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminSkills from "./pages/admin/AdminSkills"; 
import AdminLanding from "./pages/admin/AdminLanding"; 
/* 🆕 IMPORT THE CORRECT HERO COMPONENT */
import AdminHomeHero from "./pages/admin/AdminHomeHero"; 

import "./styles.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith("/admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const adminFlag = payload.isAdmin === true || payload.isAdmin === "true";
        setIsAdmin(adminFlag);
        setLoggedIn(true);
      } catch (err) {
        console.error("Token validation failed", err);
        localStorage.removeItem("token");
        setIsAdmin(false);
        setLoggedIn(false);
      }
    } else {
      setIsAdmin(false);
      setLoggedIn(false);
    }
  }, []);

  if (loggedIn === null) return null; 

  return (
    <>
      <Navbar
        loggedIn={loggedIn}
        isAdmin={isAdmin}
        setLoggedIn={setLoggedIn}
        setIsAdmin={setIsAdmin}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/home" element={loggedIn ? <Home /> : <Navigate to="/" />} />
        <Route path="/about" element={loggedIn ? <About /> : <Navigate to="/" />} />
        <Route path="/projects" element={loggedIn ? <Projects /> : <Navigate to="/" />} />
        <Route path="/contact" element={loggedIn ? <Contact /> : <Navigate to="/" />} />
        <Route path="/skill" element={loggedIn ? <Skill /> : <Navigate to="/" />} />
        <Route path="/testimonials" element={loggedIn ? <Testimonials /> : <Navigate to="/" />} />
        <Route path="/cv" element={loggedIn ? <CV /> : <Navigate to="/" />} />

        {/* --- ADMIN PANEL ROUTES --- */}
        <Route 
          path="/admin" 
          element={loggedIn && isAdmin ? <AdminNavbar /> : <Navigate to="/" />}
        >
          {/* Landing Management */}
          <Route path="landing/manage" element={<AdminLanding />} />

          <Route path="users/view" element={<AdminUser mode={pathname} />} />
          <Route path="users/delete" element={<AdminUser mode={pathname} />} />
          <Route path="users/update" element={<AdminUser mode={pathname} />} />
          
          <Route path="projects/create" element={<AdminProject mode={pathname} />} />
          <Route path="projects/view" element={<AdminProject mode={pathname} />} />
          <Route path="projects/update" element={<AdminProject mode={pathname} />} />
          <Route path="projects/delete" element={<AdminProject mode={pathname} />} />
          
          <Route path="skills/create" element={<AdminSkills mode={pathname} />} />
          <Route path="skills/view" element={<AdminSkills mode={pathname} />} />
          
          <Route path="contacts/view" element={<AdminMessages />} />
          <Route path="about/create" element={<AdminAbout />} />
          
          {/* 🆕 ADJUSTED HOME HERO ROUTES */}
          {/* These now use AdminHomeHero to ensure POST/DROP logic works correctly */}
          <Route path="hero/create" element={<AdminHomeHero />} /> 
          <Route path="hero/update" element={<AdminHomeHero />} /> 
        </Route>

        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>

      {!hideFooter  && <Footer />}
    </>
  );
}

export default App;