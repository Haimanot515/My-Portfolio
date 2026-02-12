import React, { useState, useEffect } from "react";
import Login from "../pages/Login";
import Form from "../pages/Registration/Form";
import Verify from "../pages/Registration/Verify"; 
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa"; // Added FaBars
import "./Navbar.css";

const Navbar = ({ loggedIn, isAdmin, setLoggedIn, setIsAdmin }) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // New state for hamburger

  // Sync: When user becomes logged in, close all modals
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
    setMenuOpen(false); // Close menu on logout
    navigate("/"); 
  };

  const handleNavClick = (e) => {
    setMenuOpen(false); // Close menu when a link is clicked
    if (!loggedIn) {
      e.preventDefault(); 
      e.stopPropagation(); 
      openLogin();
    }
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowVerify(false);
  };

  const openRegister = () => {
    closeModals();
    setShowRegister(true);
  };

  const openLogin = () => {
    closeModals();
    setShowLogin(true);
  };

  const openVerify = () => {
    closeModals();
    setShowVerify(true);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav className="navbar">
        {/* Hamburger Icon for Mobile */}
        <div className="nav-hamburger" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`nav-container ${menuOpen ? "nav-active" : ""}`}>
          {!loggedIn ? (
            <>
              <div className="nav-links">
                <Link to="/home" onClick={handleNavClick}>Home</Link>
                <Link to="/projects" onClick={handleNavClick}>Projects</Link>
                <Link to="/skill" onClick={handleNavClick}>Skills</Link>
                <Link to="/contact" onClick={handleNavClick}>Contact</Link>
                <Link to="/about" onClick={handleNavClick}>About</Link>
                <Link to="/testimonials" onClick={handleNavClick}>Testimony</Link>
              </div>
              <div className="nav-auth">
                <button onClick={() => { openLogin(); setMenuOpen(false); }}>Login</button>
                <button onClick={() => { openRegister(); setMenuOpen(false); }}>Register</button>
              </div>
            </>
          ) : (
            <div className="nav-links nav-links-logged-in">
              <Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
              <Link to="/skill" onClick={() => setMenuOpen(false)}>Skills</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/testimonials" onClick={() => setMenuOpen(false)}>Testimony</Link>
              {(isAdmin === true || isAdmin === "true") && (
                <Link to="/admin/users/view" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="centered-auth-card" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModals} className="modal-close-btn">
              <FaTimes className="modal-close-icon" />
            </button>
            <Login 
                setLoggedIn={setLoggedIn} 
                setIsAdmin={setIsAdmin} 
                closeModal={closeModals} 
                switchToRegister={openRegister} 
            />
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="centered-auth-card" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModals} className="modal-close-btn">
              <FaTimes className="modal-close-icon" />
            </button>
            <Form 
                closeModal={closeModals} 
                switchToLogin={openLogin} 
                switchToVerify={openVerify} 
            />
          </div>
        </div>
      )}

      {/* VERIFY MODAL */}
      {showVerify && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="centered-auth-card" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModals} className="modal-close-btn">
              <FaTimes className="modal-close-icon" />
            </button>
            <Verify 
              setLoggedIn={setLoggedIn} 
              setIsAdmin={setIsAdmin} 
              closeModal={closeModals} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
