import React, { useState, useEffect } from "react";
import Login from "../pages/Login";
import Form from "../pages/Registration/Form";
import Verify from "../pages/Registration/Verify"; 
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";
import "./Navbar.css"; 

const Navbar = ({ loggedIn, isAdmin, setLoggedIn, setIsAdmin }) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      closeModals();
    }
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setIsAdmin(false);
    closeModals();
    setIsMenuOpen(false);
    navigate("/"); 
  };

  const handleNavClick = (e) => {
    if (!loggedIn) {
      e.preventDefault(); 
      e.stopPropagation(); 
      openLogin();
    }
    setIsMenuOpen(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowVerify(false);
  };

  const openRegister = () => { closeModals(); setShowRegister(true); };
  const openLogin = () => { closeModals(); setShowLogin(true); };
  const openVerify = () => { closeModals(); setShowVerify(true); };

  return (
    <>
      <nav className="navbar">
        {/* Hamburger for Mobile */}
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* ALL links and buttons are now direct children of nav-content */}
        <div className={`nav-content ${isMenuOpen ? "active" : ""}`}>
          <Link to="/home" onClick={handleNavClick}>Home</Link>
          <Link to="/projects" onClick={handleNavClick}>Projects</Link>
          <Link to="/skill" onClick={handleNavClick}>Skills</Link>
          <Link to="/contact" onClick={handleNavClick}>Contact</Link>
          <Link to="/about" onClick={handleNavClick}>About</Link>
          <Link to="/testimonials" onClick={handleNavClick}>Testimony</Link>
          
          {/* Admin and Auth items are rendered as direct siblings */}
          {loggedIn ? (
            <>
              {(isAdmin === true || isAdmin === "true") && (
                <Link to="/admin/users/view" onClick={() => setIsMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={openLogin}>Login</button>
              <button onClick={openRegister}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* MODALS */}
      {(showLogin || showRegister || showVerify) && (
        <div className="overlay" onClick={closeModals}>
          <div className="auth-card" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModals} className="close-btn-style">
              <FaTimes />
            </button>
            {showLogin && <Login setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} closeModal={closeModals} switchToRegister={openRegister} />}
            {showRegister && <Form closeModal={closeModals} switchToLogin={openLogin} switchToVerify={openVerify} />}
            {showVerify && <Verify setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} closeModal={closeModals} />}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;