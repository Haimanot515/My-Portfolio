import React, { useState, useEffect } from "react";
import Login from "../pages/Login";
import Form from "../pages/Registration/Form";
import Verify from "../pages/Registration/Verify"; 
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "./Navbar.css"; // Added the CSS import

const Navbar = ({ loggedIn, isAdmin, setLoggedIn, setIsAdmin }) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

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
    navigate("/"); 
  };

  const handleNavClick = (e) => {
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

  return (
    <>
      <nav className="navbar">
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
              <button onClick={openLogin}>Login</button>
              <button onClick={openRegister}>Register</button>
            </div>
          </>
        ) : (
          <div className="nav-links nav-links-logged-in">
            <Link to="/home">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/skill">Skills</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">About</Link>
            <Link to="/testimonials">Testimony</Link>
            {(isAdmin === true || isAdmin === "true") && (
              <Link to="/admin/users/view">Admin</Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
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
